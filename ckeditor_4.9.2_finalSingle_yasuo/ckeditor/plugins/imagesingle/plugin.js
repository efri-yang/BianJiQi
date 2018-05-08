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


        // var inputFileStr='<input type="file" id="'+editor.name+'-imagesingle-file" />';
        // var $inputFile=$(inputFileStr);
        // $inputFile.appendTo($("body"));

        setTimeout(function() {
            var uploader, browseBtnId = editor.name + "-imagesingle-upload";
            // var strBrowse = '<a href="javascript:void(0);" id="' + browseBtnId + '" style="width:60px;height:60px;background:#f60;display:block;"></a>'
            
             var strBrowse = '<a href="javascript:void(0);" id="' + browseBtnId + '" style="position:absolute;left:0;right:0;top:0;bottom:0;background:#f60;z-index:10;"></a>'


            $(strBrowse).appendTo($('.cke_button__imagesingle_icon'));

            uploader = new plupload.Uploader({
                runtimes: 'html5,flash,silverlight,html4',
                browse_button:browseBtnId, // you can pass an id...
                url: 'upload.php',
                flash_swf_url: '../js/Moxie.swf',
                silverlight_xap_url: '../js/Moxie.xap',
                filters: {
                    max_file_size: '10mb',
                    mime_types: [
                        { title: "Image files", extensions: "jpg,gif,png" }

                    ]
                }
            });


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




            
            editor.addCommand('imagesingle', {
                exec: function(editor) {
                    $("#"+browseBtnId).trigger('click');
                }
            })
        })

    }
})