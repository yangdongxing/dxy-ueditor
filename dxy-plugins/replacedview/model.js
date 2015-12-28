define('MarkModel', function(){
	Backbone.emulateJSON = true;
	var API_HOST = 'http://'+document.domain+'/';
	var MarkModel = Backbone.Model.extend({
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/functionmarker/data?obj_id='+this.get('obj_id')+'&type='+this.get('type');
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/functionmarker/add';
			}
			return Backbone.sync(method, model, options);
		},
		parse : function(resp){
			if(resp.data){
				return {
					attach : resp.data.items[0]
				}
			}else{
				return {};
			}
		}
	});
	return {
		MarkModel : MarkModel
	};
});

define('DxyModel', function(){
	var backbone = Backbone;
	var Model = backbone.Model.extend({
		initialize : function(attrs){
			if(attrs && typeof attrs === 'object' && attrs.id){
				this._attrs = attrs;
			}else{
				this._attrs = {};
			}
		},
		sync : function(method, model, options){
			var success = options.success;
			if(!options.restful){
				var base = this.urlRoot;
				if(!base){
					throw new Error('Dxy Model require urlRoot defined');
				}
				base = base.replace(/[^\/]$/, '$&/');
				switch(method){
					case 'read':
						if(this.isNew()){
							options.url =  base + 'single';
						}else{
							options.url =  base + 'single?id='+this.get('id');
						}
						break;
					case 'update' : 
						options.url = base + 'put';
						break;
					case 'delete':
						options.url = base + 'delete?id='+this.get('id');
						break;
					case 'create':
						options.url = base + 'add';
						options.data = this.attributes;
						break;
				}
				options.success = function(resp, status, code, xhr){
					if(resp.error && options.error){
						options.error(resp)
						return;
					}
					resp = resp.data.items[0];
					delete model.attributes.id;
					if(success){
						success(resp, model, options);
					}
					model._attrs = _.clone(model.attributes);
				}
			}
			return backbone.Model.prototype.sync.call(this, method, model, options);
		},
		save : function(key, val, options){
			var opt, attr;
			if(key == null || typeof key === 'object') {
		        opt = val;
		        attr = key;
		    }else {
		        opt = options;
		        (attr = {})[key] = val;
		    }
			if(!attr && !opt){
				opt = {
					data : this.expiredAttributes()
				};
			}
			if(!this.isNew()){
				if(!opt){
					opt = {};
				}
				opt.patch = true;
			}
			return backbone.Model.prototype.save.call(this, attr, opt);
		},
		set : function(key, val, options){
			if(typeof key === 'object' && val.type){
				if('update patch delete'.indexOf(val.type.toLowerCase()) !== -1){
					for(var porp in key){
						if(key.hasOwnProperty(prop)){
							if(!this.attributes[prop]){
								delete key[prop];
							}
						}
					}
				}
				return backbone.Model.prototype.set.call(this, key, val);
			}else{
				return backbone.Model.prototype.set.apply(this, arguments);
			}
		},
		hasExpired : function(){
			var expired = this.expiredAttributes();
			for(var prop in expired){
				if(expired.hasOwnProperty(prop)){
					return true;
				}
			}
			return false;
		},
		expiredAttributes : function(){
			var old = _.clone(this._attrs),
				cur = _.clone(this.attributes),
				expired = {};
			for(var prop in cur){
				if(cur.hasOwnProperty(prop)){
					if(!_.isEqual(cur[prop], old[prop])){
						expired[prop] = cur[prop];
					}
				}
			}
			return expired;
		}
	});
	return {
		Model : Model
	}
});
define('DxyCollection', function(){
	var backbone = Backbone;
	var Collection = backbone.Collection.extend({
		constructor : function(items, opt){
			items = items || [];
			opt = opt || {};
			var defaults = {
				"total_items" : 0,
		        "items_per_page" : Math.max(5, items.length),
		        "current_item_count" : items.length,
		        "total_pages" : 1,
		        "page_index" : 1,
		        "start_index" : 1
			};
			_.extend(this, _.extend(defaults, opt));
			Backbone.Collection.call(this, items);
		},
		add : function(models, options){
			var me = this;
			if(models && models.length){
				_.each(models, function(model){
					if(!me.get(model)){
						this.items_per_page++;
					}
				});
			}
			return backbone.Collection.prototype.add.apply(this, arguments);
		},
		remove : function(models, options){
			var me = this;
			if(models && models.length){
				_.each(models, function(model){
					if(me.get(model)){
						this.items_per_page--;
					}
				});
			}
			return backbone.Collection.prototype.remove.apply(this, arguments);
		},
		sync : function(method, model, options){
			var success = options.success;
			var page_index = options.page_index || this.page_index;
			var items_per_page = options.items_per_page || this.items_per_page;
			var search = options.q || this.q;
			var base = this.urlRoot;
			if(!base){
				throw new Error('Dxy Collection require urlRoot defined');
			}
			base = base.replace(/[^\/]$/, '$&/');
			if(!options.restful){
				switch(method){
					case 'read' :
						if(search){
							options.url = base + 'search?q='+search+'&items_per_page='+items_per_page+'&page_index='+page_index;
						}else{
							options.url = base + 'list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
						}
						break;
				}
				options.success = function(resp){
					var items;
					if(resp.error && options.error){
						if(resp.error.code==101){
							resp.data = {
								items : [],
								"total_items" : 0,
								"current_item_count" : 0,
								"total_pages" : 1,
								"page_index" : 1,
								"start_index" : 1
							};
							items = [];
						}else{
							options.error(resp)
							return;
						}
					}else{
						items = resp.data.items;
					}
					if(success){
						success(items);
					}
					_.extend(model, resp.data);
				}
			}
			return Backbone.sync(method, model, options);
		},
		goto : function(page){
			page = parseInt(page);
			var newPage = page + this.page_index,
				oldPage = this.page_index,
				me = this,
				dtd = $.Deferred();
			if(page===0){
				return dtd.resolve();
			}
			if(newPage<=0 || newPage>this.total_pages){
				return dtd.resolve();
			}
			this.page_index = newPage;
			this.fetch().then(function(res){
				if(res.error){
					me.page_index = oldPage;
					dtd.reject(res);
					return;
				}
				dtd.resolve.apply(arguments);
			}, function(res){
				dtd.reject.apply(arguments);
			});
			return dtd;
		},
		search : function(){
			if(this.searchXHR){
				this.searchXHR.abort();
				this.searchXHR = null;
			}
			this.searchXHR = this.fetch();
			return this.searchXHR;
		}
	});
	return {
		Collection : Collection
	}
});