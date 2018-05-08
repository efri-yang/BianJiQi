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
                    
                		var getSelectedLink=function( editor, returnMultiple ) {
							var selection = editor.getSelection(),
								selectedElement = selection.getSelectedElement(),
								ranges = selection.getRanges(),
								links = [],
								link,
								range,
								i;
						console.dir(selectedElement);
							if ( !returnMultiple && selectedElement && selectedElement.is( 'a' ) ) {
								return selectedElement;
							}

							for ( i = 0; i < ranges.length; i++ ) {
								range = selection.getRanges()[ i ];

								// Skip bogus to cover cases of multiple selection inside tables (#tp2245).
								// Shrink to element to prevent losing anchor (#859).
								range.shrink( CKEDITOR.SHRINK_ELEMENT, true, { skipBogus: true } );
								link = editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );

								if ( link && returnMultiple ) {
									links.push( link );
								} else if ( link ) {
									return link;
								}
							}

							return returnMultiple ? links : null;
						};

						getSelectedLink(editor);




                }
            })

		}
	})
			
} )();
