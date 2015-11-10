# dxy-ueditor
丁香园文本编辑器
## dxy-ueditor开发流程
使用grunt对代码进行规范性检查，对插件进行打包

	git clone https://github.com/yangdongxing/dxy-ueditor.git
	npm install
	grunt dev 
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
    
## 插件编写规范
* 插件应该写在`dxy-plugins`目录下，grunt会自动对不同功能文件进行处理
* 对于需要自定义样式的插件的目录规范
		
		pluginname-- editor.css
		          |- toolbar.js
		          |- plugin.js
		          |- dialog -- *.js
		          			|- *.css (不能是editor.css)
		          			|- *.tpl
		          			
## 如何修改编辑器内的文档样式
1. 必须运行grunt dev
2. 通用文档基础样式请修改`/dxy-plugins/editorstyle/editor.css`。同时修改`/dest/css/dxydoctor/column-debug.css`,保证web预览的样式一致。微信导出样式已已与编辑器内样式保持一致。
3. 插件所改变的文档样式请在`插件目录/editor.css`中修改

## 如何只为微信导出内容设置特定样式


	editor.registerWechatStyle(styleString)

## 丁香园自定义插件列表
1. [dxyupload](#dxyupload) 图片上传
2. [onekeyreplace](#onekeyreplace) 丁香园一键格式化
3. [dxylink](#dxylink) 插入和移除超链接
4. [inputrule](#inputrule) 丁香园输入规则注册模块

## dxyupload
图片插入上传插件，支持多图上传，支持图片拖入上传。<a name="dxyupload"></a>

配置参数：
	
	imageUploadRequestUrl : 图片上传地址
 	imageAllowFiles : 允许上传的文件的后缀列表
 	imageUploadPrefix : 图片地址前缀
 	
## dxylink
链接插入插件。集成链接插入与移除。<a name="dxylink"></a>

配置参数：

	dxylink_default_top : 链接编辑弹出框y轴偏移量
 	dxylink_default_left: 链接编辑弹出框
 	dxylink_title : toolbar button 提示
 	dxylink_default_link_url : 链接编辑器默认链接
 	dxylink_default_link_text : 链接编辑器默认文本
