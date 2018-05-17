CKEDITOR.plugins.add('tablebox', {
    icons: 'tablebox',
    init: function() {
        var that = this;
        editor.ui.addButton('tablebox', {
            label: '表格',
            // The command to execute on click.
            command: 'tablebox',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'insert'
        });

        this._tableboxInit.call(editor);

        editor.addCommand('tablebox', {
            exec: function(editor) {
                if (!editor.tableBox.$dialog) {
                    that._tableboxRender.call(editor);
                }

                editor.tableBox.layerIndex = layer.open({
                    type: 1,
                    shade: false,
                    title: "表格属性设置", //不显示标题
                    content: editor.tableBox.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    area: "400px"
                });
            }
        })
    },

    _tableboxInit: function() {
        var editor = this;
        editor.tableBox = {};
        editor.tableBox.dialogId = editor.name + "-tablebox-dialog";
    },
    _tableboxRender: function() {
        var editor = this;
        var htmlStr = '<div class="ckeditor-tablebox-dialog" id="' + editor.tableBox.dialogId + '">' +
            '<div class="item-cell">' +
            '<label class="lab">行</label>' +
            '<input type="text" size="15" class="ckeditor-coms-formtext" name="tablerow">' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">列</label>' +
            '<input type="text" size="15"  class="ckeditor-coms-formtext" name="tablecol">' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">宽度</label>' +
            '<input type="text" size="15"  class="ckeditor-coms-formtext" name="tablew"><span class="tip-width"> (不设置默认100%)</span>' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">边框</label>' +
            '<input type="text" size="15"  class="ckeditor-coms-formtext" name="tableborder">' +
            '</div>' +
            

            '<div class="ckeditor-tablebox-ft">' +
            '<a href="#" class="ckeditor-btn-default J_closeBtn">关闭</a>' +
            '<a href="#" class="ckeditor-btn-primary J_confirmBtn">确认</a>' +
            '</div>' +
            '</div>';
        $(htmlStr).appendTo($("body"));
        var $dialog = $("#" + editor.tableBox.dialogId);
        editor.tableBox.$dialog = $dialog;
        var $tableRow = editor.tableBox.$row = editor.tableBox.$dialog.find('input[name="tablerow"]');
        var $tableCol = editor.tableBox.$col = editor.tableBox.$dialog.find('input[name="tablecol"]');
        var $tableBorder = editor.tableBox.$border = editor.tableBox.$dialog.find('input[name="tableborder"]');
        var $tableWidth = editor.tableBox.$width = editor.tableBox.$dialog.find('input[name="tablew"]');


        var col, row, borderm,w,tableStr="";


        var $closeBtn = $dialog.find(".J_closeBtn");
        var $confirm = $dialog.find(".J_confirmBtn");

        $closeBtn.on("click", function(event) {
            event.preventDefault();
            layer.close(editor.tableBox.layerIndex);
        });

        $confirm.on("click", function(event) {
            event.preventDefault();
        	tableStr="";
            row = parseInt($tableRow.val());
            col = parseInt($tableCol.val());
            border =parseInt($tableBorder.val());
            w=parseInt($tableWidth.val());


            border=!!border ? border  :1;
            w=!!w ? w :"100%";
            
            tableStr+="<table class='ck-table' width='"+w+"' style='border-width:"+border+"px'>";
            for (var i = 0; i < row; i++) {
            	tableStr+="<tr>";
                for (var j = 0; j < col; j++) {
                	tableStr+="<td style='border-width:"+border+"px'></td>"
                }
                tableStr+="</tr>";
            }
            tableStr+="</table>"
           
            editor.insertHtml(tableStr);
            layer.close(editor.tableBox.layerIndex);
        })





    }




})