define('VoteModel', function(){
	Backbone.emulateJSON = true;
	var API_HOST = 'http://dxy.us/';
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
			this.fetch().success(function(model, res){
				if(res.error){
					me.page_index = oldPage;
					dtd.reject(res);
					return;
				}
				dtd.resolve.apply(arguments);
			}).error(function(res){
				dtd.reject.apply(arguments);
			});
			return dtd;
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
			switch(method){
				case 'create' : 
					options.url = API_HOST + 'admin/i/vote/node/add';
					break;
				case 'read' :
					options.url = API_HOST + 'admin/i/vote/node/list';
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
					options.url = API_HOST + 'admin/i/vote/node/link/list';
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var VoteModel = Backbone.Model.extend({
		constructor : function(data){
			var me = this;
			this.attach = new NodeLinksModel(data.nodes);
			delete data.nodes;
			data.type = data.type===undefined? 0 : data.type;
			this.listenTo(this.attach, 'all', function(){
				me.trigger('change');
				console.log('vote change');
			});
			Backbone.Model.apply(this,arguments);
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
			node.save({value:''},{data:{value:''}}).success(function(res){
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
				}).success(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					nodelink.set('id', res.data.items[0].id, {silent:true})
					nodelink.addNode(node);
					nodes.add(nodelink);
				}).error(function(res){
					node.destroy({wait:true});
					dtd.reject(res);
				});
			}).error(function(res){
				dtd.reject(res);
			});
			return dtd;
		},
		removeOption : function(id){
			var votelink = this.attach.at(parseInt(id)),
				dtd = $.Deferred(),
				me = this;
			if(votelink){
				votelink.destroy().success(function(res){
					if(res.error){
						dtd.reject();
						return;
					}
					me.attach.remove(votelink);
				}).error(function(res){
					dtd.reject();
				});
			}
			return dtd;
		}

	});
	var VotesModel = BaseListModel.extend({
		model : VoteModel,
		sync : function(method, model, options){
			switch(method){
				case 'create':
					options.url = API_HOST + 'admin/i/vote/add';
					break;
				case 'read':
					options.url = API_HOST + 'admin/i/vote/list';
					break;
			}
			return Backbone.sync(method, model, options);
		}
	});
	var VoteGroupModel = Backbone.Model.extend({
		constructor : function(data){
			var me = this;
			this.attach = new VoteGroupLinksModel(data.votes);
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
					options.url = API_HOST + 'admin/i/vote/group/delete';
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
			node.save({type:0, title:'默认标题',content:'默认内容'},{data:{type:0, title:'默认标题',content:'默认内容'}}).success(function(res){
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
				}).success(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					nodelink.set('id', res.data.items[0].id, {silent:true})
					nodelink.addNode(node);
					nodes.add(nodelink);
				}).error(function(res){
					node.destroy({wait:true});
					dtd.reject(res);
				});
			}).error(function(res){
				dtd.reject(res);
			});
			return dtd;
		}
	});
	var VoteGroupsModel = BaseListModel.extend({
		model : VoteGroupModel,
		sync : function(method, model, options){
			switch(method){
				case 'create':
					options.url = API_HOST + 'admin/i/vote/group/add';
					break;
				case 'read':
					options.url = API_HOST + 'admin/i/vote/group/list' + '?page_index='+this.page_index+'&items_per_page='+this.items_per_page;
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
					options.url = API_HOST + 'admin/i/vote/group/link/delete';
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
					options.url = API_HOST + 'admin/i/vote/group/link/list';
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
			group.save({},{data:group.attributes}).success(function(res){
				if(res.error){
					console.log(res);
					dtd.reject(res);
					return;
				}
				group.set('id', res.data.items[0].id);
				me.save({obj_id: group.get('id'), type: 10}, {data: {obj_id: group.get('id'), type: 10}}).success(function(res){
					if(res.error){
						dtd.reject(res);
						return;
					}
					me.unset('group', {silent:true});
					me.set('id', res.data.items[0].id);
					me.addGroup(group);
					dtd.resolve(group);
				}).error(function(res){
					dtd.reject(res);
				});
			}).error(function(res){
				dtd.reject(res);
			});
			return dtd;
		},
		parse : function(resp, options){
			if(resp.error){
				return {};
			}
			if(resp.data.items[0].votes){
				_.each(resp.data.items[0].votes, function(vote){
					if(vote.nodes){
						vote.nodes.reverse();
					}
				});
			}
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
			var i = 0;
			function next(root){
				if(root.attach){
					return root.attach
				}else{
					return null;
				}
			}
			function save(model){
				if(!model){
					return;
				}
				if(model.length){
					_.each(model.models, function(m){
						save(m);
					});
					return;
				}
				if(model.hasChanged && model.hasChanged()){
					i++;
					var data = model.attributes;
					if(model.processPostData){
						data = model.processPostData(data);
					}
					model.save({},{data: model.attributes}).success(function(res){
						if(res.error){
							dtd.reject();
							return;
						}
						i--;
						if(i===0){
							dtd.resolve();
						}
					}).error(function(){
						dtd.reject();
					});
				}
				save(next(model));
			}
			var root = this.get('group');
			save(root);
			setTimeout(function(){
				if(i===0){
					dtd.resolve();
				}
			},0);
			return dtd;
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
		VoteMarkModel : VoteMarkModel
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
					if(window.location.href.indexOf('admin/column')!==-1){
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
				if(res.then){
					res.then(function(){
						modal.modal('hide');
						me.toEditorView().then(function(){
							me.mount(UE.getEditor('editor-box').selection.getRange());
						});
					}, function(){

					});
				}else{
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
'	<div class="m-drug-view-footer">'+
'		<%if(drug_tags){%>'+
'		<%_.each(drug_tags, function(tag){%>'+
'		<span class="tag"><%=tag%></span>'+
'		<%})%>'+
'		<%}%>'+
'		<span class=\'right-arrow\'>></span>'+
'	</div>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/alert.view", function(){var tpl = '<div class="editor-alert-box <%if(cls){print(cls)}%>">'+
'	<p><%=title%></p>'+
'	<a href="javascript:;"><%=button_title%></a>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/dialog.view", function(){var tpl = '<div>'+
'  <ul class="nav nav-tabs" role="tablist">'+
'    <li role="presentation" id="vote-edit-tab" class="<%if(panel!=\'votelist\'){print(\'active\')}%>"><a href="#add-vote" aria-controls="add-vote" role="tab" data-toggle="tab">投票编辑</a></li>'+
'    <li role="presentation" id="vote-list-tab" class="<%if(panel==\'votelist\'){print(\'active\')}%>"><a href="#vote-list" aria-controls="vote-list" role="tab" data-toggle="tab">已有投票</a></li>'+
'  </ul>'+
'  <div class="tab-content">'+
'    <div role="tabpanel" class="tab-pane <%if(panel!=\'votelist\'){print(\'active\')}%>" id="add-vote">'+
'    <%if(mark.get(\'group\')){%>'+
'		<form style="margin-top:20px;">'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票名称：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control limit-length"  data-max="45"  data-target="vote-name-limit" placeholder="" name="group-title" value="<%=mark.get(\'group\').get(\'title\')%>">'+
'              <em id="vote-name-limit" class="limit-counter"><%=mark.get(\'group\').get(\'title\').length%>/45</em>'+
'            </div>'+
'          </div>'+
'          <p class="text-muted form-group clearfix">'+
'          	<span class="col-sm-3"></span><span class="col-sm-9">投票名称只用于管理，不显示在下发的投票内容中</span></p>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">截止时间：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control group-date" placeholder="" name="group-e_time" value="<%=mark.get(\'group\').get(\'e_time\')%>">'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票权限：</label>'+
'            <div class="col-sm-9">'+
'              <input type="radio" placeholder="" id="status_1" name="group-status" <%if(mark.get(\'group\').get(\'status\')==\'\'){print(\'checked\')}%> value="0">'+
'              <label for="status_1">禁用</label>'+
'              <input type="radio" placeholder="" name="group-status" id="status_2" <%if(mark.get(\'group\').get(\'status\')==\'1\'){print(\'checked\')}%> value="1">'+
'              <label for="status_2">正常</label>'+
'              <input type="radio" placeholder="" name="group-status" id="status_3" <%if(mark.get(\'group\').get(\'status\')==\'10\'){print(\'checked\')}%> value="10">'+
'              <label for="status_3">删除</label>'+
'            </div>'+
'          </div>'+
'        </form>'+
'        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">'+
'         <%_.each(mark.get(\'group\').attach.models, function(vote_link, i){%>'+
'		  <div class="panel panel-default">'+
'		    <div class="panel-heading" role="tab" id="headingOne">'+
'		      <h4 class="panel-title">'+
'		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-<%=i%>" aria-expanded="true" aria-controls="collapse-<%=i%>" class="btn-block">'+
'		         问题<%=i+1%>'+
'		        </a>'+
'		      </h4>'+
'		    </div>'+
'		    <div id="collapse-<%=i%>" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
'		      <div class="panel-body">'+
'		      	<form style="margin-top:20px;">'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2">标题：</label>'+
'		            <div class="col-sm-10">'+
'		              <input type="text" class="form-control limit-length"  data-target="vote-title-limit-<%=i%>" data-max="35" placeholder="" name="group-attach-<%=i%>-attach-title" value="<%=vote_link.attach.get(\'title\')%>">'+
'		              <em id="vote-title-limit-<%=i%>" class="limit-counter"><%=vote_link.attach.get(\'title\').length%>/35</em>'+
'		            </div>'+
'		          </div>'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2"></label>'+
'		            <div class="col-sm-10">'+
'		              <input type="radio" id="vote_type_1-<%=i%>" placeholder="" name="group-attach-<%=i%>-attach-type"  <%if(vote_link.attach.get(\'type\')==\'0\'){print(\'checked\')}%> value="0">'+
'		              <label for=\'vote_type_1-<%=i%>\'>单选</label>'+
'		              <input type="radio" id="vote_type_2-<%=i%>" placeholder="" name="group-attach-<%=i%>-attach-type" <%if(vote_link.attach.get(\'type\')==\'1\'){print(\'checked\')}%> value="1">'+
'		              <label for="vote_type_2-<%=i%>">多选</label>'+
'		            </div>'+
'		          </div>'+
'		          <div class="vote-options">'+
'		          	<%_.each(vote_link.attach.attach.models,function(node_link,j){%>'+
'						<div class="form-group clearfix">'+
'				            <label class="col-sm-2">选项<%=(j+1)%>：</label>'+
'				            <div class="col-sm-6">'+
'				              <input type="text" data-max="35" data-target="vote-option-limit-<%=i%>-<%=j%>" class="form-control limit-length" placeholder=""  value="<%=node_link.attach.get(\'value\')%>" name="group-attach-<%=i%>-attach-attach-<%=j%>-attach-value">'+
'				              <em id="vote-option-limit-<%=i%>-<%=j%>" class="limit-counter"><%=node_link.attach.get(\'value\').length%>/35</em>'+
'				            </div>'+
'				            <div class="col-sm-2 btn btn-default">'+
'				            	上传图片'+
'				            	 <input type="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer;opacity: 0;width:100%;height:35px;" data-id="<%=j%>" class="vote-option-img" name="group-attach-<%=i%>-attach-attach-<%=j%>-attach-img">'+
'				            </div>'+
'				            <a href="javascript:;" class="J-remove-option col-sm-2" data-model="group-attach-<%=i%>-attach" data-id="<%=j%>">删除选项</a>'+
'				        </div>'+
'				        <%if(node_link.attach.get(\'img\')){%>'+
'				        <div class="form-group clearfix">'+
'				        	<div class="col-sm-12">'+
'				        		<img src="<%=node_link.attach.get(\'img\')%>" style="width:40px;height:40px;">'+
'				        	</div>'+
'				        </div>'+
'				        <%}%>'+
'		          	<%})%>'+
'			       </div>'+
'			       <hr>'+
'			       <a href="javascript:;" id="J-add-option" data-model="group-attach-<%=i%>-attach">添加选项</a>'+
'		        </form>'+
'		      </div>'+
'		    </div>'+
'		  </div>'+
'		 <%})%>'+
'		</div>'+
'		<a class="btn btn-default center-block" href="#" role="button" style="width:30%;" id="J-add-vote">添加投票</a>'+
'	<%}else{%>'+
'		<br>'+
'		<a class="btn btn-default center-block" href="#" role="button" style="width:40%;" id="J-new-group">新投票</a>'+
'	<%}%>'+
'    </div>'+
'    <div role="tabpanel" class="tab-pane <%if(panel==\'votelist\'){print(\'active\')}%>" id="vote-list">'+
'    	<%if(votelist){%>'+
'		<table class="table table-hover">'+
'			<thead>'+
'				<tr>'+
'					<th>#</th>'+
'					<th>名称</th>'+
'					<th>截止时间</th>'+
'					<th>投票权限</th>'+
'					<th>操作</th>'+
'				</tr>'+
'			</thead>'+
'			<tbody>'+
'				<%_.each(votelist.models, function(vote, i){%>'+
'				<tr>'+
'					<td><%=vote.get(\'id\')%></td>'+
'					<td><%=vote.get(\'title\')%></td>'+
'					<td><%=vote.get(\'e_time\')%></td>'+
'					<td><%if(vote.get(\'status\')==0){print(\'禁用\')}else if(vote.get(\'status\')==1){print(\'正常\')}else{print(\'删除\')}%></td>'+
'					<td>'+
'						<a href="javascript:;" class="J-add-vote-from-votelist" data-id="<%=vote.get(\'id\')%>"><%if(mark.get(\'group\')){print(\'替换\')}else{print(\'插入\')}%></a>'+
'					</td>'+
'				</tr>'+
'				<%})%>'+
'			</tbody>'+
'		</table>'+
'<!-- 		<div class="row">'+
'			<div class="input-group col-md-6" style="left:25%;">'+
'		      <input type="text" class="form-control" placeholder="根据名称筛选">'+
'		      <span class="input-group-btn">'+
'		        <button class="btn btn-default" type="button" id="vote-list-search">筛选</button>'+
'		      </span>'+
'		    </div>'+
'		</div>'+
' -->		<nav>'+
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
define("dxy-plugins/replacedview/vote/views/editor.view", function(){var tpl = '<div class="editor-vote-wraper">'+
'	<p>'+
'		<span class="tag"><%if(+vote_type===1){print(\'单选投票\')}else{print(\'多选投票\')}%></span>'+
'		<span class="tag"><%=vote_endtime%></span>'+
'		<span class="tag"><%if(+vote_permission===1){print(\'所有人\')}else{print(\'已登录\')}%></span>'+
'	</p>'+
'	<h4><%=vote_title%></h4>'+
'	<ul>'+
'		<%_.each(vote_options,function(opt){ %> '+
'			<li>'+
'				<%=opt.value%>'+
'			</li>'+
'		<%})%>'+
'	</ul>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '<%if(+vote_type===1){%>'+
'	<%if(new Date()<new Date(vote_endtime)){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-single-poll.png" class="vote-type">'+
'		<h4><%=vote_title%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote_options,function(opt,i){ %> '+
'					<li data-id="<%=i%>"  class="<%if(opt.checked){print(\'checked\')}%>">'+
'						<%if(user_voted){%>'+
'						<p>'+
'							<%=opt.value%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.img){%>'+
'							<span class="img">'+
'								<img src="<%=opt.img%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.value%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'			<a href="javascript:;" class="user-vote">'+
'				<%if(user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'			</a>'+
'		</div>'+
'	</div>'+
'	<%}else{%>'+
'		end'+
'	<%}%>'+
'<%}else{%>'+
'	<%if(new Date()<new Date(vote_endtime)){%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-muli-poll.png" class="vote-type">'+
'		<h4><%=vote_title%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote_options,function(opt,i){ %> '+
'					<li data-id="<%=i%>"  class="<%if(opt.checked){print(\'checked\')}%>">'+
'						<%if(user_voted){%>'+
'						<p>'+
'							<%=opt.value%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.img){%>'+
'							<span class="img">'+
'								<img src="<%=opt.img%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.value%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'			<a href="javascript:;" class="user-vote">'+
'				<%if(user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'			</a>'+
'		</div>'+
'	</div>'+
'	<%}else{%>'+
'		end'+
'	<%}%>'+
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
			require(['dxy-plugins/replacedview/drug/mobile.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
				  	drug_name : '倍德汀 （聚维酮碘溶液)',
				  	drug_tags : ['医保'],
				  	drug_company : '史达德药业 （北京）有限公司'
				});
				me.trigger('render');
			});
		  	return this;
		}
	});
	window.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
			return this.toEditorView();
		},
		toWebView : function(){
			var ele = this.createWrapNode(),
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
			var tpl = '<span>'+this.data.drug_name+'</span>';
			ele.innerHTML = tpl;
			this.ele = ele;
			setTimeout(function(){
				dtd.resolve();
			}, 0);
			return dtd;
		},
		onModalShow : function(){
			$('#drug-id').val(this.data.drug_id||'');
			$('#J-drug-info').val(this.data.drug_name||'');
			$('#J-drug-not-find').hide();
			this.modal.find('#drug-id').keyup();
		},
		onModalConfirm : function(){
			if(this.verifyDrugId() && this.drugData && this.modal.find('#drug-id').val()==this.drugData.id){
				this.data.drug_name = this.drugData.name;
				this.data.drug_id = this.drugData.id;
				return true;
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
			return /\d{5}/.test(val);
		},
		modalInit : function(){
			var me = this;
			me.modal.find('#drug-id').on('keyup', function(){
				if(me.verifyDrugId()){	
					me.modal.find('#J-drug-info').text('检索数据中...');
					me.fetchDrugData().then(function(res){
						if(res.type===0){
							me.modal.find('#J-drug-info').text('该药品 ID 不存在，请查验');
						}else{
							me.modal.find('#J-drug-info').text(res.name);
							me.drugData = res;
						}
					}, function(){
						alert('网络错误');
					});
				}else{
					me.modal.find('#J-drug-info').text('请输入5位药品数字ID');
				}
			});
		}
	});
})();
(function(){
	var IMG_PREFIX = 'http://img.dxycdn.com/dotcom/';
	var UPLOAD_ACTION = 'http://dxy.com/admin/i/att/upload?type=column_content';
	var IS_PC = isPC();

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
			'click #J-add-option' : 'addOption',
			'click .J-remove-option' : 'removeOption',
			'keyup input' : 'valueChange',
			'change input' : 'valueChange',
			'keyup .limit-length' : 'limitLength',
			'click #J-add-vote' : 'addVote',
			'click #J-new-group' : 'newGroup',
			'click #vote-list-tab' : 'fetchVoteList',
			'click #vote-list-page-prev' : 'VoteListPrevPage',
			'click #vote-list-page-next' : 'VoteListNextPage',
			'click .J-add-vote-from-votelist' : 'insertGroup'
		},
		initialize : function(view){
		var me = this;
		require(['VoteModel'], function(m){
			me.setElement($('#dxy-vote-modal .modal-body')[0]);
			if(!view.data.group_id){
				var mark = new m.VoteMarkModel({});
				me.model = mark;
				me.model.on('change', this.render, this);
				me.render();
			}else{
					var mark = new m.VoteMarkModel({obj_id:view.data.group_id,type:10});
					mark.fetch({
						success:function(model, res){
							if(res.error){
								view.modal.modal('hide');
								alert(res.error.message);
								return;
							}
							window.mark = mark;
							me.model = mark;
							me.model.on('change', function(){
								me.render();
								console.log(me);
								window.m = me.model;
							});
							me.render();
						},
						error : function(model,res){
							alert(res.error.message);
							view.modal.modal('hide');
						}
					});
			}
		});
		},
		fetchData : function(group_id){
			var dtd = $.Deferred();
			return $.get('http://dxy.us/admin/i/functionmarker/data',{type: 10, obj_id: group_id});
		},
		render: function() {
			console.log(this.model);
		  	var me = this;
		  	require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)({mark: me.model, votelist : me.votelist, panel : me.currentPanel});
		  		$(me.el).find('[name=group-e_time]').datetimepicker({
					defaultDate: 0,
				  	changeYear: true,
				  	changeMonth: true,
				  	numberOfMonths: 1,
				  	dateFormat : 'yy-mm-dd',
				  	onClose : function(newDate){
				  		if(newDate.split(":").length===2){
				  			newDate = newDate+':00';
				  		}
				  		me.model.get('group').set('e_time', newDate, {silent:true});
				  	}
				});
				me.trigger('render');
		  	});
			return me;
		},
		uploadImage : function(ele){
			function send(formData, success, error){
                var xhr = new XMLHttpRequest(); 
                xhr.open("post", UPLOAD_ACTION , true); 
                xhr.onload = success;
                xhr.onerror = error;
                xhr.send(formData);
            }
            if(!ele.files){
            	return;
            }
			var dtd = $.Deferred();
			var formData = new FormData();
            formData.append('attachment', ele.files[0]);
            send(formData, function(res){
            	dtd.resolve(res);
            }, function(res){
            	dtd.reject(res);
            });
            return dtd;
		},
		clickDate : function(){
			console.log('click date');
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
		insertGroup : function(e){
			var t = $(e.currentTarget),
				me =this,
				id = t.data('id'),
				group = me.votelist.get(+id);
			me.model.addGroup(group);
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
		newGroup : function(){
			var me = this;
			this.model.newGroup().then(function(){
				me.render();
			}, function(res){
				console.log(res);
			});
		},
		addVote : function(e){
			var group = this.model.find('group');
			if(group){
				group.addVote();
			}
		},
		deleteVote : function(){
			
		},
		addOption : function(e){
			var vote = this.model.find($(e.currentTarget).data('model'));
			if(vote){
				vote.addOption();
			}
		},
		removeOption : function(e){
			var t = $(e.currentTarget),
				vote = this.model.find(t.data('model')),
				i = t.data('id');
			if(vote){
				vote.removeOption(i);
			}
		},
		valueChange : function(e){
			function set(obj, key, val){
				var arr = key.split('-');
				_.every(arr, function(k, i, all){
					if(k!==undefined && obj){
						if(i===all.length-1){
							if(obj.get(k)===val){
								return;
							}
							obj.set(k, val, {silent: true});
 						}else{
 							if(/\d+/.test(''+k)){
 								obj = obj.at(k);
 							}else if(k==='attach'){
 								obj = obj.attach;
 							}else{
 								obj = obj.get(k);
 							}
 						}
						return true;
					}else{
						return false;
					}
				});
			}
			var t = $(e.currentTarget),
				v = t.val(),
				k = t.attr('name'),
				i,
				data = _.clone(this.model.attributes),
				me =this;
			if(k.slice(-3)==='img'){
				this.uploadImage(t[0]).then(function(e){
					var res = JSON.parse(e.currentTarget.responseText);
					set(me.model, k, IMG_PREFIX + res.data.items[0].path);
					me.model.trigger('change');
				},function(e){
					var res = JSON.parse(e.currentTarget.responseText);
					alert('上传失败：'+res);
				});
			}else{
				set(this.model, k, v);
			}
		},
		limitLength : function(e){
			var $ele = $(e.currentTarget),
				max = $ele.data('max'),
				$target = $('#'+$ele.data('target'));
			if(+$ele.val().length > +max){
				$target.addClass('text-danger');
			}else{
				$target.removeClass('text-danger');
			}
			$target.text($ele.val().length+'/'+max);
		},
		verify : function(){
			var tag = true;
			_.every(this.model.attributes, function(v, k){
				if(!v){
					switch(k){
						case 'vote_name' : 
							alert('投票名称不能为空');
							tag = false;
							break;
						case 'vote_options':
							alert('选项不能为空');
							tag = false;
							break;
						case 'vote_title' : 
							alert('投票标题不能为空');
							tag = false;
							break;
						case 'vote_endtime':
							alert('投票截止时间不能为空');
							tag = false;
							break;
					}
				}
				switch(k){
					case 'vote_options':
						if(v.length<2){
							alert('投票选项不能低于2项');
							tag = false;
							break;
						}
						tag = _.every(v, function(vv){
							if(!vv.value){
								alert('投票选项不能为空');
								tag = false;
								return false;
							}
							if(vv.value.length>35){
								alert('投票选项不能超过35个字符');
								tag = false;
								return false;
							}
							return true;
						});
						break;
					case 'vote_endtime':
						if(new Date(v)<new Date()){
							alert('投票截止日期已过期');
							tag = false;
						}
						break;
					case 'vote_name':
						if(v.length>45){
							alert('投票名称不能超过45个字符');
							tag = false;
						}
						break;
					case 'vote_title':
						if(v.length>35){
							alert('投票标题不能超过35个字符');
							tag = false;
						}
						break;
				}
				return tag;
			});
			return tag;
		}
	});

	var VoteModel = Backbone.Model.extend({
		defaults : {
            "id" : '',
            "status" : 1,
            "title" : "",
            "content" : "",
            "s_time" : "",
            "e_time" : "",
            "votes" : 
            [
                {
                    "id" : '',
                    "group_id" : '',
                    "vote_id" : '',
                    "vote_title" : "",
                    "vote_content" : "",
                    "sort" : 1,
                    "prefix" : "",
                    "type" : 0,
                    "nodes" : 
                    [
                        {
                            "id" : "",
                            "vote_id" : "",
                            "node_id" : "",
                            "node_value" : "",
                            "sort" : "",
                            "prefix" : "" 
                        }
                    ]
                }
            ]
        },
		addQuestion : function(){

		},
		constructor : function(data){
			var me = this;
			_.each(data.votes, function(vote, i, votes){
				_.each(vote.nodes, function(node, j, nodes){
					nodes[j] = $.extend(true, {}, me.defaults.votes[0].nodes[0], node);
				});
				votes[i] = $.extend(true, {}, me.defaults.votes[0], vote);
			});
			Backbone.Model.call(this, $.extend(true, {}, this.defaults, data));
		},
		addOption : function(){
			var options = _.clone(this.get('vote_options'));
			options.push({
				id: options.length,
				value : '',
				checked : false,
				total : 0,
				img : ''
			});
			this.set('vote_options', options);
		},
		removeOption : function(i){
			var options = _.clone(this.get('vote_options'));
			if(options.length<=2){
				alert('问题至少包含 2 个选项');
				return;
			}
			options.splice(i, 1);
			this.set('vote_options', options);
		}

	});
	var VoteAppView = Backbone.View.extend({
		initialize : function(view){
			this.view = view;
			this.model = new VoteModel(view.data);
			this.model.on('change', this.render, this);
			this.render();
		},
		render : function(){
			var me = this;
			require(['dxy-plugins/replacedview/vote/views/mobile.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)(me.model.attributes);
				me.delegateEvents(me.events);
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
				options = _.clone(this.model.get('vote_options'));
			options[+id].checked = !options[+id].checked;
			this.model.set('vote_options', options);
			this.model.trigger('change');
		},
		singleCheck : function(e){
			var target = $(e.currentTarget),
				id = target.data('id'),
				options = _.clone(this.model.get('vote_options'));
			_.each(options, function(opt, i){
				if(i===+id){
					opt.checked = true;
				}else{
					opt.checked = false;
				}
			});
			this.model.set('vote_options', options);
			this.model.trigger('change');
		},
		userVote : function(){
			var tag = false;
			_.each(this.model.get('vote_options'), function(opt, i){
				if(opt.checked){
					tag = true;
				}
			});
			if(!tag){
				if(IS_PC){
					this.showWebAlertBox({
						title : '请至少选择一个选项后再投票',
						button_title : '好吧',
						cls : 'web-alert'
					});
				}else{
					this.showAlertBox({
						title : '请至少选择一个选项后再投票',
						button_title : '好吧',
						cls : ''
					});
				}
			}else{
				_.each(this.model.get('vote_options'), function(opt, i){
					if(opt.checked){
						tag = true;
						opt.total++;
					}
				});
				this.model.set({
					user_voted : true,
					vote_total : this.model.get('vote_total')+1
				});
				this.model.trigger('change');
			}
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
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo($('.editor-vote-wraper',me.el));
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
			ele.innerHTML = 'vote';
			me.ele = ele;
			ele.setAttribute('contenteditable', 'false');
			require(['dxy-plugins/replacedview/vote/views/editor.view'], function(tpl){
		  		// ele.innerHTML = _.template(tpl)(me.data);
		  		// me.ele = ele;
		  		dtd.resolve(ele);
		  	});
			return dtd;
		},
		onModalShow : function(){
			this.vote =  new VoteView(this);
		},
		onModalHide : function(){
			this.vote.undelegateEvents();
		}, 
		onModalConfirm : function(){
			var data, dtd = $.Deferred(),me =this;
			if(this.vote.verify()){
				this.vote.model.confirm().then(function(){
					me.data.group_id = me.vote.model.get('group').get('id');
					dtd.resolve();
				},function(){
					dtd.reject();
				});
				return dtd;
			}else{
				return false;
			}
		},
		modalInit : function(){
			
		}
	});
})();