(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('editview', function (){
        var me = this;

        me.on('aftersetcontent', function(){
            $(me.body).find('.dxy-custom-view').each(function(i,e){
                $(e).on('dblclick',function(event){
                    UE.getEditor('editor-box').execCommand('editview', 'customview');
                });
            });
        });

        return {
            bindEvents:{
                'ready': function(){

                }
            },
            commands: {
                'editview': {
                    execCommand : function(cmd, opt, target){
                    	var type = opt, view;
                    	if(!type){
                    		throw new Error('exec editview command require 2 arguments');
                    	}
                        if(!EditView.custom[type]){
                            throw new Error(type+' not support');
                        }
                    	var range = me.selection.getRange(),
                    		cur = range.getCommonAncestor(true),
                    		ele = domUtils.findParent(cur, function(node){
                                if(EditView.isEditView(node) || (EditView.custom[type] && EditView.custom[type].isEditView && EditView.custom[type].isEditView(node))){
                                    return true;
                                }else{
                                    return false;
                                }
                    		}, true);
                    	if(ele){
                    		view = EditView.getInstance(ele);
                    		if(view.type == type){
                    			view.showModal();
                    		}else{
                    			alert('请选择正确的类型');
                    			return;
                    		}
                    	}else{
                            if(EditView.custom[type] && EditView.custom[type].isEmptySupport){
                                view = new EditView.custom[type](ele, range);
                                if(view.type == type){
                                    view.showModal();
                                }else{
                                    alert('请选择正确的类型');
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        };
    });

})();
