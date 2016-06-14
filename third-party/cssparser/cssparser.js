/**
 * css parser
 * @author yanSun
 * @email 773655223@qq.com
 * @version 1.0.0
 */
(function(env){
	var reg = /([^{]*){([^}]*)}/ig;
	var trimreg = /^\s+|\s+$/;
	var stylereg = /^([^:]+):(.+);?\s?$/;
	var fakeElementSelectorsreg = /:first-letter|:first-line|:before|:after/ig;
	var fakeClassSelectorsreg = /:link|:visited|:focus|:hover|:active|:first-child|:lang/ig;
	function Styles(){
		this.styles = [];
		this.length = 0;
	}
	Styles.prototype = {
		add : function(style){
			var styles,
				priority = this.computePriority(style.selector);
			styles = this.styles[priority];
			if(!styles){
				styles = this.styles[priority] = [];
			}
			styles.push(style);
			this.length++;
		},
		/**
		 * 支持根据重要性遍历
		 * @return {object} 获得下一个样式对象
		 * @example
		 * 
		 * 		while(style=styles.get()){
		 * 			console.log(style);
		 * 		}
		 */
		get : function(){
			if(!this.__pos){
				this.__pos=0;
			}
			if(this.__pos>=this.length){
				this.__pos = 0;
				return null;
			}
			var cur = -1, i, len, arr, j, jlen;
			for(i=0,len=this.styles.length; i<len; i++){
				arr = this.styles[i] || [];
				for(j=0,jlen=arr.length; j<jlen; j++){
					cur++;
					if(cur===this.__pos){
						this.__pos++;
						return arr[j];
					}
				}
			}
		},
		/**
		 * 计算选择器的特殊性值，根据css规范
		 * @param  {string} style 选择器
		 * @return {number}       特殊性
		 */
		computePriority : function(style){
			var idCount=0, classCount=0, propCount=0, eleCount=0, fakeCount=0, fakeClassCount=0,styles, i, len, first;
			style.replace(/\./g, function(){
				classCount++;
			});
			style.replace(fakeClassSelectorsreg, function(){
				fakeClassCount++;
			});
			style.replace(/\#/g, function(){
				idCount++;
			});
			style.replace(fakeElementSelectorsreg, function(){
				fakeCount++;
			});
			style.replace(/\[/g, function(){
				propCount++;
			});
			styles = style.replace(/\[\.+\]/g, '').split(/\s+/);
			for(i=0,len=styles.length;i<len;i++){
				first = styles[i].replace(trimreg,'')[0];
				if(!first){
					continue;
				}
				if(/\w/.test(first)){
					eleCount++;
				}
			}
			return idCount*100+classCount*10+propCount*10+fakeClassCount*10+eleCount+fakeCount;
		},

	};
	env.CssParser = {
		/**
		 * 简单的css解析器
		 * 由于css不像html，结构复杂，形式多样，因此采用正则来捕获css模式
		 * @param  {string} css 样式表字符串
		 * @return {Styles}     Styles对象,封装解析后的样式对象
		 */
		parse : function(css){
			var match, selector, content, key, value,
				styles = new Styles(),
				i, len, selector,
				temp;
			while((match=reg.exec(css))){
				selectors = match[1].split(',') || [];
				content = match[2] || '';
				temp = this.parseStyles(content);
				for(i=0,len=selectors.length; i<len; i++){
					selector = selectors[i].replace(trimreg, '');
					styles.add({
						selector : selector,
						styles : temp
					});
				}
			}
			return styles;
		},
		parseStyles : function(styles){
			var styles = styles.split(';'),
				keyvalue, key, value, i, len,
				res = {};
			for(i=0,len=styles.length; i<len; i++){
				keyvalue = styles[i].replace(trimreg, '').match(stylereg);
				if(!keyvalue){
					continue;
				}
				key = keyvalue[1] || '';
				value = keyvalue[2] || '';
				res[key.replace(trimreg, '')] = value.replace(trimreg, '');
			}
			return res;
		}
	};
})(this);