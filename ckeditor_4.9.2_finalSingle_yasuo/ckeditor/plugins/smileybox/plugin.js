(function() {
    CKEDITOR.plugins.add('smileybox', {
        icons: 'smileybox',
        beforeInit: function(editor) {
            editor.smiley = {};
            editor.smiley.dialogId = editor.name + "-smiley-dialog";
            editor.smiley.initialLinkText = "";
        },
        init: function() {
            editor.ui.addButton('smileybox', {
                // The text part of the button (if available) and the tooltip.
                label: '表情符号',
                // The command to execute on click.
                command: 'smileybox',
                // The button placement in the toolbar (toolbar group name).
                toolbar: 'insert,2'
            });

            $(document).on("click",".smiley-pic-list img",function(event){
                event.preventDefault();
                var $el = $(this);
                var src = $el.attr("src");
                var img = new CKEDITOR.dom.element('img');
                    img.setAttribute('src', src);
                    editor.insertElement(img);
            });


            editor.addCommand('smileybox', {
                exec: function(editor) {
                	if(!editor.smiley.$dialog){
                        //进行ajax请求并返回数据
                        renderDialogHtml.call(editor);
                    }

                    editor.smiley.layerIndex = layer.open({
                        type: 1,
                        shade: false,
                        title: false, //不显示标题
                        area: "420px",
                        content: editor.smiley.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                        success: function(layero, index) {
                            
                        },
                        cancel: function(index, layero) {

                        }
                    })
                }
            });
        }
    });

    function renderDialogHtml(){
        var editor=this;
        var str='<div class="ckeditor-smiley-dialog" id="' + editor.smiley.dialogId + '">'+
                    '<ul class="smiley-hd-list">'+
                        '<li class="active"><a href="#">默认表情</a></li>'+
                        '<li><a href="#">小鱼</a></li>'+
                        '<li><a href="#">免司机</a></li>'+
                        '<li class="move-seat"></li>'+
                    '</ul>'+
                    '<div class="smiley-bd">'+
                        '<ul class="smiley-pic-list">'+
                            '<li><img src="./images/demo/angel_smile.gif"></li><li><img src="./images/demo/angel_smile.gif"></li>'+
                        '</ul>'+
                    '</div>'+
                '<div>';
        $(str).appendTo($("body"));
        editor.smiley.$dialog = $("#" + editor.smiley.dialogId);
    }
})()