(function(){
	baidu.editor.ui.vote = function (editor) {
		var name = 'vote',
			title = '插入投票';
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