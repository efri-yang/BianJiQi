CKEDITOR.plugins.add("fujian",{
	icons:"fujian",
	init: function(editor) {
		editor.ui.addButton("fujian",{
			label: "添加附件",
            command: 'fujian',
            toolbar: 'insert,10'
		});
	}
});