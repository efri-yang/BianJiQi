(function(){


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
            '<div class="item-ratio">' +
                '<span class="btnlock J_btnlock"></span>' +
                '<span class="btnreset J_btnreset"></span>' +
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

        editor.editImg.$btnReset=editor.editImg.$dialog.find(".J_btnreset");
        editor.editImg.$btnLock=editor.editImg.$dialog.find(".J_btnlock");


        editor.editImg.$inputW.on("keyup",function(){
            var $this=$(this);
            var imgH;
            var val=$this.val() ? parseInt($this.val()) :"";
            var element=editor.editImg.element;

            
            editor.editImg.$inputW.val(val);
            
            if(element.imgLock){
                //锁住那么要计算一下高度
                if(val){
                    imgH=Math.floor(val/element.ratio);
                }else{
                    imgH="";
                }
                
                
                editor.editImg.$inputH.val(imgH); 
            }
        });

        editor.editImg.$inputH.on("keyup",function(){
            var $this=$(this);
            var imgH;
            var val=$this.val() ? parseInt($this.val()) :"";
            var element=editor.editImg.element;

            
            editor.editImg.$inputH.val(val);
            
            if(element.imgLock){
                //锁住那么要计算一下高度
                if(val){
                    imgW=Math.floor(val*element.ratio);
                }else{
                    imgW="";
                }
                
                
                editor.editImg.$inputW.val(imgW); 
            }
        });



    },

    _uploadImgInit: function() {
        var editor = this;
        editor.uploaderImg = {};
        editor.uploaderImg.dialogId = editor.name + "-imgupload-dialog";
    },

    _uploadImgRender: function() {
        var editor = this;
        var htmlStr = '<div class="ckeditor-imgupload-dialog" id="' + editor.uploaderImg.dialogId + '"><ul class="imgupload-tab-hd"><li class="active"><a href="#' + editor.name + '-tabbd-localupload-container">本地上传</a></li><li><a href="#' + editor.name + '-tabbd-gallery-container">相册图片</a></li><li class="move-seat"></li></ul><div class="ckeditor-localupload-container active" id="' + editor.name + '-tabbd-localupload-container"><div class="ckeditor-uploadfile-container"><div class="ckeditor-uploadfile-hd"><div class="img-upload-allprogress"><span class="txt"></span><span class="percentage"></span></div><div class="img-upload-info"></div><a href="javascript:void(0);" class="img-upload-btn disabled">开始上传</a><div class="img-add-btn">添加文件</div><a href="javascript:void(0);" class="img-pause-btn">暂停上传</a></div><ul class="ckeditor-uploadfile-list"></ul><div class="ckeditor-uploadfile-ft"><label class="ft-save-checkbox"><input type="checkbox" name="saveingallery" />保存到相册</label><select class="ft-gallery-sel" disabled></select><a href="#" class="ft-btn-insert disabled">插入</a><a href="#" class="ft-btn-cancel">关闭</a></div><div class="ckeditor-uploadfile-errortip"><i class="close"></i><div class="txt"></div></div></div></div><div class="ckeditor-gallery-container" id="' + editor.name + '-tabbd-gallery-container"><div class="ckeditor-gallery-nodata" style="display:none;">您的相册目前还没有照片,<a href="#">立马去上传</a></div><div class="ckeditor-gallery-hasdata" style="display:block;"><ul class="ckeditor-gallery-list"></ul><div class="ckeditor-gallery-ft"><select class="ft-galleryall-sel"></select><a href="#" class="ft-galleryall-insert">插入</a><a href="#" class="ft-galleryall-cancel">取消</a></div></div></div></div>';
        $(htmlStr).appendTo($("body"));
        var $dialog = $("#" + editor.uploaderImg.dialogId);
        editor.uploaderImg.$dialog = $dialog;

        $.ajax({
            url: editor.config.imageGallery.gallerytypeUrl,
            type: "post",
            data: "", //用户id
            dataType: "json",
            beforeSend: function() {

            },
            success: function(data, textStatus) {
                var strArr = [];
                $.each(data.list, function(index, obj) {
                    strArr.push('<option value="' + obj.id + '">' + obj.text + '</option>');
                });
                $dialog.find(".ft-galleryall-sel,.ft-gallery-sel").html(strArr.join(""));

            },
            complete: function(XMLHttpRequest, textStatus) {

            }
        })
        //tab 选项卡
        $dialog.find('.imgupload-tab-hd a').click(function(e) {
            e.preventDefault();
            $(this).editorTab('show');
        });







    },
    _uploadImgUpHandler: function() {
        var editor = this;
        var $uploadBtn = editor.uploaderImg.$dialog.find(".img-upload-btn");
        var $addBtn = editor.uploaderImg.$dialog.find(".img-add-btn");
        var $insertBtn = editor.uploaderImg.$dialog.find(".ft-btn-insert");
        var $closeBtn = editor.uploaderImg.$dialog.find(".ft-btn-cancel");
        var $fileListUL = editor.uploaderImg.$dialog.find(".ckeditor-uploadfile-list");
        var $saveInGallery = editor.uploaderImg.$dialog.find('input[name="saveingallery"]');
        var $selGallery = editor.uploaderImg.$dialog.find(".ft-gallery-sel");
        var $errorTip = editor.uploaderImg.$dialog.find(".ckeditor-uploadfile-errortip");
        var $uploadInfo = editor.uploaderImg.$dialog.find(".img-upload-info");
        var $pauseBtn = editor.uploaderImg.$dialog.find(".img-pause-btn");
        var $uploadProgress = editor.uploaderImg.$dialog.find(".img-upload-allprogress");

        var stating = "STOPPED";
        var fileSize = 0;

        $addBtn.attr("id", editor.name + "-img-add-btn");

        var defaultConfig = {
            plupload: {
                // runtimes: 'html5,flash,silverlight,html4',
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: editor.name + "-img-add-btn", // you can pass an id...
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


        var opts = jQuery.extend(true, defaultConfig, editor.config.imageGallery);


        var uploader = new plupload.Uploader(opts.plupload);

        plupload.extend(uploader.getOption('filters'), {
            max_imgfile_count: uploader.settings.max_imgfile_count
        });





        plupload.addFileFilter('max_imgfile_count', function(maxCount, file, cb) {
            if (maxCount <= uploader.files.length - (uploader.total.uploaded + uploader.total.failed)) {
                //抛出上传个数限制
                uploader.trigger('error', {
                    code: -9001,
                    file: file
                })
                cb(false);
            } else {
                cb(true);
            }
        });

        function updateTotalText() {
            var text = '';
            if (stating === 'FilesAdded') {
                text = '选中' + uploader.files.length + '张图片，共' + plupload.formatSize(fileSize) + '。';
            } else if (stating === 'UploadComplete') {
                text = '共' + uploader.files.length + '张（' + plupload.formatSize(fileSize) + '），已上传' + uploader.total.uploaded + '张';
                if (uploader.total.failed) {
                    text += '，失败' + uploader.total.failed + '张,<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>';
                }
            } else if (stating === 'Del') {
                text = '选中' + uploader.files.length + '张图片';
                if (uploader.total.uploaded) {
                    text += ',已上传' + uploader.total.uploaded + '张';
                }
            }
            $uploadInfo.html(text);
        }

        function _handleState() {
            var filesPending = uploader.files.length - (uploader.total.uploaded + uploader.total.failed);
            var maxCount = uploader.getOption('filters').max_imgfile_count || 0;
            if (plupload.STARTED === uploader.state) {
                //此时表示正在上传
                $pauseBtn.show();
            } else if (plupload.STOPPED === uploader.state) {
                //停止上传
                $pauseBtn.hide();

            }
        }

        function updateTotalProgress() {
            $uploadProgress.find(".txt").text(uploader.total.percent + "%");
            $uploadProgress.find(".percentage").width(uploader.total.percent + "%");
        }


        $closeBtn.on("click", function(event) {
            event.preventDefault();
            layer.close(editor.uploaderImg.layerIndex);
        });

        $errorTip.find(".close").on("click", function(event) {
            event.preventDefault();
            $errorTip.hide();
        })

        $saveInGallery.on("change", function() {
            var $this = $(this);
            if ($this.prop('checked')) {
                $selGallery.removeAttr('disabled');
            } else {
                $selGallery.attr('disabled', 'disabled');
            }

        })

        $insertBtn.on("click", function(event) {
            event.preventDefault();
            var str = "";
            $fileListUL.children("li").each(function(index, el) {
                var $el = $(el);
                var src = $el.attr("data-src");
                var id = $el.attr("id");

                if (!!src) {
                    // str='<div class="simplebox"><p><img src="'+src+'" /></p><div class="simplebox-content"><p>Content...</p></div></div>';
                    var img = editor.document.createElement('img');
                    img.setAttributes({'src':src});
                    editor.insertElement(img);
                    editor.insertHtml(str);
                    uploader.removeFile(id);
                    $el.remove();
                }
            });
            stating =false;
            updateTotalText();
            layer.close(editor.uploaderImg.layerIndex);

        });
        editor.uploaderImg.$dialog.on("click", ".retry", function(event) {
            event.preventDefault();
            var len = uploader.files.length;
            for (var i = len - 1; i >= 0; i--) {
                if (uploader.files[i].status == 4) {
                    uploader.files[i].status = 1;
                }
            }
            uploader.start();
        })
        editor.uploaderImg.$dialog.on("click", ".ignore", function(event) {
            event.preventDefault();
            var len = uploader.files.length;
            for (var i = len - 1; i >= 0; i--) {
                uploader.removeFile(uploader.files[i]);
            }
        })
        uploader.bind("Init", function(uploader) {
            // console.group("Init事件:当Plupload初始化完成后触发监听函数参数：(uploader)");
        });

        uploader.bind("PostInit", function() {
            // console.group("PostInit事件:当Init事件发生后触发监听函数参数：(uploader)");
            $uploadBtn.on("click", function(event) {
                event.preventDefault();
                uploader.start();
            });

            $pauseBtn.click(function(e) {

                uploader.stop();
                e.preventDefault();
            });
        });

        uploader.bind("Browse", function(up) {
            // console.group("Browse事件")
        });
        uploader.bind('FileFiltered', function(up, file) {
            // console.group("FileFiltered事件")
            if (uploader.settings.filters.max_imgfile_count <= uploader.files.length - (uploader.total.uploaded + uploader.total.failed)) {
                $addBtn.addClass('disabled');
                uploader.disableBrowse(true);
             }
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
            // console.group("FilesAdded事件");

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
                fileSize += file.size;
                $del.show();

                $del.on("click", function(event) {
                    event.preventDefault();
                    uploader.removeFile(file);
                    stating = 'Del';
                    updateTotalText();
                    if (!uploader.total.loaded) {
                        $insertBtn.addClass("disabled");
                    }



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
            stating = "FilesAdded";
            updateTotalText();
        });
        uploader.bind('QueueChanged', function(up) {
            // console.group("QueueChanged事件");
            _handleState();
        });
        uploader.bind('Refresh', function(up) {
            // console.group("Refresh事件");
            // console.dir(up.total);

            if (!up.total.uploaded) {
                $insertBtn.addClass("disabled");
            } else {
                $insertBtn.removeClass("disabled");
            }
        });
        uploader.bind('BeforeUpload', function(up, file) {
            // console.group("BeforeUpload事件");
            // console.dir(file);
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").show();
            $li.find(".img-del-btn").hide();
        });
        uploader.bind('UploadProgress', function(up, file) {
            // console.group("UploadProgress事件");
            // console.dir(file);
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").show();
            $propress.children('span').css("width", file.percent + "%");
            $uploadProgress.show();
            $uploadInfo.hide();
            stating = "UploadProgress";
            updateTotalProgress();

        });
        uploader.bind('FileUploaded', function(up, file, info) {
            // console.dir(info);
            // console.group("FileUploaded事件");
            var $li = $("#" + file.id);
            var $propress = $li.find(".img-progress").hide();
            $li.find(".img-success").show();
            $li.attr("data-src", info.response);
            $li.find(".img-del-btn").show();
            $insertBtn.removeClass("disabled");
        });

        uploader.bind('StateChanged', function(up) {
            //当前的上传状态，可能的值为plupload.STARTED或plupload.STOPPED，该值由Plupload实例的stop()或statr()方法控制。默认为plupload.STOPPED
            // console.group("StateChanged事件");
            // console.dir(up.state);
            if (!uploader.total.uploaded) {
                $insertBtn.addClass("disabled");
            } else {
                $insertBtn.removeClass("disabled");
            }
            _handleState();
        });

        uploader.bind('UploadComplete', function(up, files) {
            // console.group("UploadComplete事件");
             $uploadProgress.hide();
            $uploadInfo.show();
            stating = "UploadComplete";
            updateTotalText();

        });
        uploader.bind('FilesRemoved', function(up, files) {
            // console.group("FilesRemoved事件");

            $.each(files, function(index, file) {

                $("#" + file.id).remove();
                fileSize -= file.size;

            });


            setTimeout(function() {
                if (!uploader.total.queued) {
                    $uploadBtn.addClass("disabled");
                }
            })
        });

        uploader.bind('ChunkUploaded', function(up, file, info) {
            // console.group("ChunkUploaded事件")
        });

        uploader.bind('Destroy', function() {
            // console.group("Destroy事件")
        });

        uploader.bind('OptionChanged', function(up, name, value, oldValue) {
            // console.group("OptionChanged事件")
        });


        uploader.bind('Error', function(up, err) {
            var details = "";
            console.dir(err);
            switch (err.code) {
                case plupload.FILE_EXTENSION_ERROR:
                    details = err.file.name + "文件不符合格式要求！";
                    break;

                case plupload.FILE_SIZE_ERROR:
                    alert(err.file.size);
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
            $errorTip.show().find(".txt").html(details);
        });
        uploader.init();
    },
    _uploadImgGalleryHandler: function() {
        var editor = this;
        var pitchImg = [];
        var $gallayListUL = editor.uploaderImg.$dialog.find(".ckeditor-gallery-list");
        var $insertBtn = editor.uploaderImg.$dialog.find(".ft-galleryall-insert");
        var $cancelBtn = editor.uploaderImg.$dialog.find(".ft-galleryall-cancel");
        var $sel = editor.uploaderImg.$dialog.find(".ft-galleryall-sel");

        function getGalleryData(data) {
            $.ajax({
                url: editor.config.imageGallery.getGalleryListUrl,
                type: "post",
                data: data,
                dataType: "json",
                beforeSend: function() {

                },
                success: function(data, textStatus) {
                    var strArr = [];
                    $.each(data.list, function(index, src) {
                        strArr.push('<li data-src="' + src + '"><div class="pic"><img src="' + src + '" /></div><span class="status-check"></span></li>');
                    });
                    $gallayListUL.html(strArr.join(""));
                    pitchImg = data.list;
                },
                complete: function(XMLHttpRequest, textStatus) {

                }
            })
        }
        $('a[href="#' + editor.name + '-tabbd-gallery-container"]').on('shown.bs.tab', function(e) {
            getGalleryData({ "galleryid": 1 });
        });

        $sel.on("change", function() {
            var id = $(this).val();
            getGalleryData({ "galleryid": id })
        })

        $gallayListUL.on("click", "li", function() {
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                $this.addClass('active');
            }
        });

        $insertBtn.on("click", function(event) {
            event.preventDefault();
            var $el;
            var img;
            var src;
            $gallayListUL.children('li').each(function(index, el) {
                $el = $(el);
                if ($el.hasClass('active')) {
                    src = $el.attr("data-src");
                    img = new CKEDITOR.dom.element('img');
                    img.setAttribute('src', src);
                    editor.insertElement(img);
                }
            });
            layer.close(editor.uploaderImg.layerIndex);

        })

        $cancelBtn.on("click", function(event) {
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
            toolbar: 'insert,2'
        });

        this._editImgInit.call(editor);
        this._uploadImgInit.call(editor);


        
        //绑定图片双击事件
        editor.on('doubleclick', function(evt) {
            var element =editor.editImg.element=evt.data.element,
                imgW="",
                imgH="",
                imgAlt;
            // if (element.is('img') && !element.data('cke-realelement') && !element.isReadOnly()) {
            if (element.is('img') && !element.data('cke-realelement') && !element.isReadOnly()) {
                if (!editor.editImg.$dialog) {
                    that._editImgRender.call(editor);
                }
                if(!element.ratio){
                   element.ratio=element.$.naturalWidth/element.$.naturalHeight;
                }
               console.dir(editor.editImg.element);
               
                // console.dir(element.);
                // console.dir(element.style.width);
                if(element.getAttribute("width")){
                    imgW = element.$.clientWidth;
                }
                 if(element.getAttribute("height")){
                    imgH = element.$.clientHeight;
                }

                if(imgH !=element.$naturalWidth || imgW !=element.$.naturalHeight){
                        element.imgLock=false;
                }

                imgAlt = element.$.alt;
                editor.editImg.layerIndex = layer.open({
                    type: 1,
                    shade: false,
                    title: "图片属性",
                    area: '350px',
                    content: editor.editImg.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    success: function(layero, index) {
                        if(element.imgLock || element.imgLock==null){
                            editor.editImg.$btnLock.removeClass('unlock');
                        }else{
                            editor.editImg.$btnLock.addClass('unlock');
                        }
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

                    layer.close(editor.editImg.layerIndex);

                });

                editor.editImg.$btnReset.off("click").on("click",function(){
                    imgW = element.$.naturalWidth;
                    imgH = element.$.naturalHeight;
                    editor.editImg.$inputW.val(imgW);
                    editor.editImg.$inputH.val(imgH);
                });

                //锁住和解锁  锁住的时候还要根据图片的比例强制设置宽高
                editor.editImg.$btnLock.off("click").on("click",function(){
                    imgW = editor.editImg.$inputW.val(),
                    imgH = editor.editImg.$inputH.val();
                   
                    if(element.imgLock || element.imgLock==null){
                        editor.editImg.$btnLock.addClass('unlock');
                        element.imgLock=false;
                    }else{
                        element.imgLock=true;
                        editor.editImg.$btnLock.removeClass('unlock');
                        if(imgW){
                            imgH=Math.floor(imgW/element.ratio);
                            editor.editImg.$inputH.val(imgH);
                            editor.editImg.$inputW.val(imgW);
                        }else if(imgH){
                            imgW=Math.floor(imgH*element.ratio);
                            editor.editImg.$inputW.val(imgW);
                        }else{

                        }
                    }



                })

            }
        });

        //点击上传图片命令
        editor.addCommand('imagegallery', {
            exec: function(editor) {
                //判断页面是否纯在弹出框
                if (!editor.uploaderImg.$dialog) {
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


})();