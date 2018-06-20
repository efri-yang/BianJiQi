(function() {

    // 获取 wangEditor 构造函数和 jquery
    var E = window.wangEditor;
    var $ = window.jQuery;

    // 通过 E.plugin 注入插件代码
    E.plugin(function() {

        // 此处的 this 指向 editor 对象本身
        var editor = this;
        var $txt = editor.$txt;
        var elemId = editor.$valueContainer.attr("id");

        var $webuploaderDialog; //上传组件弹出框容器

        $('[data-relateto="' + elemId + '"]').attr("id", elemId + "-imgupload-dialog");
        $webuploaderDialog = $("#" + elemId + "-imgupload-dialog");



        var $uploadStartContainer = $webuploaderDialog.find(".wangeditor-localupload-start");
        $uploadStartContainer.attr("id", elemId + "-localupload-start");


        var $uploadfileContainer=$webuploaderDialog.find(".wangeditor-uploadfile-container");
        var $uploadfileUL=$webuploaderDialog.find(".wangeditor-uploadfile-list");

        var $uploadAllPgElem = $webuploaderDialog.find(".img-upload-allprogress");//总文件进度条
        var $uploadAllPgTextElem = $uploadAllPgElem.find(".txt");//总文件进度数字
        var $uploadAllPgPerElem = $uploadAllPgElem.find(".percentage");//总文件进度百分比
        var $uploadAllTextElem = $webuploaderDialog.find(".img-upload-info"); //总提示信息文字
        var $uploadBtn = $webuploaderDialog.find(".img-upload-btn");//上传文件按钮
        var $addBtn = $webuploaderDialog.find(".img-add-btn");//添加文件按钮

        var $insertBtn=$webuploaderDialog.find(".ft-btn-insert");
        var $galleryListUL=$webuploaderDialog.find(".wangeditor-gallery-list");


        //*****webuploader默认的配置 初始化**************************************************
        var defaultConfig = {
            pick: {
                id: '#J_filePicker_1',
                label: '点击选择图片'
            },
            dnd: "#" + elemId + "-localupload-start",
            paste: "#" + elemId + "-localupload-start",
            // accept: { // 只允许选择图片文件格式
            //     title: 'Images',
            //     extensions: 'gif,jpg,bmp,png',
            //     mimeTypes: 'image/jpg,image/jpeg,image/png'
            // },
            server: './php/fileupload.php',
            swf: './dist/webuploader/Uploader.swf',
            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            //限制文件的大小
            fileSingleSizeLimit: 4 * 1024 * 1024,
            // fileSingleSizeLimit:2 * 1024 * 1024,
            fileNumLimit: 30,
            fileSizeLimit: 100 * 1024 * 1024,
            addButton: {
                id: '#J_filePicker_2',
                label: '继续添加'
            }
        }

        var opt = $.extend(true, defaultConfig, editor.config.webuploader);
        editor.uploader = WebUploader.create(opt);
        if (opt.addButton) {
            editor.uploader.addButton(opt.addButton);
        }

        editor.uploader.percentages = {};
        editor.uploader.fileSize = 0;
        editor.uploader.fileCount = 0;
        // 可能有pedding(继续添加按钮), ready(添加完图片以后), uploading(图片正上传的时候), confirm(图片都上传好了), done.
        editor.uploader.state = 'pedding';

        //显示错误函数
        function showError(txt) {
            if (window.layer) {
                layer.msg(txt);
            } else {
                alert(txt);
            }
        }

        //单个图片显示错误
        function showErrorForSingle(code, $elem) {
            switch (code) {
                case 'exceed_size':
                    text = '文件大小超出';
                    break;
                case 'interrupt':
                    text = '上传暂停';
                    break;
                default:
                    text = '上传失败，请重试';
                    break;
            }
            $elem.text(text).show();
        }


        //添加li
        function addFile(file) {
            var str = '<li id="' + file.id + '">' +
                '<div class="img-before-preview">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="txt-1">预览中...</p>' +
                '</div>' +
                '<div class="img-after-preview">' +
                '<img src="" class="img-upload" />' +
                '</div>' +
                '<a href="#" class="img-del-btn"></a>' +
                '<div class="img-progress"><span style="width:50%;"></span></div>' +
                '<span class="img-error">上传失败，请重试</span>' +
                '<span class="img-success"></span>' +
                '</li>';
            var $li = $(str);
            $uploadfileUL.append($li);

            var $prewTxtElem = $li.find(".img-before-preview .txt-1");
            var $imgElem = $li.find(".img-upload");
            var $beforePreviewElem = $li.find(".img-before-preview");
            var $afterPreviewElem = $li.find(".img-after-preview");
            var $delBtnElem = $li.find(".img-del-btn");
            var $successElem = $li.find(".img-success");
            var $progressElem = $li.find(".img-progress");
            var $errorElem = $li.find(".img-error");





            //base64位预览
            editor.uploader.makeThumb(file, function(error, src) {
                if (error) {
                    $prewTxtElem.text('不能预览');
                    return;
                }
                $beforePreviewElem.hide();
                $imgElem.attr("src", src);
                $afterPreviewElem.show();
                $delBtnElem.show();

            });
            //进度信息
            editor.uploader.percentages[file.id] = [file.size, 0];
            //记住 uploader.on("error"）主要对于intered的时候进行检测报错，这里是对于单个文件进行检测
            file.on('statuschange', function(cur, prev) {
                if (cur === 'error' || cur === 'invalid') {
                    showErrorForSingle(file.statusText, $errorElem);
                    editor.uploader.percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    editor.uploader.percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    $delBtnElem.hide();
                    $progressElem.show();
                    $errorElem.hide();
                } else if (cur === 'complete') {
                    $progressElem.hide();
                    $successElem.show();
                }
            });

            $delBtnElem.on("click", function(event) {
                event.preventDefault();
                editor.uploader.removeFile(file, true);
                console.dir(editor.uploader.getFiles("inited"));
                console.dir(editor.uploader.getFiles("cancelled"));
                updateTotalProgress();

            });

        }


        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                percent;
            $.each(editor.uploader.percentages, function(k, v) {
                total += v[0];
                loaded += v[0] * v[1];
            });
            percent = total ? loaded / total : 0;
            $uploadAllPgTextElem.text(Math.round(percent * 100) + '%');
            $uploadAllPgPerElem.css('width', Math.round(percent * 100) + '%')
            //进度条显示以后，更新旁边的文字
            updateStatus();
        }

        function updateStatus() {
            var text = '',
                stats;
            if (editor.uploader.state === 'ready') {
                text = '选中' + editor.uploader.fileCount + '张图片，共' + WebUploader.formatSize(editor.uploader.fileSize) + '。';
            } else if (editor.uploader.state === 'confirm') {
                stats = editor.uploader.getStats();
                if (stats.uploadFailNum) {
                    text = '已成功上传' + stats.successNum + '张照片，' + stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                }
            } else {
                stats = editor.uploader.getStats();
                text = '共' + editor.uploader.fileCount + '张（' + WebUploader.formatSize(editor.uploader.fileSize) + '），已上传' + stats.successNum + '张';
                if (stats.uploadFailNum) {
                    text += '，失败' + stats.uploadFailNum + '张';
                }
            }
            $uploadAllTextElem.html(text);
        }


         function setState(val) {
            var file, stats;
            if (val === editor.uploader.state) {
                return;
            }
            $uploadBtn.removeClass('state-' + editor.uploader.state);
            $uploadBtn.addClass('state-' + val);
            editor.uploader.state = val;
            switch (editor.uploader.state) {
                case 'ready': //选完图片以后
                    editor.uploader.refresh();
                    $uploadBtn.removeClass('disabled');

                    break;
                case 'pedding':
                    $uploadStartContainer.show();
                    $uploadfileContainer.hide();
                    editor.uploader.refresh();
                    break;
                case 'uploading':
                    //上传进度条要显示，上传按钮要隐藏，继续添加按钮要隐藏
                    $uploadAllPgElem.show();
                    $uploadAllPgElem.show();
                    $addBtn.hide();
                    $insertBtn.addClass('disabled');
                    $uploadBtn.text('暂停上传');
                    break;
                case 'paused':
                    $uploadBtn.text('继续上传');
                    break;
                case 'confirm':
                    //上传进度条要隐藏
                    $uploadAllPgElem.hide();
                    $addBtn.show();
                    $uploadBtn.text('开始上传');
                    $insertBtn.removeClass('disabled');
                    $uploadBtn.addClass('disabled');
                    stats = editor.uploader.getStats();
                    !!stats.successNum ? $insertBtn.removeClass('disabled') :$insertBtn.addClass('disabled');
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    $uploadBtn.addClass('disabled');
                    break;

            }
            updateStatus();
        }

        function closeLayer(){
            var layerIndex=editor.$valueContainer.attr("layer-index");
            layer.close(layerIndex);
        }



       

        editor.uploader.on('dialogOpen', function() {
            // console.dir("触发了：dialogOpen(本地上传窗口打开的时候)");
        });

        editor.uploader.on("beforeFileQueued", function(file) {
            // console.group("触发了：beforeFileQueued事件(当文件被加入队列之前触发)");
        });

        //假设设定最多上传3个文件，那么第四个不会被上传，其他的三个会被上传，但是还是会报错
        editor.uploader.on("fileQueued", function(file) {
            // console.group("触发了：fileQueued事件(当文件被加入队列以后触发)");
            if (file.getStatus() === 'invalid') {
                //文件不合格，不能重试上传。会自动从队列中移除。

            } else {
                editor.uploader.fileCount++;
                editor.uploader.fileSize += file.size;
                if (editor.uploader.fileCount > 0) {
                    //隐藏初始点击上传图片
                    $uploadStartContainer.hide();
                    $uploadfileContainer.show();
                    editor.uploader.refresh();
                }
                //添加li，并绑定事件
                addFile(file);
                setState('ready');
                updateTotalProgress();

            }

        });

        editor.uploader.on("filesQueued", function(file) {
            // console.group("触发了：filesQueued事件(当一批文件添加进队列以后触发)");
        });

        editor.uploader.on('fileDequeued', function(file) {
            editor.uploader.fileCount--;
            editor.uploader.fileSize -= file.size;

            if (!editor.uploader.fileCount) {
                setState('pedding');
            }
            removeFile(file);
            updateTotalProgress();
        });

         function removeFile(file) {
            var $li = $('#' + file.id);
            delete editor.uploader.percentages[file.id];
            $li.remove();
            updateTotalProgress();
        }


        editor.uploader.on("uploadStart", function(file) {
            //这个时候文件就会被加入队列
            // console.group("触发了：uploadStart事件(某个文件开始上传前触发，一个文件只会触发一次)");
            // console.dir(uploader.getFiles("inited"))
            // console.dir(uploader.getFiles("queued"))
            setState('uploading');
        });

        editor.uploader.on("stopUpload", function(file, data) {
            // console.group("触发了：uploadAccept事件");
            setState('paused');

        });


        editor.uploader.on("uploadBeforeSend", function(file) {
            // console.group("触发了：uploadBeforeSend事件");
        });
        editor.uploader.on("uploadProgress", function(file, percentage) {

            // console.group("触发了：uploadProgress事件");


            var $li = $('#' + file.id),
                $percent = $li.find('.img-progress span');
            $percent.css('width', percentage * 100 + '%');
            editor.uploader.percentages[file.id][1] = percentage;
            updateTotalProgress();

        });

        editor.uploader.on("uploadAccept", function(file, data) {
            // console.group("触发了：uploadAccept事件");
        });


        editor.uploader.on("uploadSuccess", function(file, response) {
            // console.group("触发了：uploadSuccess");
            // console.dir(uploader.getFiles("progress"));
            // console.dir(uploader.getFiles("complete"))
            $("#" + file.id).attr("data-url", response);

        });

       editor.uploader.on("uploadComplete", function(file, response) {
            // console.group("触发了：uploadComplete");
            // console.dir(uploader.getFiles("progress"));
            // console.dir(uploader.getFiles("error"))
        });

        editor.uploader.on("uploadFinished", function(file, response) {
            // console.group("触发了：uploadFinished");
            setState('confirm');

        });

        editor.uploader.on("error", function(code) {
            //如果上传同一张图片，那么就会报错！！
            switch (code) {
                case "F_EXCEED_SIZE":
                    showError('上传单个文件最大不能超过' + WebUploader.formatSize(fileSingleSizeLimit));
                    break;
                case "F_DUPLICATE":
                    showError('您已经上传该文件了，无需重复上传！');
                    break;
                case "Q_TYPE_DENIED":
                    showError('您上传的' + editor.uploader.options.accept.mineTypes + '类型文件！');
                    break;
                case "Q_EXCEED_NUM_LIMIT":
                    showError('每次最多上传' + editor.uploader.options.fileNumLimit + "个,多出文件将不被上传！");
                    break;
                default:
                    showError("文件上传出错！");
            }
        });

        //*****点击上传按钮**************************************************
        $uploadBtn.on("click", function(event) {
            event.preventDefault();
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if (editor.uploader.state === 'ready') {
                editor.uploader.upload();
            } else if (editor.uploader.state === 'paused') {
                editor.uploader.upload();
            } else if (editor.uploader.state === 'uploading') {
                editor.uploader.stop();
            }
        });

        //*****本地上传点击插入按钮**************************************************
        $insertBtn.on("click",function(event){
            event.preventDefault();
            if($(this).hasClass('disabled')) return;
            var html="",url;
            //
            $uploadfileUL.children('li').each(function(index, el) {
                var $el=$(el);
                if($el.hasClass('had-insert')) return;
                url=$el.attr("data-url");
                if(!!url){
                    html="<img src='"+url+"' style='max-width:100%;'/>";
                }
                !!html&& editor.command(null, 'insertHtml', html,function(){
                      $(el).addClass('had-insert')  
                });
            });


            closeLayer();
        });

        //*****本地上传点击插入按钮**************************************************  
        var $galleryallInsertBtn= $webuploaderDialog.find(".ft-galleryall-insert");
        $galleryallInsertBtn.on("click",function(){

            var html="",url;
             $galleryListUL.children('li').each(function(index, el) {
                 url=$(el).find("img").attr("src");
                    console.dir(url);
                if(!!url){
                    html+="<img src='"+url+"' style='max-width:100%;'/>";
                }
             });
             // !!html&& editor.command(null, 'insertHtml', html);
             // closeLayer();
        })





        //*****tab选项卡切换**************************************************
        $webuploaderDialog.find('.imgupload-tab-hd a').click(function(e) {
            e.preventDefault()
            $(this).editorTab('show');
            editor.uploader.refresh();
        });


        //*****重新上传**************************************************
        
        $webuploaderDialog.on("click", ".retry", function() {
            editor.uploader.retry();
        })
        
        //*****忽略按钮**************************************************
        $webuploaderDialog.on("click", ".ignore", function() {
            var files = editor.uploader.getFiles("error");
            for (var i = 0; i < files.length; i++) {
                editor.uploader.removeFile(files[i], true);
                $("#" + files[i].id).remove();
            }
            updateStatus();
            setState("ready");
        });

        //*****相册列表**************************************************
        $galleryListUL.on("click","li",function(){
            var $this=$(this);
            if(!$this.hasClass('active')){
                $this.addClass('active');
            }else{
                $this.removeClass('active');
            }
        })

        //*****上传关闭按钮**************************************************
        $webuploaderDialog.find(".ft-btn-cancel,.ft-galleryall-cancel").on("click",function(event){
                event.preventDefault();
                closeLayer();
        });

        //*****上传关闭按钮**************************************************
        
        //初始化执行
        $uploadBtn.addClass('state-' + editor.uploader.state);
        updateTotalProgress();
    });

})();