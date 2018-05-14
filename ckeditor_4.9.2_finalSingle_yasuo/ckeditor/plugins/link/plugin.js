/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

(function() {
    CKEDITOR.plugins.add('link', {
        icons: 'link,unlink', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%
        beforeInit: function(editor) {
            editor.link = {};
            editor.link.dialogId = editor.name + "-link-dialog";
            editor.link.initialLinkText = "";
        },
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


            var xySelectedIndex, targetSelectedIndex;


            editor.on('doubleclick', function(evt) {

                





                editor.link.element = [];
                
                var element = evt.data.element.getAscendant({ a: 1, img: 1 }, true);
                editor.link.element.push(element);
                if (!!element && element.is('a')) {
                    if (!editor.link.$dialog) {
                        renderDialogHtml(editor);
                    }
                    editor.getSelection().selectElement(element);

                    xySelectedIndex = (element.$.protocol == "http:") ? 0 : 1;
                    targetSelectedIndex = (!element.$.target || element.$.target == "_self") ? 1 : 0;

                    editor.link.$text.val(editor.getSelection().getSelectedText());
                    editor.link.$xy.get(0).selectedIndex = xySelectedIndex;
                    editor.link.$url.val(element.$.hostname + element.$.search);
                    editor.link.$target.get(0).selectedIndex = targetSelectedIndex;
                    openDialog(editor);
                }
            }, null, null, 0)






            editor.addCommand('link', {
                exec: function(editor) {
                    if (!editor.link.$dialog) {
                        renderDialogHtml(editor);
                    }
                    var selection = editor.getSelection();
                    var elements = editor.link.element = CKEDITOR.plugins.link.getSelectedLink(editor, true); //判断是或否是a链接
                    var firstLink = elements[0] || null;

                    var selectedText = selection.getSelectedText();




                    if (firstLink && firstLink.hasAttribute('href')) {
                        if (!selection.getSelectedElement() && !selection.isInTable()) {
                            selection.selectElement(firstLink);
                        }
                    }

                    var data = editor.link.data = CKEDITOR.plugins.link.parseLinkAttributes(editor, firstLink);


                    if (!!elements.length) {
                        //当前点击的是一个链接,编辑链接//editor.getSelection().getSelectedText() 就是可以获取文本

                        xySelectedIndex = (data.url.protocol == "http://") ? 0 : 1;
                        targetSelectedIndex = (!data.target || data.target.type == "_self") ? 1 : 0;

                        editor.link.$text.val(editor.getSelection().getSelectedText());
                        editor.link.$xy.get(0).selectedIndex = xySelectedIndex;
                        editor.link.$url.val(data.url.url);
                        editor.link.$target.get(0).selectedIndex = targetSelectedIndex;
                        openDialog(editor);
                    } else {
                        //当前点击不是一个链接，判断是否又文本存在，
                        //如果没有文本表示在光标定位地方插入一个链接，
                        //如果有文本表示给当前文本添加一个链接
                        if (!!selectedText) {
                            editor.link.$text.val(selectedText);
                            editor.link.$xy.get(0).selectedIndex = 0;
                            editor.link.$url.val("");
                            editor.link.$target.get(0).selectedIndex = 0;
                            openDialog(editor);
                        } else {
                            editor.link.$text.val("");
                            editor.link.$xy.get(0).selectedIndex = 0;
                            editor.link.$url.val("");
                            editor.link.$target.get(0).selectedIndex = 0;
                            openDialog(editor);
                        }

                    }
                }
            });

            editor.addCommand('unlink', new CKEDITOR.unlinkCommand());
        }
    });

    function openDialog(editor, callback) {
        editor.link.layerIndex = layer.open({
            type: 1,
            shade: false,
            title: "连接设置", //不显示标题
            area: "420px",
            content: editor.link.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            success: function(layero, index) {
                !!callback && callback();
            },
            cancel: function(index, layero) {

            }
        })
    }

    function renderDialogHtml(editor) {
        var str = '<div class="ckeditor-link-dialog" id="' + editor.link.dialogId + '">' +
            '<div class="item-cell">' +
            '<label class="lab">显示文本</label>' +
            '<input type="text" name="linktext" size="38" class="ckeditor-coms-formtext">' +
            '</div>' +

            '<div class="item-cell item-xyurl">' +
            '<label class="lab">URL</label>' +
            '<select class="sel J_sel-xy" name="linkxy">' +
            '<option value="http://">http://</option>' +
            '<option value="https://">https://</option>' +
            '</select>' +
            '<input type="text" name="linkurl"  class="ckeditor-coms-formtext" size="24">' +
            '</div>' +
            '<div class="item-cell">' +
            '<label class="lab">目标窗口</label>' +
            '<select class="sel J_sel-url" name="linktarget">' +
            '<option value="_blank">新窗口</option>' +
            '<option value="_self">当前窗口</option>' +
            '</select>' +

            '</div>' +
            '<div class="ckeditor-link-ft">' +
            '<a href="#" class="ckeditor-btn-default J_close-btn">关闭</a>' +
            '<a href="#" class="ckeditor-btn-primary J_confirm-btn">确认</a>' +
            '</div>' +
            '</div>';
        $(str).appendTo($("body"));
        editor.link.$dialog = $("#" + editor.link.dialogId);


        editor.link.$text = editor.link.$dialog.find('input[name="linktext"]');
        editor.link.$xy = editor.link.$dialog.find('select[name="linkxy"]');
        editor.link.$url = editor.link.$dialog.find('input[name="linkurl"]');
        editor.link.$target = editor.link.$dialog.find('select[name="linktarget"]');

        editor.link.$dialog.find(".J_close-btn").on("click", function() {
            layer.close(editor.link.layerIndex);
        });

        editor.link.$dialog.find(".J_confirm-btn").on("click", function() {
            var data = editor.link.data;
            if (!data) data = {};
            if (!data.advanced) data.advanced = {};
            if (!data.target) data.target = {};
            if (!data.url) data.url = {};
            data.type = "url";
            data.target.type = data.target.name = editor.link.$target.val();
            data.url.protocol = editor.link.$xy.val();
            data.url.url = editor.link.$url.val();
            data.linkText = editor.link.$text.val();

            console.dir(data);
            if (editor.link.element && !!editor.link.element.length) {
                editLinksInSelection(editor, editor.link.element, data);
            } else {

                insertLinksIntoSelection(editor, data);

            }

            layer.close(editor.link.layerIndex);
        })






    }

    // Loads the parameters in a selected link to the link dialog fields.
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



    function createRangeForLink(editor, link) {
        var range = editor.createRange();
        range.setStartBefore(link);
        range.setEndAfter(link);
        return range;
    }

    function editLinksInSelection(editor, selectedElements, data) {
        var attributes = plugin.getLinkAttributes(editor, data),
            ranges = [],
            element,
            href,
            textView,
            newText,
            i;
        console.group("editLinksInSelection调用");
        console.dir(attributes);
        for (i = 0; i < selectedElements.length; i++) {
            // We're only editing an existing link, so just overwrite the attributes.
            element = selectedElements[i];
            href = element.data('cke-saved-href');
            textView = element.getHtml();

            element.setAttributes(attributes.set);
            element.removeAttributes(attributes.removed);


            if (data.linkText && editor.link.initialLinkText != data.linkText) {
                // Display text has been changed.
                newText = data.linkText;
            } else if (href == textView || data.type == 'email' && textView.indexOf('@') != -1) {
                // Update text view when user changes protocol (https://dev.ckeditor.com/ticket/4612).
                // Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
                newText = data.type == 'email' ? data.email.address : attributes.set['data-cke-saved-href'];
            }

            if (newText) {
                element.setText(newText);
            }

            ranges.push(createRangeForLink(editor, element));
        }

        // We changed the content, so need to select it again.
        editor.getSelection().selectRanges(ranges);
    }

    function insertLinksIntoSelection(editor, data) {
        console.group("insertLinksIntoSelection调用");
        console.dir(data);
        var attributes = plugin.getLinkAttributes(editor, data),
            ranges = editor.getSelection().getRanges(),
            style = new CKEDITOR.style({
                element: 'a',
                attributes: attributes.set
            }),
            rangesToSelect = [],
            range,
            text,
            nestedLinks,
            i,
            j;

        style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
        for (i = 0; i < ranges.length; i++) {
            range = ranges[i];

            // Use link URL as text with a collapsed cursor.
            if (range.collapsed) {
                // Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
                text = new CKEDITOR.dom.text(data.linkText || (data.type == 'email' ?
                    data.email.address : attributes.set['data-cke-saved-href']), editor.document);
                range.insertNode(text);
                range.selectNodeContents(text);
            } else if (editor.link.initialLinkText !== data.linkText) {
                text = new CKEDITOR.dom.text(data.linkText, editor.document);

                // Shrink range to preserve block element.
                range.shrink(CKEDITOR.SHRINK_TEXT);

                // Use extractHtmlFromRange to remove markup within the selection. Also this method is a little
                // smarter than range#deleteContents as it plays better e.g. with table cells.
                editor.editable().extractHtmlFromRange(range);

                range.insertNode(text);
            }

            // Editable links nested within current range should be removed, so that the link is applied to whole selection.
            nestedLinks = range._find('a');

            for (j = 0; j < nestedLinks.length; j++) {
                nestedLinks[j].remove(true);
            }


            // Apply style.
            style.applyToRange(range, editor);

            rangesToSelect.push(range);
        }

        editor.getSelection().selectRanges(rangesToSelect);
    }

    function unescapeSingleQuote(str) {
        return str.replace(/\\'/g, '\'');
    }

    function escapeSingleQuote(str) {
        return str.replace(/'/g, '\\$&');
    }

    function protectEmailAddressAsEncodedString(address) {
        var charCode,
            length = address.length,
            encodedChars = [];

        for (var i = 0; i < length; i++) {
            charCode = address.charCodeAt(i);
            encodedChars.push(charCode);
        }

        return 'String.fromCharCode(' + encodedChars.join(',') + ')';
    }

    function protectEmailLinkAsFunction(editor, email) {
        var plugin = editor.plugins.link,
            name = plugin.compiledProtectionFunction.name,
            params = plugin.compiledProtectionFunction.params,
            paramName, paramValue, retval;

        retval = [name, '('];
        for (var i = 0; i < params.length; i++) {
            paramName = params[i].toLowerCase();
            paramValue = email[paramName];

            i > 0 && retval.push(',');
            retval.push('\'', paramValue ? escapeSingleQuote(encodeURIComponent(email[paramName])) : '', '\'');
        }
        retval.push(')');
        return retval.join('');
    }

    function getCompiledProtectionFunction(editor) {
        var emailProtection = editor.config.emailProtection || '',
            compiledProtectionFunction;

        // Compile the protection function pattern.
        if (emailProtection && emailProtection != 'encode') {
            compiledProtectionFunction = {};

            emailProtection.replace(/^([^(]+)\(([^)]+)\)$/, function(match, funcName, params) {
                compiledProtectionFunction.name = funcName;
                compiledProtectionFunction.params = [];
                params.replace(/[^,\s]+/g, function(param) {
                    compiledProtectionFunction.params.push(param);
                });
            });
        }

        return compiledProtectionFunction;
    }

    /**
     * Set of Link plugin helpers.
     *
     * @class
     * @singleton
     */
    var plugin = CKEDITOR.plugins.link = {
        /**
         * Get the surrounding link element of the current selection.
         *
         *      CKEDITOR.plugins.link.getSelectedLink( editor );
         *
         *      // The following selections will all return the link element.
         *
         *      <a href="#">li^nk</a>
         *      <a href="#">[link]</a>
         *      text[<a href="#">link]</a>
         *      <a href="#">li[nk</a>]
         *      [<b><a href="#">li]nk</a></b>]
         *      [<a href="#"><b>li]nk</b></a>
         *
         * @since 3.2.1
         * @param {CKEDITOR.editor} editor
         * @param {Boolean} [returnMultiple=false] Indicates whether the function should return only the first selected link or all of them.
         * @returns {CKEDITOR.dom.element/CKEDITOR.dom.element[]/null} A single link element or an array of link
         * elements relevant to the current selection.
         */
        getSelectedLink: function(editor, returnMultiple) {
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
        },

        /**
         * Collects anchors available in the editor (i.e. used by the Link plugin).
         * Note that the scope of search is different for inline (the "global" document) and
         * classic (`iframe`-based) editors (the "inner" document).
         *
         * @since 4.3.3
         * @param {CKEDITOR.editor} editor
         * @returns {CKEDITOR.dom.element[]} An array of anchor elements.
         */
        getEditorAnchors: function(editor) {
            var editable = editor.editable(),

                // The scope of search for anchors is the entire document for inline editors
                // and editor's editable for classic editor/divarea (https://dev.ckeditor.com/ticket/11359).
                scope = (editable.isInline() && !editor.plugins.divarea) ? editor.document : editable,

                links = scope.getElementsByTag('a'),
                imgs = scope.getElementsByTag('img'),
                anchors = [],
                i = 0,
                item;

            // Retrieve all anchors within the scope.
            while ((item = links.getItem(i++))) {
                if (item.data('cke-saved-name') || item.hasAttribute('name')) {
                    anchors.push({
                        name: item.data('cke-saved-name') || item.getAttribute('name'),
                        id: item.getAttribute('id')
                    });
                }
            }
            // Retrieve all "fake anchors" within the scope.
            i = 0;

            while ((item = imgs.getItem(i++))) {
                if ((item = this.tryRestoreFakeAnchor(editor, item))) {
                    anchors.push({
                        name: item.getAttribute('name'),
                        id: item.getAttribute('id')
                    });
                }
            }

            return anchors;
        },

        /**
         * Opera and WebKit do not make it possible to select empty anchors. Fake
         * elements must be used for them.
         *
         * @readonly
         * @deprecated 4.3.3 It is set to `true` in every browser.
         * @property {Boolean}
         */
        fakeAnchor: true,

        /**
         * For browsers that do not support CSS3 `a[name]:empty()`. Note that IE9 is included because of https://dev.ckeditor.com/ticket/7783.
         *
         * @readonly
         * @deprecated 4.3.3 It is set to `false` in every browser.
         * @property {Boolean} synAnchorSelector
         */

        /**
         * For browsers that have editing issues with an empty anchor.
         *
         * @readonly
         * @deprecated 4.3.3 It is set to `false` in every browser.
         * @property {Boolean} emptyAnchorFix
         */

        /**
         * Returns an element representing a real anchor restored from a fake anchor.
         *
         * @param {CKEDITOR.editor} editor
         * @param {CKEDITOR.dom.element} element
         * @returns {CKEDITOR.dom.element} Restored anchor element or nothing if the
         * passed element was not a fake anchor.
         */
        tryRestoreFakeAnchor: function(editor, element) {
            if (element && element.data('cke-real-element-type') && element.data('cke-real-element-type') == 'anchor') {
                var link = editor.restoreRealElement(element);
                if (link.data('cke-saved-name'))
                    return link;
            }
        },

        /**
         * Parses attributes of the link element and returns an object representing
         * the current state (data) of the link. This data format is a plain object accepted
         * e.g. by the Link dialog window and {@link #getLinkAttributes}.
         *
         * **Note:** Data model format produced by the parser must be compatible with the Link
         * plugin dialog because it is passed directly to {@link CKEDITOR.dialog#setupContent}.
         *
         * @since 4.4
         * @param {CKEDITOR.editor} editor
         * @param {CKEDITOR.dom.element} element
         * @returns {Object} An object of link data.
         */
        parseLinkAttributes: function(editor, element) {
            var href = (element && (element.data('cke-saved-href') || element.getAttribute('href'))) || '',
                compiledProtectionFunction = editor.plugins.link.compiledProtectionFunction,
                emailProtection = editor.config.emailProtection,
                javascriptMatch, emailMatch, anchorMatch, urlMatch,
                retval = {};

            if ((javascriptMatch = href.match(javascriptProtocolRegex))) {
                if (emailProtection == 'encode') {
                    href = href.replace(encodedEmailLinkRegex, function(match, protectedAddress, rest) {
                        // Without it 'undefined' is appended to e-mails without subject and body (https://dev.ckeditor.com/ticket/9192).
                        rest = rest || '';

                        return 'mailto:' +
                            String.fromCharCode.apply(String, protectedAddress.split(',')) +
                            unescapeSingleQuote(rest);
                    });
                }
                // Protected email link as function call.
                else if (emailProtection) {
                    href.replace(functionCallProtectedEmailLinkRegex, function(match, funcName, funcArgs) {
                        if (funcName == compiledProtectionFunction.name) {
                            retval.type = 'email';
                            var email = retval.email = {};

                            var paramRegex = /[^,\s]+/g,
                                paramQuoteRegex = /(^')|('$)/g,
                                paramsMatch = funcArgs.match(paramRegex),
                                paramsMatchLength = paramsMatch.length,
                                paramName, paramVal;

                            for (var i = 0; i < paramsMatchLength; i++) {
                                paramVal = decodeURIComponent(unescapeSingleQuote(paramsMatch[i].replace(paramQuoteRegex, '')));
                                paramName = compiledProtectionFunction.params[i].toLowerCase();
                                email[paramName] = paramVal;
                            }
                            email.address = [email.name, email.domain].join('@');
                        }
                    });
                }
            }

            if (!retval.type) {
                if ((anchorMatch = href.match(anchorRegex))) {
                    retval.type = 'anchor';
                    retval.anchor = {};
                    retval.anchor.name = retval.anchor.id = anchorMatch[1];
                }
                // Protected email link as encoded string.
                else if ((emailMatch = href.match(emailRegex))) {
                    var subjectMatch = href.match(emailSubjectRegex),
                        bodyMatch = href.match(emailBodyRegex);

                    retval.type = 'email';
                    var email = (retval.email = {});
                    email.address = emailMatch[1];
                    subjectMatch && (email.subject = decodeURIComponent(subjectMatch[1]));
                    bodyMatch && (email.body = decodeURIComponent(bodyMatch[1]));
                }
                // urlRegex matches empty strings, so need to check for href as well.
                else if (href && (urlMatch = href.match(urlRegex))) {
                    retval.type = 'url';
                    retval.url = {};
                    retval.url.protocol = urlMatch[1];
                    retval.url.url = urlMatch[2];
                }
            }

            // Load target and popup settings.
            if (element) {
                var target = element.getAttribute('target');

                // IE BUG: target attribute is an empty string instead of null in IE if it's not set.
                if (!target) {
                    var onclick = element.data('cke-pa-onclick') || element.getAttribute('onclick'),
                        onclickMatch = onclick && onclick.match(popupRegex);

                    if (onclickMatch) {
                        retval.target = {
                            type: 'popup',
                            name: onclickMatch[1]
                        };

                        var featureMatch;
                        while ((featureMatch = popupFeaturesRegex.exec(onclickMatch[2]))) {
                            // Some values should remain numbers (https://dev.ckeditor.com/ticket/7300)
                            if ((featureMatch[2] == 'yes' || featureMatch[2] == '1') && !(featureMatch[1] in { height: 1, width: 1, top: 1, left: 1 }))
                                retval.target[featureMatch[1]] = true;
                            else if (isFinite(featureMatch[2]))
                                retval.target[featureMatch[1]] = featureMatch[2];
                        }
                    }
                } else {
                    retval.target = {
                        type: target.match(selectableTargets) ? target : 'frame',
                        name: target
                    };
                }

                var download = element.getAttribute('download');
                if (download !== null) {
                    retval.download = true;
                }

                var advanced = {};

                for (var a in advAttrNames) {
                    var val = element.getAttribute(a);

                    if (val)
                        advanced[advAttrNames[a]] = val;
                }

                var advName = element.data('cke-saved-name') || advanced.advName;

                if (advName)
                    advanced.advName = advName;

                if (!CKEDITOR.tools.isEmpty(advanced))
                    retval.advanced = advanced;
            }

            return retval;
        },

        /**
         * Converts link data produced by {@link #parseLinkAttributes} into an object which consists
         * of attributes to be set (with their values) and an array of attributes to be removed.
         * This method can be used to compose or to update any link element with the given data.
         *
         * @since 4.4
         * @param {CKEDITOR.editor} editor
         * @param {Object} data Data in {@link #parseLinkAttributes} format.
         * @returns {Object} An object consisting of two keys, i.e.:
         *
         *      {
         *          // Attributes to be set.
         *          set: {
         *              href: 'http://foo.bar',
         *              target: 'bang'
         *          },
         *          // Attributes to be removed.
         *          removed: [
         *              'id', 'style'
         *          ]
         *      }
         *
         */
        getLinkAttributes: function(editor, data) {
            var emailProtection = editor.config.emailProtection || '',
                set = {};

            // Compose the URL.
            switch (data.type) {
                case 'url':
                    var protocol = (data.url && data.url.protocol !== undefined) ? data.url.protocol : 'http://',
                        url = (data.url && CKEDITOR.tools.trim(data.url.url)) || '';

                    set['data-cke-saved-href'] = (url.indexOf('/') === 0) ? url : protocol + url;

                    break;
                case 'anchor':
                    var name = (data.anchor && data.anchor.name),
                        id = (data.anchor && data.anchor.id);

                    set['data-cke-saved-href'] = '#' + (name || id || '');

                    break;
                case 'email':
                    var email = data.email,
                        address = email.address,
                        linkHref;

                    switch (emailProtection) {
                        case '':
                        case 'encode':
                            var subject = encodeURIComponent(email.subject || ''),
                                body = encodeURIComponent(email.body || ''),
                                argList = [];

                            // Build the e-mail parameters first.
                            subject && argList.push('subject=' + subject);
                            body && argList.push('body=' + body);
                            argList = argList.length ? '?' + argList.join('&') : '';

                            if (emailProtection == 'encode') {
                                linkHref = [
                                    'javascript:void(location.href=\'mailto:\'+', // jshint ignore:line
                                    protectEmailAddressAsEncodedString(address)
                                ];
                                // parameters are optional.
                                argList && linkHref.push('+\'', escapeSingleQuote(argList), '\'');

                                linkHref.push(')');
                            } else {
                                linkHref = ['mailto:', address, argList];
                            }

                            break;
                        default:
                            // Separating name and domain.
                            var nameAndDomain = address.split('@', 2);
                            email.name = nameAndDomain[0];
                            email.domain = nameAndDomain[1];

                            linkHref = ['javascript:', protectEmailLinkAsFunction(editor, email)]; // jshint ignore:line
                    }

                    set['data-cke-saved-href'] = linkHref.join('');
                    break;
            }

            // Popups and target.
            if (data.target) {

                if (data.target.type == 'popup') {
                    var onclickList = [
                            'window.open(this.href, \'', data.target.name || '', '\', \''
                        ],
                        featureList = [
                            'resizable', 'status', 'location', 'toolbar', 'menubar', 'fullscreen', 'scrollbars', 'dependent'
                        ],
                        featureLength = featureList.length,
                        addFeature = function(featureName) {
                            if (data.target[featureName])
                                featureList.push(featureName + '=' + data.target[featureName]);
                        };

                    for (var i = 0; i < featureLength; i++)
                        featureList[i] = featureList[i] + (data.target[featureList[i]] ? '=yes' : '=no');

                    addFeature('width');
                    addFeature('left');
                    addFeature('height');
                    addFeature('top');

                    onclickList.push(featureList.join(','), '\'); return false;');
                    set['data-cke-pa-onclick'] = onclickList.join('');
                } else if (data.target.type != 'notSet' && data.target.name) {
                    set.target = data.target.name;
                }
            }

            // Force download attribute.
            if (data.download) {
                set.download = '';
            }

            // Advanced attributes.
            if (data.advanced) {
                for (var a in advAttrNames) {
                    var val = data.advanced[advAttrNames[a]];

                    if (val)
                        set[a] = val;
                }

                if (set.name)
                    set['data-cke-saved-name'] = set.name;
            }

            // Browser need the "href" fro copy/paste link to work. (https://dev.ckeditor.com/ticket/6641)
            if (set['data-cke-saved-href'])
                set.href = set['data-cke-saved-href'];

            var removed = {
                target: 1,
                onclick: 1,
                'data-cke-pa-onclick': 1,
                'data-cke-saved-name': 1,
                'download': 1
            };

            if (data.advanced)
                CKEDITOR.tools.extend(removed, advAttrNames);

            // Remove all attributes which are not currently set.
            for (var s in set)
                delete removed[s];

            return {
                set: set,
                removed: CKEDITOR.tools.objectKeys(removed)
            };
        },


        /**
         * Determines whether an element should have a "Display Text" field in the Link dialog.
         *
         * @since 4.5.11
         * @param {CKEDITOR.dom.element/null} element Selected element, `null` if none selected or if a ranged selection
         * is made.
         * @param {CKEDITOR.editor} editor The editor instance for which the check is performed.
         * @returns {Boolean}
         */
        showDisplayTextForElement: function(element, editor) {
            var undesiredElements = {
                    img: 1,
                    table: 1,
                    tbody: 1,
                    thead: 1,
                    tfoot: 1,
                    input: 1,
                    select: 1,
                    textarea: 1
                },
                selection = editor.getSelection();

            // Widget duck typing, we don't want to show display text for widgets.
            if (editor.widgets && editor.widgets.focused) {
                return false;
            }

            if (selection && selection.getRanges().length > 1) {
                return false;
            }

            return !element || !element.getName || !element.is(undesiredElements);
        }
    };

    // TODO Much probably there's no need to expose these as public objects.

    CKEDITOR.unlinkCommand = function() {

    };
    CKEDITOR.unlinkCommand.prototype = {
        exec: function(editor) {
            // IE/Edge removes link from selection while executing "unlink" command when cursor
            // is right before/after link's text. Therefore whole link must be selected and the
            // position of cursor must be restored to its initial state after unlinking. (https://dev.ckeditor.com/ticket/13062)
            if (CKEDITOR.env.ie) {
                var range = editor.getSelection().getRanges()[0],
                    link = (range.getPreviousEditableNode() && range.getPreviousEditableNode().getAscendant('a', true)) ||
                    (range.getNextEditableNode() && range.getNextEditableNode().getAscendant('a', true)),
                    bookmark;

                if (range.collapsed && link) {
                    bookmark = range.createBookmark();
                    range.selectNodeContents(link);
                    range.select();
                }
            }

            var style = new CKEDITOR.style({ element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1 });
            editor.removeStyle(style);

            if (bookmark) {
                range.moveToBookmark(bookmark);
                range.select();
            }
        },

        refresh: function(editor, path) {
            // Despite our initial hope, document.queryCommandEnabled() does not work
            // for this in Firefox. So we must detect the state by element paths.

            var element = path.lastElement && path.lastElement.getAscendant('a', true);

            if (element && element.getName() == 'a' && element.getAttribute('href') && element.getChildCount())
                this.setState(CKEDITOR.TRISTATE_OFF);
            else
                this.setState(CKEDITOR.TRISTATE_DISABLED);
        },

        contextSensitive: 1,
        startDisabled: 1,
        requiredContent: 'a[href]',
        editorFocus: 1
    };




})();