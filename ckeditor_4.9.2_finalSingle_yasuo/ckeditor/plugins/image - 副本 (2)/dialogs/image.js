/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
CKEDITOR.dialog.add( 'imageDialog', function( editor ) {
	return {
		title: '上传图片',
		minWidth: 600,
		minHeight: 300,
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab1', //不是真正的id 通过添加 id="cke_tab-1_67"
				label: '本地上传',

				// The tab content.
				elements: [
	                {
	                    type: 'html',
	                    html: '<div id="">asdfasdfasdfasdf</div>'
	                }
	            ]
			},
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab2', //不是真正的id 通过添加 id="cke_tab-1_67"
				label: '相册图片',

				// The tab content.
				elements: [
					{
						// Text input field for the abbreviation text.
						type: 'text',
						id: 'upload-localcccc',
						label: '文本1111',

						// Validation checking whether the field is not empty.
						validate: CKEDITOR.dialog.validate.notEmpty( "此处文本框不能为空" )
					}
				]
			}

		],
		onShow: function() {
				var element = CKEDITOR.document.getById( 'myElement' );
				alert( element.getId() ); // 'm

		},
		onOk: function() {
			var dialog = this;
			console.dir(editor.document);
			console.dir(dialog);
			var p = editor.document.createElement( 'p' );
			var title=dialog.getValueOf( 'tab-1', 'abbr' );
			p.setText(title);

			// Finally, insert the element into the editor at the caret position.
			editor.insertElement(p);
			// abbr.setAttribute( 'title', dialog.getValueOf( 'tab-1' ) );
		}
	}
})
