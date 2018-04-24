(function($){
	$(function(){
		var uploader = WebUploader.create({
	        pick: {
	            id: '#J_filePicker',
	            label: '点击选择图片'
	        },
	        formData: {
	            uid: 123
	        },
	        accept: {// 只允许选择图片文件格式
	            title: 'Images',
	            extensions: 'gif,jpg,bmp,png',
	            mimeTypes: 'image/jpg,image/jpeg,image/png'
	        },
	        server: '../server/fileupload.php',
	        swf: '../../dist/Uploader.swf',
	        //限制文件的大小
	        fileSingleSizeLimit:2 * 1024 * 1024,
	        fileNumLimit:20,
	        fileSizeLimit: 4 * 1024 * 1024
	    });
	})

})(jQuery);