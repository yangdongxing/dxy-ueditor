UE.plugin.register('editorstyle', function(){
var editor = this;var styles = 'body{line-height: 1.8;font-size: 14px;color: #333;font-family: Avenir,"Hiragino Sans GB","Noto Sans S Chinese","Microsoft Yahei","Microsoft Sans Serif","WenQuanYi Micro Hei",sans-serif;}'+
'img{max-width: 100%;}'+
'h1,h2,h3,h4,h5,h6{border-bottom: 1px solid #e2e2e2;margin-bottom: 25px;font-weight: bold;line-height: 1.8;}'+
'hr {display: block; height: 0; border: 0; border-top: 1px solid #ccc; margin: 15px 0; padding: 0; }'+
'p{margin-bottom: 15px;}'+
'blockquote {'+
'    border-left: 6px solid #ddd;'+
'    padding: 5px 0 5px 10px;'+
'    margin: 15px 0 15px 15px;'+
'}'+
'h1{font-size:28px;}'+
'h2{font-size:21px;}'+
'h3{font-size:17px;}'+
'p{font-size:14px;margin-bottom:15px;margin-top:5px;line-height:1.8;}';
	if(this.wechatready){
		this.registerWechatStyle(styles);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles);
		});
	}
});