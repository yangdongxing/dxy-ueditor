(function(){
	var VoteView = Backbone.View.extend({
		events: {
			'click #J-add-option' : 'addOption',
			'click .J-remove-option' : 'removeOption',
			'blur input' : 'valueChange',
			'change input' : 'valueChange'
		},
		initialize : function(view){
			var me = this;
			this.setElement($('#dxy-vote-modal .modal-body')[0]);
			this.model =  new VoteModel(view.data);
			this.model.on('change', function(){
				me.render();
			});
			this.render();
		},
		render: function() {
		  	var me = this;
			require(['dxy-plugins/replacedview/vote/views/dialog.view'], function(v){
				var t;
				if(VoteView.template){
					t = VoteView.template;
				}else{
					t = _.template(v);
				}
				me.el.innerHTML = t(_.clone(me.model.attributes));
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
			this.model.removeOption($(e.target).data('id'));
		},
		valueChange : function(e){
			var t = $(e.target),
				v = t.val(),
				k = t.attr('name'),
				i,
				data = this.model.attributes;
			if(k.indexOf('vote_option')!==-1){
				i = +k.split('_').pop();
				data.vote_options[i].value = v;
			}else{
				data[k] = v;
			}
		},
		verify : function(){
			var tag = true;
			_.each(this.model.attributes, function(v, k){
				if(!v){
					switch(k){
						case 'vote_name' : 
							alert('投票名称不能为空');
							tag = false;
							return;
						case 'vote_options':
							alert('选项不能为空');
							tag = false;
							return;
						case 'vote_title' : 
							alert('投票标题不能为空');
							tag = false;
							return;
						case 'vote_endtime':
							alert('投票截止时间不能为空');
							tag = false;
							return;
					}
				}
				switch(k){
					case 'vote_options':
						if(v.length<2){
							alert('投票选项不能低于2项');
							tag = false;
							return;
						}
						_.each(v, function(vv){
							if(!vv){
								alert('投票选项不能为空');
								tag = false;
								return;
							}
						})
						break;
					case 'vote_endtime':
						if(new Date(v)<new Date()){
							alert('投票截止日期已过期');
							tag = false;
							return;
						}
						break;
				}
			});
			return tag;
		}
	});

	var VoteModel = Backbone.Model.extend({
		defaults : {
			vote_name : '',
			vote_title : '',
			vote_options : [{},{},{}],
			vote_type : '1',
			vote_permission : '1',
			vote_endtime : ''
		},
		addQuestion : function(){

		},
		addOption : function(){
			var options = _.clone(this.get('vote_options'));
			options.push({id: options.length});
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
	window.DrugReplacedView = ReplacedView.register('vote', {
		toWechatView : function(){
		},
		toWebView : function(){
		},
		toAppView : function(){
		},
		toEditorView : function(){
			var ele = this.createWrapNode(),
				me = this,
				dtd = $.Deferred();
			ele.style.display = 'block';
			ele.ondblclick = function(){
				UE.getEditor('editor-box').execCommand('replacedview', me.type);
			};
			ele.setAttribute('contenteditable', 'false');
			var tpl = '<span>'+JSON.stringify(this.data)+'</span>';
			ele.innerHTML = tpl;
			this.ele = ele;
			setTimeout(function(){
				dtd.resolve();
			}, 0);
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