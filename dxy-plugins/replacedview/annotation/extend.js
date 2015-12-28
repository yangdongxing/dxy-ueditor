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
			require(['AnnotationModel'], function(m){
				me.annotation = new m.AnnotationModel({});
				me.render();
			});
		},
		changeValue : function(e){
			this.annotation.set('value', $('#annotation-value').val());
		},
		render: function() {
			var me = this;
			require(['dxy-plugins/replacedview/annotation/views/dialog.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({});
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
		},
		init : function(){
			var me = this;
			require(['AnnotationModel'], function(m){
				me.annotation = new m.AnnotationModel({
					id : me.annotationId
				});
				me.annotation.fetch().then(function(){
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
			}
			this.render();
			this.$el.show();
		},
		hide : function(){
			this.$el.hide();
		},
		getDocumentPosition : function(ele){
			var p = $(ele).offset(),
				left = p.left,
				top = p.top,
				scrollLeft = $('body').scrollLeft(),
				scrollTop = $('body').scrollTop(),
				left = left + scrollLeft,
				top = top + scrollTop;
			return {
				left : left,
				top : top
			};
		},
		render: function() {
			var me = this;
			require(['dxy-plugins/replacedview/annotation/views/pop.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					annotation : me.annotation,
					error : me.error
 				});
				var p = me.getDocumentPosition(me.target);
				if(isPC()){
					me.$el.css('left', parseInt(me.$el.outerWidth()/2) + 'px');
					me.$el.css('top', '-'+ parseInt(me.$el.outerHeight())+'px');
				}else{
					me.$el.css('top', '-'+ parseInt(me.$el.outerHeight())+'px');
				}
				$(me.target).append(me.$el);
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
			setTimeout(function(){
				dtd.resolve(ele);
			},0);
			return dtd;
		},
		toAppView : function(e){
			return this.toWebView(e);
		},
		toEditorView : function(e){
			var ele = this.toMetaView(e),
				dtd = $.Deferred();
			setTimeout(function(){
				dtd.resolve(ele);
			},0);
			return dtd;
		},
		onModalShow : function(){
			this.annotation =  new AnnotationView(this);
			$('#dxy-annotation-modal .modal-body').html($(this.annotation.el));
		},
		bindEvent : function(ele){
			var me = this;
			$(ele).on('mouseover', function(){
				console.log('over');
				if(!me.popview){
					me.popview = new PopView(me.data.obj_id,ele);
				}
				me.popview.show();
			});
			$(ele).on('mouseout', function(){
				me.popview.hide();
			});
		},
		onModalConfirm : function(){
			var me = this,
				dtd = $.Deferred();
			require(['MarkModel'], function(m){
				var annotation = me.annotation.annotation;
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
			});
			return dtd;
		},
		isWraper : true
	});
})();