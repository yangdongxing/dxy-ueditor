(function(){
	UE.plugin.register('outputrule', function(){
		var me = this;
		me.addOutputRule(function(root){
			root.traversal(function(node){
				//bugfix: 临时修复出乎意料出现的span样式
				if(node.tagName === 'span' && node.getStyle('font-family')){
					node.setStyle('font-family', '');
				}
				//bugfix : 临时修复未关闭链接框，导致保存链接框
				if(node.tagName === 'div' && node.getAttr('class')==='dxy-linkedit-box'){
					node.parentNode.removeChild(node, false);
				}
			});
		});
	});
})();