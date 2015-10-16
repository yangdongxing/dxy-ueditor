/**
 * 提供dxyupload指令， 参数[File, File...] || input.files
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
