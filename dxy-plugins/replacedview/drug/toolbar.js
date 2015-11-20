(function(){
	baidu.editor.ui.drug = function (editor) {
		var name = 'drug',
			title = '插入药品信息';
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