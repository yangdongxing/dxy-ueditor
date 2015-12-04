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