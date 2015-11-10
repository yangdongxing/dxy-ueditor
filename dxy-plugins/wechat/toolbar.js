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
    	for(i=0,len=editor.wechatoutputrules.length; i<len; i++){
    		try{
    			editor.wechatoutputrules[i].call(editor, root);
    		}catch(e){
    			console.log(e);
    			throw e;
    		}
    	}
    	return root.toHtml();
    }
    UE.getWechatContent = getWechatContent; 
})();