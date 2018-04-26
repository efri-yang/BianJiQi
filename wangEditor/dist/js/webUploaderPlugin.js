(function () {

    // 获取 wangEditor 构造函数和 jquery
    var E = window.wangEditor;
    var $ = window.jQuery;

    // 通过 E.plugin 注入插件代码
    E.plugin(function () {
        
        // 此处的 this 指向 editor 对象本身
        var editor = this;
        var $txt = editor.$txt;
        var elemId=editor.$valueContainer.attr("id");
        
      
        //webuploader默认的配置
        var default={
            pick: {
                id: '#J_filePicker_1',
                label: '点击选择图片'
            },
            dnd: '#J_wangeditor-localupload-start',
            paste: '#J_wangeditor-localupload-start',
            // accept: { // 只允许选择图片文件格式
            //     title: 'Images',
            //     extensions: 'gif,jpg,bmp,png',
            //     mimeTypes: 'image/jpg,image/jpeg,image/png'
            // },
            server: './php/fileupload.php',
            swf: '../../dist/Uploader.swf',
            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            //限制文件的大小
            fileSingleSizeLimit: 4 * 1024 * 1024,
            // fileSingleSizeLimit:2 * 1024 * 1024,
            fileNumLimit: 30,
            fileSizeLimit: 100 * 1024 * 1024
        }
        
        // var opt=$.extend(true, target object, object1);
        
           

        
    });

})();