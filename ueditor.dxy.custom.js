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
				url.innerHTML = currentLink.href;
				text.innerHTML = currentLink.textContent || currentLink.innerText;
			},
			hide : function(){
				if(elements){
					elements.style.display = 'none';
				}
			},
			init : function(ed, link){
				var me = this;
				editor = ed;
				currentLink = link;
				var template = '<div class="dxy-linkedit-box" style="display:none;position:absolute;" contenteditable="false">'+
								'<p><label>文本：</label><span class="dxy-linkedit-text" contenteditable="true" style="border:1px solid #000;min-width:190px;display:inline-block;"></span><span class="dxy-linkedit-unlink"></span></p>'+
								'<p><label>链接地址：</label><span style="border:1px solid #000;padding:0px;display:inline-block;min-width:190px" class="dxy-linkedit-url" contenteditable="true"></span></p>'+
							   '</div>';
				elements = baidu.editor.ui.uiUtils.createElementByHtml(template);
				$(editor.document.body).prepend(elements);
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
						'margin' : '0px 0px 5px 0px'
					});
				});
				domUtils.setStyles(unlink, {
					'display' : 'inline-block',
					'width' : '20px',
					'height' : '20px',
					'background-image' : 'url(http://assets.dxycdn.com/app/dxydoctor/admin/js/lib/ueditor/themes/default/images2/icons@2x.png)',
					'background-size' : '1250px 800px',
					'background-position' : '-415px -8px',
					'margin-left': '10px',
					'float' : 'right'
				});
				domUtils.on(url, 'keyup', function(e){
					currentLink.href = url.innerHTML;
					currentLink.setAttribute('_href', url.innerHTML);
				});
				domUtils.on(url, 'keydown', function(e){
					var range = editor.selection.getRange();
					if(e.keyCode===13){
						LinkEditorBox.destory();
						return;
					}else if(e.keyCode===8){
						if(range.startOffset==range.endOffset && range.startOffset===0){
							if(e.preventDefault){
								 e.preventDefault();
							}else{
								window.event.returnValue = false;
							}
							return false;
						}
					}
				});
				domUtils.on(url, 'change', function(){
					currentLink.href = url.innerHTML;
					currentLink.setAttribute('_href', url.innerHTML);
				});
				domUtils.on(text, 'keyup', function(e){
					currentLink.innerHTML = text.innerHTML;
				});
				domUtils.on(text, 'keydown', function(e){
					var range = editor.selection.getRange();
					if(e.keyCode===13){
						LinkEditorBox.destory();
						return;
					}else if(e.keyCode===8){
						if(range.startOffset==range.endOffset && range.startOffset===0){
							if(e.preventDefault){
								 e.preventDefault();
							}else{
								window.event.returnValue = false;
							}
							return false;
						}
					}                });
				domUtils.on(unlink, 'click', function(){
					editor.selection.getRange().selectNodeContents(currentLink).select();
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
		editor.addListener('blur', function(){
			LinkEditorBox.destory();
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

})();
/**
 * 提供dxyupload指令， 参数[File, File...] || input.files
 * 可配置参数:
 * imageUploadRequestUrl : 图片上传地址
 * imageAllowFiles : 允许上传的文件的后缀列表
 * imageUploadPrefix : 图片地址前缀
 */
(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('dxyupload', function (){
        var me = this,
            isLoaded = false,
            containerBtn;
        function initUploadBtn(){
            var w = containerBtn.offsetWidth || 20,
                h = containerBtn.offsetHeight || 20,
                btnIframe = document.createElement('iframe'),
                btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';

            domUtils.on(btnIframe, 'load', function(){

                var timestrap = (+new Date()).toString(36),
                    wrapper,
                    btnIframeDoc,
                    btnIframeBody;

                btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
                btnIframeBody = btnIframeDoc.body;
                wrapper = btnIframeDoc.createElement('div');

                wrapper.innerHTML = '<form id="edui_form_' + timestrap + '" target="edui_iframe_' + timestrap + '" method="POST" enctype="multipart/form-data" action="' + me.getOpt('imageUploadRequestUrl')+ '" ' +
                'style="' + btnStyle + '">' +
                '<input id="edui_input_' + timestrap + '" type="file"  multiple="multiple" accept="image/*" name="' + 'attachment' + '" ' +
                'style="' + btnStyle + '">' +
                '</form>' +
                '<iframe id="edui_iframe_' + timestrap + '" name="edui_iframe_' + timestrap + '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>';

                wrapper.className = 'edui-' + me.options.theme;
                wrapper.id = me.ui.id + '_iframeupload';
                btnIframeBody.style.cssText = btnStyle;
                btnIframeBody.style.width = w + 'px';
                btnIframeBody.style.height = h + 'px';
                btnIframeBody.appendChild(wrapper);

                if (btnIframeBody.parentNode) {
                    btnIframeBody.parentNode.style.width = w + 'px';
                    btnIframeBody.parentNode.style.height = w + 'px';
                }

                var form = btnIframeDoc.getElementById('edui_form_' + timestrap);
                var input = btnIframeDoc.getElementById('edui_input_' + timestrap);
                var iframe = btnIframeDoc.getElementById('edui_iframe_' + timestrap);

                domUtils.on(input, 'change', function(){
                    var i,len, loadingId, loadingIds = [], params, filename, fileext,
                        allowFiles = me.getOpt('imageAllowFiles');
                    if(!input.value) return;
                    me.focus();
                    for(i=0,len=input.files.length;i<len;i++){
                        filename = input.files[i].name;
                        fileext = filename ? filename.substr(filename.lastIndexOf('.')):'';
                        if (!fileext || (allowFiles && (allowFiles.join('') + '.').indexOf(fileext.toLowerCase() + '.') == -1)) {
                            showErrorLoader(me.getLang('simpleupload.exceedTypeError'));
                            return;
                        }
                        loadingId = 'loading_' + (+new Date()).toString(36);
                        params = utils.serializeParam(me.queryCommandValue('serverparam')) || '';
                        loadingIds.push(loadingId);
                        me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('simpleupload.loading') || '') + '" >');
                    }                

                    function callback(){
                        try{
                            var link, json, loader, i, len, 
                                body = (iframe.contentDocument || iframe.contentWindow.document).body,
                                result = body.innerText || body.textContent || '';
                            json = JSON.parse(result);
                            try{
                                for(i=0,len=json.data.items.length; i<len; i++){
                                    link = me.getOpt('imageUploadPrefix')+json.data.items[i].path;
                                    loader = me.document.getElementById(loadingIds.shift());
                                    loader.setAttribute('src', link);
                                    loader.setAttribute('_src', link);
                                    loader.setAttribute('title', json.data.items[i].original_name || '');
                                    loader.setAttribute('alt', json.data.items[i].original_name || '');
                                    loader.removeAttribute('id');
                                    domUtils.removeClasses(loader, 'loadingclass');
                                }
                            }catch(e){
                                if(showErrorLoader){
                                    showErrorLoader(json);
                                }
                            }
                        }catch(er){
                            if(showErrorLoader){
                                showErrorLoader(me.getLang('simpleupload.loadError'));
                            }
                        }
                        form.reset();
                        domUtils.un(iframe, 'load', callback);
                    }
                    function showErrorLoader(title){
                        if(loadingId) {
                            var loader = me.document.getElementById(loadingId);
                            if(loader){
                                domUtils.remove(loader);
                            }
                            me.fireEvent('showmessage', {
                                'id': loadingId,
                                'content': title,
                                'type': 'error',
                                'timeout': 4000
                            });
                        }
                    }
                    domUtils.on(iframe, 'load', callback);
                    form.submit();
                });

                var stateTimer;
                me.addListener('selectionchange', function () {
                    clearTimeout(stateTimer);
                    stateTimer = setTimeout(function() {
                        var state = me.queryCommandState('dxyupload');
                        if (state == -1) {
                            input.disabled = 'disabled';
                        } else {
                            input.disabled = false;
                        }
                    }, 400);
                });
                isLoaded = true;
            });

            btnIframe.style.cssText = btnStyle;
            containerBtn.appendChild(btnIframe);
        }

        function uploadFiles(files, requestOne){
            function checkFileType(type){
                var allowFiles = me.getOpt('imageAllowFiles');
                if(allowFiles){
                    return allowFiles.join('').indexOf(type.toLowerCase()) !== -1;
                }else{
                    return true;
                }
            }
            function uploadFile(file, requestOne){
                function success(e){
                    var res = JSON.parse(e.currentTarget.responseText),
                        files = res.data.items,
                        file,
                        i,
                        len = files.length,
                        link,
                        loader,
                        loadingId;
                    for(i=0;i<len;i++){
                        try{
                            loadingId = loadingIds.shift();
                            file = files[i];
                            link = me.getOpt('imageUploadPrefix')+file.path;
                            loader = me.document.getElementById(loadingId);
                            loader.setAttribute('src', link);
                            loader.setAttribute('_src', link);
                            loader.setAttribute('title', file.original_name || '');
                            loader.setAttribute('alt', file.original_name || '');
                            loader.removeAttribute('id');
                            domUtils.removeClasses(loader, 'loadingclass');
                        }catch(err){
                            if(loadingId) {
                                var loader = me.document.getElementById(loadingId);
                                if(loader){
                                    domUtils.remove(loader);
                                }
                                me.fireEvent('showmessage', {
                                    'id': loadingId,
                                    'content': '图片上传出错了',
                                    'type': 'error',
                                    'timeout': 4000
                                });
                            }
                        }
                    }
                    me.focus();
                }
                function error(e){
                    me.fireEvent('showmessage', {
                                    'content': '图片上传出错了',
                                    'type': 'error',
                                    'timeout': 4000
                                });
                }

                var type = '.'+file.type.slice(file.type.indexOf('/')+1),
                    filename = file.name,
                    loadingId = 'loading_' + (+new Date()).toString(36),
                    i;
                var domUtils = baidu.editor.dom.domUtils;
                var utils = baidu.editor.utils;
                var editorui = baidu.editor.ui;
                var _Dialog = editorui.Dialog;

                loadingIds.push(loadingId);
                if(!checkFileType(type)){ 
                     me.fireEvent('showmessage', {
                                    'content': '您拖的不是图片',
                                    'type': 'error',
                                    'timeout': 4000
                                }); 
                    return false; 
                }

                me.focus();
                me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('simpleupload.loading') || '') + '" >');

                if(requestOne){
                    if(_count===(filesCount-1)){
                        formData.append('attachment', file);
                        send(formData, success, error);  
                    }else{
                        formData.append('attachment', file);
                        _count++;
                    }
                }else{
                    formData = new FormData();
                    formData.append('attachment', file);
                    send(formData, success, error);
                }
            }
            function send(formData, success, error){
                var xhr = new XMLHttpRequest(); 
                xhr.open("post", me.getOpt('imageUploadRequestUrl'), true); 
                xhr.onload = success;
                xhr.onerror = error;
                xhr.send(formData);
            }
            var i, filesCount=files.length, _count=0, loadingIds=[],
                formData = new FormData();
            for(i=0;i<filesCount;i++){
                uploadFile(files[i], requestOne);
            }
        }

        function initDrag(){
            $(me.window.document).on({ 
                dragleave:function(e){  
                    e.preventDefault(); 
                }, 
                drop:function(e){ 
                    e.preventDefault(); 
                }, 
                dragenter:function(e){ 
                    e.preventDefault(); 
                }, 
                dragover:function(e){ 
                    e.preventDefault(); 
                } 
            }); 
            me.ready(function(){
                me.body.addEventListener('drop', function(e){
                    e.preventDefault();
                    uploadFiles(e.dataTransfer.files, true);
                });
            });
        }

        return {
            bindEvents:{
                'ready': function() {
                    //设置loading的样式
                    utils.cssRule('loading',
                        '.loadingclass{display:inline-block;cursor:default;background: url(\''+
                        this.options.themePath + 
                        this.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n' +
                        '.loaderrorclass{display:inline-block;cursor:default;background: url(\'' + 
                        this.options.themePath +
                        this.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
                        '}',
                        this.document);
                },
                /* 初始化简单上传按钮 */
                'dxyuploadbtnready': function(type, container) {
                    containerBtn = container;
                    initUploadBtn();
                    initDrag();
                }
            },
            outputRule: function(root){
                utils.each(root.getNodesByTagName('img'),function(n){
                    if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                        n.parentNode.removeChild(n);
                    }
                });
            },
            commands: {
                'dxyupload': {
                    queryCommandState: function () {
                        return isLoaded ? 0:-1;
                    },
                    execCommand : function(cmd, opt){
                        var files = opt.files,
                            requestOne = opt.requestOne || true;
                        if(!files || !files.length || files.length===0){
                            return;
                        }
                        uploadFiles(files, requestOne);
                    }
                }
            }
        };
    });

})();

(function(){
	var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
	editorui.dxyupload = function (editor) {
	    var name = 'simpleupload',
	        ui = new UE.ui.Button({
	            className:'edui-for-' + name,
	            title: '图片上传',
	            theme:editor.options.theme,
	            showText:false
	        });
	    editorui.buttons.dxyupload = ui;
	    editor.addListener('ready', function() {
	        var b = ui.getDom('body'),
	            iconSpan = b.children[0];
	        editor.fireEvent('dxyuploadbtnready', iconSpan);
	    });
	    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
	        var state = editor.queryCommandState('dxyupload');
	        if (state == -1) {
	            ui.setDisabled(true);
	            ui.setChecked(false);
	        } else {
	            if (!uiReady) {
	                ui.setDisabled(false);
	                ui.setChecked(state);
	            }
	        }
	    });
	    return ui; 
	};

})();
UE.plugin.register('editorstyle', function(){
var editor = this;
var styles = 'body{line-height: 1.7;font-size: 14px;color: #333;font-family: "Avenir", "Hiragino Sans GB", "Noto Sans S Chinese", "Microsoft Yahei", "Microsoft Sans Serif", "WenQuanYi Micro Hei", "sans-serif";padding: 20px;}'+
'img{max-width: 100%;}'+
'h4, h5, h6, hr, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td{'+
'	margin: 0px;'+
'	padding: 0px;'+
'}'+
'table{'+
'    width: 100%;'+
'    table-layout: fixed;'+
'    border-collapse: collapse;'+
'    border-spacing: 0;'+
'    margin: 15px 0;'+
'}'+
'th, td{'+
'    height: 30px;'+
'    border: 1px solid #ccc;'+
'    vertical-align: top;'+
'    padding: 2px 4px;'+
'    text-align: left;'+
'    box-sizing: border-box;'+
'}'+
'a{'+
'    color: #7c68b4;'+
'    text-decoration: none;'+
'}'+
'hr {display: block; height: 0; border: 0; border-top: 1px solid #ccc; margin: 15px 0; padding: 0; }'+
'blockquote{'+
'    border-left: 6px solid #ddd;'+
'    padding: 5px 0 5px 10px;'+
'    margin: 15px 0 15px 15px;'+
'}'+
'blockquote p {'+
'	color: rgb(153, 153, 153);'+
'}'+
' '+
'h1{'+
'	font-size: 24px;'+
'	font-weight: bolder;'+
'	margin-bottom: 25px;'+
'	line-height: 1.7;'+
'	margin-top: 0px;'+
'	padding: 1% 0;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'h2{'+
'    padding: 1% 0;'+
'    color: #333;'+
'    font-size: 18px;'+
'    font-weight: bolder;'+
'    border-bottom: 1px solid #e2e2e2;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    line-height: 1.7;'+
'    word-wrap: break-word;'+
'}'+
'h3{'+
'    font-size: 16px;'+
'    font-weight: bolder;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    padding: 1% 0;'+
'    line-height: 1.7;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'ul, ol{'+
'	list-style: disc outside none;'+
'	margin: 15px 0 !important;'+
'	padding: 0 0 0 40px;'+
'	line-height: 1.7;'+
'	font-size: 14px;'+
'}'+
'p{'+
'	margin-top: 0px;'+
'	font-size:14px;'+
'	margin-bottom:15px;'+
'	line-height:1.7;'+
'	color: #444;'+
'	word-wrap: break-word;'+
'}'+
'li p{'+
'	margin-bottom: 0px;'+
'}'+
'.dxy-meta-replaced-view{'+
'    border: 1px solid #ddd;'+
'    padding: 20px;'+
'    cursor: pointer;'+
'}'+
'.editor-vote-container p span{'+
'    padding: 3px 6px;'+
'    background: #c5c5c5;'+
'    color: #fff;'+
'    border-radius: 10px;'+
'}'+
'.editor-vote-wraper img{'+
'    width: 50px!important;'+
'    height: 50px!important;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles, true);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles, true);
		});
	}
});
(function(){
	baidu.editor.ui.bubbletalk = function (editor) {
		var name = 'bubbletalk',
			title = '插入气泡对话';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	        editor.execCommand('editview', name);
	    });
	        
	    return btn;
	};
})();
(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('editview', function (){
        var me = this;
        return {
            bindEvents:{
                'ready': function(){

                }
            },
            commands: {
                'editview': {
                    execCommand : function(cmd, opt){
                    	var type = opt, view;
                    	if(!type){
                    		throw new Error('exec editview command require 2 arguments');
                    	}
                        if(!EditView.custom[type]){
                            throw new Error(type+' not support');
                        }
                    	var range = me.selection.getRange(),
                    		cur = range.getCommonAncestor(true),
                    		ele = domUtils.findParent(cur, function(node){
                                if(EditView.isEditView(node) || (EditView.custom[type] && EditView.custom[type].isEditView && EditView.custom[type].isEditView(node))){
                                    return true;
                                }else{
                                    return false;
                                }
                    		}, true);
                    	if(ele){
                    		view = EditView.getInstance(ele);
                    		if(view.type == type){
                    			view.showModal();
                    		}else{
                    			alert('请选择正确的类型');
                    			return;
                    		}
                    	}else{
                            if(EditView.custom[type] && EditView.custom[type].isEmptySupport){
                                view = new EditView.custom[type](ele, range);
                                if(view.type == type){
                                    view.showModal();
                                }else{
                                    alert('请选择正确的类型');
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        };
    });

})();

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
UE.plugin.register('dxymodal', function(){
var editor = this;
var modals = '<div class="modal fade" id="dxy-bubbletalk-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-bubbletalk-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入气泡对话</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <div contenteditable="true" style="width:100%;height:400px;border:1px solid #eee;overflow-y:scroll;" id="dxy-bubbletalk-content">'+
'          '+
'        </div>'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
'        <button class="btn btn-primary" type="button" id="confirm-bubbletalk">确认修改</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-image-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-image-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">图片详情</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <form>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">图片链接：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" id="modal-image-link" placeholder="请输入图片链接">'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">图片描述：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" id="modal-image-desc" placeholder="请输入图片描述" >'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">高：</label>'+
'            <div class="col-sm-3">'+
'              <input type="text" class="form-control" id="modal-image-height" readonly>'+
'            </div>'+
'            <label class="col-sm-3">宽：</label>'+
'            <div class="col-sm-3">'+
'              <input type="text" class="form-control" id="modal-image-width" readonly>'+
'            </div>'+
'          </div>'+
'        </form>'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
'        <button class="btn btn-primary" type="button" id="confirm-image">确认修改</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-annotation-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-annotation-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入注释卡</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button class="btn btn-primary" type="button" id="confirm-annotation">确定</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-drug-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-drug-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入药品</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <form>'+
'          <div class="form-group row">'+
'            <label class="control-label col-md-6"><a>如何获取药品ID></a></label>'+
'            <label class="control-label col-md-6"><a>查找药品ID></a></label>'+
'          </div>'+
'          <div class="input-group" style="margin-bottom:15px;">'+
'            <input type="text" class="form-control" id="drug-id" placeholder="请输入5位药品数字ID">'+
'            <div class="input-group-btn">'+
'             <button class="btn btn-default" type="button" id="confirm-drug">确认提交</button>'+
'            </div>'+
'          </div>'+
'          <div class="form-group">'+
'            <label class="control-label" id="J-drug-info"></label>'+
'          </div>'+
'          <div class="form-group">'+
'           <label class="control-label" id="J-drug-not-find" style="display:none;">该药品 ID 不存在，请查验</label>'+
'          </div>'+
'        </form>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-mark-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-mark-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入标记</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-vote-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-vote-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入投票卡</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button class="btn btn-primary" type="button" id="confirm-vote">确定</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>';
$(document).ready(function(){
	$('body').append($(modals));
});
});
(function () {
    baidu.editor.ui.onekeyreplace = function (editor) {
        var btn = new UE.ui.Button({
            name: 'onekeyreplace',
            title: '丁香园标准格式化功能',
        });
        btn.addListener('click', function(){
            exeCommandReplaceButton(editor);
        });
        return btn;
    };

    function exeCommandReplaceButton(editor) {
        var root = UE.htmlparser(editor.body.innerHTML),
            flag = false,
            dxyFlag = false;
        root.traversal(function(node){
            if(node.getAttr && node.getAttr('class') && node.getAttr('class')==='dxy-meta-replaced-view' ){ 
                var view = ReplacedView.getInstance(node.getAttr('data-type'));
                if(view){
                    view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
                    node.setStyle('display','none');
                    node.innerHTML(view.toMetaView().innerHTML);
                }
            }else{
                if(node.type==='text' && !flag){
                    if(node.data==='丁香园版权所有，未经许可不得转载。'){
                        dxyFlag = true;
                    }
                    if(node.data==='参考资料：' && dxyFlag){
                        flag = true;
                        return;
                    }
                    node.data = fomat(node.data);
                }
            }
        });
        editor.setContent(root.toHtml());
        alert('格式化完成');
    }

    function fomat(content){
        if(content.length>0){
            content = preg_replace("/(\\p{Han})([a-zA-Z0-9\\p{Ps}])(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([a-zA-Z0-9\\p{Pe}])(\\p{Han})(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([!?‽:;,.])(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(\\p{Han})(<[a-zA-Z]+?.*?>)/ig", "\\1 \\2", content);
            content = preg_replace("/(\p{Han})(<\/[a-zA-Z]+>)/ig", "\\1 \\2", content);
            content = preg_replace("/(<\/[a-zA-Z]+>)(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(%|％|‰|℃)(\\p{Han})/ig", "\\1 \\2", content);
            content = preg_replace("/(<[a-zA-Z]+?.*?>)(\\p{Han})/ig", "\\1\\2", content);
            content = preg_replace("/([0-9])(mmHg|mw|mm|g|μg|mg|kg|ml|min|h|cm)/ig", "\\1 \\2", content);
            content = preg_replace("/[ ]*([「」『』（）〈〉《》【】〔〕〖〗〘〙〚〛])[ ]*/ig", "\\1", content);
            content = preg_replace("/([a-zA-Z0-9\\p{Han}])([≤≥=])(?![^<]*>)/ig", "\\1 \\2", content);
            content = preg_replace("/([≤≥=])([a-zA-Z0-9\\p{Han}])(?![^<]*>)/ig", "\\1 \\2", content);
            //汉字英文和数字和大于等于，小于等于之间，加入空格（注：暂不处理 <> 由于这两个符号在 HTML 中会与标签重复，且闭合的 <> 被加入空格会造成问题）

            content = content.replace(/n(’|\&rsquo\;)t/ig, "n&rsq_temp;t");
            content = content.replace(/(’|\&rsquo\;)s/ig, "&rsq_temp;s");
            content = content.replace(/(’|\&rsquo\;)m/ig, "&rsq_temp;m");
            content = content.replace(/(’|\&rsquo\;)re/ig, "&rsq_temp;re");
            content = content.replace(/(’|\&rsquo\;)ve/ig, "&rsq_temp;ve");
            content = content.replace(/(’|\&rsquo\;)d/ig, "&rsq_temp;d");
            content = content.replace(/(’|\&rsquo\;)ll/ig, "&rsq_temp;ll");
            content = content.replace(/(“|\&ldquo\;)/ig, "「");
            content = content.replace(/(”|\&rdquo\;)/ig, "」");
            content = content.replace(/(‘|\&lsquo\;)/ig, "『");
            content = content.replace(/(’|\&rsquo\;)/ig, "』");
            content = content.replace(/&rsq_temp;/ig, "’");
            content = content.replace(/％/ig, '%');
            content = content.replace(/／/ig, '/');
            content = content.replace(/~/ig, '～');
            content = content.replace(/(\d+)([-+*\/]+)/ig, "$1 $2").replace(/([-+*\/]+)(\d+)/ig, "$1 $2");
        }
        return content;
    }


// preg_replace

        function preg_replace(pattern, pattern_replace, subject, limit) {
            if (limit === undefined) {
                limit = -1;
            }

            var _flag = pattern.substr(pattern.lastIndexOf(pattern[0]) + 1),
                    _pattern = pattern.substr(1, pattern.lastIndexOf(pattern[0]) - 1),
                    reg = new XRegExp(_pattern, _flag),
                    rs = null,
                    res = [],
                    x = 0,
                    y = 0,
                    ret = subject,
                    temp;

            if (limit === -1) {
                tmp = [];

                do {
                    tmp = reg.exec(subject);
                    if (tmp !== null) {
                        res.push(tmp);
                    }
                } while (tmp !== null && _flag.indexOf('g') !== -1);
            } else {
                res.push(reg.exec(subject));
            }

            for (x = res.length - 1; x > -1; x--) { //explore match
                tmp = pattern_replace;

                for (y = res[x].length - 1; y > -1; y--) {
                    tmp = tmp.replace('${' + y + '}', res[x][y])
                            .replace('$' + y, res[x][y])
                            .replace('\\' + y, res[x][y]);
                }
                ret = ret.replace(res[x][0], tmp);
            }
            return ret;
        }


})();

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
(function(){
	baidu.editor.ui.drug = function (editor) {
		var name = 'annotation',
			title = '插入注释卡';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	        editor.execCommand('replacedview', name);
	    });
	        
	    return btn;
	};
})();
(function(){
	baidu.editor.ui.drug = function (editor) {
		var name = 'drug',
			title = '插入药品卡';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	        editor.execCommand('replacedview', name);
	    });
	        
	    return btn;
	};
})();
(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('replacedview', function (){
        var me = this;
        function showModal(type, obj){
        	if(!obj){
        		obj = ReplacedView.getInstance(type);
        	}
        	if(!obj){
        		throw new Error('error type : '+type);
        	}
        	obj.showModal();
        }
        me.addOutputRule(function(root){
			root.traversal(function(node){
				if(node.getAttr && node.getAttr('class') && node.getAttr('class')==='dxy-meta-replaced-view' ){ 
					var view = ReplacedView.getInstance(node.getAttr('data-type'));
					if(view){
						view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
						node.setStyle('display','none');
						node.innerHTML(view.toMetaView().innerHTML);
					}
				}
			});
		});
        me.on('aftersetcontent', function(){
            $(me.body).find('.dxy-meta-replaced-view').each(function(i,e){
                var view = ReplacedView.getInstance(e);
                if(view){
                    view.toAppropriateView().then(function(){
                        view.mount(e);
                    });
                }
            });
        });
		function addWechatOutputRule(){
			me.addWechatOutputRule(function(root){
				root.traversal(function(node){
					if(node.getAttr('class')==='dxy-meta-replaced-view' ){ 
						var view = ReplacedView.getInstance(node.getAttr('data-type'));
						if(view){
							view.data = ReplacedView.deSerialize(node.getAttr('data-params'));
                            view.toWechatView();
                            if(!view.ele.innerHTML){
                                node.parentNode.removeChild(node);
                            }else{
                                node.innerHTML(view.ele.innerHTML);
                            }
						}
					}
				});
			}, 'afterStructEdit');
		}
		if(me.wechatready){
			addWechatOutputRule();
		}else{
			me.addListener('wechatready', function(){
				addWechatOutputRule();
			});
		}
        return {
            bindEvents:{
                'ready': function(){

                }
            },
            commands: {
                'replacedview': {
                    execCommand : function(cmd, opt){
                    	var type = opt;
                    	if(!type){
                    		throw new Error('exec replacedview command require 2 arguments');
                    	}
                    	var range = me.selection.getRange(),
                    		cur = range.getCommonAncestor(true),
                    		replacedview = domUtils.findParent(cur, function(node){
                    			return ReplacedView.isReplacedView(node);
                    		}, true);
                    	if(replacedview){
                    		var obj = ReplacedView.getInstance(replacedview);
                    		if(obj.type == type){
                    			showModal(type,obj);
                    		}else{
                    			alert('请选择正确的类型');
                    			return;
                    		}
                    	}else{
                    		showModal(type);
                    	}
                    }
                }
            }
        };
    });

})();

(function(){
	var MarkView = Backbone.View.extend({
		initialize : function(editor){
			this.render();
			this.editor = editor;
		},
		render : function(){
			var me = this,
				ctx = {marks : []},
				item;
			for(var prop in ReplacedView.custom){
				item = {};
				item.id = prop;
				switch(prop){
					case 'vote' : 
						item.name = '插入投票卡';
						break;
					case 'drug' :
						item.name = '插入药品卡';
						break;
					case 'annotation':
						item.name = '插入注释卡';
						break
					default:
						break;
				}
				ctx.marks.push(item);
			}
			require(['dxy-plugins/replacedview/mark.view'], function(tpl){
				me.$el.html(_.template(tpl)(ctx));
			});
		},
		events : {
			'click .mark-item' : 'run'
		},
		run : function(e){
			var id = $(e.currentTarget).data('id');
			$('#dxy-mark-modal').modal('hide');
			this.editor.execCommand('replacedview', id);
		}
	});
	baidu.editor.ui.mark = function(editor) {
		var name = 'mark',
			title = '插入标记';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	    	var v = new MarkView(editor);
	    	$('#dxy-mark-modal .modal-body').html($(v.el));
	        $('#dxy-mark-modal').modal('show');
	    });
	        
	    return btn;
	};
})();
(function(){
	baidu.editor.ui.vote = function (editor) {
		var name = 'vote',
			title = '插入投票卡';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	        editor.execCommand('replacedview', name);
	    });
	        
	    return btn;
	};
})();
/**
 * @required cssparser, sizzer
 */
(function(){
	UE.plugin.register('wechatoutputrule', function(){
		var loadCount = 0,
			me = this,
			stylesheet = '';
		UE.utils.loadFile(document, {
			src: me.getOpt('UEDITOR_HOME_URL') + 'third-party/cssparser/cssparser.js',
			tag:"script",
			type:"text/javascript",
			defer:"defer"
		}, function(){
			loadCount++;
		});
		UE.utils.loadFile(document, {
			src: me.getOpt('UEDITOR_HOME_URL') + 'third-party/sizzer/selector.js?t='+new Date().getTime(),
			tag:"script",
			type:"text/javascript",
			defer:"defer"
		}, function(){
			loadCount++;
		});
		if(!me.addWechatOutputRule){
			me.wechatoutputrules = {
				beforeStyleSet : [],
				styleSet : [],
				afterStyleSet : [],
				structEdit : [],
				afterStructEdit : []
			};
			me.addWechatOutputRule = function(rule, stat){
				stat = stat || 'beforeStyleSet';
				me.wechatoutputrules[stat].push(rule);
			};
		}
		if(!me.registerWechatStyle){
			me.registerWechatStyle = function(styles, isStart){
				if(isStart){
					stylesheet = styles + stylesheet;
				}else{
					stylesheet += styles;
				}
			};
		}

		/**
		 * 设置wechat导出样式
		 */
		me.addWechatOutputRule(function(root){
			function process(style){
				UE.utils.each(Y(style.selector, root), function(ele){
					UE.utils.each(style.styles, function(v, k){
			    		ele.setStyle(k, v);
			    	});
				});
			}
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			var styles = CssParser.parse(stylesheet),	
				style;
			while((style=styles.get())){
				process(style);
			}
		}, 'styleSet');

		//段落后空行
		me.addWechatOutputRule(function(root){
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			UE.utils.each(Y('p, h2, ul, ol, blockquote', root), function(ele){
				if(ele.parentNode.type==='root' || ele.parentNode.tagName==='blockquote'){
					if(ele.innerText()===''){
						return;
					}
					if(!ele.nextSibling()){
						return;
					}
					if(ele.getAttr('class')==='dxy-meta-replaced-view'){
						return;
					}
					ele.parentNode.insertAfter(new UE.uNode({
	     				type:'element',
	     				tagName:'p',
	     				 attrs:{style:'line-height:1.5;font-size:17px;'}
	     			}), ele);
				}
			});
		}, 'structEdit');

        //修改table样式，因为微信对过滤table标签上的样式。
		me.addWechatOutputRule(function(root){
			UE.utils.each(Y('table', root), function(ele){
				ele.setStyle('width', '');
				var domUtils = baidu.editor.dom.domUtils,
					firstParentBlock = domUtils.findParent(ele, function (node) {
	                    return domUtils.isBlockElm(node);
	                }, true) || me.body,
					tableWidth = firstParentBlock.offsetWidth,
					numCols, tdWidth;
				UE.utils.each(Y('tr', ele),function(tr){
					numCols = Y('td', tr).length;
					tdWidth = Math.floor(tableWidth / numCols);
					UE.utils.each(Y('td', tr), function(td){
						td.setAttr('width', ''+tdWidth);
					});
				});
			});
		},'structEdit');

		me.fireEvent('wechatready');
		me.wechatready = true;
	});
})();
/**
 * 复制到微信功能
 * @required ZeroClipboard
 */
(function () {
    baidu.editor.ui.copytowechat = function (editor) {
        var btn = new UE.ui.Button({
            name: 'copytowechat',
            title: '复制到微信',
        });

        editor.addListener('afteruiready', function(){
        	UE.utils.loadFile(document, {
			     src: editor.getOpt('UEDITOR_HOME_URL') + 'third-party/zeroclipboard/ZeroClipboard.js',
			     tag:"script",
			     type:"text/javascript",
			     defer:"defer"
		 	}, function(){
		 		ZeroClipboard.config({
		            debug: false,
		            swfPath: editor.getOpt('UEDITOR_HOME_URL')+ 'third-party/zeroclipboard/ZeroClipboard.swf'
		        });
	        	var wraper = btn.getDom('body'),
		        	client;
		        client = new ZeroClipboard($('#'+btn.id+' .edui-icon')[0]);       
				client.on( "ready", function( readyEvent ) {
				   client.on( "copy", function ( event ) {
				   		var data = getWechatContent(editor);
				        event.clipboardData.setData( "text/html", data||'');
				        event.clipboardData.setData( "text/plain", data||'' );
				        alert('已复制到粘贴板');
				    } );
				} );
		 	});
        });
        
        return btn;
    };
    function getWechatContent(editor, ignoreBlank){
    	var root = UE.htmlparser(editor.body.innerHTML, !!ignoreBlank),
    		i, len;
    	for(i=0,len=editor.wechatoutputrules.beforeStyleSet.length; i<len; i++){
    		try{
    			editor.wechatoutputrules.beforeStyleSet[i].call(editor, root);
    		}catch(e){
    			console.log(e);
    			throw e;
    		}
    	}
        for(i=0,len=editor.wechatoutputrules.styleSet.length; i<len; i++){
            try{
                editor.wechatoutputrules.styleSet[i].call(editor, root);
            }catch(e){
                console.log(e);
                throw e;
            }
        }
        for(i=0,len=editor.wechatoutputrules.afterStyleSet.length; i<len; i++){
            try{
                editor.wechatoutputrules.afterStyleSet[i].call(editor, root);
            }catch(e){
                console.log(e);
                throw e;
            }
        }
        for(i=0,len=editor.wechatoutputrules.structEdit.length; i<len; i++){
            try{
                editor.wechatoutputrules.structEdit[i].call(editor, root);
            }catch(e){
                console.log(e);
                throw e;
            }
        }
        for(i=0,len=editor.wechatoutputrules.afterStructEdit.length; i<len; i++){
            try{
                editor.wechatoutputrules.afterStructEdit[i].call(editor, root);
            }catch(e){
                console.log(e);
                throw e;
            }
        }
    	return root.toHtml();
    }
    UE.getWechatContent = getWechatContent; 
})();
UE.plugin.register('wechatstyle', function(){
var editor = this;
var styles = 'h2{'+
'	font-size: 20px;'+
'	color : #262626;'+
'	line-height: 1.75;'+
'	margin-bottom: 0px;'+
'}'+
'p{'+
'	font-size: 17px;'+
'	color: #3f3f3f;'+
'	line-height: 1.75;'+
'	margin-bottom: 0px;'+
'}'+
'li p{'+
'	margin-bottom: 10px;'+
'}'+
'li:last p{'+
'	margin-bottom: 0px;'+
'}'+
'ul, ol{'+
'	margin: 0 0 !important;'+
'}'+
'strong{'+
'	color : #262626;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles);
		});
	}
});