# dxy-ueditor
丁香园文本编辑器

## Toolbar UI 注册规范
ueditor使用两种方式注册ui，在渲染时，渲染的位置逻辑也不相同。
为了方便个性化定制toolbar，应该通过给`baidu.editor.ui`对象添加属性的方式注册。

    baidu.editor.ui.dxyupload = function(editor){
    	...
    	return ui;
	}

最终可以通过配置文件来定制toolbar，配置中的顺序则为真实顺序。

	[[
            'fullscreen', 'paragraph','bold', 'italic','strikethrough','underline','|',
            'forecolor','removeformat','|',
            'justifyleft','justifycenter','justifyright','indent','|',
            'insertorderedlist', 'insertunorderedlist', '|',
            'link', 'unlink', 'horizontal','blockquote' ,'|',
            'dxyupload','inserttable','|',
            'superscript', 'subscript','|','onekeyreplace'
            
    ]]

## 丁香园自定义插件列表
1. [dxyupload](#dxyupload) 图片上传
2. [onekeyreplace](#onekeyreplace) 丁香园一键格式化
