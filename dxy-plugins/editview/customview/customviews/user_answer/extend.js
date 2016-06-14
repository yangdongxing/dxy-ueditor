LocalModule.require(['CustomView', 'dxy-plugins/editview/customview/customviews/user_answer/views/page.view'], function(CustomView, PageTpl){
	CustomView.register('user_answer', {
		title : '用户提问',
		confirmConfig : function(){
			this.isNew = false;
			this.config.content.value = this.$el.find('.input-content').val();
			this.config.img.value = this.$el.find('.input-img').val();
			if(localStorage && this.config.img){
				localStorage.setItem('user_avator', this.config.img.value);
			}
			this.toStaticView();
		},
		getInitConfig : function(){
			var img;
			if(localStorage){
				img = localStorage.getItem('user_avator');
			}
			return {
				'img' : {
					'title' : '用户头像',
					'value' : img || '',
					'placeholder' : '输入图片链接'
				},
				'content' : {
					'title' : '用户提问',
					'value' : '用户提问',
					'placeholder' : '输入文字'
				}
			}
		},
		getConfig : function(){
			var config = this.getInitConfig();
			config.content.value = $(this._ele).find('.view-wraper').text();
			config.img.value = $(this._ele).find('img').attr('src');
			return config;
		},
		getTemplate : function(){
			return PageTpl;
		},
		inEditor : function(){
			throw new Error('you should provide inEditor in the config');
		},
		priority : 1
	});
});