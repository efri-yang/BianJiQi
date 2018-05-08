/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'link', {
		icons: 'link,unlink', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		onLoad: function() {
			// Add the CSS styles for anchor placeholders.
			
		},

		init: function( editor ) {
			editor.ui.addButton( 'Link', {
				label:"添加链接",
				command: 'link',
				toolbar: 'links,10'
			});
			editor.ui.addButton( 'Unlink', {
				label:"取消链接",
				command: 'unlink',
				toolbar: 'links,20'
			});


			editor.addCommand('link', {
                exec: function(editor) {
                    	alert(editor.activeEnterMode );
						




                }
            })

		}
	})
			
} )();
