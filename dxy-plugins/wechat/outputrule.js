(function(){
	UE.plugin.register('wechatoutputrule', function(){
		var me = this;
		if(!me.addWechatOutputRule){
			me.wechatoutputrules = [];
			me.addWechatOutputRule = function(rule){
				me.wechatoutputrules.push(rule);
			};
		}
		me.addWechatOutputRule(function(root){
			root.traversal(function(node){
				if(node.tagName === 'p'){
					node.setStyle('font-size', '14px');
					node.setStyle('margin-bottom', '15px');
					node.setStyle('line-height', '1.8');
					node.setStyle('margin-top', '5px');
				}
			});
		});
		me.addWechatOutputRule(function(root){
			root.traversal(function(node){
				if(node.tagName === 'h1'){
					node.tagName = 'p';
					node.setStyle('font-size', '28px');
					node.setStyle('font-weight', 'bold');
					node.setStyle('border-bottom', '1px solid #e2e2e2');
					node.setStyle('margin-bottom', '25px');
					node.setStyle('line-height', '1.8');
				}else if(node.tagName === 'h2'){
					node.tagName = 'p';
					node.setStyle('font-size', '21px');
					node.setStyle('font-weight', 'bold');
					node.setStyle('border-bottom', '1px solid #e2e2e2');
					node.setStyle('margin-bottom', '25px');
					node.setStyle('line-height', '1.8');
				}else if(node.tagName === 'h3'){
					node.tagName = 'p';
					node.setStyle('font-size', '1.17em');
					node.setStyle('font-weight', 'bold');
					node.setStyle('border-bottom', '1px solid #e2e2e2');
					node.setStyle('margin-bottom', '17px');
					node.setStyle('line-height', '1.8');
				}
			});
		});
	});
})();