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