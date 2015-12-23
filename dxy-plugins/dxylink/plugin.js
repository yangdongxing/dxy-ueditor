//link 插件
(function(){
	var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils; 
	UE.plugin.register('dxylink', function (){
		var me = this,
			canInsert = false;

		return {
	        bindEvents:{
	        },
	        commands: {
	            'dxylinkinsert': {
	                queryCommandState: function () {
	                    var range = me.selection.getRange(),
		            		link = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true);
		            	if(link){
		            		canInsert = false;
		            		return -1;
		            	}else{
		            		canInsert = true;
		            		return 0;
		            	}
	                },
	                execCommand : function(cmd, opt){
	                    var range = me.selection.getRange(),
	                    	link,
	                    	text;
	                    range.select();
	                    if(range.startContainer===range.endContainer && range.startOffset===range.endOffset){
	                    	link = domUtils.createElement(document, 'a', {
	                    		'href' : me.getOpt('dxylink_default_link_url') || 'http://dxy.com/column/',
	                    		'_href' : me.getOpt('dxylink_default_link_url') || 'http://dxy.com/column/',
	                    		'class' : 'dxylink',
	                    		'style' : 'text-decoration:none'
	                    	});
	                   		link.appendChild(document.createTextNode(me.getOpt('dxylink_default_link_text')||'Link Text'));
	                   		range.insertNode(link).selectNode(link);
	                    }else{
	                    	text = me.selection.getText();
	                    	link = domUtils.createElement(document, 'a', {
	                    		'href' : me.getOpt('dxylink_default_link_url') || 'http://dxy.com/column/',
	                    		'_href' : me.getOpt('dxylink_default_link_url') || 'http://dxy.com/column/',
	                    		'class' : 'dxylink',
	                    		'style' : 'text-decoration:none',
	                    		'target' : '_black'
	                    	});
	                    	link.appendChild(document.createTextNode(text));
	                    	range.deleteContents().collapse().insertNode(link).selectNode(link);
	                    }
	                    range.select();
	                    me.fireEvent('selectionchange');
	                }
	            },
	            'dxylinkremove' : {
	            	queryCommandState: function () {
	                    return this.queryCommandValue('link') ?  0 : -1;
	                },
	                execCommand : function(cmd, opt){
	                    var range = this.selection.getRange(),
			                bookmark;
			            if(range.collapsed && !domUtils.findParentByTagName( range.startContainer, 'a', true )){
			                return;
			            }
			            bookmark = range.createBookmark();
			            optimize( range );
			            range.removeInlineStyle( 'a' ).moveToBookmark( bookmark ).select();
	                }
	            }
	        },
	        queryCommandValue : function() {
	            var range = this.selection.getRange(),
	                node;
	            if ( range.collapsed ) {
	                node = range.startContainer;
	                node = node.nodeType == 1 ? node : node.parentNode;

	                if ( node && (node = domUtils.findParentByTagName( node, 'a', true )) && ! domUtils.isInNodeEndBoundary(range,node)) {

	                    return node;
	                }
	            } else {
	                range.shrinkBoundary();
	                var start = range.startContainer.nodeType  === 3 || !range.startContainer.childNodes[range.startOffset] ? range.startContainer : range.startContainer.childNodes[range.startOffset],
	                    end =  range.endContainer.nodeType === 3 || range.endOffset === 0 ? range.endContainer : range.endContainer.childNodes[range.endOffset-1],
	                    common = range.getCommonAncestor();
	                node = domUtils.findParentByTagName( common, 'a', true );
	                if ( !node && common.nodeType == 1){

	                    var as = common.getElementsByTagName( 'a' ),
	                        ps,pe,
	                        i=0,ci=as[i++];

	                    for ( ;ci!==undefined; i++ ) {
	                        ps = domUtils.getPosition( ci, start );
	                        pe = domUtils.getPosition( ci,end);
	                        if ( (ps & domUtils.POSITION_FOLLOWING || ps & domUtils.POSITION_CONTAINS) &&
	                            (pe & domUtils.POSITION_PRECEDING || pe & domUtils.POSITION_CONTAINS)) {
	                            node = ci;
	                            break;
	                        }
	                    }
	                }
	                return node;
	            }
	        }

    	};
	});
	function optimize( range ) {
        var start = range.startContainer,end = range.endContainer;
        start = domUtils.findParentByTagName( start, 'a', true );
        if ( start ) {
            range.setStartBefore( start );
        }
        end = domUtils.findParentByTagName( end, 'a', true );
        if ( end ) {
            range.setEndAfter( end );
        }
    }
})();