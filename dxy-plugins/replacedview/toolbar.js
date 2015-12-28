(function(){
	var MarkView = Backbone.View.extend({
		initialize : function(editor){
			this.render();
			this.editor = editor;
		},
		render : function(){
			var me = this,
				ctx = {marks : []},
				item;
			for(var prop in ReplacedView.custom){
				item = {};
				item.id = prop;
				switch(prop){
					case 'vote' : 
						item.name = '插入投票卡';
						break;
					case 'drug' :
						item.name = '插入药品卡';
						break;
					case 'annotation':
						item.name = '插入注释卡';
						if(document.domain!=='dxy.us'){
							continue;
						}
						break;
					default:
						continue;
				}
				ctx.marks.push(item);
			}
			require(['dxy-plugins/replacedview/mark.view'], function(tpl){
				me.$el.html(_.template(tpl)(ctx));
			});
		},
		events : {
			'click .mark-item' : 'run'
		},
		run : function(e){
			var id = $(e.currentTarget).data('id');
			$('#dxy-mark-modal').modal('hide');
			this.editor.execCommand('replacedview', id);
		}
	});
	baidu.editor.ui.mark = function(editor) {
		var name = 'mark',
			title = '插入标记';
	    var btn = new UE.ui.Button({
	        name: name,
	        title: title
	    });

	    btn.addListener('click', function(){
	    	var v = new MarkView(editor);
	    	$('#dxy-mark-modal .modal-body').html($(v.el));
	        $('#dxy-mark-modal').modal('show');
	    });
	        
	    return btn;
	};
})();