LocalModule.require(['CustomView', 'dxy-plugins/editview/customview/customviews/doctor_question/views/page.view'], function(CustomView, PageTpl){
	CustomView.register('doctor_question', {
		title : '医生回答',
		confirmConfig : function(){
			this.isNew = false;
			this.config.content.value = this.$el.find('.input-content').val();
			this.config.img.value = this.$el.find('.input-img').val();
			if(localStorage && this.config.img){
				localStorage.setItem('doctor_avator', this.config.img.value);
			}
			this.toStaticView();
		},
		getInitConfig : function(){
			var img;
			if(localStorage){
				img = localStorage.getItem('doctor_avator');
			}
			return {
				'img' : {
					title : '医生头像',
					value : img || 'http://img.dxycdn.com/dotcom/2015/09/14/23/9u7rkbqx.png',
					placeholder : '输入图片链接'
				},
				'content' : {
					title : '医生回答',
					value : '医生回答',
					placeholder : '输入文字'
				}
			}
		},
		getConfig : function(){
			var config = this.getInitConfig();
			config.img.value = $(this._ele).find('img').attr('src');
			config.content.value = $(this._ele).find('.view-wraper').text();
			return config;
		},
		getTemplate : function(){
			return PageTpl;
		},
		inEditor : function(){
			throw new Error('you should provide inEditor in the config');
		}
	});
});