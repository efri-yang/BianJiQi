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


            editor.addCommand('smileybox', {
                exec: function(editor) {
                	alert("sdfsadfasdfasdf");
                }
            });
        }
    })
})()