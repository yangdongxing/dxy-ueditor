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
				if(me.onModalConfirm()){
					modal.modal('hide')
					me.toEditorView().then(function(){
						me.mount(UE.getEditor('editor-box').selection.getRange());
					});
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
'    <li role="presentation" class="active"><a href="#add-vote" aria-controls="add-vote" role="tab" data-toggle="tab">新投票</a></li>'+
'    <li role="presentation"><a href="#vote-list" aria-controls="vote-list" role="tab" data-toggle="tab">已有投票</a></li>'+
'  </ul>'+
'  <div class="tab-content">'+
'    <div role="tabpanel" class="tab-pane active" id="add-vote">'+
'		<form style="margin-top:20px;">'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票名称：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control limit-length"  data-max="45"  data-target="vote-name-limit" placeholder="" name="vote_name" value="<%=vote_name%>">'+
'              <em id="vote-name-limit" class="limit-counter"><%=vote_name.length%>/45</em>'+
'            </div>'+
'          </div>'+
'          <p class="text-muted form-group clearfix">'+
'          	<span class="col-sm-3"></span><span class="col-sm-9">投票名称只用于管理，不显示在下发的投票内容中</span></p>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">截止时间：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" placeholder="" name="vote_endtime" value="<%=vote_endtime%>">'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票权限：</label>'+
'            <div class="col-sm-9">'+
'              <input type="radio" placeholder="" id="vote_permission_1" name="vote_permission" <%if(vote_permission===\'1\'){print(\'checked\')}%> value="1">'+
'              <label for="vote_permission_1">所有人</label>'+
'              <input type="radio" placeholder="" name="vote_permission" id="vote_permission_2" <%if(vote_permission===\'2\'){print(\'checked\')}%> value="2">'+
'              <label for="vote_permission_2">已登陆</label>'+
'            </div>'+
'          </div>'+
'        </form>'+
'        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">'+
'		  <div class="panel panel-default">'+
'		    <div class="panel-heading" role="tab" id="headingOne">'+
'		      <h4 class="panel-title">'+
'		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-1" aria-expanded="true" aria-controls="collapse-1" class="btn-block">'+
'		         问题一'+
'		        </a>'+
'		      </h4>'+
'		    </div>'+
'		    <div id="collapse-1" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
'		      <div class="panel-body">'+
'		      	<form style="margin-top:20px;">'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2">标题：</label>'+
'		            <div class="col-sm-10">'+
'		              <input type="text" class="form-control limit-length"  data-target="vote-title-limit" data-max="35" placeholder="" name="vote_title" value="<%=vote_title%>">'+
'		              <em id="vote-title-limit" class="limit-counter"><%=vote_title.length%>/35</em>'+
'		            </div>'+
'		          </div>'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2"></label>'+
'		            <div class="col-sm-10">'+
'		              <input type="radio" id="vote_type_1" placeholder="" name="vote_type"  <%if(vote_type===\'1\'){print(\'checked\')}%> value="1">'+
'		              <label for=\'vote_type_1\'>单选</label>'+
'		              <input type="radio" id="vote_type_2" placeholder="" name="vote_type" <%if(vote_type===\'2\'){print(\'checked\')}%> value="2">'+
'		              <label for="vote_type_2">多选</label>'+
'		            </div>'+
'		          </div>'+
'		          <div class="vote-options">'+
'		          	<%_.each(vote_options,function(opt,i){%>'+
'						<div class="form-group clearfix">'+
'				            <label class="col-sm-2">选项<%=(i+1)%>：</label>'+
'				            <div class="col-sm-6">'+
'				              <input type="text" data-max="35" data-target="vote-option-limit-<%=i%>" class="form-control limit-length" placeholder=""  value="<%=opt.value%>" name="vote_option_<%=i%>">'+
'				              <em id="vote-option-limit-<%=i%>" class="limit-counter"><%=opt.value?opt.value.length:0%>/35</em>'+
'				            </div>'+
'				            <div class="col-sm-2 btn btn-default">'+
'				            	上传图片'+
'				            	 <input type="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer;opacity: 0;width:100%;height:35px;" data-id="<%=i%>" class="vote-option-img" name="vote_img_<%=i%>">'+
'				            </div>'+
'				            <a href="javascript:;" class="J-remove-option col-sm-2" data-id="<%=i%>">删除选项</a>'+
'				        </div>'+
'				        <%if(opt.img){%>'+
'				        <div class="form-group clearfix">'+
'				        	<div class="col-sm-12">'+
'				        		<img src="<%=opt.img%>" style="width:40px;height:40px;">'+
'				        	</div>'+
'				        </div>'+
'				        <%}%>'+
'		          	<%})%>'+
'			       </div>'+
'			       <hr>'+
'			       <a href="javascript:;" id="J-add-option">添加选项</a>'+
'		        </form>'+
'		      </div>'+
'		    </div>'+
'		  </div>'+
'		</div>'+
''+
'    </div>'+
'    <div role="tabpanel" class="tab-pane" id="vote-list">vote list</div>'+
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
			'keyup .limit-length' : 'limitLength'
		},
		initialize : function(view){
			var me = this;
			this.setElement($('#dxy-vote-modal .modal-body')[0]);
			this.model =  new VoteModel(view.data);
			this.model.on('change', this.render, this);
			this.render();
		},
		render: function() {
		  	var me = this;
		  	require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(tpl){
		  		me.el.innerHTML = _.template(tpl)(me.model.attributes);
		  		$(me.el).find('[name=vote_endtime]').datetimepicker({
					defaultDate: 0,
				  	changeYear: true,
				  	changeMonth: true,
				  	numberOfMonths: 1,
				  	dateFormat : 'yy-mm-dd',
				});
				me.delegateEvents(me.events);
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
		fetchVotes : function(){

		},
		addVote : function(){

		},
		deleteVote : function(){

		},
		addOption : function(){
			this.model.addOption();
		},
		removeOption : function(e){
			this.model.removeOption($(e.currentTarget).data('id'));
		},
		valueChange : function(e){
			var t = $(e.currentTarget),
				v = t.val(),
				k = t.attr('name'),
				i,
				data = this.model.attributes,
				me =this;
			if(k.indexOf('vote_option')!==-1){
				i = +k.split('_').pop();
				data.vote_options[i].value = v;
				this.model.set('vote_options', data.vote_options);
			}else if(k.indexOf('vote_img')!==-1){
				i = +k.split('_').pop();
				this.uploadImage(t[0]).then(function(e){
					var res = JSON.parse(e.currentTarget.responseText);
					data.vote_options[i].img = IMG_PREFIX + res.data.items[0].path;
					me.model.set('vote_options', data.vote_options);
					me.model.trigger('change');
				},function(e){
					var res = JSON.parse(e.currentTarget.responseText);
					alert('上传失败：'+res);
				});
			}else{
				data[k] = v;
				this.model.set(k, v);
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
			vote_total : 0,
			vote_name : '',
			vote_title : '',
			vote_options : [{
				value : '',
				checked : false,
				total : 0,
				img: ''
			},{
				value : '',
				checked : false,
				total : 0,
				img : ''
			},{
				value : '',
				checked : false,
				total : 0,
				img : ''
			}],
			vote_type : '1',
			vote_permission : '1',
			vote_endtime : '',
			user_voted : false
		},
		addQuestion : function(){

		},
		constructor : function(data){
			var me = this;
			_.each(data.vote_options, function(opt, i, arr){
				arr[i] = $.extend(true, {}, me.defaults.vote_options[0], opt);
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
			ele.setAttribute('contenteditable', 'false');
			require(['dxy-plugins/replacedview/vote/views/editor.view'], function(tpl){
		  		ele.innerHTML = _.template(tpl)(me.data);
		  		me.ele = ele;
		  		dtd.resolve(ele);
		  	});
			return dtd;
		},
		onModalShow : function(){
			this.vote =  new VoteView(this);
		},
		onModalConfirm : function(){
			if(this.vote.verify()){
				this.data = _.clone(this.vote.model.attributes);
				return true;
			}else{
				return false;
			}
		},
		modalInit : function(){
			
		}
	});
})();