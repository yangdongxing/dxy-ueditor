var API_HOST = 'http://'+(window.location.host||'dxy.com')+'/';
(function(){
// 	window.DXYJSBridge = {};
// window.DXYJSBridge.invoke = function(a, options, callback){
// 	if(options.url.indexOf('functionmarker')!==-1){
// 		setTimeout(function(){
// 			callback({
// 				code : 200,
// 				data : {"data":{"items":[{"id":150,"status":1,"title":"测试排序","content":"默认内容","s_time":"2015-12-23 11:08:22","e_time":"2015-12-31 00:00:00","votes":[{"id":258,"group_id":150,"vote_id":255,"vote_type":0,"vote_title":"选择分数1","vote_content":"默认内容","sort":2,"nodes":[{"id":797,"vote_id":255,"node_id":807,"node_value":"1","sort":3},{"id":798,"vote_id":255,"node_id":808,"node_value":"2","sort":2},{"id":799,"vote_id":255,"node_id":809,"node_value":"3","sort":1}]},{"id":259,"group_id":150,"vote_id":256,"vote_type":1,"vote_title":"选择分数2","vote_content":"默认内容","sort":1,"nodes":[{"id":800,"vote_id":256,"node_id":810,"node_value":"1","sort":3},{"id":801,"vote_id":256,"node_id":811,"node_value":"2","sort":2},{"id":802,"vote_id":256,"node_id":812,"node_value":"函数阿达","sort":1}]}]}]}}
// 			});
// 		}, 1000);
// 	}else if(options.url.indexOf('result')!==-1){
// 		setTimeout(function(){
// 			callback({
// 				code : 200,
// 				data : {"data":{"total_items":2,"items_per_page":5,"current_item_count":2,"total_pages":1,"page_index":1,"start_index":1,"items":[{"id":103,"group_id":150,"vote_id":256,"node_id":811,"user_id":1,"creator":1,"modifier":1,"create_time":"2015-12-23 13:14:14","modify_time":"2015-12-23 13:14:14"},{"id":102,"group_id":150,"vote_id":255,"node_id":807,"user_id":1,"creator":1,"modifier":1,"create_time":"2015-12-23 13:14:14","modify_time":"2015-12-23 13:14:14"}]}}
// 			});
// 		}, 1000);
// 	}else if(options.url.indexOf('stat')!==-1){
// 		setTimeout(function(){
// 			callback({
// 				code : 200,
// 				data : {"data":{"total_items":6,"items_per_page":100,"current_item_count":6,"total_pages":1,"page_index":1,"start_index":1,"items":[{"id":715,"group_id":150,"vote_id":256,"node_id":812,"count":0},{"id":714,"group_id":150,"vote_id":256,"node_id":811,"count":1},{"id":713,"group_id":150,"vote_id":256,"node_id":810,"count":0},{"id":712,"group_id":150,"vote_id":255,"node_id":809,"count":0},{"id":711,"group_id":150,"vote_id":255,"node_id":808,"count":0},{"id":710,"group_id":150,"vote_id":255,"node_id":807,"count":1}]}}
// 			});
// 		}, 1000);
// 	}
// };
	var ajax = Backbone.ajax;
	Backbone.ajax = function(options){
		function preProressUrl(url){
			return url.replace('/view/i/','/app/i/').replace('/user/i/', '/app/i/user/');
		}
		if(window.DXYJSBridge){
			var dtd = $.Deferred(),
				xhr = dtd.promise();
			options.url = preProressUrl(options.url);
			DXYJSBridge.invoke("getServerData", {
			    "url": options.url,
			    "method": options.type.toLowerCase(),
			    "params" : options.data || {}
			}, function(res){
			    if(res){
			       if(res.code===200){
			       		xhr.statusCode = 200;
			       		xhr.readyState = 4;
			       		xhr.responseText = JSON.stringify(res.data);
			       		options.success && options.success(res.data, 200, xhr)
			       		dtd.resolve(res.data);
			       }else{
			       		xhr.statusCode = parseInt(res.code);
			       		xhr.readyState = 4;
			       		xhr.responseText = JSON.stringify(res.data);
			       		options.error && options.error(xhr, res.data);
			       		dtd.reject(res.data);
			       }
			    }else{
			    	options.error && options.error(xhr);
			    	dtd.reject({});
			    }
			});
			return xhr;
		}else{
			return ajax.apply(null, arguments);
		}
	};
})();

LocalModule.define('MarkModel', function(){
	Backbone.emulateJSON = true;
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
	var UserMarkModel = Backbone.Model.extend({
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'view/i/functionmarker/single?obj_id='+this.get('obj_id')+'&type='+this.get('type');
					break;
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
		MarkModel : MarkModel,
		UserMarkModel : UserMarkModel
	};
});

LocalModule.define('DxyModel', function(){
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
			}
			opt.data = attr;
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
LocalModule.define('DxyCollection', function(){
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
			var args = options.args || this.args;
			if(!base){
				throw new Error('Dxy Collection require urlRoot defined');
			}
			base = base.replace(/[^\/]$/, '$&/');
			if(!options.restful){
				switch(method){
					case 'read' :
						if(search){
							options.url = base + 'search?q='+search+'&items_per_page='+items_per_page+'&page_index='+page_index;
						}else if(args){
							options.url = base + 'list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
							for(var prop in args){
								if(args.hasOwnProperty(prop)){
									options.url += ('&'+prop+'='+args[prop]);
								}
							}
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
			return Backbone.sync.apply(this, arguments);
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
				dtd.resolve.call(null, res);
			}, function(res){
				dtd.reject.call(null, res);
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