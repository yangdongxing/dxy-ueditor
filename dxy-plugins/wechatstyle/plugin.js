UE.plugin.register('wechatstyle', function(){
var editor = this;
var styles = 'h2{'+
'	font-size: 20px;'+
'	color : #262626;'+
'	line-height: 1.75;'+
'	margin-bottom: 15px;'+
'	margin-top: 10px;'+
'}'+
'p{'+
'	font-size: 17px;'+
'	color: #3f3f3f;'+
'	line-height: 1.75;'+
'	margin-bottom: 0px;'+
'}'+
'li p{'+
'	margin-bottom: 10px;'+
'}'+
'li:last p{'+
'	margin-bottom: 0px;'+
'}'+
'ul, ol{'+
'	margin: 0 0 !important;'+
'	font-size: inherit;'+
'	padding-left: 30px!important;'+
'}'+
'strong{'+
'	color : #262626;'+
'}'+
'blockquote{'+
'	margin: 0;'+
'    padding-left: 10px;'+
'    border-left: 3px solid #dbdbdb;'+
'}'+
'.clear{'+
'    clear : both;'+
'    height: 0px;'+
'}'+
'.laiwen-user-question{'+
'    clear: both;'+
'    margin-bottom: 20px;'+
'}'+
'.laiwen-user-question .dialog{'+
'   padding: 15px 20px;'+
'    float: right;'+
'    background-color: #4bc7ba;'+
'    color: #fff;'+
'    border-radius: 15px 0px 15px 15px;'+
'    min-width: 10%;'+
'    max-width: 80%;'+
'    word-break: break-word;'+
'    box-sizing: border-box;'+
'}'+
'.laiwen-user-question p{'+
'    color: #fff;'+
'    margin-bottom: 0px;'+
'}'+
'.laiwen-doctor-answer p{'+
'     color: #000;'+
'    margin-bottom: 0px;'+
'}'+
'.laiwen-doctor-answer{'+
'    margin-bottom: 20px;'+
'}'+
'.laiwen-doctor-answer .dialog{'+
'    float : left;'+
'    min-width: 10%;'+
'    max-width: 80%;'+
'    word-break: break-word;'+
'    box-sizing: border-box;'+
'    margin-left: 16px;'+
'    background-color: rgb(184,221,234);'+
'    color: #000;'+
'    border-radius: 0px 15px 15px 15px;'+
'    padding: 15px 20px;'+
'    position: relative;'+
'}'+
'.laiwen-doctor-answer .avatar{'+
'    float : left;'+
'}'+
'.laiwen-doctor-answer .avatar img{'+
'    width : 40px;'+
'    height: 40px;'+
'    border-radius : 50%;'+
'}';
	if(this.wechatready){
		this.registerWechatStyle(styles);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles);
		});
	}
});