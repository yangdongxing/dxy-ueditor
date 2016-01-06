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
			function process(style){
				UE.utils.each(Y(style.selector, root), function(ele){
					UE.utils.each(style.styles, function(v, k){
			    		ele.setStyle(k, v);
			    	});
				});
			}
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			var styles = CssParser.parse(stylesheet),	
				style;
			while((style=styles.get())){
				process(style);
			}
		}, 'styleSet');

		//段落后空行, 移除img alt属性
		me.addWechatOutputRule(function(root){
			if(loadCount!==2){
				throw new Error('cssparser or sizzer not loaded');
			}
			UE.utils.each(Y('p, img, ul, ol, blockquote', root), function(ele){
				if(ele.parentNode.type==='root' || ele.parentNode.tagName==='blockquote'){
					if(ele.innerText()===''){
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
				if(ele.tagName==='img' && (ele.parentNode.tagName==='p')){
					ele.setAttr('alt', '');
					ele.parentNode.parentNode.insertAfter(new UE.uNode({
	     				type:'element',
	     				tagName:'p',
	     				 attrs:{style:'line-height:1.5;font-size:17px;'}
	     			}), ele.parentNode);
				}
			});
		}, 'structEdit');

        //修改table样式，因为微信对过滤table标签上的样式。
		me.addWechatOutputRule(function(root){
			UE.utils.each(Y('table', root), function(ele){
				ele.setStyle('width', '');
				var domUtils = baidu.editor.dom.domUtils,
					firstParentBlock = domUtils.findParent(ele, function (node) {
	                    return domUtils.isBlockElm(node);
	                }, true) || me.body,
					tableWidth = firstParentBlock.offsetWidth,
					numCols, tdWidth;
				UE.utils.each(Y('tr', ele),function(tr){
					numCols = Y('td', tr).length;
					tdWidth = Math.floor(tableWidth / numCols);
					UE.utils.each(Y('td', tr), function(td){
						td.setAttr('width', ''+tdWidth);
					});
				});
			});
		},'structEdit');

		me.fireEvent('wechatready');
		me.wechatready = true;
	});
})();