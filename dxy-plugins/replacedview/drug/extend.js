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