(function(g){
	g.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
			return this.toEditorView();
		},
		toWebView : function(){
			throw new Error('you must provide toWebView in the config');
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
			$('#drug-name').val(this.data.drug_name||'');
		},
		onModalConfirm : function(){
			var drug_name = $('#drug-name').val();
			if(!drug_name){
				alert('药品名不能为空');
				return false;
			}
			this.data.drug_name = $('#drug-name').val();
			return true
		}
	});
})(this);