(function(){
	UE.plugin.register('keyboardmonitor', function(){
		var me = this;
		var domUtils = baidu.editor.dom.domUtils;
		function findRootParentNotBody(ele){
			ele = $(ele);
			var cur = ele.parent(),
				prev = ele;
			while(cur && cur[0] && cur[0].tagName!=='BODY'){
				prev = cur;
				cur = cur.parent();
			}
			return prev;
		}
		me.addListener('keydown', function (type, e) {
			var range = me.selection.getRange(),
                    cur = range.getCommonAncestor(true),
                    target = domUtils.findParent(cur, function(node){
                    	if(node.className && (node.className.indexOf('dxy-meta-replaced-view')!==-1 || node.className.indexOf('dxy-custom-view')!==-1)){
                    		return true;
                    	}else{
                    		return false;
                    	}
                    }, true);
            if(target){
            	if($(target).css('display') === 'inline'){
            		return;
            	}
            	e.preventDefault();
	            return false;
            }
			if(e.keyCode === 46 || e.keyCode === 8){
				if(range.startOffset===0){
					target = $(findRootParentNotBody(cur)).prev();
					if(target && target.length>0 && target.attr('class') &&  (target.attr('class').indexOf('dxy-meta-replaced-view')!==-1||target.attr('class').indexOf('dxy-custom-view')!==-1)){
						target.remove();
						e.preventDefault();
	                	return false;
					}
				}
			}
		});
	});
})();