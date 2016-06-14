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