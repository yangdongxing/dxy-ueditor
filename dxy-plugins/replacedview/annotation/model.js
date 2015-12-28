define('AnnotationModel', ['DxyModel'], function(dxy){
	var API_HOST = 'http://'+document.domain+'/';
	var AnnotationModel = dxy.Model.extend({
		urlRoot : API_HOST + 'admin/i/card/annotation'
	});
	window.M = AnnotationModel;
	return {
		AnnotationModel : AnnotationModel
	}
});