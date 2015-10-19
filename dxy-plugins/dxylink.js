/**
 * dxylink
 *
 * 可配置参数:
 * dxylink_default_top : 链接编辑弹出框y轴偏移量
 * dxylink_default_left: 链接编辑弹出框
 * dxylink_title : toolbar button 提示
 * dxylink_default_link_url : 链接编辑器默认链接
 * dxylink_default_link_text : 链接编辑器默认文本
 */
(function(){
	var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils; 
    var LinkEditorBox = (function(){
    	var currentLink = null,
    		editor,
    		elements,
    		url, text, unlink, bookmark;
    	return {
    		show : function(link){
    			currentLink = link;
    			var pos = domUtils.getXY(currentLink);
    			elements.style.top = pos.y + currentLink.scrollTop + (editor.getOpt('dxylink_default_top')||20) + 'px';
    			elements.style.left = pos.x + currentLink.scrollLeft + (editor.getOpt('dxylink_default_left')||0)+'px';
    			elements.style.display = 'block';
    			url.value = currentLink.href;
    			text.value = currentLink.textContent || currentLink.innerText;
    		},
    		hide : function(){
    			if(elements){
    				elements.style.display = 'none';
    			}
    		},
    		init : function(ed, link){
    			editor = ed;
    			currentLink = link;
    			var template = '<div class="dxy-linkedit-box" style="display:none;position:absolute;">'+
    							'<p><label>文本：</label><input type="text" class="dxy-linkedit-text"><span class="dxy-linkedit-unlink"></span></p>'+
    							'<p><label>链接地址：</label><input type="text" class="dxy-linkedit-url"></p>'+
    					   	   '</div>';
    			elements = baidu.editor.ui.uiUtils.createElementByHtml(template);
    			editor.document.body.appendChild(elements);
    			url = editor.document.getElementsByClassName('dxy-linkedit-url')[0];
    			text = editor.document.getElementsByClassName('dxy-linkedit-text')[0];
    			unlink = editor.document.getElementsByClassName('dxy-linkedit-unlink')[0];
    			domUtils.setStyles(elements, {
    				'background' : '#fff',
    				'box-shadow' : '0 1px 4px rgba(0, 0, 0, 0.4)',
    				'border-radius' : '2px',
    				'padding' : '5px'
    			});
    			utils.each(elements.getElementsByTagName('p'), function(ele){
    				domUtils.setStyles(ele, {
	    				'margin' : '0px',
	    				'margin-button': '5px'
	    			});
    			});
    			domUtils.setStyles(unlink, {
    				'display' : 'inline-block',
    				'width' : '20px',
    				'height' : '20px',
    				'background-image' : 'url(http://assets.dxycdn.com/app/dxydoctor/admin/js/lib/dxy-ueditor/themes/default/images2/icons@2x.png)',
    				'background-size' : '1250px 800px',
    				'background-position' : '-415px -8px',
    				'margin-left': '10px'
    			});
    			domUtils.on(url, 'keyup', function(){
    				currentLink.href = url.value;
    			});
    			domUtils.on(text, 'keyup', function(){
    				currentLink.innerHTML = text.value;
    			});
    			domUtils.on(unlink, 'click', function(){
    				editor.selection.getRange().setStart(currentLink,0);
    				editor.selection.getRange().setEnd(currentLink).select();
    				editor.execCommand('dxylinkremove');
    			});
    			this.show(link);
    		},
    		destory : function(){
    			if(elements){
    				domUtils.remove(elements);
    				elements = null;
    			}
    		}
    	};
    })();

	baidu.editor.ui.dxylink = function(editor){
		var btn = new UE.ui.Button({
            name: 'link',
            title: editor.getOpt('dxylink_title') || '插入链接',
        });

	    
        var popup = new baidu.editor.ui.Popup({
                        content: 'hehe',
                        editor: editor ,
                        className:'edui-wordpastepop'
                    });
        btn.addListener('click', function(){
        	editor.execCommand('dxylinkInsert');
        });
        editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
	        var state = editor.queryCommandState('dxylinkInsert'),
	        	range = editor.selection.getRange(),
		        link = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true);
	        if (state == -1) {
	            btn.setDisabled(true);
	            btn.setChecked(false);
	            LinkEditorBox.destory();
	            LinkEditorBox.init(editor,link);
	        } else {
	            if (!uiReady) {
	                btn.setDisabled(false);
	                btn.setChecked(state);
	                link = domUtils.findParent(range.getCommonAncestor(), function(node){
	                	if(node.nodeType === 1 && node.getAttribute('class') === 'dxy-linkedit-box'){
	                		return true;
	                	}else{
	                		return false;
	                	}
	                }, true);
	                if(!link){
	                	LinkEditorBox.destory();
	                }
	            }
	        }
	    });
        return btn;
	};

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
	                    		'href' : me.getOpt('dxylink_default_link_url') || '',
	                    		'class' : 'dxylink',
	                    		'style' : 'text-decoration:none'
	                    	});
	                   		link.appendChild(document.createTextNode(me.getOpt('dxylink_default_link_text')||'Link Text'));
	                   		range.insertNode(link).selectNode(link);
	                    }else{
	                    	text = me.selection.getText();
	                    	link = domUtils.createElement(document, 'a', {
	                    		'href' : me.getOpt('dxylink_default_link_url') || '',
	                    		'class' : 'dxylink',
	                    		'style' : 'text-decoration:none'
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
