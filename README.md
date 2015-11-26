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
1. 必须运行grunt dev --force
2. 通用文档基础样式请修改`/dxy-plugins/editorstyle/editor.css`。同时修改`/dest/css/dxydoctor/editor_custom.css`,保证web预览的样式一致。微信导出样式已已与编辑器内样式保持一致。
3. 插件所改变的文档样式请在`插件目录/editor.css`中修改

## 如何只为微信导出内容设置特定样式

1. 样式请写在`插件目录/wechat.css`
	
## 如何对微信导出内容做修改

	editor.addWechatOutputRule(function(root){
		//root为ueditor内部 node tree, 见ueditor官方api文档
	})

## 丁香园自定义插件列表
1. [dxyupload](#dxyupload) 图片上传
2. [onekeyreplace](#onekeyreplace) 丁香园一键格式化
3. [dxylink](#dxylink) 插入和移除超链接
4. [inputrule](#inputrule) 丁香园输入规则注册模块
5. [wechat](#wechat) 导出到微信
6. [replacedview](#replacedview) 可替换视图插件
7. [editview](#editview) 可编辑视图插件

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
 	
## wechat
* UE.getWechatContent() //获得导出的内容
* editor.addWechatOutputRule(function(root){...}, stat) //对导出内容进行修改

		stat = 'beforeStyleSet'|'styleSet'|'afterStyleSet' default 'beforeStyleSet'
		
* editor.registerWechatStyle(styleString) //添加微信导出样式


	
## editorstyle
设置编辑器内部文章样式和微信样式

`editorstyle/editor.css`设置基本通用样式

插件修改的样式应该在`pluginname/editor.css`中设置

## wechatstyle
设置微信样式

`wechatstyle/wechat.css`设置微信通用样式

插件修改的样式应该在`pluginname/wechat.css`中设置

## replacedview
### 如何添加自定义内容（如插入药品信息）

1. 在replacedview目录下新建目录，并在新建的目录下新建dialog目录
2. toolbar.js 注册ui
3. extend.js 创建并注册视图类
	
		ReplacedView.register(/**名字**/, {
			//配置
			toWechatView : function(){
				//返回自定义内容在微信上的视图元素,所有的toXXXVie应该根据当前对象this.data中的数据进行渲染
			},
			toWebView : function(){
				//返回自定义内容在web上的视图元素，因为视图可能是需要请求数据进行渲染，因此推荐返回promise对象，从而支持异步编程
			},
			toAppView : function(){
				//返回自定义内容在web上的视图元素
			},
			toEditor : function(){
				//返回自定义内容在编辑器上的视图元素
			},
			onModalShow : function(){
				//应该在这里对弹出的modal中的内容进行修改
			},
			onModalConfirm : function(){
				//应该在这里对数据进行验证，并保存到this.data中，返回false将不关闭modal
			}
		})

4. 在dialog目录下新建modal.tpl进行弹出视图的编写,最外层元素的id应该是 dxy-{你注册视图提供的类型名}-modal

### RelpacedView类
属性：
	
	data : 附加的属性
	type : 类型
	isMounted : 是否挂载在页面上
	ele : dom元素
	
类方法：

	serialize(obj) : 将数据序列化成字符串
	deSerialoze(str) : 反序列化
	isReplacedView(node|type) : 是否是自定义视图
	getInstance(node|type) : 返回视图对象
	register(type, instancemethods) : 注册自定义视图
	
实例方法：

	toJson() : 返回视图对象的元数据
	toMetaVoew() : 返回视图对象的元视图，编辑器最终保存的自定义视图是以元视图的形成存在的。
	toWechatView(): 返回微信视图元素
	toWebView(): 返回web视图元素
	toAppView(): 返回移动视图元素
	toEditorView() : 返回编辑器视图元素
	toAppropriateView() : 自动检测不同的平台，并返回最接近的视图
	mount(target|range): 将当期视图替换目标元素或所选范围
	serialize(obj) : ...
	deSerialize(str) : ...
	
## editview

自定义弹出框

### example
注册

		EditView.register('image', {
		onModalShow : function(){
			this.modal.find('#modal-image-link').val(this.ele.src);
			this.modal.find('#modal-image-desc').val(this.ele.alt);
			this.modal.find('#modal-image-height').val($(this.ele).height());
			this.modal.find('#modal-image-width').val($(this.ele).width());
		},
		onModalConfirm : function(){
			if(!this.modal.find('#modal-image-desc').val()){
				alert('请填写图片描述:)');
				return false;
			}
			this.ele.alt = this.modal.find('#modal-image-desc').val();
			return true;
		},
		modalInit : function(){
			
		}
	},{
		isEditView : function(ele){
			if(ele && ele.tagName==='IMG'){
				return true;
			}else{
				return false;
			}
		}
	});
	
调用

	editor.execCommand('editview', type)