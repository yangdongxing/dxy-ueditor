UE.plugin.register('editorstyle', function(){
var editor = this;
var styles = 'body{line-height: 1.7;font-size: 14px;color: #333;font-family: Avenir,"Hiragino Sans GB","Noto Sans S Chinese","Microsoft Yahei","Microsoft Sans Serif","WenQuanYi Micro Hei",sans-serif;padding: 20px;}'+
'img{max-width: 100%;}'+
'h4, h5, h6, hr, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td{'+
'	margin: 0px;'+
'	padding: 0px;'+
'	font-family: Avenir,"Hiragino Sans GB","Noto Sans S Chinese","Microsoft Yahei","Microsoft Sans Serif","WenQuanYi Micro Hei",sans-serif;'+
'}'+
'hr {display: block; height: 0; border: 0; border-top: 1px solid #ccc; margin: 15px 0; padding: 0; }'+
'blockquote{'+
'    border-left: 6px solid #ddd;'+
'    padding: 5px 0 5px 10px;'+
'    margin: 15px 0 15px 15px;'+
'}'+
'blockquote p {'+
'	color: rgb(153, 153, 153);'+
'}'+
' '+
'h1{'+
'	font-size: 24px;'+
'	font-weight: bolder;'+
'	margin-bottom: 25px;'+
'	line-height: 1.7;'+
'	margin-top: 0px;'+
'	padding: 1% 0;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'h2{'+
'    padding: 1% 0;'+
'    color: #333;'+
'    font-size: 18px;'+
'    font-weight: bolder;'+
'    border-bottom: 1px solid #e2e2e2;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    line-height: 1.7;'+
'    word-wrap: break-word;'+
'}'+
'h3{'+
'    font-size: 16px;'+
'    font-weight: bolder;'+
'    margin-bottom: 25px;'+
'    margin-top: 0px;'+
'    padding: 1% 0;'+
'    line-height: 1.7;'+
'    color: #333; '+
'    border-bottom: 1px solid #e2e2e2;'+
'    word-wrap: break-word;'+
'}'+
'ul, ol{'+
'	list-style: disc outside none;'+
'	margin: 15px 0 !important;'+
'	padding: 0 0 0 40px;'+
'	line-height: 1.7;'+
'	font-size: 14px;'+
'}'+
'p{'+
'	margin-top: 0px;'+
'	font-size:14px;'+
'	margin-bottom:15px;'+
'	line-height:1.7;'+
'	color: #444;'+
'	word-wrap: break-word;'+
'	font-family: Avenir;'+
'}'+
'li p{'+
'	margin-bottom: 0px;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles);
		});
	}
});