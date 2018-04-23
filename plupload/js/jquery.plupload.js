;(function(window, document, plupload, o, $) {
	var uploaders = {
		browse_button : 'pickfiles'
	};
	var renderUI=function($el){
		return  '<div></div>'
	}
	$.fn.plupload=function(option){
		var defaultConfig = {};
		var opt=$.extend(true,defaultConfig,option);
		return this.each(function(index, el) {
			
			var id=el.id,
				$el=$(el);

			var uploader;
			if(!id){
				id = plupload.guid();
				$el.attr("id",id);
			}

			
			console.dir(option);
			this.uploader = uploaders[id] = new plupload.Uploader(option);
			this.uploader.init();
		});
	}
})(window, document, plupload, moxie, jQuery)