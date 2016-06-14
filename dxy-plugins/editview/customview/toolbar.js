(function(){
	baidu.editor.ui.customview = function (editor) {
		var name = 'customview',
			title = '插入组合视图';
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