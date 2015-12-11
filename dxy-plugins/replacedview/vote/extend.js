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