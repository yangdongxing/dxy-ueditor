(function(){
	if(window.LocalModule){
		return;
	}

	var modules = {};
	var tasks = [];

	function isAllLoaded(requires){
		for(var i=0, len=requires.length; i<len; i++){
			if(!modules[requires[i]]){
				return false;
			}
		}
		return true;
	}

	function getModules(requires){
		var res = [];
		for(var i=0, len=requires.length; i<len; i++){
			if(modules[requires[i]]){
				res.push(modules[requires[i]]);
			}
		}
		return res;
	}

	function checkTask(){
		var task;
		for(var i=0,len=tasks.length;i<len; i++){
			task = tasks[i];
			if(!task){
				continue;
			}
			if(isAllLoaded(task.requires)){
				task.callback.apply(null,getModules(task.requires));
				tasks[i] = null;
			}
		}
	}

	function _define(moduleName, requires, callback){
		if(typeof requires === 'function'){
			callback = requires;
			requires = [];
		}
		if(!isAllLoaded(requires)){
			for(var i=0,len=requires.length; i<len; i++){
				for(var j=0,jlen = tasks.length; j<jlen; j++){
					if(requires.indexOf(tasks[j].name)!==-1 && tasks[j].requires.indexOf(moduleName)!==-1){
						throw new Error('module "'+moduleName+'" and "'+tasks[j].name+'" has circular references');
					}
				}
			}
		}
		_require(requires, function(){
			modules[moduleName] = callback.apply(null, arguments);
		}, moduleName);
	}

	function _require(requires, callback, _moduleName){
		if(isAllLoaded(requires)){
			callback.apply(null, getModules(requires));
		}else{
			tasks.push({
				requires : requires,
				callback : callback,
				name : _moduleName
			});
		}
		checkTask();
	}

	window.LocalModule = {
		define : _define,
		require : _require
	};

})();
(function(root, factory) {
    root.Date = factory(root);
})(window, function(g){
    var D,
        staticMethods = ['UTC','apply','bind','call','constructor','hasOwnProperty','isPrototypeOf','now','parse','propertyIsEnumerable','toLocaleString', 'toString', 'valueOf'];
    if(!g.Date.tag){
        D = g.Date;
        g.Date = function(){
            var len = arguments.length;
            if(this===undefined || this === g){
                return D();
            }
            if(arguments.length==1){
                if(typeof arguments[0]==='string' && arguments[0].indexOf('-')!==-1){
                    return new D(arguments[0].replace(/\-/g,'/'));
                }
            }
            switch(len){
                case 0:
                    return new D();
                case 1:
                    return new D(arguments[0]);
                case 2:
                    return new D(arguments[0], arguments[1]);
                case 3:
                    return new D(arguments[0], arguments[1], arguments[2]); 
                case 4:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3]); 
                case 5:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]); 
                case 6:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]); 
            }
        };
        g.Date.tag = 'hehe';
        for(var i=0,len=staticMethods.length; i<len; i++){
            g.Date[staticMethods[i]] = (function(methodName){
                return function(){
                    return D[methodName].apply(null, Array.prototype.slice(arguments,0));
                };
            })(staticMethods[i]);
        }
        g.Date.conflict = function(){
            return D;
        };
        g.Date.prototype = D.prototype;
    }
    return g.Date;
});
(function(){
	if(window.LocalModule){
		return;
	}

	var modules = {};
	var tasks = [];

	function isAllLoaded(requires){
		for(var i=0, len=requires.length; i<len; i++){
			if(!modules[requires[i]]){
				return false;
			}
		}
		return true;
	}

	function getModules(requires){
		var res = [];
		for(var i=0, len=requires.length; i<len; i++){
			if(modules[requires[i]]){
				res.push(modules[requires[i]]);
			}
		}
		return res;
	}

	function checkTask(){
		var task;
		for(var i=0,len=tasks.length;i<len; i++){
			task = tasks[i];
			if(!task){
				continue;
			}
			if(isAllLoaded(task.requires)){
				task.callback.apply(null,getModules(task.requires));
				tasks[i] = null;
			}
		}
	}

	function _define(moduleName, requires, callback){
		if(typeof requires === 'function'){
			callback = requires;
			requires = [];
		}
		if(!isAllLoaded(requires)){
			for(var i=0,len=requires.length; i<len; i++){
				for(var j=0,jlen = tasks.length; j<jlen; j++){
					if(requires.indexOf(tasks[j].name)!==-1 && tasks[j].requires.indexOf(moduleName)!==-1){
						throw new Error('module "'+moduleName+'" and "'+tasks[j].name+'" has circular references');
					}
				}
			}
		}
		_require(requires, function(){
			modules[moduleName] = callback.apply(null, arguments);
		}, moduleName);
	}

	function _require(requires, callback, _moduleName){
		if(isAllLoaded(requires)){
			callback.apply(null, getModules(requires));
		}else{
			tasks.push({
				requires : requires,
				callback : callback,
				name : _moduleName
			});
		}
		checkTask();
	}

	window.LocalModule = {
		define : _define,
		require : _require
	};

})();
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
LocalModule.define('AnnotationModel', ['DxyModel'], function(dxy){
	var API_HOST = 'http://'+(window.location.host||'dxy.com')+'/';
	var AnnotationModel = dxy.Model.extend({
		urlRoot : API_HOST + 'admin/i/card/annotation'
	});
	var AnnotationUserModel = dxy.Model.extend({
		urlRoot : API_HOST + 'view/i/functionmarker'
	});
	window.M = AnnotationModel;
	return {
		AnnotationModel : AnnotationModel,
		AnnotationUserModel : AnnotationUserModel
	}
});
LocalModule.define('VoteModel', ['DxyModel','DxyCollection'],function(DxyModel, DxyCollection){
	Backbone.emulateJSON = true;
	function fomat(date, fmt){
		var o = {   
			"YYYY" : date.getFullYear(),
		    "MM" : date.getMonth()+1,                   
		    "DD" : date.getDate(),                   
		    "hh" : date.getHours(),              
		    "mm" : date.getMinutes(), 
		    "ss" : date.getSeconds()           
		};   
		return fmt.replace('YYYY', o.YYYY).replace('MM', o.MM).replace('DD', o.DD).replace('hh', o.hh).replace('mm',o.mm).replace('ss', o.ss);
	}
	var BaseListModel = Backbone.Collection.extend({
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
		set : function(resp, option){
			var items = resp;
			if(resp.data){
				items = resp.data.items;
				delete resp.data.items;
				_.extend(this, resp.data);
			}
			if(resp.error){
				items = [];
			}
			Backbone.Collection.prototype.set.call(this, items, option);
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
		findByAttachId : function(id){
			var res = null;
			_.each(this.models, function(v){
				if(v.attach.get('id')==id){
					res = v;
				}
			});
			return res;
		},
		search : function(q, len){
			len = len || 6;
			if(this.searchXHR){
				this.searchXHR.abort();
				this.searchXHR = null;
			}
			this.searchXHR = this.fetch({items_per_page: len, search: q});
			return this.searchXHR;
		}
	});
	var NodeModel = Backbone.Model.extend({
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/node/single' + '?id=' + model.get('id');
					break;
				case 'update' : 
					options.url = API_HOST + 'admin/i/vote/node/put';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/vote/node/delete' + '?id='+model.get('id');;
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/vote/node/add';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		parse : function(resp){
			if(resp.data && resp.data.items){
				return resp.data.items[0];
			}else{
				return resp;
			}
		},
		constructor : function(data){
			Backbone.Model.call(this,data);
			this.processInData();
		},
		processInData : function(){
			var value = this.get('value'),
				params = this.get('params'),
				list,
				me = this;
			if(value){
				list = value.split('$$');
				_.each(list, function(item){
					if(item.indexOf('=')===-1){
						me.attributes.value = item;
					}else{
						me.attributes[item.split('=')[0]] =  item.split('=')[1];
					}
				});
			}
			if(params){
				if(typeof params === 'string'){
					params = JSON.parse(params);
				}
				me.attributes.params = params;
			}
			me._previousAttributes = _.clone(me.attributes);
			me.changed = {};
		},
		processPostData : function(data){
			var img = data.img;
			if(img){
				delete data.img;
				data.value = data.value + '$$img='+ img; 
			}
			if(data.params &&  !(typeof data.params === 'string')){
				data.params = JSON.stringify(data.params);
			}
			return data;
		},
		addTag : function(id){
			var current = this.get('tags_str') ? this.get('tags_str').split(',') : [];
			if(current.indexOf(''+id)===-1){
				current.push(id);
			}
			this.set('tags_str', current.join(','));
		},
		addDeseaseTag : function(id){
			var current = this.get('disease_tags_str') ? this.get('disease_tags_str').split(',') : [];
			if(current.indexOf(''+id)===-1){
				current.push(id);
			}
			this.set('disease_tags_str', current.join(','));
		},
		addSymptomTag : function(id){
			var current = this.get('symptom_tags_str') ? this.get('symptom_tags_str').split(',') : [];
			if(current.indexOf(''+id)===-1){
				current.push(id);
			}
			this.set('symptom_tags_str', current.join(','));
		},
		removeTag : function(id){
			var current = this.get('tags_str') ? this.get('tags_str').split(',') : [];
			var index = current.indexOf(''+id);
			if(index!==-1){
				current.splice(+index, 1);
			}
			this.set('tags_str', current.join(','));
		},
		removeDeseaseTag : function(id){
			var current = this.get('disease_tags_str') ? this.get('disease_tags_str').split(',') : [];
			var index = current.indexOf(''+id);
			if(index!==-1){
				current.splice(+index, 1);
			}
			this.set('disease_tags_str', current.join(','));
		},
		removeSymptomTag : function(id){
			var current = this.get('symptom_tags_str') ? this.get('symptom_tags_str').split(',') : [];
			var index = current.indexOf(''+id);
			if(index!==-1){
				current.splice(+index, 1);
			}
			this.set('symptom_tags_str', current.join(','));
		}
	});
	var NodesModel = BaseListModel.extend({
		model : NodeModel,
		sync : function(method, model, options){
			var page_index = options.page_index || this.page_index;
			var items_per_page = options.items_per_page || this.items_per_page;
			switch(method){
				case 'create' : 
					options.url = API_HOST + 'admin/i/vote/node/add';
					break;
				case 'read' :
					if(options.search){
						options.url = API_HOST + 'admin/i/vote/node/search?q='+options.search+'&items_per_page='+items_per_page+'&page_index='+page_index;
					}else{
						options.url = API_HOST + 'admin/i/vote/node/list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
					}
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var TagModel = DxyModel.Model.extend({
		urlRoot : API_HOST+'admin/i/userprofile/tag'
	});
	var TagsModel = BaseListModel.extend({
		model : TagModel,
		sync : function(method, model, options){
			var page_index = options.page_index || this.page_index;
			var items_per_page = options.items_per_page || this.items_per_page;
			switch(method){
				case 'read' :
					if(options.search){
						options.url = API_HOST + 'admin/i/userprofile/tag/search?q='+options.search+'&items_per_page='+items_per_page+'&page_index='+page_index;
					}else{
						options.url = API_HOST + 'admin/i/userprofile/tag/list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
					}
					break;
			}
			return Backbone.sync(method, model, options);
		},
		pick : function(ids){
			function process(ids){
				var res = '';
				_.each(ids, function(id){
					res += ('id='+id+'&');
				});
				return res.slice(0,-1);
			}
			return Backbone.ajax({
				type : 'GET',
				url : API_HOST+'admin/i/userprofile/tag/pick?'+process(ids)
			});
		}
	});
	var DeseaseTagsModel = DxyCollection.Collection.extend({
		urlRoot : API_HOST + 'admin/i/common/disease',
		model : TagModel,
		pick : function(ids){
			function process(ids){
				var res = '';
				_.each(ids, function(id){
					res += ('id='+id+'&');
				});
				return res.slice(0,-1);
			}
			return Backbone.ajax({
				type : 'GET',
				url : API_HOST+'admin/i/common/disease/pick?'+process(ids)
			});
		}
	});
	var SymptomTagsModel = DxyCollection.Collection.extend({
		urlRoot : API_HOST + 'admin/i/common/symptom',
		model : TagModel,
		pick : function(ids){
			function process(ids){
				var res = '';
				_.each(ids, function(id){
					res += ('id='+id+'&');
				});
				return res.slice(0,-1);
			}
			return Backbone.ajax({
				type : 'GET',
				url : API_HOST+'admin/i/common/symptom/pick?'+process(ids)
			});
		}
	});
	var NodeLinkModel = Backbone.Model.extend({
		constructor : function(data){
			var id = data.node_id,
				value = data.node_value || '',
				params = data.node_params || '{}',
				me = this;
			var node = {
				id : id,
				value : value,
				params : params
			};
			this.total = 0;
			this.attach = new NodeModel(node);
			this.listenTo(this.attach, 'all', function(){
				me.trigger('change');
				console.log('node link change');
			});
			Backbone.Model.apply(this,arguments);
		},
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/node/link/single' + '?id=' + model.get('id');
					break;
				case 'update' : 
					options.url = API_HOST + 'admin/i/vote/node/link/put';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/vote/node/link/delete'+ '?id=' +model.get('id');
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/vote/node/link/add';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		parse : function(resp){
			if(resp.data && resp.data.items){
				return resp.data.items[0];
			}else{
				return resp;
			}
		},
		addNode : function(node){
			var me = this,
				old = this.attach;
			if(!node){
				return;
			}
			if(old){
				this.stopListening();
			}
			this.listenTo(node, 'all', function(){
				me.trigger('change');
				console.log('node link change');
			});
			this.attach = node;
		}
	});

	var NodeLinksModel = BaseListModel.extend({
		model : NodeLinkModel,
		url :  API_HOST + 'admin/i/vote/node/link/list',
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/node/link/list?vote_id='+this.id+'&items_per_page=100';
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var VoteModel = Backbone.Model.extend({
		constructor : function(data){
			var me = this;
			this.attach = new NodeLinksModel(data.nodes||[]);
			this.attach.parent = this;
			delete data.nodes;
			data.type = data.type===undefined? 0 : data.type;
			this.listenTo(this.attach, 'all', function(){
				me.trigger('change');
				console.log('vote change');
			});
			Backbone.Model.apply(this,arguments);
		},
		gen : function(opt){
			try{
				this.attach.id = this.get('id');
				this.attach.fetch({
					async: false,
					success : function(res){
						if(res.error){
							throw new Error('获取NodeLinks数据失败');
						}
					},
					error : function(){
						if(res.error){
							throw new Error('获取获取NodeLinks数据失败失败');
						}
					}
				});
				_.each(this.attach.models, function(nodelink){
					nodelink.attach.fetch({
						async: false,
						success : function(res){
							if(res.error){
								throw new Error('获取Node数据失败');
							}
						},
						error : function(){
							if(res.error){
								throw new Error('获取获取Node数据失败失败');
							}
						}
					});
					nodelink.attach.processInData();
				});
				opt.success();
			}catch(e){
				opt.error(e.message);
			}
		},
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/single' + '?id=' + model.get('id');
					break;
				case 'update' : 
					options.url = API_HOST + 'admin/i/vote/put';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/vote/delete';
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/vote/add';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		parse : function(resp){
			if(resp.data && resp.data.items){
				return resp.data.items[0];
			}else{
				return resp;
			}

		},
		addOption : function(){
			var	nodes = this.attach,
				me = this,
				dtd = $.Deferred();
			if(!nodes){
				nodes = new NodeLinksModel([]);
				this.listenTo(nodes, 'all', function(){
					me.trigger('change');
					console.log('vote change');
				});
				this.attach = nodes;
			}
			var node = new NodeModel({}),
				nodelink = new NodeLinkModel({});
			node.save({value:''},{data:{value:''}}).then(function(res){
				if(res.error){
					dtd.reject(res);
					return;
				}
				var id = res.data.items[0].id;
				node.set('id', id, {silent: true});
				nodelink.save({
						vote_id : me.get('id'),
						node_id : node.get('id'),
					},{
						data : {
							vote_id : me.get('id'),
							node_id : node.get('id'),
							sort : 1
						}
				}).then(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					nodelink.set('id', res.data.items[0].id, {silent:true})
					nodelink.addNode(node);
					nodes.add(nodelink);
				}, function(res){
					node.destroy({wait:true});
					dtd.reject(res);
				});
			}, function(res){
				dtd.reject(res);
			});
			return dtd;
		},
		removeOption : function(id){
			var votelink = this.attach.at(parseInt(id)),
				dtd = $.Deferred(),
				me = this;
			if(votelink.get('id')){
				votelink.destroy().then(function(res){
					if(res.error){
						dtd.reject();
						return;
					}
					me.attach.remove(votelink);
				}, function(res){
					dtd.reject();
				});
			}else{
				setTimeout(function(){
					me.attach.remove(votelink);
				},0);
			}
			return dtd;
		}

	});
	var VotesModel = BaseListModel.extend({
		model : VoteModel,
		sync : function(method, model, options){
			var page_index = options.page_index || this.page_index;
			var items_per_page = options.items_per_page || this.items_per_page;
			switch(method){
				case 'create':
					options.url = API_HOST + 'admin/i/vote/add';
					break;
				case 'read':
					if(options.search){
						options.url = API_HOST + 'admin/i/vote/search?q='+options.search+'&items_per_page='+items_per_page+'&page_index='+page_index;
					}else{
						options.url = API_HOST + 'admin/i/vote/list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
					}
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var VoteGroupModel = Backbone.Model.extend({
		constructor : function(data){
			var me = this;
			this.attach = new VoteGroupLinksModel(data.votes);
			this.attach.parent = this;
			delete data.votes;
			data.status = data.status===undefined ? 1 : data.status;
			this.listenTo(this.attach, 'all', function(){
				me.trigger('change');
				console.log('vote group change');
			});
			Backbone.Model.apply(this,arguments);
		},
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/group/single' + '?id=' + model.get('id');
					break;
				case 'update' : 
					options.url = API_HOST + 'admin/i/vote/group/put';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/vote/group/delete?id='+model.get('id');
					break;
				case 'create' :
					options.url = API_HOST + 'admin/i/vote/group/add';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		parse : function(resp){
			if(resp.data && resp.data.items){
				return resp.data.items[0];
			}else{
				return resp;
			}
		},
		processVoteData : function(){
			var res = 'group_id=' + this.get('id')+'&';
			_.each(this.attach.models, function(vote){
				var vote_id = vote.attach.get('id');
				_.each(vote.attach.attach.models, function(node){
					if(!node.checked){
						return;
					}
					var node_id = node.attach.get('id');
					res += ('vote_id='+vote_id+'&node_id='+node_id+'&');
				});
			});
			return res.slice(0,-1);
		},
		userVote : function(){
			var me = this;
			try{
				_.each(me.attach.models, function(vote, i){
					var tag = false;
					_.each(vote.attach.attach.models, function(opt){
						if(opt.checked){
							tag = true;
						}
					});
					if(!tag){
						throw new Error();
					}
				});
			}catch(e){
				return;
			}
			return Backbone.ajax({
				url : API_HOST + 'user/i/vote/result/batch_add?'+ me.processVoteData(),
				type : 'POST',
				data : {}
			});
		},
		getUserVotes : function(){
			var xhr = Backbone.ajax({
				url : API_HOST+'user/i/vote/result/list?group_id='+this.get('id'),
				type : 'GET'
			});
			return xhr;
		},
		getVotesStat : function(admin){
			var url;
			if(admin){
				url = API_HOST+'admin/i/vote/stat/list?group_id='+this.get('id')+'&items_per_page=100';
			}else{
				url = API_HOST+'user/i/vote/stat/list?group_id='+this.get('id')+'&items_per_page=100';
			}
			var xhr = Backbone.ajax({
				url : url,
				type : 'GET'
			});
			return xhr;
		},
		removeVote : function(id){
			var votelink = this.attach.at(parseInt(id)),
				dtd = $.Deferred(),
				me = this;
			if(votelink.get('id')){
				votelink.destroy().then(function(res){
					if(res.error){
						dtd.reject();
						return;
					}
					me.attach.remove(votelink);
				}, function(res){
					dtd.reject();
				});
			}else{
				setTimeout(function(){
					me.attach.remove(votelink)
				},0);
			}
			return dtd;
		},
		addVote : function(){
			var	nodes = this.attach,
				me = this,
				dtd = $.Deferred();
			if(!nodes){
				nodes = new VoteGroupLinksModel([]);
				this.listenTo(nodes, 'all', function(){
					me.trigger('change');
					console.log('vote change');
				});
				this.attach = nodes;
			}
			var node = new VoteModel({}),
				nodelink = new VoteGroupLinkModel({});
			node.save({type:0, title:'默认标题',content:'默认内容'},{data:{type:0, title:'默认标题',content:'默认内容'}}).then(function(res){
				if(res.error){
					dtd.reject(res);
					return;
				}
				var id = res.data.items[0].id;
				node.set('id', id, {silent: true});
				nodelink.save({
						group_id : me.get('id'),
						vote_id : node.get('id')
					},{
						data : {
							group_id : me.get('id'),
							vote_id : node.get('id')
						}
				}).then(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					nodelink.set('id', res.data.items[0].id, {silent:true})
					nodelink.addNode(node);
					nodes.add(nodelink);
					dtd.resolve(res);
				}, function(res){
					node.destroy({wait:true});
					dtd.reject(res);
				});
			}, function(res){
				dtd.reject(res);
			});
			return dtd;
		},
		sort : function(){
			function _sort(list){
				var len = list.length;
				_.each(list, function(item, i){
					item.set('sort', len-i);
				});
			}
			var votelinks = this.attach.models;
			_sort(votelinks);
			_.each(votelinks, function(votelink){
				_sort(votelink.attach.attach.models);
			});
		}
	});
	var VoteGroupsModel = BaseListModel.extend({
		model : VoteGroupModel,
		sync : function(method, model, options){
			var page_index = options.page_index || this.page_index;
			var items_per_page = options.items_per_page || this.items_per_page;
			switch(method){
				case 'create':
					options.url = API_HOST + 'admin/i/vote/group/add';
					break;
				case 'read':
					if(options.search){
						options.url = API_HOST + 'admin/i/vote/group/search?q='+options.search+'&items_per_page='+items_per_page+'&page_index='+page_index;
					}else{
						options.url = API_HOST + 'admin/i/vote/group/list' + '?page_index='+page_index+'&items_per_page='+items_per_page;
					}
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var VoteGroupLinkModel = Backbone.Model.extend({
		constructor : function(data){
			var title = data.vote_title || '',
				content = data.vote_content || '',
				me = this,
				temp= {};
			_.each(data, function(v, k){
				if(k.indexOf('vote')===0){
					temp[k.slice(5)] = v;
				}
			});
			temp.nodes = data.nodes || [];
			this.attach = new VoteModel(temp);
			this.vote_total = 0;
			this.listenTo(this.attach, 'all', function(){
				me.trigger('change');
				console.log('vote group link change');
			});
			Backbone.Model.apply(this,arguments);
		},
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/vote/group/link/single' + '?id=' + model.get('id');
					break;
				case 'update' : 
					options.url = API_HOST + 'admin/i/vote/group/link/put';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/vote/group/link/delete?id='+this.get('id');
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/vote/group/link/add';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		addNode : function(node){
			var me = this,
				old = this.attach;
			if(!node){
				return;
			}
			if(old){
				this.stopListening();
			}
			this.listenTo(node, 'all', function(){
				me.trigger('change');
				console.log('node link change');
			});
			this.attach = node;
		},
		parse : function(resp){
			if(resp.data && resp.data.items){
				return resp.data.items[0];
			}else{
				return resp;
			}
		},
	});
	var VoteGroupLinksModel = BaseListModel.extend({
		model : VoteGroupLinkModel,
		sync : function(method, model, options){
			switch(method){
				case 'create':
					options.url = API_HOST + 'admin/i/vote/group/link/add';
					break;
				case 'read':
					options.url = API_HOST + 'admin/i/vote/group/link/list?group_id='+this.id+'&items_per_page=100';
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});

	var VoteMarkModel = Backbone.Model.extend({
		constructor : function(data){
			var me = this;
			if(data.group){
				data.group = new VoteGroupModel(data.group||{});
				this.listenTo(data.group ,'all', function(){
					me.trigger('change');
					console.log('Vote mark change');
				});
			}
			Backbone.Model.apply(this, [data]);
		},
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'admin/i/functionmarker/data?obj_id='+this.get('obj_id')+'&type='+this.get('type');
					break;
				case 'create':
					options.url = API_HOST + 'admin/i/functionmarker/add';
					break;
				case 'delete':
					options.url = API_HOST + 'admin/i/functionmarker/delete';
					break;
			}
			return Backbone.sync(method, model, options);
		},
		addGroup : function(group){
			var me = this;
			this.stopListening();
			this.listenTo(group ,'all', function(){
				me.trigger('change');
				console.log('Vote mark change');
			});
			this.set('group', group, {silent:true});
		},
		newGroup : function(){
			var me = this, dtd = $.Deferred();
			var group = new VoteGroupModel({
				s_time : fomat(new Date(), 'YYYY-MM-DD hh:mm:ss'),
				e_time : fomat(new Date(), 'YYYY-MM-DD hh:mm:ss'),
				status : 1,
				title : '默认标题',
				content : '默认内容'
			});
			var mark = new VoteMarkModel({});
			group.save({},{data:group.attributes}).then(function(res){
				if(res.error){
					console.log(res);
					dtd.reject(res);
					return;
				}
				group.set('id', res.data.items[0].id);
				me.save({obj_id: group.get('id'), type: 10}, {data: {obj_id: group.get('id'), type: 10}}).then(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					me.unset('group', {silent:true});
					me.set('id', res.data.items[0].id);
					me.addGroup(group);
					dtd.resolve(group);
				}, function(res){
					dtd.reject(res);
				});
			}, function(res){
				dtd.reject(res);
			});
			return dtd;
		},
		parse : function(resp, options){
			if(resp.error){
				return {};
			}
			if(!resp.data.items[0].title){
				return resp.data.items[0];
			}
			// if(resp.data.items[0].votes){
			// 	_.each(resp.data.items[0].votes, function(vote){
			// 		if(vote.nodes){
			// 			vote.nodes.reverse();
			// 		}
			// 	});
			// }
			var group = new VoteGroupModel(resp.data.items[0]);
			var me = this;
			me.stopListening();
			me.listenTo(group ,'all', function(){
				me.trigger('change');
				console.log('Vote mark change');
			});
			return {group : group};
		},
		find : function(key){
			var arr = key.split('-'),
				obj = this;
			_.every(arr, function(k, i, all){
				if(k!==undefined && obj){
 					if(/\d+/.test(''+k)){
 						obj = obj.at(k);
 					}else if(k==='attach'){
 						obj = obj.attach;
 					}else{
 						obj = obj.get(k);
 					}
					return true;
				}else{
					return false;
				}
			});
			return obj;
		},
		confirm : function(){
			var error = false;
			var dtd = $.Deferred();
			function save(model){
				var me = this;
				if(!model){
					return;
				}
				if(model.models){
					_.each(model.models, function(m){
						save(m);
					});
				}
				if(model.attach){
					save(model.attach);
				}
				if(model instanceof NodeLinkModel){
					if(!model.get('node_id')){
						model.set('node_id', model.attach.get('id'));
					}
					if(!model.collection.parent.get('id')){
						model.collection.parent.save({},{
							data : model.collection.parent.attributes,
							async: false, 
							success: function(res){
								if(res.error){
									throw new Error('保存失败');
								}
							}, 
							error: function(){
								throw new Error('保存失败');
							}
						});
					}
					if(!model.get('vote_id')){
						model.set('vote_id',  model.collection.parent.get('id'));
					}
				}
				if(model instanceof VoteGroupLinkModel){
					if(!model.get('vote_id')){
						model.set('vote_id', model.attach.get('id'));
					}
					if(!model.collection.parent.get('id')){
						model.collection.parent.save({},{
							data : model.collection.parent.attributes, 
							async: false, 
							success: function(res){
								if(res.error){
									throw new Error('保存失败');
								}
							}, 
							error: function(){
								throw new Error('保存失败');
							}
						});
					}
					if(!model.get('group_id')){
						model.set('group_id',  model.collection.parent.get('id'));
					}
				}
				if(model.hasChanged && model.hasChanged()){
					var _data = model.attributes;
					if(model.processPostData){
						_data = model.processPostData(_data);
					}
					model.save({},{
						data: _data, 
						async: false, 
						success: function(res){
							if(res.error){
								throw new Error('保存失败');
							}
						},
						error : function(){
							throw new Error('保存失败');
						}
					});
				}
			}
			try{
				this.get('group').sort();
				var root = this.get('group');
				save(root);
				setTimeout(function(){
					dtd.resolve();
				},0);
			}catch(e){
				console.log(e);
				setTimeout(function(){
					dtd.reject();
				},0);
			}
			return dtd;
		},
		gen2 : function(opt){
			var me = this;
			if(!this.get('obj_id')){
				opt.error('require obj_id');
				return;
			}
			Backbone.$.get(API_HOST+'admin/i/vote/group/single_all?id='+this.get('obj_id')).then(function(res){
				if(res.error){
					opt.error('加载投票数据失败');
					return;
				}
				if(res.data && res.data.items && res.data.items[0]){
					var votelinks, 
					res = res.data.items[0];
					me.addGroup(new VoteGroupModel({}));
					votelinks = res.group_vote_links;
					delete res.group_vote_links;
					me.get('group').attributes = res;
					me.get('group').attach.id = me.get('group').get('id');
					_.each(votelinks, function(votelink){
						var vote = votelink.vote,
							nodelinks = vote.vote_node_links;
						delete votelink.vote;
						votelink = new VoteGroupLinkModel(votelink);
						delete vote.vote_node_links;
						me.get('group').attach.add(votelink);
						votelink.addNode(new VoteModel({}));
						votelink.attach.attributes = vote;
						_.each(nodelinks, function(nodelink){
							var node = nodelink.node;
							delete nodelink.node;
							nodelink = new NodeLinkModel(nodelink);
							votelink.attach.attach.add(nodelink);
							nodelink.addNode(new NodeModel({}));
							nodelink.attach.attributes = node;
							nodelink.attach.processInData();
						});
					});
					opt.success();
				}
			}, function(res){
				opt.error('加载投票数据失败');
			});
		},
		gen : function(opt){
			if(!this.get('obj_id')){
				opt.error('require obj_id');
				return;
			}
			try{
				this.addGroup(new VoteGroupModel({}));
				this.get('group').attributes.id = this.get('obj_id');
				this.get('group').fetch({
					async: false,
					success : function(res, resp){
						if(resp.error){
							throw new Error('获取投票组数据失败');
						}
					},
					error : function(res, resp){
						if(resp.error){
							throw new Error('获取投票组数据失败');
						}
					}
				});
				this.get('group').changed = {};
				this.get('group').attach.id = this.get('group').get('id');
				this.get('group').attach.fetch({
					async: false,
					success : function(res, resp){
						if(resp.error){
							if(resp.error.code==101){
								return;
							}else{
								throw new Error('获取VoteGroupLinksModel数据失败');
							}
						}
					},
					error : function(res, resp){
						if(resp.error){
							throw new Error('获取VoteGroupLinksModel失败');
						}
					}
				});
				_.each(this.get('group').attach.models, function(votelink){
					votelink.attach.attributes.id = votelink.get('vote_id');
					votelink.attach.fetch({
						async: false,
						success : function(res, resp){
							if(resp.error){
								throw new Error('获取Vote数据失败');
							}
						},
						error : function(res, resp){
							if(resp.error){
								throw new Error('获取Vote失败');
							}
						}
					});
					votelink.attach.changed = {};
					votelink.attach.attach.id = votelink.attach.get('id');
					votelink.attach.attach.fetch({
						async: false,
						success : function(res, resp){
							if(resp.error){
								throw new Error('获取NodeLinks数据失败');
							}
						},
						error : function(res, resp){
							if(resp.error){
								throw new Error('获取获取NodeLinks数据失败失败');
							}
						}
					});
					_.each(votelink.attach.attach.models, function(nodelink){
						nodelink.attach.fetch({
							async: false,
							success : function(res, resp){
								if(resp.error){
									throw new Error('获取Node数据失败');
								}
							},
							error : function(res, resp){
								if(resp.error){
									throw new Error('获取获取Node数据失败失败');
								}
							}
						});
						nodelink.attach.processInData();
					});
				});
				opt.success();
			}catch(e){
				throw e;
				opt.error(e.message);
			}
		}
	});

	var VoteUserMarkModel = VoteMarkModel.extend({
		sync : function(method, model, options){
			switch(method){
				case 'read':
					options.url = API_HOST + 'view/i/functionmarker/single?obj_id='+this.get('obj_id')+'&type='+this.get('type');
					break;
			}
			return Backbone.sync(method, model, options);
		},
		userChooseVoteOption : function(nid, vid, gid){
			return Backbone.ajax({
				type : 'POST',
				url : API_HOST+'user/i/vote/result/add',
				data : {
					node_id : nid,
					vote_id : vid,
					group_id : gid
				}
			});
		}
	});

	return {
		NodeModel : NodeModel,
		NodesModel : NodesModel,
		NodeLinkModel : NodeLinkModel,
		NodeLinksModel : NodeLinksModel,
		VoteModel : VoteModel,
		VotesModel : VotesModel,
		VoteGroupModel : VoteGroupModel,
		VoteGroupsModel : VoteGroupsModel,
		VoteGroupLinkModel : VoteGroupLinkModel,
		VoteGroupLinksModel : VoteGroupLinksModel,
		VoteMarkModel : VoteMarkModel,
		VoteUserMarkModel : VoteUserMarkModel,
		BaseListModel : BaseListModel,
		TagsModel : TagsModel,
		TagModel : TagModel,
		DeseaseTagsModel : DeseaseTagsModel,
		SymptomTagsModel : SymptomTagsModel
	};
});
(function(g){
	var CLASS_NAME = 'dxy-meta-replaced-view';
	function isPC(){  
        	var userAgentInfo = navigator.userAgent;  
        	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        	var flag = true;  
        	for (var i = 0; i < Agents.length; i++) {  
				if (userAgentInfo.indexOf(Agents[i]) > 0){
					flag = false;
					break; 
				}  
        	}  
        	return flag;  
	}
	function assign(target){
		for(var i=1,len=arguments.length; i<len; i++){
			for(var prop in arguments[i]){
				if(arguments[i].hasOwnProperty(prop)){
					target[prop] = arguments[i][prop];
				}
			}
		}
		return target;
	}

	function EditView(ele, range){
		if(range){
			this.range = range;
			if(!this.createPlainElement){
				return;
			}
			this.ele = this.createPlainElement();
			range.insertNode(this.ele);
		}else{
			if(!ele && !ele.nodeType){
				throw new Error('require dom element');
			}
			this.ele = ele;
		}
	}
	EditView.prototype = {};
	EditView.isEditView = function(ele){
		return ele.nodeType && ele.nodeType===1 && ele.getAttribute('data-type') && EditView.custom[ele.getAttribute('data-type')];
	};
	EditView.getInstance = function(ele, range){
		if(!ele){
			throw new Error('getInstance require one argument');
		}
		if(EditView.isEditView(ele)){
			return new EditView.custom[ele.getAttribute('data-type')](ele);
		}else{
			for(var view in EditView.custom){
				if(EditView.custom.hasOwnProperty(view)){
					if(EditView.custom[view].isEditView && EditView.custom[view].isEditView(ele)){
						return new EditView.custom[view](ele);
					}
				}
			}
			return null;
		}
	};
	EditView.custom = {};
	EditView.register = function(type, instancemethods, classmethods){
		function CustomEditView(){
			this.type = type;
			EditView.apply(this, [].slice.apply(arguments));
		}
		CustomEditView.prototype = assign({}, CustomEditView.prototype, instancemethods);
		classmethods && assign(CustomEditView, classmethods);
		CustomEditView.prototype.showModal = function(){
			if(instancemethods.showModal){
				instancemethods.showModal.call(this);
				return;
			}
			var modal = $('#dxy-'+this.type+'-modal'),
				confirm = $('#confirm-'+this.type),
				me = this;
			if(modal.length===0){
				throw new Error('can not find modal id dxy-'+this.type+'-modal');
			}
			if(confirm.length===0){
				throw new Error('can not find confirm id dxy-'+this.type);
			}
			me.modal = modal;
			function onShow(){
				if(!modal.isInited){
					if(me.modalInit){
						me.modalInit();
					}
					modal.isInited = true;
				}
				modal.data('view', me);
				if(!me.onModalShow){
					throw new Error('requrie onModalShow');
				}
				me.onModalShow();
			}
			function onHide(){
				if(me.onModalHide){
					me.onModalHide();
				}
				modal.off('show.bs.modal', onShow).off('hide.bs.modal', onHide);
				confirm.off('click', onConfirm);
				modal.data('view', null);
			}
			function onConfirm(){
				if(!me.onModalConfirm){
					throw new Error('requrie onModalConfirm');
				}
				if(me.onModalConfirm()){
					modal.modal('hide')
				}
			}
			modal.on('show.bs.modal', onShow).on('hide.bs.modal', onHide).modal();
			confirm.on('click', onConfirm);
		};
		EditView.custom[type] = CustomEditView;
		return CustomEditView;
	};

	function ReplacedView(data){
		if(!data){
			throw new Error('ReplacedView require one argument');
		}
		if(typeof data==='string'){
			data = JSON.parse(data);
		}
		if(!data.type){
			throw new Error('miss type');
		}
		this.data = data;
		this.type = data.type;
		this.isMounted = false;
		this.ele = null;
		// this.toMetaView();
	};
	ReplacedView.prototype = {
		createWrapNode : function(plain){
			var me = this;
			var ele = document.createElement('section');
			ele.style.display = 'block';
			ele.className = CLASS_NAME;
			ele.setAttribute('data-type', this.type);
			ele.setAttribute('data-params', this.serialize(this.data));
			if(!plain){
				ele.ondblclick = function(e){
					e = e || window.event;
					var editor = UE.getEditor('editor-box'),
						range = editor.selection.getRange();
					range.selectNode(e.target).select();
					UE.getEditor('editor-box').execCommand('replacedview', me.type);
				};
			}
			return ele;
		},
		// todo: 移除contenteditable, 测试删除bug
		createEditorWraperNode : function(){
			var me = this;
			var ele = document.createElement('section');
			var close = document.createElement('span');
			close.innerHTML = 'X';
			close.className = 'mark-close';
			close.onclick = function(){
				$(ele).remove();
			};
			ele.style.display = 'block';
			ele.className = CLASS_NAME;
			ele.setAttribute('data-type', this.type);
			ele.setAttribute('data-params', this.serialize(this.data));
			// ele.setAttribute('contenteditable', false);
			ele.ondblclick = function(e){
				e = e || window.event;
				var editor = UE.getEditor('editor-box'),
					range = editor.selection.getRange();
				range.selectNode(e.target).select();
				UE.getEditor('editor-box').execCommand('replacedview', me.type);
			};
			// ele.appendChild(close);
			return ele;
		},
		createInlineWrapNode : function(plain){
			var me = this;
			var ele = document.createElement('span');
			ele.className = CLASS_NAME;
			ele.setAttribute('data-type', this.type);
			ele.setAttribute('data-params', this.serialize(this.data));
			if(true){
				ele.ondblclick = function(e){
					if(!window.UE){
						return;
					}
					e = e || window.event;
					var editor = UE.getEditor('editor-box'),
						range = editor.selection.getRange();
					range.selectNode(e.target).select();
					UE.getEditor('editor-box').execCommand('replacedview', me.type);
				};
			}
			return ele;
		},
		createBlockWrapNode : function(){
			var me = this;
			var ele = document.createElement('section');
			ele.className = CLASS_NAME;
			ele.setAttribute('data-type', this.type);
			ele.setAttribute('data-params', this.serialize(this.data));
			if(true){
				ele.ondblclick = function(e){
					if(!window.UE){
						return;
					}
					e = e || window.event;
					var editor = UE.getEditor('editor-box'),
						range = editor.selection.getRange();
					range.selectNode(e.target).select();
					UE.getEditor('editor-box').execCommand('replacedview', me.type);
				};
			}
			return ele;
		},
		toJson : function(){
			return this.data;
		},
		toWechatView : function(){
			throw new Error('you should provide toWechatView in the config');
		},
		toWebView : function(){
			throw new Error('you should provide toWebView in the config');
		},
		toAppView : function(){
			throw new Error('you should provide toAppView in the config');
		},
		toMobileView : function(){
			throw new Error('you should provide toAppView in the config');
		},
		toEditorView : function(){
			throw new Error('you should provide toAppView in the config');
		},
		showModal : function(){

		},
		toMetaView : function(e){
			this.view = 'meta';
			var ele;
			if(this.isWraper){
				ele = this.createInlineWrapNode();
				if(e){
					ele.innerHTML = typeof e.innerHTML === 'string' ? e.innerHTML : e.innerHTML();
				}else{
					ele.appendChild(UE.getEditor('editor-box').selection.getRange().cloneContents());
				}
				ele.style.display = 'inline';
			}else if(this.isBlock){
				ele = this.createBlockWrapNode();
				if(e){
					ele.innerHTML = typeof e.innerHTML === 'string' ? e.innerHTML : e.innerHTML();
				}
				ele.style.display = 'block';
			}else{
				ele = this.createWrapNode();
				ele.style.display = 'none';
			}
			this.ele = ele;
			return ele;
		},
		toAppropriateView : function(ele){
			if(!ReplacedView.platform){
				if(isPC()){
					if(/admin\/column\/\d+/.test(window.location.href)){
						ReplacedView.platform = 'editor';
					}else{
						ReplacedView.platform = 'pc';
					}
				}else{
					ReplacedView.platform = 'h5';
				}
				if(window.DXYJSBridge){
					ReplacedView.platform = 'mobile';
				}
			}
			switch(ReplacedView.platform){
				case 'pc' :
					return this.toWebView(ele);
				case 'editor' :
					return this.toEditorView(ele);
				case 'h5' :
					return this.toAppView(ele);
				case 'mobile':
					return this.toMobileView(ele);
			}
		},
		mount : function(ele){
			function find(ancestors){
				if(!ancestors){
					return null;
				}
				if(ancestors.getAttribute){
					if(ancestors.getAttribute('class') && ancestors.getAttribute('class').indexOf('dxy-meta-replaced-view')!==-1){
						return ancestors;
					}else{
						return find(ancestors.parentNode);
					}
				}else{
					return find(ancestors.parentNode);
				}
			}
			if(!ele){
				throw new Error('mount requrie one argument');
			}
			if(ele.nodeType){
				ele.parentNode.replaceChild(this.ele, ele);
			}else{
				if(ele.cloneRange){
					if(this.isWraper){
						var ancestors = ele.getCommonAncestor(true);
						var e = find(ancestors)
						if(e){
							this.mount(e);
						}else{
							ele.deleteContents().insertNode(this.ele);
						}
					}else{
						var ancestors = ele.getCommonAncestor(true);
						var e = find(ancestors)
						if(e){
							this.mount(e);
						}else{
							ele.enlarge(true).deleteContents().insertNode(this.ele);
						}
					}
				}else{
					throw new Error('mount argument should element or range');
				}
			}
			this.isMounted = true;
		},
		serialize : function(obj){
			return ReplacedView.serialize(obj);
		},
		deSerialize : function(str){
			return ReplacedView.deSerialize(str);
		}
	};
	ReplacedView.serialize = function(obj){
		if(typeof obj==='string'){
			return obj;
		}
		var res = '';
		for(var prop in obj){
			if(obj.hasOwnProperty(prop)){
				res += (prop + '=' + obj[prop]+'&');
			}
		}
		return res.slice(0, -1);
	};
	ReplacedView.deSerialize = function(str){
		if(typeof str === 'object'){
			return str;
		}
		try{
			return JSON.parse(window.decodeURIComponent(str));
		}catch(e){

		}
		str = str.replace(/&amp;/g, '&');
		var items = str.split('&'),
			res = {},
			item;
		for(var i=0, len=items? items.length: 0; i<len; i++){
			item = items[i].split('=');
			res[item[0]] = item[1];
		}
		return res;
	};
	ReplacedView.isReplacedView = function(node){
		return node.nodeType===1 && node.getAttribute('data-type') && node.getAttribute('data-params') && node.className.indexOf('dxy-meta-replaced-view')!==-1 && ReplacedView.custom[node.getAttribute('data-type')];
	};
	ReplacedView.getInstance = function(node){
		if(!node){
			throw new Error('getInstance require one argument');
		}
		if(typeof node === 'string'){
			if(ReplacedView.custom[node]){
				return new ReplacedView.custom[node]({type:node});
			}else{
				return null;
			}
		}
		if(ReplacedView.isReplacedView(node)){
			var v =  new ReplacedView.custom[node.getAttribute('data-type')](ReplacedView.deSerialize(node.getAttribute('data-params')));
			v.isMounted = true;
			return v;
		}else{
			return null;
		}
	};
	ReplacedView.renderAll = function(){
		$('.'+CLASS_NAME).each(function(i, ele){
			var view = ReplacedView.getInstance(ele);
			if(view){
				view.toAppropriateView(ele).then(function(){
					if(!view.isWraper){
						view.ele.style.display = 'block';
					}
					view.mount(ele);
				});
			}
		});
	};
	ReplacedView.custom = {};
	ReplacedView.register = function(type, instancemethods, classmethods){
		function CustomReplacedView(data){
			data.type = type;
			ReplacedView.call(this, data);
		}
		CustomReplacedView.prototype = assign({}, ReplacedView.prototype, instancemethods);
		classmethods && assign(CustomReplacedView, classmethods);
		CustomReplacedView.prototype.showModal = function(){
			if(instancemethods.showModal){
				instancemethods.showModal.call(this);
				return;
			}
			var modal = $('#dxy-'+this.type+'-modal'),
				confirm = $('#confirm-'+this.type),
				me = this;
			if(modal.length===0){
				throw new Error('can not find modal id dxy-'+this.type+'-modal');
			}
			if(confirm.length===0){
				throw new Error('can not find confirm id dxy-'+this.type);
			}
			me.modal = modal;
			function onShow(){
				if(!modal.isInited){
					if(me.modalInit){
						me.modalInit();
					}
					modal.isInited = true;
				}
				modal.data('view', me);
				if(!me.onModalShow){
					throw new Error('requrie onModalShow');
				}
				me.onModalShow();
			}
			function onHide(){
				if(me.onModalHide){
					me.onModalHide();
				}
				modal.off('show.bs.modal', onShow).off('hide.bs.modal', onHide);
				confirm.off('click', onConfirm);
				modal.data('view', null);
			}
			function onConfirm(){
				if(!me.onModalConfirm){
					throw new Error('requrie onModalConfirm');
				}
				var res = me.onModalConfirm();
				if(me.saving){
					return;
				}
				me.saving = true;
				if(res.then){
					res.then(function(){
						me.saving = false;
						modal.modal('hide');
						me.toEditorView().then(function(){
							me.mount(UE.getEditor('editor-box').selection.getRange());
							var domUtils = baidu.editor.dom.domUtils;
							var range = UE.getEditor('editor-box').selection.getRange(),
								cur = range.getCommonAncestor(true),
			                    target = domUtils.findParent(cur, function(node){
			                    	if(node.className && node.className.indexOf('dxy-meta-replaced-view')!==-1){
			                    		return true;
			                    	}else{
			                    		return false;
			                    	}
			                    }, true);
		                	// if($(target).next()[0]){
		                	// 	range.setStartBefore($(target).next()[0]);
		                	// 	range.setCursor();
		                	// 	UE.getEditor('editor-box').focus();
		                	// }
						});
					}, function(){
						me.saving = false;
					});
				}else{
					me.saving = false;
					if(res){
						modal.modal('hide')
						me.toEditorView().then(function(){
							me.mount(UE.getEditor('editor-box').selection.getRange());
						});
					}
				}
			}
			modal.on('show.bs.modal', onShow).on('hide.bs.modal', onHide).modal();
			confirm.on('click', onConfirm);
		};
		ReplacedView.custom[type] = CustomReplacedView;
		return CustomReplacedView;
	};
	g.ReplacedView = ReplacedView;
	g.EditView = EditView;
})(window);
LocalModule.define("dxy-plugins/editview/customview/customviews/doctor_question/views/page.view", function(){var tpl = '<section class="laiwen-doctor-answer clearfix">'+
'	<section class="avatar">'+
'		<img src="<%=img.value%>">'+
'	</section>'+
'	<section class="dialog">'+
'		<section class="view-wraper"><%=content.value%></section>'+
'	</section>'+
'	<section class="clear">&nbsp;</section>'+
'</section>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/customviews/user_answer/views/page.view", function(){var tpl = '<section class="laiwen-user-question clearfix">'+
'	<%if(img.value){%>'+
'		<section class="avatar">'+
'			<img src="<%=img.value%>">'+
'		</section>'+
'	<%}%>'+
'	<section class="dialog">'+
'		<section class="view-wraper"><%=content.value%></section>'+
'	</section>'+
'	<section class="clear">&nbsp;</section>'+
'</section>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/views/config.view", function(){var tpl = '<div class="clearfix">'+
'  <form class="form-horizontal">'+
'  <%_.each(_.keys(config), function(key){%>'+
'    <div class="form-group">'+
'      <label for="inputEmail3" class="col-sm-3 control-label"><%=config[key].title%></label>'+
'      <div class="col-sm-9">'+
'        <input type="text" class="form-control input-<%=key%>" value="<%=config[key].value%>" placeholder="<%=config[key].placeholder%>">'+
'      </div>'+
'    </div>'+
'  <%})%>'+
'  </form>'+
'  <button class="btn btn-primary pull-right confirm-config" type="button">确认修改</button>'+
'<div>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/views/dashboard.view", function(){var tpl = '<div class="btn-group-vertical customview-dashboard-controll" role="group">'+
'	<%_.each(styles, function(style){%>'+
'	<button type="button" class="btn btn-default view-button" data-name="<%=style.viewname%>"><%=style.title%></button>'+
'	<%})%>'+
'</div>'+
'<div class="views-container" style="display:inline-block;">'+
'	'+
'</div>'+
'<div class="col-md-12 view-trash" style="margin-top:20px;text-align:center;">'+
'  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'+
'  拖动到这删除'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/dialog.view", function(){var tpl = '<div class="form-group">'+
'	<textarea class="form-control" id="annotation-value"  placeholder="请输入注释" rows=\'5\'><%=value%></textarea>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/mobile_pop.view", function(){var tpl = '	<div class=\'arrow\'>'+
'	</div>'+
'	<%if(annotation){%>'+
'		<%if(url){%>'+
'			<a href="<%=url%>" target="_black" class="annotation-header">'+
'				<span class="annotation-title"><%=title%></span>'+
'				<span class="more"></span>'+
'			</a>'+
'		<%}else{%>'+
'			<div class="annotation-header">'+
'				<span class="annotation-title"><%=title%></span>'+
'			</div>'+
'		<%}%>'+
'		<div class="annotation-content"><%=slice(annotation.get(\'value\'))%></div>'+
'	<%}else{%>'+
'		<div class="loading">加载中...</div>'+
'	<%}%>'+
'	<%if(error){%>'+
'		<div>'+
'			<%=error%>'+
'		</div>'+
'	<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/pop.view", function(){var tpl = '	<%if(arrow){%>'+
'	<div class=\'arrow\'>'+
'	</div>'+
'	<%}%>'+
'	<%if(annotation){%>'+
'	<div class="annotation-content"><%=annotation.get(\'value\')%></div>'+
'	<%}else{%>'+
'	<div class="loading">加载中...</div>'+
'	<%}%>'+
'	<%if(error){%>'+
'	<div>'+
'		<%=error%>'+
'	</div>'+
'	<%}%>'+
'	<%if(url){%>'+
'	<div class="more">'+
'		<a href="<%=url%>" target="_black">查看更多<span></span></a>'+
'	</div>'+
'	<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/drug/views/app.view", function(){var tpl = '<a href="<%=drug_url%>" class=\'m-drug-view-wraper\' target="_black">'+
'	<div class="m-drug-view-img">'+
'		<img src=\'http://assets.dxycdn.com/app/dxydoctor/img/editor/drug-icon.png\'>'+
'	</div>'+
'	<div class=\'m-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'</a>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/drug/views/mobile.view", function(){var tpl = '<a class=\'mobile-drug-view-wraper\' href="<%=drug_url%>" target="_black">'+
'	<div class=\'mobile-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'	<div class="mobile-drug-view-footer">'+
'		<span class="arrow"></span>'+
'		<%if(is_medicare){%>'+
'		<span class="tag">医保</span>'+
'		<%}%>'+
'	</div>'+
'</a>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/mark.view", function(){var tpl = '<%if(marks){%>'+
''+
'<%_.each(marks, function(mark){%>'+
''+
'<a class="btn btn-default center-block mark-item" href="#" role="button" style="width:40%;" data-id=<%=mark.id%>><%=mark.name%></a>'+
'<br>'+
''+
'<%})%>'+
''+
'<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/video/views/main.view", function(){var tpl = '<div>'+
'<div class="form-group">'+
'  <input type="text" class="form-control" id="video-id"  placeholder="请输入腾讯视频id或链接" value="<%=value%>">'+
' </div>'+
' <div class="form-group">'+
' <div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;width: 100px;" >'+
' 	<p>上传视频截图</p>'+
' 	<input type="file" name="file" id="video-cover" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;">'+
' </div>'+
'  <p class="help-block">手机上不自动播放视频，挑一张精彩的视频截图更能吸引用户点击播放。</p>'+
' </div>'+
' <div class="form-group">'+
' <img src="<%=cover%>" style="width:100%;">'+
' </div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/alert.view", function(){var tpl = '<div class="editor-alert-box <%if(cls){print(cls)}%>">'+
'	<p><%=title%></p>'+
'	<a href="javascript:;"><%=button_title%></a>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/dialog.view", function(){var tpl = '<div>'+
'  <div class="tab-content">'+
'    <div role="tabpanel" class="tab-pane" id="add-vote">'+
'    '+
'    </div>'+
'    <div role="tabpanel" class="tab-pane active" id="vote-list">'+
'    	<%if(votelist){%>'+
'    	<div class="row">'+
'			<div class="input-group col-md-6" style="left:25%;">'+
'		      <input type="text" class="form-control" placeholder="根据名称筛选" id="J-vote-group-search">'+
'		      <div id="search-list-container">'+
'		      	'+
'		      </div>'+
'		    </div>'+
'		</div>'+
'		<table class="table table-hover">'+
'			<thead>'+
'				<tr>'+
'					<th>#</th>'+
'					<th>名称</th>'+
'					<th>开始时间</th>'+
'					<th>截止时间</th>'+
'					<th>状态</th>'+
'					<th>操作</th>'+
'				</tr>'+
'			</thead>'+
'			<tbody>'+
'				<%_.each(votelist.models, function(vote, i){%>'+
'				<tr class="<%if(new Date()<new Date(vote.get(\'e_time\')) && new Date()>=new Date(vote.get(\'s_time\'))){print(\'success\')}%>">'+
'					<td><%=vote.get(\'id\')%></td>'+
'					<td><%=vote.get(\'title\')%></td>'+
'					<td><%=vote.get(\'s_time\')%></td>'+
'					<td><%=vote.get(\'e_time\')%></td>'+
'					<td><%if(vote.get(\'status\')==0){print(\'禁用\')}else if(vote.get(\'status\')==1){print(\'正常\')}else{print(\'删除\')}%></td>'+
'					<td>'+
'						<a href="javascript:;" class="J-add-vote-from-votelist" data-id="<%=vote.get(\'id\')%>"><%if(mark.get(\'group\')){print(\'替换\')}else{print(\'插入\')}%></a>'+
'					</td>'+
'				</tr>'+
'				<%})%>'+
'			</tbody>'+
'		</table>'+
'		<nav>'+
'		  <ul class="pager">'+
'		    <li class="previous" id="vote-list-page-prev"><a href="#"><span aria-hidden="true">&larr;</span> 上一页</a></li>'+
'		    <li class="next" id="vote-list-page-next"><a href="#">下一页 <span aria-hidden="true">&rarr;</span></a></li>'+
'		  </ul>'+
'		</nav>'+
'		<%}else{%>'+
'			<span class=\'center-block\'>加载中...</span>'+
'		<%}%>'+
'    </div>'+
'  </div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/editor.view", function(){var tpl = '<div class="editor-vote-container">'+
'<p>'+
'	<span class="tag">投票</span>'+
'	<span class="tag"><%if(group.get(\'show_type\')==0){print(\'默认类型\')}else if(group.get(\'show_type\')==1){print(\'横排单选\')}%></span>'+
'	<span class="tag"><%if(group.get(\'status\')==\'0\'){print(\'禁用\')}else if(group.get(\'status\')==\'1\'){print(\'正常\')}else{print(\'删除\')}%></span>'+
'	<span class="tag"><%if(new Date()<new Date(group.get(\'e_time\')) && new Date()>=new Date(group.get(\'s_time\'))){print(\'进行中\')}else if(new Date()>new Date(group.get(\'e_time\'))){print(\'已过期\')}else{print(\'未开始\')}%></span>'+
'</p>'+
'<%_.each(votes, function(vote, i){%>'+
'<%if(+vote.attach.get(\'type\')===0){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!vote.attach.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(vote.attach.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}else{%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!vote.attach.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(vote.attach.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}%>'+
'<%})%>'+
''+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/h5.view", function(){var tpl = '<div class="editor-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>" >'+
'<%if(expired){%>'+
'<a href="javascript:;" class="vote-expired-tip user-vote">'+
'	投票已过期'+
'</a>'+
'<%}%>'+
'<%_.each(votes, function(vote, i){%>'+
'<%if(+vote.attach.get(\'type\')===0){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<div class="vote-type"></div>'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}else{%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<div class="vote-type"></div>'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}%>'+
'<%})%>'+
'<%if(!expired){%>'+
'<div class="vote-opt-wraper">'+
'<%if(!expired && isLogin){%>'+
'<a href="javascript:;" class="user-vote J-user-vote">'+
'	<%if(group.user_voted){print(\'你已投票\')}else if(isLogin){print(\'我要投票\')}%>'+
'</a>'+
'<%}else if(!isLogin){%>'+
'<a href="https://account.dxy.com/login?redirect_uri=<%=window.location.href%>" class="user-vote">'+
'	登录并投票'+
'</a>'+
'<%}%>'+
'</div>'+
'<%}%>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '<div class="editor-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%> mobile-vote">'+
'<%_.each(votes, function(vote, i){%>'+
'	<div class="editor-vote-wraper <%if(+vote.attach.get(\'type\')===0){print(\'vote-single\')}else{print(\'vote-multiple\')}%> <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><span>投票</span><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<span class="vote-value"><%=opt.attach.get(\'value\')%></span><span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</p>'+
'						<div class="status-bar" style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;">'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<div class="vote-option-main">'+
'								<%if(opt.attach.get(\'img\')){%>'+
'								<span class="img">'+
'									<img src="<%=opt.attach.get(\'img\')%>">'+
'								</span>'+
'								<%}%>'+
'								<span class="vote-option-value"><%=opt.attach.get(\'value\')%></span>'+
'							</div>'+
'							<div class="vote-option-sub">'+
'								'+
'							</div>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%})%>'+
'<div class="vote-opt-wraper">'+
'<%if(expired){%>'+
'<a href="javascript:;" class="vote-expired-tip user-vote">'+
'	投票已过期'+
'</a>'+
'<%}%>'+
'<%if(!expired){%>'+
'<a href="javascript:;" class="user-vote J-user-vote">'+
'	<%if(group.user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'</a>'+
'<%}%>'+
'</div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/searchList.view", function(){var tpl = '<%if(list && list.length>0){%>'+
'<ul class="search-list">'+
'	<%_.each(list, function(item,i){%>'+
'	<li data-id="<%=i%>"><%=item.get(\'title\')%></li>'+
'	<%})%>'+
'</ul>'+
'<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/singlebutton/mobile.view", function(){var tpl = '<div class="editor-button-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%> <%if(!expired){print(\'not_expired\')}else{print(\'expired\')}%>">'+
'<%if(group.user_voted){%>'+
'<%if(expired){%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'	<table>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check">'+
'					<%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%>'+
'				</span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	<tr style="height:10px;"></tr>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option-stat <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<div class="right-answer"><span class="arrow"></span>正确答案</div>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	</table>'+
'	</div>'+
'<%})%>'+
''+
'<%if(false){%>'+
'<%_.each(votes, function(vote, i){%>'+
'	<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<div class="editor-vote-option <%if(opt.checked){print(\'checked\')}%>" style="<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check"><%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%></span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</div>'+
'		<%})%>'+
'	</div>'+
'<%})%>'+
'<%}%>'+
''+
'<%}else{%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'	<table>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check">'+
'					<%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%>'+
'				</span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	<tr style="height:10px;"></tr>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option-stat <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<div class="right-answer"><span class="arrow"></span>正确答案</div>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	</table>'+
'	</div>'+
'<%})%>'+
''+
'<%if(false){%>'+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<div class="editor-vote-option <%if(opt.checked){print(\'checked\')}%>" style="<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check"><%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%></span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</div>'+
'		<%})%>'+
'	</div>'+
'<%})%>'+
'<%}%>'+
''+
'<%}%>'+
'<%}else{%>'+
'<%if(expired){%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
''+
'<%})%>'+
''+
'<%}else{%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<table class="editor-vote-wraper clearfix">'+
'		<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option" style="<%if(j==0){print(\'padding-right:6px\')}else if(j==vote.attach.attach.models.length-1){print(\'padding-left:6px\')}else{print(\'padding-right:6px;padding-left:6px\')}%>"  data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>" >'+
'				<div>'+
'					<span style="background-color: <%=bgcolors[j]%>"><%=opt.attach.get(\'value\')%></span>'+
'				</div>'+
'			</td>'+
'		<%})%>'+
'		</tr>'+
'	</table>'+
'<%})%>'+
''+
'<%}%>'+
'<%}%>'+
'</div>';return tpl;});
(function(g){
	EditView.register('bubbletalk', {
		onModalShow : function(){
			this.modal.find('#dxy-bubbletalk-content').html('')
		},
		onModalConfirm : function(){
			try{
				var content = this.modal.find('#dxy-bubbletalk-content').html();
				UE.getEditor('editor-box').execCommand('inserthtml', content);
			}catch(e){
				alert('发生未知错误,请联系');
				console.log(e);
			}
			return true;
		},	
		modalInit : function(){
			
		}
	},{
		isEmptySupport : true
	});
})(this);
(function(g){
	EditView.register('image', {
		onModalShow : function(){
			if(this.ele && this.ele.tagName==='IMG'){
				this.modal.find('#modal-image-link').val(this.ele.src);
				this.modal.find('#modal-image-desc').val(this.ele.alt);
				var image = new Image()
			    image.src = this.ele.src;
				this.modal.find('#modal-image-height').val(image.height);
				this.modal.find('#modal-image-width').val(image.width);
			}else{
				alert(1);
			}
		},
		onModalConfirm : function(){
			var desc = this.modal.find('#modal-image-desc').val(),
				href = this.modal.find('#modal-image-link').val();
			if(!desc){
				alert('请填写图片描述:)');
				return false;
			}
			if(!href){
				alert('请填写图片链接:)');
				return false;
			}
			this.ele.alt = desc;
			this.ele.src = href;
			this.ele.setAttribute('_src', href);
			return true;
		},
		modalInit : function(){
			
		},
		createPlainElement : function(){
			var image = document.createElement('img');
			image.src = '';
			image.alt = '默认图片';
			return image;
		}
	},{
		isEmptySupport : true,
		isEditView : function(ele){
			if(ele && ele.tagName === 'IMG'){
				return true;
			}
			return false;
		}
	});
})(this);
LocalModule.require(['CustomView', 'dxy-plugins/editview/customview/customviews/doctor_question/views/page.view'], function(CustomView, PageTpl){
	CustomView.register('doctor_question', {
		title : '医生回答',
		confirmConfig : function(){
			this.isNew = false;
			this.config.content.value = this.$el.find('.input-content').val();
			this.config.img.value = this.$el.find('.input-img').val();
			if(localStorage && this.config.img){
				localStorage.setItem('doctor_avator', this.config.img.value);
			}
			this.toStaticView();
		},
		getInitConfig : function(){
			var img;
			if(localStorage){
				img = localStorage.getItem('doctor_avator');
			}
			return {
				'img' : {
					title : '医生头像',
					value : img || 'http://img.dxycdn.com/dotcom/2015/09/14/23/9u7rkbqx.png',
					placeholder : '输入图片链接'
				},
				'content' : {
					title : '医生回答',
					value : '医生回答',
					placeholder : '输入文字'
				}
			}
		},
		getConfig : function(){
			var config = this.getInitConfig();
			config.img.value = $(this._ele).find('img').attr('src');
			config.content.value = $(this._ele).find('.view-wraper').text();
			return config;
		},
		getTemplate : function(){
			return PageTpl;
		},
		inEditor : function(){
			throw new Error('you should provide inEditor in the config');
		}
	});
});
LocalModule.require(['CustomView', 'dxy-plugins/editview/customview/customviews/user_answer/views/page.view'], function(CustomView, PageTpl){
	CustomView.register('user_answer', {
		title : '用户提问',
		confirmConfig : function(){
			this.isNew = false;
			this.config.content.value = this.$el.find('.input-content').val();
			this.config.img.value = this.$el.find('.input-img').val();
			if(localStorage && this.config.img){
				localStorage.setItem('user_avator', this.config.img.value);
			}
			this.toStaticView();
		},
		getInitConfig : function(){
			var img;
			if(localStorage){
				img = localStorage.getItem('user_avator');
			}
			return {
				'img' : {
					'title' : '用户头像',
					'value' : img || '',
					'placeholder' : '输入图片链接'
				},
				'content' : {
					'title' : '用户提问',
					'value' : '用户提问',
					'placeholder' : '输入文字'
				}
			}
		},
		getConfig : function(){
			var config = this.getInitConfig();
			config.content.value = $(this._ele).find('.view-wraper').text();
			config.img.value = $(this._ele).find('img').attr('src');
			return config;
		},
		getTemplate : function(){
			return PageTpl;
		},
		inEditor : function(){
			throw new Error('you should provide inEditor in the config');
		},
		priority : 1
	});
});
LocalModule.define('CustomView', ['dxy-plugins/editview/customview/views/config.view'], function(ConfigTpl){
	var BaseView = Backbone.View.extend({
		className : 'custom-style-view',
		attributes : {
			draggable : "true"
		},
		events : {
			'dblclick' : 'toConfigView',
			'click .confirm-config' : 'confirmConfig' 
		},
		initialize : function(option){
			this.type = option.type;
			this._ele = option._ele;
			this.isNew = true;
			this.config = this.getInitConfig();
			if(this._ele){
				this.isNew = false;
				this.config = this.getConfig();
			}
			this.toStaticView();
		},
		toStaticView : function(){
			this.$el.attr('draggable', 'true');
			var template = this.getTemplate();
			this.$el.html(_.template(template)(this.config));
			this.$el.children().attr('data-type', this.type);
		},
		toConfigView : function(){
			this.$el.removeAttr('draggable');
			var template = this.getConfigTemplate();
			this.$el.html(_.template(template)({
				config : this.config
			}));
		},
		confirmConfig : function(){
			throw new Error('you should provide confirmConfig in the config');
		},
		getInitConfig : function(){
			throw new Error('you should provide getInitConfig in the config');
		},
		getConfig : function(){
			throw new Error('you should provide getConfig in the config');
		},
		getTemplate : function(){
			throw new Error('you should provide getTemplate in the config');
		},
		inEditor : function(){
			throw new Error('you should provide inEditor in the config');
		},
		getConfigTemplate : function(){
			return ConfigTpl;
		}
	});
	var CustomView = {
		customs : {},
		register : function(name, config){
			if(!config.title){
				throw new Error('you should provide title in the config');
			}
			this.customs[name] = BaseView.extend(config);
			this.customs[name].title = config.title;
			this.customs[name].viewname = name;
			this.customs[name].priority = config.priority;
		},
		instance : function(name, ele){
			var ins;
			if(!this.customs[name]){
				throw new Error('can not find CustomView '+name);
			}
			if(ele){
				ins = new this.customs[name]({
					_ele : ele,
					type : name
				});
			}else{
				ins =  new this.customs[name]({
					type : name
				});
			}
			return ins;
		},
		BaseView : BaseView
	};
	return CustomView;
});

LocalModule.require(['dxy-plugins/editview/customview/views/dashboard.view', 'CustomView'], function(DashboardTpl, CustomView){
	var DashboardView = Backbone.View.extend({
		events: {
			'click .view-button' : 'insertView',
			'dragstart .custom-style-view' : 'drag',
			'dragover .custom-style-view,.view-trash' : 'allowDrop',
			'drop .custom-style-view' : 'drop',
			'dragleave .custom-style-view,.view-trash' : 'dragLeave',
			'drop .view-trash' : 'dropToTrash'
		},
		className : 'clearfix',
		initialize : function(view){
			var me = this;
			this.view = view;
			this.styleviews = [];
			this.render();
		},
		template : function(){
			return _.template(DashboardTpl);
		},
		render: function(){
			var styles = this.sortViewButton(CustomView.customs);
			this.$el.html(this.template()({
				styles : styles
			}));
			if(this.view.ele){
				this.insertExistViews(this.view.ele);
			}
		},
		sortViewButton : function(styles){
			var temp = [], res = [];
			_.each(styles, function(style, key){
				var priority = style.priority || 0;
				if(!temp[priority]){
					temp[priority] = [];
				}
				temp[priority].push(style);
			});
			temp.reverse();
			_.each(temp, function(group){
				res = res.concat(group);
			});
			return res;
		},
		insertExistViews : function(ele){
			var me = this;
			$(ele).children().each(function(index, viewele){
				var view = CustomView.instance($(viewele).data('type'), viewele);
				me.styleviews.push(view);
				me.$el.find('.views-container').append(view.el);
			});
		},
		insertView : function(e){
			var name = $(e.target).data('name'),
				view = CustomView.instance(name);
			this.styleviews.push(view);
			this.$el.find('.views-container').append(view.el);
		},
		removeView : function(index){
			var view = this.styleviews[index];
			if(view){
				view.$el.remove();
				this.styleviews.splice(index, 1);
			}
		},
		moveView : function(from, to){
			var fromView = this.styleviews[from];
			if(fromView){
				if(to<=0){
					to = 0
					fromView.$el.insertBefore(this.styleviews[to].$el);
					this.styleviews.splice(from, 1);
					this.styleviews.unshift(fromView);
					return;
				}
				if(to>=this.styleviews.length-1){
					to = this.styleviews.length-1;
					fromView.$el.insertAfter(this.styleviews[to].$el);
					this.styleviews.splice(from, 1);
					this.styleviews.push(fromView);
					return;
				}
				if(to<from){
					fromView.$el.insertBefore(this.styleviews[to].$el);
					this.styleviews.splice(from, 1);
					this.styleviews.splice(to-1, 0, fromView);
				}else{
					fromView.$el.insertAfter(this.styleviews[to].$el);
					this.styleviews.splice(from, 1);
					this.styleviews.splice(to+1, 0, fromView);
				}
			}
		},
		toEditor : function(){
			var wraper = $('<section class="dxy-custom-view" data-type="customview"></section>');
			_.each(this.styleviews, function(view){
				view.toStaticView();
				wraper.append(view.$el.html());
			});
			wraper.on('dblclick',function(e){
				UE.getEditor('editor-box').execCommand('editview', 'customview');
			});
			return wraper;
		},
		allowDrop : function(e){
			e.preventDefault();
			e.stopPropagation();
			$(e.currentTarget).css('border','1px dashed #aaa');
		},
		dragLeave : function(e){
			$(e.currentTarget).css('border','none');
		},
		drag : function(e){
			var me = this;
			me._drap_from = undefined;
			_.each(this.styleviews, function(view, i){
				if(view.el === e.currentTarget){
					me._drap_from = i;
				}
			});
		},
		drop : function(e){
			var me = this;
			me._drag_to = undefined;
			_.each(this.styleviews, function(view, i){
				if(view.el === e.currentTarget){
					me._drag_to = i;
				}
			});
			this.moveView(this._drap_from, this._drag_to);
			$(e.currentTarget).css('border','none');
		},
		dropToTrash : function(e){
			this.removeView(this._drap_from);
			$(e.currentTarget).css('border','none');
		}
	});

	EditView.register('customview', {
		onModalShow : function(){
			this.dashboard = new DashboardView(this);
			this.modal.find('#dxy-customview-content').html(this.dashboard.el);
		},
		onModalConfirm : function(){
			try{
				var domUtils = baidu.editor.dom.domUtils;
				var ele = this.dashboard.toEditor(),
					range = UE.getEditor('editor-box').selection.getRange(),
					cur = range.getCommonAncestor(true),
					target = domUtils.findParent(cur, function(node){
                    	if(node.className && node.className.indexOf('dxy-custom-view')!==-1){
                    		return true;
                    	}else{
                    		return false;
                    	}
                    }, true);
                if(target){
                	$(target).replaceWith(ele[0]);
                }else{
                	range.enlarge(true).trimBoundary().deleteContents().insertNode(ele[0]);
                }
			}catch(e){
				alert('发生未知错误,请联系');
				console.log(e);
			}
			return true;
		},	
		modalInit : function(){
			
		}
	},{
		isEmptySupport : true
	});
});
(function(){
	function isPC(){  
        	var userAgentInfo = navigator.userAgent;  
        	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        	var flag = true;  
        	for (var i = 0; i < Agents.length; i++) {  
				if (userAgentInfo.indexOf(Agents[i]) > 0){
					flag = false;
					break; 
				}  
        	}  
        	return flag;  
	}
	var AnnotationView = Backbone.View.extend({
		events: {
			'blur #annotation-value' : 'changeValue'
		},
		initialize : function(view){
			var me = this;
			this.view = view;
			if(view.data && view.data.obj_id){
				LocalModule.require(['AnnotationModel'], function(m){
					me.annotation = new m.AnnotationModel({
						id : view.data.obj_id
					});
					me.annotation.fetch().then(function(){
						me.render();
					}, function(){
						alert('加载注释数据失败');
					});
				});
			}else{
				LocalModule.require(['AnnotationModel'], function(m){
					me.annotation = new m.AnnotationModel({});
					me.render();
				});
			}
		},
		changeValue : function(e){
			this.annotation.set('value', $('#annotation-value').val());
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/annotation/views/dialog.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					value : me.annotation.get('value')
				});
				me.trigger('render');
			});
		  	return this;
		}
	});

	var PopView = Backbone.View.extend({
		className : 'editor-pop-container',
		events: {

		},
		initialize : function(annotationId, target){
			var me = this;
			this.annotationId = annotationId;
			this.target = target;
			if($(target).parent().attr('href')){
				this.href = $(target).parent().attr('href');
				$(target).parent().removeAttr('href');
			}
		},
		init : function(){
			var me = this;
			LocalModule.require(['AnnotationModel'], function(m){
				if(window.UE){
					me.annotation = new m.AnnotationModel({
						id : me.annotationId
					});
					me.annotation.fetch().then(function(){
						me.render();
					}, function(){
						me.error = '加载失败:(';
						me.render();
					});
				}else{
					me.annotation = new m.AnnotationUserModel({
						
					});
					me.annotation.fetch({data : {type : 3, obj_id : me.annotationId}}).then(function(){
						me.render();
					}, function(){
						me.error = '加载失败:(';
						me.render();
					});
				}
			});
		},
		show : function(){
			if(!this.annotation){
				this.init();
			}
			this.render();
			this.$el.show();
		},
		hide : function(){
			this.$el.hide();
		},
		getDocumentPosition : function(ele){
			return $(ele).offset();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/annotation/views/pop.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					annotation : me.annotation,
					error : me.error,
					url : me.href,
					arrow : !isPC()
 				});
				var p = me.getDocumentPosition(me.target);
				if(isPC()){
					var bodyWidth = parseFloat($('.pg-article-detail').css('width'));
					var boxWidth = 200;
					var targetWidth = parseFloat($(me.target).css('width'));
					if(bodyWidth-p.left<boxWidth){
						me.$el.css('left', p.left+targetWidth-boxWidth + 'px');
						me.$el.css('top', 1.5*parseFloat($(me.target).css('height'))+p.top+'px');
					}else{
						me.$el.css('left', p.left + 'px');
						me.$el.css('top', 1.5*parseFloat($(me.target).css('height'))+p.top+'px');
					}
				}else{
					var bodyWidth = parseFloat($('body').css('width'));
					var boxWidth = 200;
					var targetWidth = parseFloat($(me.target).css('width'));
					if(bodyWidth-p.left<boxWidth){
						me.$el.css('left', p.left+targetWidth-boxWidth + 'px');
						me.$el.find('.arrow').css('right', '5px');
						me.$el.css('top', 1.5*parseFloat($(me.target).css('height'))+p.top+'px');
					}else{
						me.$el.css('left', p.left + 'px');
						me.$el.find('.arrow').css('left', '5px');
						me.$el.css('top', 1.5*parseFloat($(me.target).css('height'))+p.top+'px');
					}
				}
				$('body').append(me.$el);
				me.trigger('render');
			});
		  	return this;
		}
	});

	var MobilePopView = Backbone.View.extend({
		className : 'editor-mobile-pop-container',
		events: {

		},
		initialize : function(annotationId, target){
			var me = this;
			this.annotationId = annotationId;
			this.target = target;
			this.title = $(target).text();
			if($(target).parent().attr('href')){
				this.href = $(target).parent().attr('href');
				$(target).parent().removeAttr('href');
			}
		},
		init : function(){
			var me = this;
			LocalModule.require(['AnnotationModel'], function(m){
				me.annotation = new m.AnnotationUserModel({
						
				});
				me.annotation.fetch({data : {type : 3, obj_id : me.annotationId}}).then(function(){
					me.render();
				}, function(){
					me.error = '加载失败:(';
					me.render();
				});
			});
		},
		show : function(){
			if(!this.annotation){
				this.init();
			}else{
				this.render();
			}
			this.$el.show();
		},
		hide : function(){
			this.$el.hide();
		},
		getDocumentPosition : function(ele){
			return $(ele).offset();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/annotation/views/mobile_pop.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					annotation : me.annotation,
					error : me.error,
					url : me.href,
					title : me.title,
					slice : function(content){
						if(content.length>50){
							return content.slice(0, 48) + '...';
						}
						return content;
					}
 				});
				var p = me.getDocumentPosition(me.target);
				var bodyWidth = parseFloat($('body').css('width'));
				var boxWidth = 200;
				var targetWidth = parseFloat($(me.target).css('width'));
				if(bodyWidth-p.left<boxWidth){
					me.$el.css('left', p.left+targetWidth-boxWidth + 'px');
					me.$el.find('.arrow').css('right', '5px');
					me.$el.css('top', 1.2*parseFloat($(me.target).css('height'))+p.top+'px');
				}else{
					me.$el.css('left', p.left + 'px');
					me.$el.find('.arrow').css('left', '5px');
					me.$el.css('top', 1.2*parseFloat($(me.target).css('height'))+p.top+'px');
				}
				$('body').append(me.$el);
				me.trigger('render');
			});
		  	return this;
		}
	});

	window.AnnotationReplacedView = ReplacedView.register('annotation', {
		toWechatView : function(){

		},
		toWebView : function(e){
			var ele = this.toMetaView(e),
				dtd = $.Deferred();
			this.bindEvent(ele);
			dtd.resolve(ele);
			return dtd;
		},
		toAppView : function(e){
			return this.toWebView(e);
		},
		toEditorView : function(e){
			var ele = this.toMetaView(e),
				dtd = $.Deferred();
			dtd.resolve(ele);
			return dtd;
		},
		toMobileView : function(e){
			var	dtd = $.Deferred();
			this.bindMobileEvent(e);
			return dtd;
		},
		onModalShow : function(){
			this.annotation =  new AnnotationView(this);
			$('#dxy-annotation-modal .modal-body').html($(this.annotation.el));
		},
		bindMobileEvent : function(ele){
			var me = this;
			var hideTimer;
			function show(){
				$(ele).off('click', show);
				if(!me.popview){
					me.popview = new MobilePopView(me.data.obj_id,ele);
					// me.popview.$el.on('mouseover', function(){
					// 	clearTimeout(hideTimer);
					// });
					// me.popview.$el.on('mouseout', function(){
					// 	hideTimer = setTimeout(function(){
					// 		me.popview.hide();
					// 	},300);
					// });
				}
				me.popview.show();
				$(ele).on('click', hide);		
			}
			function hide(){
				$(ele).off('click', hide);
					me.popview.hide();
				$(ele).on('click', show);
			}
			$(ele).on('click', show);
			$('body').on('click', function(e){
				if($(e.target).parent('.editor-mobile-pop-container').length==0 && e.target!==ele){
					hide();
				}
			});
		},
		bindEvent : function(ele){
			var me = this;
			var hideTimer;
			function show(){
				if(!me.popview){
					me.popview = new PopView(me.data.obj_id,ele);
					me.popview.$el.on('mouseover', function(){
						clearTimeout(hideTimer);
					});
					me.popview.$el.on('mouseout', function(){
						hideTimer = setTimeout(function(){
							me.popview.hide();
						},300);
					});
				}
				me.popview.show();				
			}
			$(ele).on('mouseover', show);
			$(ele).on('mouseout', function(){
				hideTimer = setTimeout(function(){
					me.popview.hide();
				},300);
			});
		},
		onModalConfirm : function(){
			var me = this,
				dtd = $.Deferred();
			LocalModule.require(['MarkModel'], function(m){
				var annotation = me.annotation.annotation;
				if(!annotation.get('value')){
					return;
				}
				if(annotation.get('id')){
					annotation.save({
						value : annotation.get('value'),
						id : annotation.get('id')
					}).then(function(res){
						dtd.resolve();
					}, function(res){
						alert('更新注释失败');
						dtd.reject();
						console.log(res);
					});
				}else{
					annotation.save().then(function(res){
						var mark = new m.MarkModel({
							obj_id : annotation.get('id'),
							type : 3
						});
						mark.save({}, {data: mark.attributes}).then(function(res){
							if(res.error){
								alert(res.error.message);
								dtd.reject();
								return;
							}
							me.data.obj_id = annotation.get('id');
							me.data.type_id = 3;
							dtd.resolve();
						}, function(res){
							alert('创建标记失败');
							dtd.reject();
							console.log(res);
						});
					}, function(res){
						alert('创建注释卡失败');
						dtd.reject();
						console.log(res);
					});
				}
			});
			return dtd;
		},
		isWraper : true
	});
})();
(function(){
	var AppView = Backbone.View.extend({
		events: {

		},
		initialize : function(view){
			this.view = view;
			this.render();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/drug/views/app.view', 'MarkModel'], function(v, m){
				var mark = new m.UserMarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company,
					  	drug_url : 'http://yao.dxy.com/drug/'+res.data.items[0].id+'.htm'
					});
					me.trigger('render');
				}, function(res){
					
				});
			});
		  	return this;
		}
	});
	var MobileView = Backbone.View.extend({
		events: {

		},
		initialize : function(view){
			this.view = view;
			this.render();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/drug/views/mobile.view', 'MarkModel'], function(v, m){
				var mark = new m.UserMarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company,
					  	drug_url : 'http://yao.dxy.com/drug/'+res.data.items[0].id+'.htm'
					});
					me.trigger('render');
				}, function(res){

				});
			});
		  	return this;
		}
	});
	window.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
		},
		toAppView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				view = new AppView(this);
			view.on('render', function(){
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			});
			return dtd;
		},
		toMobileView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				view = new MobileView(this);
			view.on('render', function(){
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			});
			return dtd;
		},
		toEditorView : function(callback){
			var ele = this.createEditorWraperNode(),
				me = this,
				dtd = $.Deferred();
			ele.setAttribute('contenteditable', 'false');
			LocalModule.require(['MarkModel'], function(m){
				var mark = new m.MarkModel({obj_id: me.data.obj_id, type: me.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						alert(res.error.message);
						dtd.reject();
						return;
					}
					var tpl = '<br>';
					for(var prop in res.data.items[0]){
						tpl += (res.data.items[0][prop]+'<br>');
					}
					$(ele).append($(tpl));
					me.ele = ele;
					dtd.resolve();
				}, function(res){
					dtd.reject();
					alert('网络错误');
				});
			});			
			return dtd;
		},
		onModalShow : function(){
			$('#drug-id').val(this.data.drug_id||'');
			$('#J-drug-info').val(this.data.drug_name||'');
			$('#J-drug-not-find').hide();
			this.modal.find('#drug-id').keyup();
		},
		onModalConfirm : function(){
			var me = this,
				dtd = $.Deferred();
			if(this.verifyDrugId()){
				LocalModule.require(['MarkModel'], function(m){
					var mark = new m.MarkModel({obj_id: me.modal.find('#drug-id').val(), type: 1});
					mark.save({},{data : mark.attributes}).then(function(res){
						if(res.error){
							alert(res.error.message);
							dtd.reject();
							return;
						}
						me.data.obj_id = me.modal.find('#drug-id').val();
						me.data.type_id = 1;
						dtd.resolve();
					}, function(res){
						alert('网络错误');
					});
				});
				return dtd;
			}else{
				return false;
			}
		},
		fetchDrugData : function(){
			var p = $.Deferred();
			setTimeout(function(){
				var state = Math.round(Math.random());
				if(state===0){
					p.resolve({name: 'hehe', id: 12345, type: 0});
				}else{
					p.resolve({name: 'hehe', id: 12345, type:1});
				}
			}, 1000);
			return p;
		},
		verifyDrugId : function(){
			var val = this.modal.find('#drug-id').val();
			return /\d+/.test(val);
		},
		modalInit : function(){
			// var me = this;
			// me.modal.find('#drug-id').on('keyup', function(){
			// 	if(me.verifyDrugId()){	
			// 		me.modal.find('#J-drug-info').text('检索数据中...');
			// 		me.fetchDrugData().then(function(res){
			// 			if(res.type===0){
			// 				me.modal.find('#J-drug-info').text('该药品 ID 不存在，请查验');
			// 			}else{
			// 				me.modal.find('#J-drug-info').text(res.name);
			// 				me.drugData = res;
			// 			}
			// 		}, function(){
			// 			alert('网络错误');
			// 		});
			// 	}else{
			// 		me.modal.find('#J-drug-info').text('请输入5位药品数字ID');
			// 	}
			// });
		}
	});
})();
(function(){
	var IMG_PREFIX = 'http://img.dxycdn.com/dotcom/';
	if(document.domain === 'dxy.us'){
		IMG_PREFIX = 'http://dxy.us/upload/public/';
	}
	var VideoView = Backbone.View.extend({
		events: {
			'change #video-cover' : 'changeCover'
		},
		initialize : function(view){
			var me = this;
			this.view = view;
			if(view.data && view.data.id){
				this.id = view.data.id;
				this.cover = view.data.cover;
			}else{
				this.id = '';
				this.cover = '';
			}
			this.render();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/video/views/main.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					value : me.id,
					cover : me.cover
				});
				me.trigger('render');
			});
		  	return this;
		},
		changeCover : function(e){
			var me = this;
			var t = $(e.currentTarget);
			var uploader = new ImageUploader({
				el : t[0],
				type : 'card_video_cover'
			});
			uploader.upload().then(function(e){
				var res = JSON.parse(e.currentTarget.responseText);
				var img = IMG_PREFIX + res.data.items[0].path;
				me.cover = me.view.data.cover = img;
				me.$el.find('img').attr('src', me.cover);
			},function(e){
				var res = JSON.parse(e.currentTarget.responseText);
				alert('上传失败：'+res);
			});
		},
		processValue : function(){
			function uid(q){
				if(q){
					var pairs = q.split('&');
					var pair;
					for(var i=0,len=pairs.length;i<len; i++){
						pair = pairs[i].split('=');
						if(pair[0] && pair[0]=='vid'){
							return pair[1];
						}
					}
					return null;
				}
				return null;
			}
			var value = this.$el.find('#video-id').val();
			var UrlReg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
			var querystring;
			if(value){
				var match = UrlReg.exec(value);
				if(match && match[1]){
					var query = match[6];
					if(query && uid(query)){
						this.id = this.view.data.id = uid(query);
					}else{
						var path = match[5];
						var name = path.slice(path.lastIndexOf('/')+1);
						var m = /^(.+)\.html$/.exec(name);
						if(m && m[1]){
							this.id = this.view.data.id = m[1];
						}else{
							alert('格式无法识别，请联系佳奇');
						}
					}
				}else{
					this.id = this.view.data.id = value;
				}
			}
		}
	});


	window.VideoReplacedView = ReplacedView.register('video', {
		toWechatView : function(){
			return this.toEditorView()
		},
		toWebView : function(e){
		    var video = $('<iframe frameborder="0" width="640" height="498" src="http://v.qq.com/iframe/player.html?vid='+this.data.id+'&tiny=0&auto=0" allowfullscreen></iframe>')[0];
		    $(e).html(video);
		    this.ele = e;
		    return $.Deferred().resolve(e);
		},
		toAppView : function(e){
			return this.toMobileView(e);
			// e.id = this.data.id;
			// var video = new tvp.VideoInfo();
		 //       video.setVid(this.data.id);
		 //       var player = new tvp.Player('100%', '200px');
		 //       player.addParam("showcfg",0);
		 //       player.addParam("autoplay", 0);
		 //       player.addParam("showend",0);
		 //       player.addParam("controls", "disable");
		 //       player.setCurVideo(video);
		 //       player.write(this.data.id);
		 //    e.style.display = 'block';
		 //    return $.Deferred();
		},
		toEditorView : function(e){
			var ele = this.toMetaView(e),
				dtd = $.Deferred();
			ele.style.display = 'block';
			ele.id = this.data.id;
			var video = $('<iframe frameborder="0" width="640" height="498" src="http://v.qq.com/iframe/player.html?vid='+this.data.id+'&tiny=0&auto=0" allowfullscreen></iframe>');
			$(ele).html(video);
			dtd.resolve(ele);
			return dtd;
		},
		toMobileView : function(e){
			var dtd = $.Deferred();
			var url = 'http://h5vv.video.qq.com/getinfo?vids='+this.data.id+'&otype=json&defaultfmt=auto&sdtfrom=v3010&_rnd='+new Date().getTime()+'&sphls=0&sb=1&platform=11001&charge=0';
			var me = this;
			$.ajax({
				url: url,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'callback',
				success : function(json){
					try{
						var data = json.vl.vi[0];
						var source = data.ul.ui[0].url + data.fn + '?vkey=' + data.fvkey;
						var video = $('<video controls poster="'+me.data.cover+'" preload="metadata" width="100%" name="media"><source src="'+source+'" type="video/mp4"></source></video>');
						me.ele = video[0];
						dtd.resolve(video[0]);
					}catch(e){
						console.log('视频解析失败');
					}
				},
				error : function(){
					console.log('视频元信息获取失败');
				}
			});
			return dtd;
		},
		onModalShow : function(){
			this.video =  new VideoView(this);
			$('#dxy-video-modal .modal-body').html($(this.video.el));
		},
		onModalConfirm : function(){
			this.video.processValue();
			if(!this.data.id){
				alert('请输入视频id');
				return false;
			}
			return true;
		}
	});
})();
(function(){
	var IMG_PREFIX = 'http://img.dxycdn.com/dotcom/';
	var UPLOAD_ACTION = 'http://dxy.com/admin/i/att/upload?type=column_content';
	var IS_PC = isPC();
	var isLogin = (function(){
		try{
			if(window.isLogin){
				return true;
			}
			if(+window.GDATA.userId){
				return true;
			}else{
				return false;
			}
		}catch(e){
			return false;
		}
	})();
	window.setUserLogin = function(login){
		isLogin = login;
		function process(){
			if(ReplacedView){
				ReplacedView.renderAll();
			}else{
				setTimeout(process, 100);
			}
		}
		setTimeout(process, 100);
	};
	function fomat(date, fmt){
		var o = {   
			"YYYY" : date.getFullYear(),
		    "MM" : date.getMonth()+1,                   
		    "DD" : date.getDate(),                   
		    "hh" : date.getHours(),              
		    "mm" : date.getMinutes(), 
		    "ss" : date.getSeconds()           
		};   
		return fmt.replace('YYYY', o.YYYY).replace('MM', o.MM).replace('DD', o.DD).replace('hh', o.hh).replace('mm',o.mm).replace('ss', o.ss);
	}
	function isPC(){  
        	var userAgentInfo = navigator.userAgent;  
        	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        	var flag = true;  
        	for (var i = 0; i < Agents.length; i++) {  
				if (userAgentInfo.indexOf(Agents[i]) > 0){
					flag = false;
					break; 
				}  
        	}  
        	return flag;  
	}
	if(document.domain === 'dxy.us'){
		IMG_PREFIX = 'http://dxy.us/upload/public/';
		UPLOAD_ACTION = "http://dxy.us/admin/i/att/upload?type=column_content"
	}

	var VoteView = Backbone.View.extend({
		events: {
			'click #vote-list-tab' : 'fetchVoteList',
			'click #vote-list-page-prev' : 'VoteListPrevPage',
			'click #vote-list-page-next' : 'VoteListNextPage',
			'click .J-add-vote-from-votelist' : 'insertGroup',
			'keyup #J-vote-group-search' : 'search',
			'click #search-list-container li' : 'insertSearchGroup'
		},
		initialize : function(view){
			var me = this;
			me.view = view;
			console.log('init');
			window.__hack = true;
			LocalModule.require(['VoteModel'], function(m){
				me.model = new m.VoteMarkModel({});
				me.searchModel = new m.VoteGroupsModel([]);
				me.fetchVoteList();
			});
		},
		render: function() {
		  	var me = this;
		  	LocalModule.require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({mark: me.model, votelist : me.votelist, panel : me.currentPanel});
		  		me.delegateEvents(me.events);
				me.trigger('render');
		  	});
			return me;
		},
		search : function(e){
			var me = this,
				q = $(e.currentTarget).val();
			if(!q){
				$('#search-list-container').html('');
				return;
			}
			this.searchModel.search(q,10).then(function(res){
				if(res.error){
					$('#search-list-container').html('');
					return;
				}
				LocalModule.require(['dxy-plugins/replacedview/vote/views/searchList.view'], function(tpl){
			  		$('#search-list-container')[0].innerHTML = _.template(tpl)({list: me.searchModel.models});
			  	});
			}, function(res){
				$('#search-list-container').html('');
			});
		},
		fetchVoteList : function(){
			var me =this;
			LocalModule.require(['VoteModel'], function(m){
				var list = new m.VoteGroupsModel([],{items_per_page:8});
				list.fetch().then(function(){
					list.on('all', me.render, me);
					me.votelist = list;
					me.currentPanel = 'votelist';
					me.render();
				}, function(model, res){
					console.log(res);
				});
			});
		},
		insertSearchGroup : function(e){
			var t = $(e.currentTarget),
				me =this,
				id = t.data('id'),
				group = me.searchModel.at(+id);
			if(group){
				me._insertGroup(group);
			}
		},
		insertGroup : function(e){
			if(!window.__hack){
				return;
			}
			window.__hack = false;
			console.log('insert group');
			var t = $(e.currentTarget),
				me =this,
				id = t.data('id'),
				group = me.votelist.get(+id);
			if(group){
				me._insertGroup(group);
			}
		},
		_insertGroup : function(group){
			window.group = group;
			this.model.isInsert = true;
			$('#confirm-vote').click();
		},
		VoteListPrevPage : function(){
			var me = this;
			if(this.votelist.fetching){
				return;
			}
			this.votelist.fetching = true;
			this.votelist.goto(-1).then(function(){
				me.votelist.fetching = false;
			}, function(model,res){
				me.votelist.fetching = false;
			});
		},
		VoteListNextPage : function(){
			var me = this;
			if(this.votelist.fetching){
				return;
			}
			this.votelist.fetching = true;
			this.votelist.goto(1).then(function(){
				me.votelist.fetching = false;
			}, function(model,res){
				me.votelist.fetching = false;
			});
		},
	});

	var VoteAppView = Backbone.View.extend({
		initialize : function(view, mark){
			this.view = view;
			mark.on('change', this.render, this);
			this.model = mark;
			this.render();
		},
		render : function(){
			var me = this,
				view;
			if(ReplacedView.platform==='mobile'){
				view = 'dxy-plugins/replacedview/vote/views/mobile.view'
			}else{
				view = 'dxy-plugins/replacedview/vote/views/h5.view';
			}
			LocalModule.require([view], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({
		  			votes: me.model.get('group').attach.models, 
		  			group: me.model.get('group'),
		  			expired : new Date()>new Date(me.model.get('group').get('e_time')),
		  			isLogin : isLogin
		  		});
				me.trigger('render');
		  	});
			return me;
		},
		events : {
			'click .vote-multiple.user_not_voted li' : 'multipleCheck',
			'click .vote-single.user_not_voted li' : 'singleCheck',
			'click .user_not_voted .J-user-vote' : 'userVote'
		},
		multipleCheck : function(e){
			var target = $(e.currentTarget);
			if(target[0].tagName!=='LI'){
				target = target.parents('li');
			}
			var	id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			options[+id].checked = !options[+id].checked;
			// if(options[+id].checked){
			// 	target.addClass('checked');
			// }else{
			// 	target.removeClass('checked');
			// }
			this.render();
		},
		singleCheck : function(e){
			var target = $(e.currentTarget);
			if(target[0].tagName!=='LI'){
				target = target.parents('li');
			}
			var	id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			// target.parents('ul').find('li').removeClass('checked');
			// target.addClass('checked');
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			this.render();
		},
		userVote : function(e){
			var tag = false,
				me = this;
			window.__voted = false;
			try{
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					throw new Error();
				}
			});
			}catch(e){
				if(IS_PC){
					me.showWebAlertBox({
						title : '请填完当前组内的所有选项后再投票',
						button_title : '好吧',
						cls : 'web-alert',
						index : me.model.get('group').attach.models.length-1
					});
				}else{
					me.showAlertBox({
						title : '请填完当前组内的所有选项后再投票',
						button_title : '好吧',
						cls : '',
						index : me.model.get('group').attach.models.length-1
					});
				}
				return;
			}
			var xhr = me.model.get('group').userVote();
			if(xhr){
				xhr.then(function(res){
					if(res.error){
						me.showAlertBox({
							title : '投票失败',
							button_title : '好吧',
							cls : 'global-alert',
							container : $('body')
						});
						return;
					}
					try{
						var mark = me.model;
						xhr = mark.get('group').getVotesStat().then(function(res){
							if(res.data){
								_.each(res.data.items, function(item, i){
									var vote = mark.get('group').attach.findByAttachId(item.vote_id),
										opt = mark.get('group').attach.findByAttachId(item.vote_id).attach.attach.findByAttachId(item.node_id);
									if(!vote.vote_total){
										vote.vote_total = 0;
									}
									if(!opt.total){
										opt.total = 0;
									}
									vote.vote_total += item.count;
									opt.total += item.count;
								});
								me.model.get('group').user_voted = true;
								me.render();
							}else{
								_.each(mark.get('group').attach.models, function(vote){
								_.each(vote.attach.attach.models, function(opt){
									if(opt.checked){
										opt.total++;
										vote.vote_total++;
									}
								});
								});
								me.model.get('group').user_voted = true;
								me.render();
							}
						}, function(res){
							_.each(mark.get('group').attach.models, function(vote){
							_.each(vote.attach.attach.models, function(opt){
								if(opt.checked){
									opt.total++;
									vote.vote_total++;
								}
							});
							});
							me.model.get('group').user_voted = true;
							me.render();
						});
					}catch(e){
						me.showAlertBox({
							title : '投票失败',
							button_title : '好吧',
							cls : 'global-alert',
							container : $('body')
						});
					}
				}, function(){
					me.showAlertBox({
						title : '投票失败',
						button_title : '好吧',
						cls : 'global-alert',
						container : $('body')
					});
				});
			}else{
				me.showAlertBox({
					title : '请填完当前组内的所有选项后再投票',
					button_title : '好吧',
					cls : 'global-alert',
					container : $('body')
				});
			}
		},
		removeAlertBox : function(){
			$('.msg-mark, .editor-alert-box').remove();
		},
		showAlertBox : function(opt){
			if(ReplacedView.platform === 'mobile'){
				alert(opt.title);
				return;
			}
			var me = this;
			this.removeAlertBox();
			$('<div class="msg-mark"></div>').appendTo($('body'));
			LocalModule.require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo($('body'));
				$('.editor-alert-box a').click(function(){
					me.removeAlertBox();
				});
			});
		},
		showWebAlertBox : function(opt){
			var me = this;
			this.removeAlertBox();
			opt.index = opt.index || 0;
			opt.container = opt.container || $($('.editor-vote-wraper',me.el)[opt.index]);
			LocalModule.require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo(opt.container);
				$('.editor-alert-box a').click(function(){
					me.removeAlertBox();
				});
			});
		}
	});
	var VoteMobileView = VoteAppView.extend({
		checkLogin : function(){
			var dtd = $.Deferred();
			Backbone.ajax({
				type : 'GET',
				url : 'http://dxy.com/app/i/user/likes/single?obj_id='+window.pid+'&type=0'
			}).then(function(res){
				if(res.success === false){
					dtd.reject();
				}else{
					dtd.resolve();
				}
			}, function(){
				dtd.reject();
			});
			return dtd;
		},
		showLoginBox : function(){
			Backbone.ajax({
				type : 'GET',
				url : 'http://dxy.com/app/i/user/likes/single?obj_id='+window.pid+'&type=0',
				data : {
					need_login : 1
				}
			});
		},
		userVote : function(){
			var me = this;
			this.checkLogin().then(function(){
				VoteAppView.prototype.userVote.apply(me, arguments);
			}, function(){
				me.showLoginBox();
			});
		}
	});

	var SingleButtonVoteAppView =  VoteAppView.extend({
		className : 'singlebutton-wraper',
		render : function(){
			var me = this,
				view;
			if(ReplacedView.platform==='mobile'){
				view = 'dxy-plugins/replacedview/vote/views/singlebutton/mobile.view'
			}else{
				view = 'dxy-plugins/replacedview/vote/views/singlebutton/mobile.view';
			}
			_.each(me.model.get('group').attach.models, function(vote, i){
				var vote_total = vote.vote_total;
				var total = 0;
				_.each(vote.attach.attach.models,function(opt,j, all){
					console.log(opt);
					var opt_total = opt.total;
					var percent = opt_total/vote_total;
					if(isNaN(percent)){
						percent = 0.5;
					}
					var width =  Math.round(100/(all.length+1))+Math.round(100/(all.length+1)*percent);
					opt.width = width;
					total +=  width;
				});
				vote.attach.attach.models[0].width += (100-total);
			});
			LocalModule.require([view], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({
		  			votes: me.model.get('group').attach.models, 
		  			group: me.model.get('group'),
		  			expired : new Date()>new Date(me.model.get('group').get('e_time')),
		  			isLogin : isLogin,
		  			bgcolors : ['rgb(65,178,166)','rgb(254,150,126)','rgb(65,178,166)','rgb(254,150,126)','rgb(65,178,166)','rgb(254,150,126)']
		  		});
				me.trigger('render');
		  	});
			return me;
		},
		events : {
			'click .user_not_voted .editor-vote-option' : 'singleCheck',
		},
		singleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models,
				tag = false,
				me = this;
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			try{
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					throw new Error();
				}
			});
			}catch(e){
				return;
			}
			if(!isLogin){
				window.location.href = 'https://account.dxy.com/login?redirect_uri='+window.location.href;
				return;
			}
			this.userVote();
		}
	});

	var SingleButtonVoteMobileView = SingleButtonVoteAppView.extend({
		checkLogin : function(){
			var dtd = $.Deferred();
			Backbone.ajax({
				type : 'GET',
				url : 'http://dxy.com/app/i/user/likes/single?obj_id='+window.pid+'&type=0'
			}).then(function(res){
				if(res.success === false){
					dtd.reject();
				}else{
					dtd.resolve();
				}
			}, function(){
				dtd.reject();
			});
			return dtd;
		},
		showLoginBox : function(){
			Backbone.ajax({
				type : 'GET',
				url : 'http://dxy.com/app/i/user/likes/single?obj_id='+window.pid+'&type=0',
				data : {
					need_login : 1
				}
			});
		},
		singleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models,
				tag = false,
				me = this;
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			try{
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					throw new Error();
				}
			});
			}catch(e){
				return;
			}
			this.userVote();
		},
		userVote : function(){
			var me = this;
			this.checkLogin().then(function(){
				VoteAppView.prototype.userVote.apply(me, arguments);
			}, function(){
				me.showLoginBox();
			});
		}
	});

	window.VoteReplacedView = ReplacedView.register('vote', {
		genMark : function(){
			var view = this,
				dtd = $.Deferred();
			LocalModule.require(['VoteModel'], function(m){
				var mark = new m.VoteUserMarkModel({obj_id:view.data.group_id,type:10});
				mark.fetch({
					success:function(model, res){
						var i = 2;
						function fin(){
							if(i===0){
								dtd.resolve(mark);
							}
						}
						if(res.error){
							console.log(res);
							dtd.reject();
							return;
						}
						try{
							var xhr = mark.get('group').getUserVotes().then(function(res){
								i--;
								var votes = [];
								if(res.error){
									if(res.error.code==101){
										votes = [];
									}else{
										console.log(res);
										fin();
										return;
									}
								}else{
									votes = res.data && res.data.items;
								}
								_.each(votes, function(vote){
									var vote_id = vote.vote_id,
										node_id = vote.node_id;
									mark.get('group').attach.findByAttachId(vote_id).attach.attach.findByAttachId(node_id).checked = true;
									mark.get('group').attach.findByAttachId(vote_id).attach.user_voted = true;
									mark.get('group').user_voted = true;
								});
								fin();
							}, function(res){
								i--;
								fin();
							});
						}catch(e){
							dtd.reject();
							console.error(e);
							return;
						}
						try{
							xhr = mark.get('group').getVotesStat().then(function(res){
								i--;
								if(res.data){
									_.each(res.data.items, function(item, i){
										var vote = mark.get('group').attach.findByAttachId(item.vote_id),
											opt = mark.get('group').attach.findByAttachId(item.vote_id).attach.attach.findByAttachId(item.node_id);
										if(!opt){
											return;
										}
										if(!vote.vote_total){
											vote.vote_total = 0;
										}
										if(!opt.total){
											opt.total = 0;
										}
										vote.vote_total += item.count;
										opt.total += item.count;
									});
								}
								fin();
							}, function(res){
								i--;
								fin();
							});
						}catch(e){
							dtd.reject();
							console.error(e);
						}
					},
					error : function(model,res){
						console.log(res);
						dtd.reject();
					}
				});
			});
			return dtd;
		},
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
		},
		toAppView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				show_type = me.data.show_type,
				view;
			this.genMark().then(function(mark){
				var show_type = mark.get('group').get('show_type');
				if(!show_type || show_type==0){
					view = new VoteAppView(me, mark);
				}else if(show_type==1){
					view = new SingleButtonVoteAppView(me, mark);
				}
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			}, function(){
				dtd.reject();
			});
			return dtd;
		},
		toMobileView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				show_type = me.data.show_type,
				view;
			this.genMark().then(function(mark){
				var show_type = mark.get('group').get('show_type');
				if(!show_type || show_type==0){
					view = new VoteMobileView(me, mark);
				}else if(show_type==1){
					view = new SingleButtonVoteMobileView(me, mark);
				}
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			}, function(){
				dtd.reject();
			});
			return dtd;
		},
		toEditorView : function(){
			var ele = this.createEditorWraperNode(),
				me = this,
				dtd = $.Deferred();
			// ele.setAttribute('contenteditable', 'false');
			LocalModule.require(['dxy-plugins/replacedview/vote/views/editor.view', 'VoteModel'], function(tpl, m){
				var mark = new m.VoteMarkModel({obj_id:me.data.group_id,type:10});
				mark.fetch({
					success:function(model, res){
						if(res.error){
							return;
						}
						$(ele).append($(_.template(tpl)({group : mark.get('group'),votes: mark.get('group').attach.models})));
						me.ele = ele;
						dtd.resolve(ele);
					},
					error : function(model,res){
						console.log(res);
					}
				});
				// var group = new m.VoteGroupModel({id: me.data.group_id});
				// group.fetch().success(function(res){
				// 	if(res.error){
				// 		alert(res.error.message);
				// 		console.log(res);
				// 		return;
				// 	}
				// 	ele.innerHTML = _.template(tpl)(group.attributes);
				// 	me.ele = ele;
				// 	dtd.resolve(ele);
				// }).error(function(res){
				// 	console.log(res);
				// 	alert(res.error.message);
				// });
		  	});
			return dtd;
		},
		onModalShow : function(){
			this.vote =  new VoteView(this);
			$('#dxy-vote-modal .modal-body').html($(this.vote.el));
		},
		onModalHide : function(){

		}, 
		onModalConfirm : function(){
			var data, dtd = $.Deferred(),me =this;
			me.vote.model.save({}, {data : {obj_id: window.group.get('id'), type: 10}}).then(function(res){
				if(res.error){
					dtd.reject();
					return;
				}
				me.data.obj_id = me.data.group_id = window.group.get('id');
				me.data.type_id = 10;
				me.data.id = res.data.items[0].id;
				dtd.resolve();
			}, function(res){
				alert('保存标记失败');
				dtd.reject();
			});
			return dtd;
		},
		modalInit : function(){
			
		}
	});
})();