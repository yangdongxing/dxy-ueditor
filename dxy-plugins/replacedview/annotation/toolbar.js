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