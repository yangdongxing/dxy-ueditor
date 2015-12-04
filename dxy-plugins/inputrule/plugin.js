(function(){
	UE.plugin.register('inputrule', function(){
		var me = this;
		me.addInputRule(function(root){
			root.traversal(function(node){
				if(node.getAttr('data-align')==='div-center' || node.getAttr('data-align')==='center'){ 
					node.setStyle('text-align', 'center');
				}
				if(node.getAttr('data-align')==='div-right' || node.getAttr('data-align')==='right'){
					node.setStyle('text-align', 'right');
				}
				if(node.tagName === 'span' && node.getStyle('font-family')){
					node.setStyle('font-family', '');
				}
			});
		});
	});
})();