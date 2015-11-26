(function(g){
	g.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
			return this.toEditorView();
		},
		toWebView : function(){
			var ele = this.createWrapNode(),
				me = this;
			ele.style.display = 'block';
			var tpl = '<span>'+this.data.drug_name+'</span>';
			ele.innerHTML = tpl;
			this.ele = ele;
			return ele;
		},
		toAppView : function(){
			throw new Error('you must provide toAppView in the config');
		},
		toEditorView : function(callback){
			var ele = this.createWrapNode(),
				me = this;
			ele.style.display = 'block';
			ele.ondblclick = function(){
				UE.getEditor('editor-box').execCommand('replacedview', me.type);
			};
			ele.setAttribute('contenteditable', 'false');
			var tpl = '<span>'+this.data.drug_name+'</span>';
			ele.innerHTML = tpl;
			this.ele = ele;
			return ele;
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
})(this);