/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

(function() {
    CKEDITOR.plugins.add('link', {
        icons: 'link,unlink', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%
        onLoad: function() {
            // Add the CSS styles for anchor placeholders.

        },

        init: function(editor) {




            editor.ui.addButton('Link', {
                label: "添加链接",
                command: 'link',
                toolbar: 'links,10'
            });
            editor.ui.addButton('Unlink', {
                label: "取消链接",
                command: 'unlink',
                toolbar: 'links,20'
            });

            


            editor.addCommand('link', {
                exec: function(editor) {
                   	var selection = editor.getSelection();
                   	var elements =getSelectedLink( editor, true );
                   	var firstLink = elements[ 0 ] || null;

                   	if ( firstLink && firstLink.hasAttribute( 'href' ) ) {
					// Don't change selection if some element is already selected.
					// For example - don't destroy fake selection.
						if ( !selection.getSelectedElement() && !selection.isInTable() ) {
							selection.selectElement( firstLink );
						}
					}

					var data = parseLinkAttributes( editor, firstLink );

					console.dir(data);




                }
            });

            CKEDITOR.removeAnchorCommand = function() {};
            CKEDITOR.removeAnchorCommand.prototype = {
                exec: function(editor) {
                    var sel = editor.getSelection(),
                        bms = sel.createBookmarks(),
                        anchor;
                    if (sel && (anchor = sel.getSelectedElement()) && (!anchor.getChildCount() ? tryRestoreFakeAnchor(editor, anchor) : anchor.is('a')))
                        anchor.remove(1);
                    else {
                        if ((anchor =getSelectedLink(editor))) {
                            if (anchor.hasAttribute('href')) {
                                anchor.removeAttributes({ name: 1, 'data-cke-saved-name': 1 });
                                anchor.removeClass('cke_anchor');
                            } else {
                                anchor.remove(1);
                            }
                        }
                    }
                    sel.selectBookmarks(bms);
                }
            }

        }
    });


    var javascriptProtocolRegex = /^javascript:/,
		emailRegex = /^mailto:([^?]+)(?:\?(.+))?$/,
		emailSubjectRegex = /subject=([^;?:@&=$,\/]*)/i,
		emailBodyRegex = /body=([^;?:@&=$,\/]*)/i,
		anchorRegex = /^#(.*)$/,
		urlRegex = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
		selectableTargets = /^(_(?:self|top|parent|blank))$/,
		encodedEmailLinkRegex = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
		functionCallProtectedEmailLinkRegex = /^javascript:([^(]+)\(([^)]+)\)$/,
		popupRegex = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
		popupFeaturesRegex = /(?:^|,)([^=]+)=(\d+|yes|no)/gi;

	var advAttrNames = {
		id: 'advId',
		dir: 'advLangDir',
		accessKey: 'advAccessKey',
		// 'data-cke-saved-name': 'advName',
		name: 'advName',
		lang: 'advLangCode',
		tabindex: 'advTabIndex',
		title: 'advTitle',
		type: 'advContentType',
		'class': 'advCSSClasses',
		charset: 'advCharset',
		style: 'advStyles',
		rel: 'advRel'
	};

    function getSelectedLink(editor, returnMultiple) {
        var selection = editor.getSelection(),
            selectedElement = selection.getSelectedElement(),
            ranges = selection.getRanges(),
            links = [],
            link,
            range,
            i;

        if (!returnMultiple && selectedElement && selectedElement.is('a')) {
            return selectedElement;
        }

        for (i = 0; i < ranges.length; i++) {
            range = selection.getRanges()[i];

            // Skip bogus to cover cases of multiple selection inside tables (#tp2245).
            // Shrink to element to prevent losing anchor (#859).
            range.shrink(CKEDITOR.SHRINK_ELEMENT, true, { skipBogus: true });
            link = editor.elementPath(range.getCommonAncestor()).contains('a', 1);

            if (link && returnMultiple) {
                links.push(link);
            } else if (link) {
                return link;
            }
        }

        return returnMultiple ? links : null;
    }




    function tryRestoreFakeAnchor( editor, element ) {
		if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'anchor' ) {
			var link = editor.restoreRealElement( element );
			if ( link.data( 'cke-saved-name' ) )
				return link;
		}
	}



	function parseLinkAttributes( editor, element ) {
			var href = ( element && ( element.data( 'cke-saved-href' ) || element.getAttribute( 'href' ) ) ) || '',
				compiledProtectionFunction = editor.plugins.link.compiledProtectionFunction,
				emailProtection = editor.config.emailProtection,
				javascriptMatch, emailMatch, anchorMatch, urlMatch,
				retval = {};

			if ( ( javascriptMatch = href.match( javascriptProtocolRegex ) ) ) {
				if ( emailProtection == 'encode' ) {
					href = href.replace( encodedEmailLinkRegex, function( match, protectedAddress, rest ) {
						// Without it 'undefined' is appended to e-mails without subject and body (https://dev.ckeditor.com/ticket/9192).
						rest = rest || '';

						return 'mailto:' +
							String.fromCharCode.apply( String, protectedAddress.split( ',' ) ) +
							unescapeSingleQuote( rest );
					} );
				}
				// Protected email link as function call.
				else if ( emailProtection ) {
					href.replace( functionCallProtectedEmailLinkRegex, function( match, funcName, funcArgs ) {
						if ( funcName == compiledProtectionFunction.name ) {
							retval.type = 'email';
							var email = retval.email = {};

							var paramRegex = /[^,\s]+/g,
								paramQuoteRegex = /(^')|('$)/g,
								paramsMatch = funcArgs.match( paramRegex ),
								paramsMatchLength = paramsMatch.length,
								paramName, paramVal;

							for ( var i = 0; i < paramsMatchLength; i++ ) {
								paramVal = decodeURIComponent( unescapeSingleQuote( paramsMatch[ i ].replace( paramQuoteRegex, '' ) ) );
								paramName = compiledProtectionFunction.params[ i ].toLowerCase();
								email[ paramName ] = paramVal;
							}
							email.address = [ email.name, email.domain ].join( '@' );
						}
					} );
				}
			}

			if ( !retval.type ) {
				if ( ( anchorMatch = href.match( anchorRegex ) ) ) {
					retval.type = 'anchor';
					retval.anchor = {};
					retval.anchor.name = retval.anchor.id = anchorMatch[ 1 ];
				}
				// Protected email link as encoded string.
				else if ( ( emailMatch = href.match( emailRegex ) ) ) {
					var subjectMatch = href.match( emailSubjectRegex ),
						bodyMatch = href.match( emailBodyRegex );

					retval.type = 'email';
					var email = ( retval.email = {} );
					email.address = emailMatch[ 1 ];
					subjectMatch && ( email.subject = decodeURIComponent( subjectMatch[ 1 ] ) );
					bodyMatch && ( email.body = decodeURIComponent( bodyMatch[ 1 ] ) );
				}
				// urlRegex matches empty strings, so need to check for href as well.
				else if ( href && ( urlMatch = href.match( urlRegex ) ) ) {
					retval.type = 'url';
					retval.url = {};
					retval.url.protocol = urlMatch[ 1 ];
					retval.url.url = urlMatch[ 2 ];
				}
			}

			// Load target and popup settings.
			if ( element ) {
				var target = element.getAttribute( 'target' );

				// IE BUG: target attribute is an empty string instead of null in IE if it's not set.
				if ( !target ) {
					var onclick = element.data( 'cke-pa-onclick' ) || element.getAttribute( 'onclick' ),
						onclickMatch = onclick && onclick.match( popupRegex );

					if ( onclickMatch ) {
						retval.target = {
							type: 'popup',
							name: onclickMatch[ 1 ]
						};

						var featureMatch;
						while ( ( featureMatch = popupFeaturesRegex.exec( onclickMatch[ 2 ] ) ) ) {
							// Some values should remain numbers (https://dev.ckeditor.com/ticket/7300)
							if ( ( featureMatch[ 2 ] == 'yes' || featureMatch[ 2 ] == '1' ) && !( featureMatch[ 1 ] in { height: 1, width: 1, top: 1, left: 1 } ) )
								retval.target[ featureMatch[ 1 ] ] = true;
							else if ( isFinite( featureMatch[ 2 ] ) )
								retval.target[ featureMatch[ 1 ] ] = featureMatch[ 2 ];
						}
					}
				} else {
					retval.target = {
						type: target.match( selectableTargets ) ? target : 'frame',
						name: target
					};
				}

				var download = element.getAttribute( 'download' );
				if ( download !== null ) {
					retval.download = true;
				}

				var advanced = {};

				for ( var a in advAttrNames ) {
					var val = element.getAttribute( a );

					if ( val )
						advanced[ advAttrNames[ a ] ] = val;
				}

				var advName = element.data( 'cke-saved-name' ) || advanced.advName;

				if ( advName )
					advanced.advName = advName;

				if ( !CKEDITOR.tools.isEmpty( advanced ) )
					retval.advanced = advanced;
			}

			return retval;
		}




})();