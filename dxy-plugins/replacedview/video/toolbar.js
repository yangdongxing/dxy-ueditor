(function(){
	baidu.editor.ui.drug = function (editor) {
		var name = 'video',
			title = '插入视频卡';
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