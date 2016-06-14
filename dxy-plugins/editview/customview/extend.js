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