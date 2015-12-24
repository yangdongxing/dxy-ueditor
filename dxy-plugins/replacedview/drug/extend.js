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
			require(['dxy-plugins/replacedview/drug/mobile.view', 'MarkModel'], function(v, m){
				var mark = new m.MarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company,
					  	drug_url : 'http://yao.dxy.com/drug/'+res.data.items[0].id+'.htm'
					});
					me.trigger('render');
				}, function(res){
					
				});
			});
		  	return this;
		}
	});
	var WebView = Backbone.View.extend({
		events: {

		},
		initialize : function(view){
			this.view = view;
			this.el = view.ele;
			this.render();
		},
		render: function() {
			var me = this;
			require(['dxy-plugins/replacedview/drug/mobile.view', 'MarkModel'], function(v, m){
				var mark = new m.MarkModel({obj_id: me.view.data.obj_id, type: me.view.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						return;
					}
					var t = _.template(v);
					me.el.innerHTML = t({
					  	drug_name : res.data.items[0].name_cn+'('+res.data.items[0].name_common+')',
					  	is_medicare : res.data.items[0].is_medicare,
					  	drug_company : res.data.items[0].company
					});
					me.trigger('render');
				}, function(res){

				});
			});
		  	return this;
		}
	});
	window.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
			var ele = this.createWrapNode(true),
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
			require(['MarkModel'], function(m){
				var mark = new m.MarkModel({obj_id: me.data.obj_id, type: me.data.type_id});
				mark.fetch().then(function(res){
					if(res.error){
						alert(res.error.message);
						dtd.reject();
						return;
					}
					var tpl = '';
					for(var prop in res.data.items[0]){
						tpl += (res.data.items[0][prop]+'<br>');
					}
					ele.innerHTML = tpl;
					me.ele = ele;
					dtd.resolve();
				}, function(res){
					dtd.reject();
					alert('网络错误');
				});
			});			
			return dtd;
		},
		onModalShow : function(){
			$('#drug-id').val(this.data.drug_id||'');
			$('#J-drug-info').val(this.data.drug_name||'');
			$('#J-drug-not-find').hide();
			this.modal.find('#drug-id').keyup();
		},
		onModalConfirm : function(){
			var me = this,
				dtd = $.Deferred();
			if(this.verifyDrugId()){
				require(['MarkModel'], function(m){
					var mark = new m.MarkModel({obj_id: me.modal.find('#drug-id').val(), type: 1});
					mark.save({},{data : mark.attributes}).then(function(res){
						if(res.error){
							alert(res.error.message);
							dtd.reject();
							return;
						}
						me.data.obj_id = me.modal.find('#drug-id').val();
						me.data.type_id = 1;
						dtd.resolve();
					}, function(res){
						alert('网络错误');
					});
				});
				return dtd;
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
			return /\d+/.test(val);
		},
		modalInit : function(){
			// var me = this;
			// me.modal.find('#drug-id').on('keyup', function(){
			// 	if(me.verifyDrugId()){	
			// 		me.modal.find('#J-drug-info').text('检索数据中...');
			// 		me.fetchDrugData().then(function(res){
			// 			if(res.type===0){
			// 				me.modal.find('#J-drug-info').text('该药品 ID 不存在，请查验');
			// 			}else{
			// 				me.modal.find('#J-drug-info').text(res.name);
			// 				me.drugData = res;
			// 			}
			// 		}, function(){
			// 			alert('网络错误');
			// 		});
			// 	}else{
			// 		me.modal.find('#J-drug-info').text('请输入5位药品数字ID');
			// 	}
			// });
		}
	});
})();