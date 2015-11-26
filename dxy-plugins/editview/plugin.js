(function(){
    var domUtils = baidu.editor.dom.domUtils;
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    UE.plugin.register('editview', function (){
        var me = this;
        return {
            bindEvents:{
                'ready': function(){

                }
            },
            commands: {
                'editview': {
                    execCommand : function(cmd, opt){
                    	var type = opt;
                    	if(!type){
                    		throw new Error('exec editview command require 2 arguments');
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
                    		var view = EditView.getInstance(ele);
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
        };
    });

})();
