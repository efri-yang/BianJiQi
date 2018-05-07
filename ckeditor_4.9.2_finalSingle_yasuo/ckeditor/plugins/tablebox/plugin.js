CKEDITOR.plugins.add("tablebox",function(){
	icons: 'tablebox',
	init:function(){
		editor.ui.addButton('tablebox',{
			label: '表格',
            // The command to execute on click.
            command: 'tablebox',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'insert'
		})
	}
})