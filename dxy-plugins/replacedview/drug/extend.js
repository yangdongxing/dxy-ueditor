(function(g){
	g.DrugReplacedView = ReplacedView.register('drug', {
		toWechatView : function(){
			return this.toEditorView();
		},
		toWebView : function(){
			throw new Error('you should provide toWebView in the config');
		},
		toAppView : function(){
			throw new Error('you should provide toAppView in the config');
		},
		toEditorView : function(callback){
			var ele = this.createWrapNode();
			ele.style.display = 'block';
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