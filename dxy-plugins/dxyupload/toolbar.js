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