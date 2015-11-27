(function(g){
	EditView.register('image', {
		onModalShow : function(){
			this.modal.find('#modal-image-link').val(this.ele.src);
			this.modal.find('#modal-image-desc').val(this.ele.alt);
			var image = new Image()
		    image.src = this.ele.src;
			this.modal.find('#modal-image-height').val(image.height);
			this.modal.find('#modal-image-width').val(image.width);
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
})(this);