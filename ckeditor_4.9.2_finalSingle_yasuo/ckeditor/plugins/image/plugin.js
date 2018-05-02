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
		console.dir(editor.contextMenu);
		if ( editor.contextMenu ) {
			
			// Add a context menu group with the Edit Abbreviation item.
			editor.addMenuGroup( 'abbrGroup' );
			editor.addMenuItem( 'abbrItem', {
				label: 'Edit Abbreviation',
				icon: this.path + 'icons/abbr.png',
				command: 'abbr',
				group: 'abbrGroup'
			});

			editor.contextMenu.addListener( function( element ) {
				if ( element.getAscendant( 'abbr', true ) ) {
					return { abbrItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}


		CKEDITOR.dialog.add( 'imageDialog', this.path + 'dialogs/image.js' );
		editor.addCommand( 'image', new CKEDITOR.dialogCommand( 'imageDialog' ) );
	}

});