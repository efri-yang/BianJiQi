CKEDITOR.plugins.add('imagesingle', {
    icons: 'imagesingle',
    afterInit: function() {

    },
    onLoad: function() {

    },
    init: function() {
        editor.ui.addButton('imagesingle', {
            // The text part of the button (if available) and the tooltip.
            label: '上传图片',
            // The command to execute on click.
            command: 'imagesingle',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'insert,1'
        });


        var uploader, browseBtnId = editor.name + "-imagesingle-upload";


        var defaultConfig = {
            plupload: {
                // runtimes: 'html5,flash,silverlight,html4',
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: browseBtnId, // you can pass an id...
                url: 'upload.php',
                flash_swf_url: '../js/Moxie.swf',
                silverlight_xap_url: '../js/Moxie.xap',
                filters: {
                    max_imgfile_count: 3,
                    prevent_duplicates: true,
                    max_file_size: '5mb',
                    mime_types: [
                        { title: "Image files", extensions: "jpg,gif,png" }
                    ]
                },
                FILE_COUNT_ERROR: -9001
            }

        }

        var opts = jQuery.extend(true, defaultConfig, editor.config.imageSingle);



        // var inputFileStr='<input type="file" id="'+editor.name+'-imagesingle-file" />';
        // var $inputFile=$(inputFileStr);
        // $inputFile.appendTo($("body"));

        setTimeout(function() {

            // var strBrowse = '<a href="javascript:void(0);" id="' + browseBtnId + '" style="width:60px;height:60px;background:#f60;display:block;"></a>'

            var strBrowse = '<a href="javascript:void(0);" id="' + browseBtnId + '" style="position:absolute;left:0;top:0;width:25px;height:25px;z-index:10;"></a>'


            $(strBrowse).appendTo($('.cke_button__imagesingle_icon').parent().parent());
           
            uploader = new plupload.Uploader(opts.plupload);


            uploader.init();

            uploader.bind('FilesAdded', function(up, files) {
                uploader.start();
            });

            uploader.bind('FileUploaded', function(up, file, info) {
                console.dir(info);
                var img = new CKEDITOR.dom.element('img');
                img.setAttribute('src', info.response);
                editor.insertElement(img);
            });

            uploader.bind('Error', function(up, err) {
                var details = "";
                console.dir(err);
                switch (err.code) {
                    case plupload.FILE_EXTENSION_ERROR:
                        details = err.file.name + "文件不符合格式要求！";
                        break;

                    case plupload.FILE_SIZE_ERROR:
                        
                        details = "单个文件大小不能超过" + plupload.formatSize(plupload.parseSize(up.getOption('filters').max_file_size)) + ",文件(" + err.file.name + ")大小为：" + plupload.formatSize(err.file.size);
                        break;

                    case plupload.FILE_DUPLICATE_ERROR:
                        details = err.file.name + "上传已经在队列中了！";
                        break;

                    case uploader.settings.FILE_COUNT_ERROR:
                        details = "每次上传文件总数不能超过" + up.getOption('filters').max_imgfile_count + "个,多出的文件将不被上传！";
                        break;

                    case plupload.IMAGE_FORMAT_ERROR:
                        details = _("Image format either wrong or not supported.");
                        break;

                    case plupload.IMAGE_MEMORY_ERROR:
                        details = _("Runtime ran out of available memory.");
                        break;
                    case plupload.HTTP_ERROR:
                        details = "上传的URL出现错误或着文件不存在！";
                        break;
                }
                layer.msg(details);
            });





            editor.addCommand('imagesingle', {
                exec: function(editor) {
                    $("#" + browseBtnId).trigger('click');
                }
            })
        })

    }
})