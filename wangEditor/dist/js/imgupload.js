(function($){
	$(function(){
		
		var uploader = WebUploader.create({
	        pick: {
	            id: '#J_filePicker_1',
	            label: '点击选择图片'
	        },
	        formData: {
	            uid: 123
	        },
	        dnd: '#J_wangeditor-localupload-start',
            paste: '#J_wangeditor-localupload-start',
	        accept: {// 只允许选择图片文件格式
	            title: 'Images',
	            extensions: 'gif,jpg,bmp,png',
	            mimeTypes: 'image/jpg,image/jpeg,image/png'
	        },
	        server: '../server/fileupload.php',
	        swf: '../../dist/Uploader.swf',
	        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
	        disableGlobalDnd: true,
	        //限制文件的大小
	        fileSingleSizeLimit:2 * 1024 * 1024,
	        // fileSingleSizeLimit:2 * 1024 * 1024,
	        fileNumLimit:3,
	        fileSizeLimit: 4 * 1024 * 1024
	    });

	    uploader.addButton({
	        id: '#J_filePicker_2',
	        label: '继续添加'
	    });


	    var fileCount=0;
	    var $startContainer=$("#J_wangeditor-localupload-start");
	    var $uploadfileContainer=$("#J_wangeditor-uploadfile-container");
	    var $uploadfileUL=$("#J_wangeditor-uploadfile-list");

	    // 所有文件的进度信息，key为file id
        var percentages = {};


	    console.dir(uploader);

	    //显示错误函数
	    function showError(txt){
	    	if(window.layer){
	    		layer.msg(txt);
	    	}else{
	    		alert(txt);
	    	}
	    }
	    //文件打下转化成对应的单位
	    function conver(limit){  
	        var size = "";  
	        if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
	            size = limit.toFixed(2) + "B";    
	        }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
	            size = (limit / 1024).toFixed(2) + "KB";              
	        }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
	            size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
	        }else{ //其他转化成GB  
	            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
	        }  
	          
	        var sizestr = size + "";   
	        var len = sizestr.indexOf("\.");  
	        var dec = sizestr.substr(len + 1, 2);  
	        if(dec == "00"){//当小数点后为00时 去掉小数部分  
	            return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
	        }  
	        return sizestr;  
    	}  

    	//
    	function addFile(file){
    		var str='<li id="'+file.id+'">'+
                        '<div class="img-before-preview">'+
                            '<p class="title">'+file.name+'</p>'+
                            '<p class="txt-1">预览中...</p>'+
                        '</div>'+
                        '<div class="img-after-preview">'+
                            '<img src="" class="img-upload" />'+
                        '</div>'+
                        '<a href="#" class="img-del-btn"></a>'+
                        '<div class="img-progress"><span style="width:50%;"></span></div>'+
                        '<span class="img-error">上传失败，请重试</span>'+
                    '</li>';
    		var $li=$(str);
    		$uploadfileUL.append($li);

    		var $prewTxtElem=$li.find(".img-before-preview .txt-1");
    		var $imgElem=$li.find(".img-upload");
    		var $beforePreviewElem=$li.find(".img-before-preview");
    		var $afterPreviewElem=$li.find(".img-after-preview");
    		var $delBtnElem=$li.find(".img-del-btn");


    		//base64位预览
    		uploader.makeThumb( file, function( error, src) {
    			if (error) {
                    $prewTxtElem.text( '不能预览' );
                    return;
                }
                $beforePreviewElem.hide();
                $imgElem.attr("src",src);
                $afterPreviewElem.show();
                $delBtnElem.show();

    		});
    		//进度信息
    		percentages[ file.id ] = [ file.size, 0 ];

    		file.on('statuschange', function( cur, prev ) {
    			
    		})
    	}




	    uploader.on('ready', function() {
        	window.uploader = uploader;
    	});

    	uploader.on('dialogOpen', function() {
	        // console.dir("触发了：dialogOpen(本地上传窗口打开的时候)");
	    });

	    uploader.on("beforeFileQueued", function(file) {


	        // console.group("触发了：beforeFileQueued事件(当文件被加入队列之前触发)");
	    });

	    uploader.on("fileQueued", function(file) {
	    	console.group("触发了：fileQueued事件(当文件被加入队列以后触发)");
	    	if(file.getStatus() === 'invalid'){
	    		//文件不合格，不能重试上传。会自动从队列中移除。

	    	}else{
	    		fileCount++;
	    		if(fileCount > 0){
	    			//隐藏初始点击上传图片
	    			$startContainer.hide();
	    			$uploadfileContainer.show();
	    		}
	    		//添加li
	    		addFile(file);

	    		
	    		
	    	}
	    });




	    uploader.on("error",function(code){
    	//如果上传同一张图片，那么就会报错！！
	    	switch(code){
	    		case "F_EXCEED_SIZE":
	    			showError('上传单个文件最大不能超过'+conver(uploader.options.fileSingleSizeLimit));
	    			break;
	    		case "F_DUPLICATE":
	    			showError('您已经上传该文件了，无需重复上传！');
	    			break;
	    		case "Q_TYPE_DENIED":
	    			showError('您上传的'+uploader.options.accept.mineTypes+'类型文件！');
	    			break;
	    		case "Q_EXCEED_NUM_LIMIT":
	    			showError('每次最多上传'+uploader.options.fileNumLimit+"个,多出文件将不被上传！");
	    			break;
	    		default:
	    			showError("文件上传出错！");
	    	}
	    });
	   
















	})

})(jQuery);