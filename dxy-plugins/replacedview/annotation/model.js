LocalModule.define('AnnotationModel', ['DxyModel'], function(dxy){
	var API_HOST = 'http://'+(window.location.host||'dxy.com')+'/';
	var AnnotationModel = dxy.Model.extend({
		urlRoot : API_HOST + 'admin/i/card/annotation'
	});
	var AnnotationUserModel = dxy.Model.extend({
		urlRoot : API_HOST + 'view/i/functionmarker'
	});
	window.M = AnnotationModel;
	return {
		AnnotationModel : AnnotationModel,
		AnnotationUserModel : AnnotationUserModel
	}
});