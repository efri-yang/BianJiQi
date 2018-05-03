CKEDITOR.plugins.add('imagegallery', {
    icons: 'imagegallery',

    _editImgInit: function() {
        var editor = this;
        editor.editImg = {};
        editor.editImg.dialogId = editor.name + "-imgedit-dialog";
    },

    _editImgRender: function() {
        var editor = this;
        var htmlStr = '<div class="ckeditor-imgedit-dialog" id="' + editor.editImg.dialogId + '">' +
            '<div class="item-cell">' +
            '<label class="lab">宽：</label>' +
            '<input type="text" size="10" name="imgw" class="ipt-text">' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">高：</label>' +
            '<input type="text" size="10" name="imgh" class="ipt-text">' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">描述：</label>' +
            '<input type="text" name="imgalt" class="ipt-text">' +
            '</div>' +

            '<div class="ckeditor-imgedit-ft">' +
            '<a href="#" class="ft-btn-cancel">取消</a>' +
            '<a href="#" class="ft-btn-insert ">确认</a>' +
            '</div>' +
            '</div>';
        $(htmlStr).appendTo($("body"));
        editor.editImg.$dialog = $("#" + editor.editImg.dialogId);
        editor.editImg.$inputW = editor.editImg.$dialog.find('input[name="imgw"]');
        editor.editImg.$inputH = editor.editImg.$dialog.find('input[name="imgh"]');
        editor.editImg.$inputAlt = editor.editImg.$dialog.find('input[name="imgalt"]');
        editor.editImg.$btnCancel = editor.editImg.$dialog.find('.ft-btn-cancel');
        editor.editImg.$btnConfirm = editor.editImg.$dialog.find('.ft-btn-insert');
    },

    _uploadImgInit: function() {
        var editor = this;
        editor.uploaderImg = {};
        editor.uploaderImg.dialogId = editor.name + "-imgupload-dialog";
    },

    _uploadImgRender: function() {
        var editor = this;

        var htmlStr = '<div class="ckeditor-imgupload-dialog" id="' + editor.uploaderImg.dialogId + '"><ul class="imgupload-tab-hd"><li class="active"><a href="#'+editor.name+'-tabbd-localupload-container">本地上传</a></li><li><a href="#'+editor.name+'-tabbd-gallery-container">相册图片</a></li><li class="move-seat"></li></ul><div class="ckeditor-localupload-container active" id="'+editor.name+'-tabbd-localupload-container"><div class="ckeditor-uploadfile-container"><div class="ckeditor-uploadfile-hd"><div class="img-upload-allprogress"><span class="txt"></span><span class="percentage"></span></div><div class="img-upload-info"></div><a href="javascript:void(0);" class="img-upload-btn disabled">开始上传</a><div class="img-add-btn">添加文件</div></div><ul class="ckeditor-uploadfile-list"></ul><div class="ckeditor-uploadfile-ft"><label class="ft-save-checkbox"><input type="checkbox" name="saveingallery" />保存到相册</label><select class="ft-gallery-sel" disabled></select><a href="#" class="ft-btn-insert disabled">插入</a><a href="#" class="ft-btn-cancel">关闭</a></div></div></div><div class="ckeditor-gallery-container" id="'+editor.name+'-tabbd-gallery-container"><div class="ckeditor-gallery-nodata" style="display:none;">您的相册目前还没有照片,<a href="#">立马去上传</a></div><div class="ckeditor-gallery-hasdata" style="display:block;"><ul class="ckeditor-gallery-list"></ul><div class="ckeditor-gallery-ft"><select class="ft-galleryall-sel"></select><a href="#" class="ft-galleryall-insert">插入</a><a href="#" class="ft-galleryall-cancel">取消</a></div></div></div></div>';
        $(htmlStr).appendTo($("body"));
        var $dialog = $("#" + editor.uploaderImg.dialogId);
         editor.uploaderImg.$dialog=$dialog;

        $.ajax({
                url:"./gallerytype.php",
                type:"post",
                data:"",//用户id
                dataType:"json",
                beforeSend:function(){

                },
                success:function(data, textStatus){
                    var strArr=[];
                    $.each(data.list,function(index,obj){
                        strArr.push('<option value="'+obj.id+'">'+obj.text+'</option>');
                    });
                   $dialog.find(".ft-galleryall-sel,.ft-gallery-sel").html(strArr.join(""));
                   
                },
                complete:function(XMLHttpRequest, textStatus){

                }
        })
        //tab 选项卡
        $dialog.find('.imgupload-tab-hd a').click(function(e) {
            e.preventDefault();
            $(this).editorTab('show');
        });

        

        
       

       
    },
    _uploadImgUpHandler:function(){
        var editor=this;
        var $uploadBtn = editor.uploaderImg.$dialog.find(".img-upload-btn");
        var $addBtn = editor.uploaderImg.$dialog.find(".img-add-btn");
        var $insertBtn = editor.uploaderImg.$dialog.find(".ft-btn-insert");
        var $closeBtn = editor.uploaderImg.$dialog.find(".ft-btn-cancel");
        var $fileListUL = editor.uploaderImg.$dialog.find(".ckeditor-uploadfile-list");
        var $saveInGallery=editor.uploaderImg.$dialog.find('input[name="saveingallery"]');
        var $selGallery=editor.uploaderImg.$dialog.find(".ft-gallery-sel");

        $addBtn.attr("id", editor.name + "-img-add-btn");
       


        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: editor.name + "-img-add-btn", // you can pass an id...
            url: 'upload2.php',
            flash_swf_url: '../js/Moxie.swf',
            silverlight_xap_url: '../js/Moxie.xap',
            filters: {
                prevent_duplicates: true,
                max_file_size: '1000mb',
                mime_types: [
                    { title: "Image files", extensions: "jpg,gif,png" }
                ]
            }
        });

        $closeBtn.on("click", function() {
            layer.close(editor.uploaderImg.layerIndex);
        });

        $saveInGallery.on("change",function(){
            var $this=$(this);
            if($this.prop('checked')){
                $selGallery.removeAttr('disabled');
            }else{
                $selGallery.attr('disabled','disabled');
            }
           
        })

        $insertBtn.on("click", function() {
            $fileListUL.children("li").each(function(index, el) {
                var $el = $(el);
                var src = $el.attr("data-src");
                var id = $el.attr("id");
                if (!!src) {
                    var img = editor.document.createElement('img');
                    img.setAttribute('src', src);
                    editor.insertElement(img);
                   uploader.removeFile(id);
                   $el.remove();
                    
                }

                
            });

            layer.close(editor.uploaderImg.layerIndex);

        });



        uploader.bind("Init", function(uploader) {
            console.group("Init事件:当Plupload初始化完成后触发监听函数参数：(uploader)");
        });

        uploader.bind("PostInit", function() {
            console.group("PostInit事件:当Init事件发生后触发监听函数参数：(uploader)");
            $uploadBtn.on("click", function() {
               uploader.start();
            });
        });

        uploader.bind("Browse", function(up) {
            console.group("Browse事件")
        });
        uploader.bind('FileFiltered', function(up, file) {
            console.group("FileFiltered事件")
        });

        function preloadThumb(file, cb) {
            var img = new moxie.image.Image();
            var resolveUrl = moxie.core.utils.Url.resolveUrl;
            img.onload = function() {
                var thumb = $('#' + file.id);
                thumb.find(".img-before-preview").hide();
                this.embed(thumb[0], {
                    // width: self.options.thumb_width,
                    // height: self.options.thumb_height,
                    width: 110,
                    height: 110,
                    crop: false,
                    fit: true,
                    preserveHeaders: false,
                    swf_url: resolveUrl(uploader.settings.flash_swf_url),
                    xap_url: resolveUrl(uploader.settings.silverlight_xap_url)
                });
            };

            img.bind("embedded error", function(e) {
                //不支持的浏览器就会触发error事件,支持的浏览器会触发embedded  e.type
                this.destroy();
                setTimeout(function() {
                    cb.call(null, e.type)
                }, 1); // detach, otherwise ui might hang (in SilverLight for example)
            });

            $('#' + file.id).removeClass('plupload_thumb_toload').addClass('plupload_thumb_loading');
            img.load(file.getSource());
        }
        uploader.bind('FilesAdded', function(up, files) {
            console.group("FilesAdded事件");

            $uploadBtn.removeClass("disabled");

            var str = "";
            var $beforePreview;
            var $afterPreview;
            plupload.each(files, function(file) {
                var str = '<li id="' + file.id + '">' +
                    '<div class="img-before-preview">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="txt-error-tip"></p>' +
                    '<p class="img-loading"></p>' +
                    '</div>' +
                    '<div class="img-after-preview">' +
                    '<img src="" class="img-upload" />' +
                    '</div>' +
                    '<div class="img-progress"><span></span></div>' +
                    '<a href="#" class="img-del-btn"></a>' +
                    '<span class="img-success"></span>' +
                    '<span class="img-error">上传失败，请重试</span>' +
                    '</li>';
                var $str = $(str);
                $str.appendTo($fileListUL);
                $beforePreview = $str.find('.img-before-preview');
                $afterPreview = $str.find(".img-after-preview");
                $del = $str.find(".img-del-btn");

                $del.show();
                $del.on("click", function() {
                    uploader.removeFile(file);
                    console.dir(uploader.files);



                })

                preloadThumb(file, function(type) {
                    if (type == "error") {
                        $str.find(".img-loading").hide();
                        $str.find(".txt-error-tip").text("该浏览器不支持图片预览").show();

                    } else {
                        $beforePreview.hide();
                    }



                })
            });
        });
        uploader.bind('QueueChanged', function(up) {
            console.group("QueueChanged事件");
        });
        uploader.bind('Refresh', function(up) {
            console.group("Refresh事件");
            console.dir(up.total);

            if (!up.total.uploaded) {
                $insertBtn.addClass("disabled");
            } else {
                $insertBtn.removeClass("disabled");
            }
        });
        uploader.bind('BeforeUpload', function(up, file) {
            console.group("BeforeUpload事件");
            console.dir(file);
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").show();
            $li.find(".img-del-btn").hide();
        });
        uploader.bind('UploadProgress', function(up, file) {
            console.group("UploadProgress事件");
            console.dir(file);
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").show();
            $propress.children('span').css("width", file.percent + "%");

        });
        uploader.bind('FileUploaded', function(up, file, info) {
            console.dir(info);
            console.group("FileUploaded事件");
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").hide();
            $li.find(".img-success").show();
            $li.attr("data-src", info.response);
            $li.find(".img-del-btn").show();
            $insertBtn.removeClass("disabled");
        });

        uploader.bind('StateChanged', function(up) {
            //当前的上传状态，可能的值为plupload.STARTED或plupload.STOPPED，该值由Plupload实例的stop()或statr()方法控制。默认为plupload.STOPPED
            console.group("StateChanged事件");
            console.dir(up.state);
        });

        uploader.bind('UploadComplete', function(up, files) {
            console.group("UploadComplete事件");

        });
        uploader.bind('FilesRemoved', function(up, files) {
            console.group("FilesRemoved事件");

            $.each(files, function(index, file) {

                $("#" + file.id).remove();

            });


            setTimeout(function() {
                if (!uploader.total.queued) {
                    $uploadBtn.addClass("disabled");
                }
            })



        });

        uploader.bind('ChunkUploaded', function(up, file, info) {
            console.group("ChunkUploaded事件")
        });

        uploader.bind('Destroy', function() {
            console.group("Destroy事件")
        });

        uploader.bind('OptionChanged', function(up, name, value, oldValue) {
            console.group("OptionChanged事件")
        });
        uploader.init();
    },
    _uploadImgGalleryHandler:function(){
        var editor=this;
        var pitchImg=[];
        var $gallayListUL=editor.uploaderImg.$dialog.find(".ckeditor-gallery-list");
        var $insertBtn=editor.uploaderImg.$dialog.find(".ft-galleryall-insert");
        var $cancelBtn=editor.uploaderImg.$dialog.find(".ft-galleryall-cancel");
        var $sel=editor.uploaderImg.$dialog.find(".ft-galleryall-sel");

        function getGalleryData(data){
            $.ajax({
                url:"./lazyload.php",
                type:"post",
                data:data,
                dataType:"json",
                beforeSend:function(){

                },
                success:function(data, textStatus){
                    var strArr=[];
                    $.each(data.list,function(index,src){
                        strArr.push('<li data-src="'+src+'"><div class="pic"><img src="'+src+'" /></div><span class="status-check"></span></li>');
                    });
                   $gallayListUL.html(strArr.join(""));
                   pitchImg=data.list;
                },
                complete:function(XMLHttpRequest, textStatus){

                }
            })
        }
        $('a[href="#'+editor.name+'-tabbd-gallery-container"]').on('shown.bs.tab', function (e) {
           getGalleryData({"galleryid":1});
        }); 

        $sel.on("change",function(){
            var id=$(this).val();
            getGalleryData({"galleryid":id})
        })
        
        $gallayListUL.on("click","li",function(){
            var $this=$(this);
            if($this.hasClass('active')){
                $this.removeClass('active');
            }else{
                $this.addClass('active');
            }
        });

        $insertBtn.on("click",function(event){
            event.preventDefault();
            var $el;
                var img;
                var src;
            $gallayListUL.children('li').each(function(index, el) {
                $el=$(el);
                if($el.hasClass('active')){
                    src=$el.attr("data-src");
                    img = new CKEDITOR.dom.element( 'img' );
                    img.setAttribute( 'src',src);
                    editor.insertElement(img);
                }
            });
            layer.close(editor.uploaderImg.layerIndex); 

        })

        $cancelBtn.on("click",function(event){
            event.preventDefault();
            layer.close(editor.uploaderImg.layerIndex);
        })
    },


    init: function(editor) {
        var that = this;

        editor.ui.addButton('imagegallery', {
            // The text part of the button (if available) and the tooltip.
            label: '上传图片',
            // The command to execute on click.
            command: 'imagegallery',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'insert'
        });

        this._editImgInit.call(editor);
        this._uploadImgInit.call(editor);


        

        //绑定图片双击事件
        editor.on('doubleclick', function(evt) {

            var element = evt.data.element,
                imgW,
                imgH,
                imgAlt;
            console.dir(element);
            if (!editor.editImg.$dialog) {
                that._editImgRender.call(editor);
            }

            if (element.is('img') && !element.data('cke-realelement') && !element.isReadOnly()) {
                imgW = element.$.clientWidth;
                imgH = element.$.clientHeight;
                imgAlt = element.$.alt;
                editor.editImg.layerIndex = layer.open({
                    type: 1,
                    shade: false,
                    title: "图片属性",
                    area: '350px',
                    content: editor.editImg.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    success: function(layero, index) {
                        editor.editImg.$inputW.val(imgW);
                        editor.editImg.$inputH.val(imgH);
                        editor.editImg.$inputAlt.val(imgAlt);
                    }
                });

                editor.editImg.$btnCancel.off("click").on("click", function(event) {
                    event.preventDefault();
                    layer.close(editor.editImg.layerIndex);
                });
                editor.editImg.$btnConfirm.off("click").on("click", function(event) {
                    event.preventDefault();
                    element.setAttributes({
                        width: editor.editImg.$inputW.val(),
                        height: editor.editImg.$inputH.val(),
                        alt: editor.editImg.$inputAlt.val()
                    });
                    // var span=new CKEDITOR.dom.element('span');
                    // span.appendText(editor.editImg.$inputAlt.val());
                    // span.insertAfter(elem);

                    layer.close(editor.editImg.layerIndex);

                })

            }






            
        });

        //点击上传图片命令
        editor.addCommand('imagegallery', {
            exec: function(editor) {
                //判断页面是否纯在弹出框
                if(!editor.uploaderImg.$dialog){
                    that._uploadImgRender.call(editor);
                    that._uploadImgGalleryHandler.call(editor);
                    that._uploadImgUpHandler.call(editor);
                }
                editor.uploaderImg.layerIndex = layer.open({
                    type: 1,
                    shade: false,
                    move: ".move-seat",
                    title: false, //不显示标题
                    area: '702px',
                    content: editor.uploaderImg.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    success: function(layero, index) {
                        //ajax 请求
                    },
                    cancel: function(index, layero) {

                    }
                });
            }
        });
    },


});