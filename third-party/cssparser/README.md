# cssparser

将css样式按照选择器重要性解析为javascript对象

## why
当需要在运行时将某些复杂的有层级的样式用在dom元素上时，需要一种像游览器应用css的方式，来简化样式的设置。

## how
通过与提供类似jquery的元素选择器配合，将样式应用到元素上。

	while(style=styles.get()){
		$(style.selector, root).each(function(ele){
			style.styles.each(function(v, k){
				ele.css(k, v);
			});
		});
	}
	
后设置的样式会覆盖先设置的样式，从而实现层叠的效果。	

## api
`CssParser.parse(style)`: 解析样式,返回Styles对象<br>
`Styles.get()`：迭代样式对象，方便遍历<br>
`Styles.computePriority(selector)`：计算选择器重要性

## example

	var stylesheet = 'div{color:red} .container{color:red}';
	var styles = new CssParser().parse(stylesheet);
	var style;
	while(style=styles.get()){
		console.log(style);
	}
