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