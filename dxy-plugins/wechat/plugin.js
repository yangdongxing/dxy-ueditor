/**
 * @required cssparser, sizzer
 */
(function(){
	UE.plugin.register('wechatoutputrule', function(){
		var loadCount = 0,
			me = this,
			stylesheet = '';
		UE.utils.loadFile(document, {
			src: me.getOpt('UEDITOR_HOME_URL') + 'third-party/cssparser/cssparser.js',
			tag:"script",
			type:"text/javascript",
			defer:"defer"
		}, function(){
			loadCount++;
		});
		UE.utils.loadFile(document, {
			src: me.getOpt('UEDITOR_HOME_URL') + 'third-party/sizzer/selector.js?t='+new Date().getTime(),
			tag:"script",
			type:"text/javascript",
			defer:"defer"
		}, function(){
			loadCount++;
		});
		if(!me.addWechatOutputRule){
			me.wechatoutputrules = {
				beforeStyleSet : [],
				styleSet : [],
				afterStyleSet : [],
				structEdit : [],
				afterStructEdit : []
			};
			me.addWechatOutputRule = function(rule, stat){
				stat = stat || 'beforeStyleSet';
				me.wechatoutputrules[stat].push(rule);
			};
		}
		if(!me.registerWechatStyle){
			me.registerWechatStyle = function(styles, isStart){
				if(isStart){
					stylesheet = styles + stylesheet;
				}else{
					stylesheet += styles;
				}
			};
		}

		/**
		 * 设置wechat导出样式
		 */
		me.addWechatOutputRule(function(root){
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			var styles = CssParser.parse(stylesheet),	
				style;
			while((style=styles.get())){
				UE.utils.each(Y(style.selector, root), function(ele){
					UE.utils.each(style.styles, function(v, k){
			    		ele.setStyle(k, v);
			    	});
				});
			}
		}, 'styleSet');

		//段落后空行
		me.addWechatOutputRule(function(root){
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			UE.utils.each(Y('p, h2, ul, ol, blockquote', root), function(ele){
				if(ele.parentNode.type==='root' || ele.parentNode.tagName==='blockquote'){
					if(ele.innerText()==''){
						return;
					}
					if(!ele.nextSibling()){
						return;
					}
					if(ele.getAttr('class')==='dxy-meta-replaced-view'){
						return;
					}
					ele.parentNode.insertAfter(new UE.uNode({
	     				type:'element',
	     				tagName:'p',
	     				 attrs:{style:'line-height:1.5;font-size:17px;'}
	     			}), ele);
				}
			});
		}, 'structEdit');

		me.fireEvent('wechatready');
		me.wechatready = true;
	});
})();