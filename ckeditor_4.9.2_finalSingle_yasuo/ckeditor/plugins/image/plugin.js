CKEDITOR.plugins.add( 'image', {
	icons: 'image',
	init: function( editor ) {
		
		editor.ui.addButton( 'image', {

			// The text part of the button (if available) and the tooltip.
			label: '上传图片',

			// The command to execute on click.
			command: 'image',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'insert'
		});

		
		
		
		

		// CKEDITOR.dialog.add( 'imageDialog', this.path + 'dialogs/image.js' );
		editor.addCommand( 'image', {
		    exec: function( editor ) {
		       	



		    }
		} );
	}

});