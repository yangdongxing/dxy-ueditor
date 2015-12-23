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
define('VoteModel', function(){
	Backbone.emulateJSON = true;
	var API_HOST = 'http://'+document.domain+'/';
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
			Backbone.Collection.prototype.set.call(this, items, option);
		},
		goto : function(page){
			page = parseInt(page);
			if(page===0){
				return dtd.resolve();
			}
			var newPage = page + this.page_index,
				oldPage = this.page_index,
				me = this,
				dtd = $.Deferred();
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
				list,
				me = this;
			if(value){
				list = value.split('$$');
				_.each(list, function(item){
					if(item.indexOf('=')===-1){
						me.set('value', item, {silent:true});
					}else{
						me.set(item.split('=')[0], item.split('=')[1], {silent:true});
					}
				});
			}
		},
		processPostData : function(data){
			var img = data.img;
			if(img){
				delete data.img;
				data.value = data.value + '$$img='+ img; 
			}
			return data;
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
	var NodeLinkModel = Backbone.Model.extend({
		constructor : function(data){
			var id = data.node_id,
				value = data.node_value || '',
				me = this;
			var node = {
				id : id,
				value : value
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
			this.attach = new NodeLinksModel(data.nodes);
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
		getUserVotes : function(){
			var dtd = $.Deferred();
			$.get(API_HOST+'user/i/vote/result/list?group_id='+this.get('id')).then(function(res){
				dtd.resolve(res);
			}, function(res){
				dtd.resolve({
			 		error : {
			 			code : 101
			 		}
			 	});
			 	console.log(res);
			});
			return dtd;
		},
		getVotesStat : function(){
			var dtd = $.Deferred();
			$.get(API_HOST+'user/i/vote/stat/list?group_id='+this.get('id')+'&items_per_page=100').then(function(res){
				dtd.resolve(res);
			}, function(res){
				dtd.resolve({
			 		error : {
			 			code : 101
			 		}
			 	});
			});
			return dtd;
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
				alert(e.message);
				console.log(e);
				setTimeout(function(){
					dtd.reject();
				},0);
			}
			return dtd;
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
					success : function(res){
						if(res.error){
							throw new Error('获取投票组数据失败');
						}
					},
					error : function(res){
						if(res.error){
							throw new Error('获取投票组数据失败');
						}
					}
				});
				this.get('group').attach.id = this.get('group').get('id');
				this.get('group').attach.fetch({
					async: false,
					success : function(res){
						if(res.error){
							throw new Error('获取VoteGroupLinksModel数据失败');
						}
					},
					error : function(res){
						if(res.error){
							throw new Error('获取VoteGroupLinksModel失败');
						}
					}
				});
				_.each(this.get('group').attach.models, function(votelink){
					votelink.attach.attributes.id = votelink.get('vote_id');
					votelink.attach.fetch({
						async: false,
						success : function(res){
							if(res.error){
								throw new Error('获取Vote数据失败');
							}
						},
						error : function(res){
							if(res.error){
								throw new Error('获取Vote失败');
							}
						}
					});
					votelink.attach.attach.id = votelink.attach.get('id');
					votelink.attach.attach.fetch({
						async: false,
						success : function(res){
							if(res.error){
								throw new Error('获取NodeLinks数据失败');
							}
						},
						error : function(res){
							if(res.error){
								throw new Error('获取获取NodeLinks数据失败失败');
							}
						}
					});
					_.each(votelink.attach.attach.models, function(nodelink){
						nodelink.attach.fetch({
							async: false,
							success : function(res){
								if(res.error){
									throw new Error('获取Node数据失败');
								}
							},
							error : function(res){
								if(res.error){
									throw new Error('获取获取Node数据失败失败');
								}
							}
						});
						nodelink.attach.processInData();
					});
					opt.success();
				});
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
			return $.post(API_HOST+'user/i/vote/result/add', {
				node_id : nid,
				vote_id : vid,
				group_id : gid
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
		BaseListModel : BaseListModel
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
		this.toMetaView();
	};
	ReplacedView.prototype = {
		createWrapNode : function(plain){
			var me = this;
			var ele = document.createElement('p');
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
		toEditorView : function(){
			throw new Error('you should provide toAppView in the config');
		},
		showModal : function(){

		},
		toMetaView : function(c){
			this.view = 'meta';
			var ele = this.createWrapNode();
			ele.style.display = 'none';
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
					ReplacedView.platform = 'mobile';
				}
			}
			switch(ReplacedView.platform){
				case 'pc' :
					return this.toWebView(ele);
				case 'editor' :
					return this.toEditorView(ele);
				case 'mobile' :
					return this.toAppView(ele);
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
					var ancestors = ele.getCommonAncestor(true);
					var e = find(ancestors)
					if(e){
						this.mount(e);
					}else{
						ele.enlarge(true).deleteContents().insertNode(this.ele);
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
		return window.encodeURIComponent(JSON.stringify(obj));
	};
	ReplacedView.deSerialize = function(str){
		if(typeof str === 'object'){
			return str;
		}
		return JSON.parse(window.decodeURIComponent(str));
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
			view.toAppropriateView(ele).then(function(){
				view.ele.style.display = 'block';
				view.mount(ele);
			});
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
			console.log('showmodal');
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
				console.log('show');
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
				console.log('hide');
				if(me.onModalHide){
					me.onModalHide();
				}
				modal.off('show.bs.modal', onShow).off('hide.bs.modal', onHide);
				confirm.off('click', onConfirm);
				modal.data('view', null);
			}
			function onConfirm(){
				console.log('confirm');
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
})(this);
define("dxy-plugins/replacedview/drug/mobile.view", function(){var tpl = '<div class=\'m-drug-view-wraper\'>'+
'	<div>'+
'		<img src=\'\'>'+
'	</div>'+
'	<div class=\'m-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/drug/web.view", function(){var tpl = '<div class=\'web-drug-view-wraper\'>'+
'	<div>'+
'		<img src=\'\'>'+
'	</div>'+
'	<div class=\'web-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'	<div class="web-drug-view-footer">'+
'		<%if(is_medicare){%>'+
'		<span class="tag">医保</span>'+
'		<%}%>'+
'	</div>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/mark.view", function(){var tpl = '<%if(marks){%>'+
''+
'<%_.each(marks, function(mark){%>'+
''+
'<a class="btn btn-default center-block mark-item" href="#" role="button" style="width:40%;" data-id=<%=mark.id%>><%=mark.name%></a>'+
'<br>'+
''+
'<%})%>'+
''+
'<%}%>';return tpl;});
define("dxy-plugins/replacedview/vote/views/alert.view", function(){var tpl = '<div class="editor-alert-box <%if(cls){print(cls)}%>">'+
'	<p><%=title%></p>'+
'	<a href="javascript:;"><%=button_title%></a>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/dialog.view", function(){var tpl = '<div>'+
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
'					<th>投票权限</th>'+
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
define("dxy-plugins/replacedview/vote/views/editor.view", function(){var tpl = '<div class="editor-vote-container">'+
'<p>'+
'	<span class="tag">投票</span>'+
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
define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '<%if(new Date()<new Date(group.get(\'e_time\')) && new Date()>=new Date(group.get(\'s_time\'))){%>'+
'<div class="editor-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>" >'+
'<%_.each(votes, function(vote, i){%>'+
'<%if(+vote.attach.get(\'type\')===0){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-single-poll.png" class="vote-type">'+
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
'							<span class="vote-state"><%if(vote.vote_total){print(Math.floor(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
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
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-muli-poll.png" class="vote-type">'+
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
'							<span class="vote-state"><%if(vote.vote_total){print(Math.floor(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
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
'<a href="javascript:;" class="user-vote">'+
'	<%if(group.user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'</a>'+
'</div>'+
'<%}else{%><%}%>'+
'';return tpl;});
define("dxy-plugins/replacedview/vote/views/searchList.view", function(){var tpl = '<%if(list && list.length>0){%>'+
'<ul class="search-list">'+
'	<%_.each(list, function(item,i){%>'+
'	<li data-id="<%=i%>"><%=item.get(\'title\')%></li>'+
'	<%})%>'+
'</ul>'+
'<%}%>';return tpl;});
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
(function(){
	var AppView = Backbone.View.extend({
		events: {

		},
		initialize : function(view){
			this.view = view;
			this.el = view.ele;
			this.render();
		},
		render: function() {
			var me = this;
			require(['dxy-plugins/replacedview/drug/mobile.view', 'MarkModel'], function(v, m){
				var mark = new m.MarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company
					});
					me.trigger('render');
				}, function(res){
					
				});
			});
		  	return this;
		}
	});
	var WebView = Backbone.View.extend({
		events: {

		},
		initialize : function(view){
			this.view = view;
			this.el = view.ele;
			this.render();
		},
		render: function() {
			var me = this;
			require(['dxy-plugins/replacedview/drug/mobile.view', 'MarkModel'], function(v, m){
				var mark = new m.MarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company
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
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred();
			var tpl = '<span>'+this.data.drug_name+'</span>';
			ele.innerHTML = tpl;
			this.ele = ele;
			setTimeout(function(){
				dtd.resolve();
			},0);
			return dtd;
		},
		toAppView : function(){
			var dtd = $.Deferred(),
				view = new AppView(this);
			view.on('render', function(){
				dtd.resolve();
			});
			return dtd;
		},
		toEditorView : function(callback){
			var ele = this.createWrapNode(),
				me = this,
				dtd = $.Deferred();
			ele.setAttribute('contenteditable', 'false');
			require(['MarkModel'], function(m){
				var mark = new m.MarkModel({obj_id: me.data.obj_id, type: me.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						alert(res.error.message);
						dtd.reject();
						return;
					}
					var tpl = '';
					for(var prop in res.data.items[0]){
						tpl += (res.data.items[0][prop]+'<br>');
					}
					ele.innerHTML = tpl;
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
				require(['MarkModel'], function(m){
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
	var UPLOAD_ACTION = 'http://dxy.com/admin/i/att/upload?type=column_content';
	var IS_PC = isPC();
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
			require(['VoteModel'], function(m){
				me.model = new m.VoteMarkModel({});
				me.searchModel = new m.VoteGroupsModel([]);
				me.fetchVoteList();
			});
		},
		render: function() {
		  	var me = this;
		  	require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(tpl){
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
				require(['dxy-plugins/replacedview/vote/views/searchList.view'], function(tpl){
			  		$('#search-list-container')[0].innerHTML = _.template(tpl)({list: me.searchModel.models});
			  	});
			}, function(res){
				$('#search-list-container').html('');
			});
		},
		fetchVoteList : function(){
			var me =this;
			require(['VoteModel'], function(m){
				var list = new m.VoteGroupsModel([],{items_per_page:8});
				list.fetch().then(function(){
					list.on('all', me.render, me);
					me.votelist = list;
					me.currentPanel = 'votelist';
					me.render();
				}, function(model, res){
					console.log(res);
					alert(res.error.message);
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
				alert(res.error.message);
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
				alert(res.error.message);
				me.votelist.fetching = false;
			});
		},
	});

	var VoteAppView = Backbone.View.extend({
		initialize : function(view){
			try{
				var me = this;
				me.view = view;
				require(['VoteModel'], function(m){
					if(!view.data.group_id){
						return;
					}else{
						var mark = new m.VoteUserMarkModel({obj_id:view.data.group_id,type:10});
						mark.fetch({
							success:function(model, res){
								if(res.error){
									console.log(res);
									return;
								}
								mark.get('group').getUserVotes().then(function(res){
									var votes = [];
									if(res.error){
										if(res.error.code==101){
											votes = [];
										}else{
											console.log(res);
											return;
										}
									}else{
										votes = res.data.items;
									}
									_.each(votes, function(vote){
										var vote_id = vote.vote_id,
											node_id = vote.node_id;
										mark.get('group').attach.findByAttachId(vote_id).attach.attach.findByAttachId(node_id).checked = true;
										mark.get('group').attach.findByAttachId(vote_id).attach.user_voted = true;
										mark.get('group').user_voted = true;
									});
									mark.get('group').getVotesStat().then(function(res){
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
										}
										mark.on('change', me.render, me);
										me.model = mark;
										me.render();
									}, function(res){
										console.log(res);
										return;
									});
								}, function(res){
									console.log(res);
									return;
								});
							},
							error : function(model,res){
								console.log(res);
								return;
							}
						});
					}
				});
			}catch(e){
				console.log(e);
			}
		},
		render : function(){
			var me = this;
			require(['dxy-plugins/replacedview/vote/views/mobile.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({votes: me.model.get('group').attach.models, group: me.model.get('group')});
				me.trigger('render');
		  	});
			return me;
		},
		events : {
			'click .vote-multiple.user_not_voted li' : 'multipleCheck',
			'click .vote-single.user_not_voted li' : 'singleCheck',
			'click .user_not_voted .user-vote' : 'userVote'
		},
		multipleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			options[+id].checked = !options[+id].checked;
			this.model.trigger('change');
		},
		singleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = this.model.find(target.data('model')).models;
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			this.model.trigger('change');
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
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					return;
				}else{
					var dtds =[];
					if(vote.attach.user_voted){
						return;
					}
					_.each(vote.attach.attach.models, function(opt){
						if(opt.checked){
							dtds.push(me.model.userChooseVoteOption(opt.get('node_id'), vote.get('vote_id'), vote.get('group_id')));
						}
					});
					$.when.apply(null, dtds).then(function(res, textStatus, jqXHR){
						vote.attach.user_voted = true;
						_.each(vote.attach.attach.models, function(opt){
							if(opt.checked){
								opt.total++;
								vote.vote_total++;
							}
						});
						me.model.get('group').user_voted = true;
						me.render();
					}, function(res){
						if(!window.__voted){
							alert('请登录');
						}
						window.__voted = true;
					});
				}
			});
		},
		removeAlertBox : function(){
			$('.msg-mark, .editor-alert-box').remove();
		},
		showAlertBox : function(opt){
			var me = this;
			this.removeAlertBox();
			$('<div class="msg-mark"></div>').appendTo($('body'));
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
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
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo(opt.container);
				$('.editor-alert-box a').click(function(){
					me.removeAlertBox();
				});
			});
		}
	});

	window.VoteReplacedView = ReplacedView.register('vote', {
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
		},
		toAppView : function(){
			var ele = this.createWrapNode(true),
				me = this,
				dtd = $.Deferred(),
				view = new VoteAppView(this);
			view.on('render', function(){
				ele.appendChild(view.el);
				me.ele = ele;
				dtd.resolve(ele);
			});
			return dtd;
		},
		toEditorView : function(){
			var ele = this.createWrapNode(),
				me = this,
				dtd = $.Deferred();
			ele.setAttribute('contenteditable', 'false');
			require(['dxy-plugins/replacedview/vote/views/editor.view', 'VoteModel'], function(tpl, m){
				var mark = new m.VoteMarkModel({obj_id:me.data.group_id,type:10});
				mark.fetch({
					success:function(model, res){
						if(res.error){
							alert(res.error.message);
							return;
						}
						ele.innerHTML = _.template(tpl)({group : mark.get('group'),votes: mark.get('group').attach.models});
						me.ele = ele;
						dtd.resolve(ele);
					},
					error : function(model,res){
						console.log(res);
						alert(res.error.message);
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
					alert(res.error.message);
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