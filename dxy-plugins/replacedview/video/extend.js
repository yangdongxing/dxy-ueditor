(function(){
	var IMG_PREFIX = 'http://img.dxycdn.com/dotcom/';
	if(document.domain === 'dxy.us'){
		IMG_PREFIX = 'http://dxy.us/upload/public/';
	}
	var VideoView = Backbone.View.extend({
		events: {
			'change #video-cover' : 'changeCover'
		},
		initialize : function(view){
			var me = this;
			this.view = view;
			if(view.data && view.data.id){
				this.id = view.data.id;
				this.cover = view.data.cover;
			}else{
				this.id = '';
				this.cover = '';
			}
			this.render();
		},
		render: function() {
			var me = this;
			LocalModule.require(['dxy-plugins/replacedview/video/views/main.view'], function(v){
				var t = _.template(v);
				me.el.innerHTML = t({
					value : me.id,
					cover : me.cover
				});
				me.trigger('render');
			});
		  	return this;
		},
		changeCover : function(e){
			var me = this;
			var t = $(e.currentTarget);
			var uploader = new ImageUploader({
				el : t[0],
				type : 'card_video_cover'
			});
			uploader.upload().then(function(e){
				var res = JSON.parse(e.currentTarget.responseText);
				var img = IMG_PREFIX + res.data.items[0].path;
				me.cover = me.view.data.cover = img;
				me.$el.find('img').attr('src', me.cover);
			},function(e){
				var res = JSON.parse(e.currentTarget.responseText);
				alert('上传失败：'+res);
			});
		},
		processValue : function(){
			function uid(q){
				if(q){
					var pairs = q.split('&');
					var pair;
					for(var i=0,len=pairs.length;i<len; i++){
						pair = pairs[i].split('=');
						if(pair[0] && pair[0]=='vid'){
							return pair[1];
						}
					}
					return null;
				}
				return null;
			}
			var value = this.$el.find('#video-id').val();
			var UrlReg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
			var querystring;
			if(value){
				var match = UrlReg.exec(value);
				if(match && match[1]){
					var query = match[6];
					if(query && uid(query)){
						this.id = this.view.data.id = uid(query);
					}else{
						var path = match[5];
						var name = path.slice(path.lastIndexOf('/')+1);
						var m = /^(.+)\.html$/.exec(name);
						if(m && m[1]){
							this.id = this.view.data.id = m[1];
						}else{
							alert('格式无法识别，请联系佳奇');
						}
					}
				}else{
					this.id = this.view.data.id = value;
				}
			}
		}
	});


	window.VideoReplacedView = ReplacedView.register('video', {
		toWechatView : function(){
			return this.toEditorView()
		},
		toWebView : function(e){
		    var video = $('<iframe frameborder="0" width="640" height="498" src="http://v.qq.com/iframe/player.html?vid='+this.data.id+'&tiny=0&auto=0" allowfullscreen></iframe>')[0];
		    $(e).html(video);
		    this.ele = e;
		    return $.Deferred().resolve(e);
		},
		toAppView : function(e){
			return this.toMobileView(e);
			// e.id = this.data.id;
			// var video = new tvp.VideoInfo();
		 //       video.setVid(this.data.id);
		 //       var player = new tvp.Player('100%', '200px');
		 //       player.addParam("showcfg",0);
		 //       player.addParam("autoplay", 0);
		 //       player.addParam("showend",0);
		 //       player.addParam("controls", "disable");
		 //       player.setCurVideo(video);
		 //       player.write(this.data.id);
		 //    e.style.display = 'block';
		 //    return $.Deferred();
		},
		toEditorView : function(e){
			var ele = this.toMetaView(e),
				dtd = $.Deferred();
			ele.style.display = 'block';
			ele.id = this.data.id;
			var video = $('<iframe frameborder="0" width="640" height="498" src="http://v.qq.com/iframe/player.html?vid='+this.data.id+'&tiny=0&auto=0" allowfullscreen></iframe>');
			$(ele).html(video);
			dtd.resolve(ele);
			return dtd;
		},
		toMobileView : function(e){
			var dtd = $.Deferred();
			var url = 'http://h5vv.video.qq.com/getinfo?vids='+this.data.id+'&otype=json&defaultfmt=auto&sdtfrom=v3010&_rnd='+new Date().getTime()+'&sphls=0&sb=1&platform=11001&charge=0';
			var me = this;
			$.ajax({
				url: url,
				type: "GET",
				dataType: 'jsonp',
				jsonp: 'callback',
				success : function(json){
					try{
						var data = json.vl.vi[0];
						var source = data.ul.ui[0].url + data.fn + '?vkey=' + data.fvkey;
						var video = $('<video controls poster="'+me.data.cover+'" preload="metadata" width="100%" name="media"><source src="'+source+'" type="video/mp4"></source></video>');
						me.ele = video[0];
						dtd.resolve(video[0]);
					}catch(e){
						console.log('视频解析失败');
					}
				},
				error : function(){
					console.log('视频元信息获取失败');
				}
			});
			return dtd;
		},
		onModalShow : function(){
			this.video =  new VideoView(this);
			$('#dxy-video-modal .modal-body').html($(this.video.el));
		},
		onModalConfirm : function(){
			this.video.processValue();
			if(!this.data.id){
				alert('请输入视频id');
				return false;
			}
			return true;
		}
	});
})();