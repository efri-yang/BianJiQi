(function($) {
    $(function() {

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
        });

        uploader.addButton({
            id: '#J_filePicker_2',
            label: '继续添加'
        });



        var $startContainer = $("#J_wangeditor-localupload-start");
        var $uploadfileContainer = $("#J_wangeditor-uploadfile-container");
        var $uploadfileUL = $("#J_wangeditor-uploadfile-list");
        var $uploadAllPgElem = $(".img-upload-allprogress");
        var $uploadAllPgTextElem = $uploadAllPgElem.find(".txt");
        var $uploadAllPgPerElem = $uploadAllPgElem.find(".percentage");

        var $uploadAllTextElem = $(".img-upload-info");


        var $uploadBtn = $(".img-upload-btn");
        var $addBtn = $(".img-add-btn");

        // 所有文件的进度信息，key为file id
        var percentages = {};
        var fileSize = 0;
        var fileCount = 0;
        // 可能有pedding(继续添加按钮), ready(添加完图片以后), uploading(图片正上传的时候), confirm(图片都上传好了), done.
        var state = 'pedding';


        console.dir(uploader);







        //显示错误函数
        function showError(txt) {
            if (window.layer) {
                layer.msg(txt);
            } else {
                alert(txt);
            }
        }
        //文件打下转化成对应的单位
        function conver(limit) {
            var size = "";
            if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B  
                size = limit.toFixed(2) + "B";
            } else if (limit < 0.1 * 1024 * 1024) { //如果小于0.1MB转化成KB  
                size = (limit / 1024).toFixed(2) + "KB";
            } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
                size = (limit / (1024 * 1024)).toFixed(2) + "MB";
            } else { //其他转化成GB  
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            }

            var sizestr = size + "";
            var len = sizestr.indexOf("\.");
            var dec = sizestr.substr(len + 1, 2);
            if (dec == "00") { //当小数点后为00时 去掉小数部分  
                return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
            }
            return sizestr;
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
            uploader.makeThumb(file, function(error, src) {
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
            percentages[file.id] = [file.size, 0];
            //记住 uploader.on("error"）主要对于intered的时候进行检测报错，这里是对于单个文件进行检测
            file.on('statuschange', function(cur, prev) {
                if (cur === 'error' || cur === 'invalid') {
                    showErrorForSingle(file.statusText, $errorElem);
                    percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    percentages[file.id][1] = 0;
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
                uploader.removeFile(file, true);
                console.dir(uploader.getFiles("inited"));
                console.dir(uploader.getFiles("cancelled"));
                updateTotalProgress();

            });

        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                percent;
            $.each(percentages, function(k, v) {
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
            if (state === 'ready') {
                text = '选中' + fileCount + '张图片，共' + WebUploader.formatSize(fileSize) + '。';
            } else if (state === 'confirm') {
                stats = uploader.getStats();
                if (stats.uploadFailNum) {
                    text = '已成功上传' + stats.successNum + '张照片至相册，' + stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                }
            } else {
                stats = uploader.getStats();
                text = '共' + fileCount + '张（' + WebUploader.formatSize(fileSize) + '），已上传' + stats.successNum + '张';
                if (stats.uploadFailNum) {
                    text += '，失败' + stats.uploadFailNum + '张';
                }
            }
            $uploadAllTextElem.html(text);
        }




        function setState(val) {
            var file, stats;
            if (val === state) {
                return;
            }
            $uploadBtn.removeClass('state-' + state);
            $uploadBtn.addClass('state-' + val);
            state = val;
            switch (state) {
                case 'ready': //选完图片以后
                    uploader.refresh();
                    break;
                case 'pedding':
                    $startContainer.show();
                    $uploadfileContainer.hide();
                    uploader.refresh();
                    break;
                case 'uploading':
                    //上传进度条要显示，上传按钮要隐藏，继续添加按钮要隐藏
                    $uploadAllPgElem.show();
                    $uploadAllPgElem.show();
                    $(".img-add-btn").hide();
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
                    stats = uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    break;

            }
            updateStatus();
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

        //假设设定最多上传3个文件，那么第四个不会被上传，其他的三个会被上传，但是还是会报错
        uploader.on("fileQueued", function(file) {
            // console.group("触发了：fileQueued事件(当文件被加入队列以后触发)");
            if (file.getStatus() === 'invalid') {
                //文件不合格，不能重试上传。会自动从队列中移除。

            } else {
                fileCount++;
                fileSize += file.size;
                if (fileCount > 0) {
                    //隐藏初始点击上传图片
                    $startContainer.hide();
                    $uploadfileContainer.show();
                }
                //添加li，并绑定事件
                addFile(file);
                setState('ready');
                updateTotalProgress();

            }

        });

        uploader.on("filesQueued", function(file) {
            // console.group("触发了：filesQueued事件(当一批文件添加进队列以后触发)");
        });

        uploader.on('fileDequeued', function(file) {
            fileCount--;
            fileSize -= file.size;

            if (!fileCount) {
                setState('pedding');
            }
            removeFile(file);
            updateTotalProgress();
        });

        function removeFile(file) {
            var $li = $('#' + file.id);
            delete percentages[file.id];
            $li.remove();
            updateTotalProgress();
        }
        uploader.on("uploadStart", function(file) {
            //这个时候文件就会被加入队列
            // console.group("触发了：uploadStart事件(某个文件开始上传前触发，一个文件只会触发一次)");
            // console.dir(uploader.getFiles("inited"))
            // console.dir(uploader.getFiles("queued"))
            setState('uploading');
        });

        uploader.on("stopUpload", function(file, data) {
            // console.group("触发了：uploadAccept事件");
            setState('paused');

        });

        uploader.on("uploadBeforeSend", function(file) {
            // console.group("触发了：uploadBeforeSend事件");
        });
        uploader.on("uploadProgress", function(file, percentage) {

            // console.group("触发了：uploadProgress事件");


            var $li = $('#' + file.id),
                $percent = $li.find('.img-progress span');
            $percent.css('width', percentage * 100 + '%');
            percentages[file.id][1] = percentage;
            updateTotalProgress();

        });

        uploader.on("uploadAccept", function(file, data) {
            // console.group("触发了：uploadAccept事件");
        });







        uploader.on("uploadSuccess", function(file, response) {
            // console.group("触发了：uploadSuccess");
            // console.dir(uploader.getFiles("progress"));
            // console.dir(uploader.getFiles("complete"))
            $("#" + file.id).attr("data-url", response);

        });

        uploader.on("uploadComplete", function(file, response) {
            // console.group("触发了：uploadComplete");
            // console.dir(uploader.getFiles("progress"));
            // console.dir(uploader.getFiles("error"))
        });

        uploader.on("uploadFinished", function(file, response) {
            // console.group("触发了：uploadFinished");
            setState('confirm');

        });












        uploader.on("error", function(code) {
            //如果上传同一张图片，那么就会报错！！
            switch (code) {
                case "F_EXCEED_SIZE":
                    showError('上传单个文件最大不能超过' + conver(uploader.options.fileSingleSizeLimit));
                    break;
                case "F_DUPLICATE":
                    showError('您已经上传该文件了，无需重复上传！');
                    break;
                case "Q_TYPE_DENIED":
                    showError('您上传的' + uploader.options.accept.mineTypes + '类型文件！');
                    break;
                case "Q_EXCEED_NUM_LIMIT":
                    showError('每次最多上传' + uploader.options.fileNumLimit + "个,多出文件将不被上传！");
                    break;
                default:
                    showError("文件上传出错！");
            }
        });


        $uploadBtn.on("click", function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if (state === 'ready') {
                uploader.upload();
            } else if (state === 'paused') {
                uploader.upload();
            } else if (state === 'uploading') {
                uploader.stop();
            }
        });


        $uploadfileContainer.on("click", ".retry", function() {
            uploader.retry();
        })

        $uploadfileContainer.on("click", ".ignore", function() {
            //忽略 这个时候的状态是confirm
            console.dir(uploader.getFiles())
            console.dir(fileSize)
            var files = uploader.getFiles("error");
            for (var i = 0; i < files.length; i++) {
                uploader.removeFile(files[i], true);
                $("#" + files[i].id).remove();
            }

            updateStatus();
            setState("ready");


        })


        $uploadBtn.addClass('state-' + state);
        updateTotalProgress();





        $('.imgupload-tab-hd a').click(function(e) {
            e.preventDefault()
            $(this).editorTab('show')
        })





        $(".ft-btn-insert").on("click",function(){
        	var $url=$("#J_wangeditor-uploadfile-list li").eq(0).attr("data-url");
        	html="<img src='"+$url+"' style='max-width:100%;'/>";
        	editor.command(null, 'insertHtml', html);

        	$("#J_wangeditor-imgupload-dialog").hide();
        	
        })


   console.dir(editor.customCommand)












    })

})(jQuery);