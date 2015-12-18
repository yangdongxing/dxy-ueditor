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
			me.view = view;
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
				  		var old = me.model.get('group').get('e_time'),
				  			e_time = new Date(newDate),
				  			s_time = new Date(me.model.get('group').get('s_time'));
				  		if(newDate.split(":").length===2){
				  			newDate = newDate+':00';	
				  		}
				  		if(old && old.split(":").length===2){
				  			old = old+':00';
				  		}
				  		if(e_time <= s_time){
				  			alert('截止日期不能小于开始日期');
				  			$(me.el).find('[name=group-e_time]').val(old);
				  		}else{
				  			me.model.get('group').set('e_time', newDate, {silent:true});
				  		}
				  	}
				});
				$(me.el).find('[name=group-s_time]').datetimepicker({
					defaultDate: 0,
				  	changeYear: true,
				  	changeMonth: true,
				  	numberOfMonths: 1,
				  	dateFormat : 'yy-mm-dd',
				  	onClose : function(newDate){
				  		var old = me.model.get('group').get('s_time'),
				  			s_time = new Date(newDate),
				  			e_time = new Date(me.model.get('group').get('e_time'));
				  		if(newDate.split(":").length===2){
				  			newDate = newDate+':00';	
				  		}
				  		if(old && old.split(":").length===2){
				  			old = old+':00';
				  		}
				  		if(s_time >= e_time){
				  			alert('开始日期不能大于截止日期');
				  			$(me.el).find('[name=group-s_time]').val(old);
				  		}else{
				  			me.model.get('group').set('s_time', newDate, {silent:true});
				  		}
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
			me.model.isInsert = true;
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
			require(['VoteModel'], function(m){
				var group = new m.VoteGroupModel({
					s_time : fomat(new Date(), 'YYYY-MM-DD hh:mm:ss'),
					e_time : fomat(new Date(), 'YYYY-MM-DD hh:mm:ss'),
					status : 1,
					title : '',
					content : '默认内容',
					votes : []
				});
				me.model.addGroup(group);
				me.model.isInsert = false;
				me.render();
			});
		},
		addVote : function(e){
			var group = this.model.find('group'),
				me = this;
			require(['VoteModel'], function(m){
				var votelink = new m.VoteGroupLinkModel({}),
					vote = new m.VoteModel({
						nodes : [],
						content : '默认内容',
						title : '',
						type : 0
					});
				votelink.addNode(vote);
				group.attach.add(votelink)
				me.render();
			});
		},
		deleteVote : function(){
			
		},
		addOption : function(e){
			var vote = this.model.find($(e.currentTarget).data('model')),
				me = this;
			if(vote.get('id')){
				vote.addOption();
			}else{
				require(['VoteModel'], function(m){
					var optlink = new m.NodeLinkModel({}),
						opt = new m.NodeModel({
							value : ''
						});
					optlink.addNode(opt);
					vote.attach.add(optlink)
					me.render();
				});
			}
		},
		removeOption : function(e){
			var t = $(e.currentTarget),
				vote = this.model.find(t.data('model')),
				i = t.data('id');
			if(vote){
				vote.removeOption(i);
				this.render();
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
					me.render();
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
			var me = this;
			
				function _verify(model){
					if(!model){
						return;
					}
					if(model.models){
						if(model.models.length===0){
							throw new Error('投票选项和投票至少存在一项');
						}
					}
					if(model.models){
						_.each(model.models, function(m){
							_verify(m);
						});
						return;
					}
					if(model.attach){
						_verify(model.attach);
					}
					for(var k in model.attributes){
						if(model.attributes.hasOwnProperty(k)){
							var v = model.attributes[k];
							switch(k){
								case 'title':
									if(v.length<4){
										throw new Error('标题必须大于等于4个字');
									}
									break;
								case 'value':
									if(v.length<4){
										throw new Error('投票项值必须大于等于4个字');
									}
									break;
							}
						}
					}
				}
				try{
					if(me.model.isInsert){
						return true;
					}
					if(!me.model.get('group') && me.model.isInsert===undefined){
						throw new Error('请选择要插入的投票组');
					}
					_verify(me.model.get('group'));
					return true;
				}catch(e){
					alert(e.message);
					tag = false;
					return false
				}
		}
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
								mark.get('group').getUserVotes().success(function(res){
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
									});
									mark.get('group').getVotesStat().success(function(res){
										console.log(res);
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
									}).error(function(){
										console.log(res);
										return;
									});
								}).error(function(res){
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
		userVote : function(){
			var tag = false,
				me = this;
			_.each(me.model.get('group').attach.models, function(vote, i){
				tag = false;
				_.each(vote.attach.attach.models, function(opt){
					if(opt.checked){
						tag = true;
					}
				});
				if(!tag){
					if(IS_PC){
						me.showWebAlertBox({
							title : '请至少选择一个选项后再投票',
							button_title : '好吧',
							cls : 'web-alert',
							index : i
						});
					}else{
						me.showAlertBox({
							title : '请至少选择一个选项后再投票',
							button_title : '好吧',
							cls : '',
							index : i
						});
					}
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
					$.when.apply(dtds).then(function(res){
						vote.attach.user_voted = true;
						_.each(vote.attach.attach.models, function(opt){
							if(opt.checked){
								opt.total++;
								vote.vote_total++;
							}
						});
						me.model.trigger('change');
					}, function(res){});
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
			require(['dxy-plugins/replacedview/vote/views/alert.view'],function(tpl){
				$(_.template(tpl)(opt)).appendTo($($('.editor-vote-wraper',me.el)[opt.index]));
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