	if(this.wechatready){
		this.registerWechatStyle(styles, true);
	}else{
		this.addListener('wechatready', function(){
			editor.registerWechatStyle(styles, true);
		});
	}
});