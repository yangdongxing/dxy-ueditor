(function(){
	window.AnnotationReplacedView = ReplacedView.register('annotation', {
		toWechatView : function(){
		},
		toWebView : function(){
			return this.toAppView();
		},
		toAppView : function(){
			var dtd = $.Deferred();
			return dtd;
		},
		toEditorView : function(callback){
			var ele = this.createWrapNode(),
				me = this,
				dtd = $.Deferred();
			return dtd;
		},
		onModalShow : function(){
		},
		onModalConfirm : function(){
			var me = this,
				dtd = $.Deferred();
			return true;
		},
	});
})();