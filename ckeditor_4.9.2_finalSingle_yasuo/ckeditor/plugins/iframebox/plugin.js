CKEDITOR.plugins.add('iframebox', {
    icons: 'iframebox',
    init: function(editor) {

    	var that=this;
        editor.ui.addButton("iframebox", {
            label: '插入表单',
            // The command to execute on click.
            command: 'iframebox',
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'insert'
        });

        this._iframeboxInit.call(editor);

        var element = new CKEDITOR.dom.element( 'iframe' );



        editor.on('doubleclick', function(evt) {
					
					var element = evt.data.element,url,w,h;
					
					console.dir(element);
					w = element.$.clientWidth;
                	h = element.$.clientHeight;


				});

        editor.on("click",function(){
        	alert("asdfasdfasdf");
        })


        editor.addCommand('iframebox', {

            exec: function(editor) {
            	//渲染html
				
				if (!editor.iframeBox.$dialog) {

	                that._iframeboxRender.call(editor);
	            }


				


                layerIndex=layer.open({
				  type: 1,
				  shade: false,
				  title: "iframe属性设置", //不显示标题
				  content: editor.iframeBox.$dialog, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area:"500px"
				});
            }
        });
    },
    _iframeboxInit:function(){
    	var editor = this;
        editor.iframeBox = {};
        editor.iframeBox.dialogId = editor.name + "-iframebox-dialog";
    },
    _iframeboxRender:function(){
    	var editor=this;
    	var htmlStr='<div class="ckeditor-iframebox-dialog" id="'+editor.iframeBox.dialogId+'">'+
							'<div class="item-cell">'+
								'<label class="lab">URL地址</label>'+
								'<input type="text" class="ckeditor-coms-formtext" size="50" name="iframeboxurl" value="http://www.xiaoyu.com/enroll?app_id=2559">'+
							'</div>'+

							'<div class="item-cell">'+
								'<label class="lab">宽</label>'+
								'<input type="text" class="ckeditor-coms-formtext" size="8" name="iframeboxw">'+
							'</div>'+

							'<div class="item-cell">'+
								'<label class="lab">高</label>'+
								'<input type="text" class="ckeditor-coms-formtext" size="8" name="iframeboxh">'+
							'</div>'+
							
							'<div class="ckeditor-iframebox-ft">'+
								'<a href="#" class="ckeditor-btn-default J_btn-close">关闭</a>'+
								'<a href="#" class="ckeditor-btn-primary J_btn-confirm">确认</a>'+
							'</div>'+
						'</div>';


		$(htmlStr).appendTo($("body"));
		var $dialog=$("#"+editor.iframeBox.dialogId);
		editor.iframeBox.$dialog=$dialog;


		var $closeBtn=$dialog.find(".J_btn-close");
		var $confirmBtn=$dialog.find(".J_btn-confirm");

		var $formUrl=$dialog.find('input[name="iframeboxurl"]');
		var $formW=$dialog.find('input[name="iframeboxw"]');
		var $formH=$dialog.find('input[name="iframeboxh"]');


		

		$closeBtn.on("click",function(){
			layer.close(layerIndex);
		});


		$confirmBtn.on("click",function(){
			var iframebox='<iframe frameborder="none" src="'+$formUrl.val()+'" width="'+$formW.val()+'"  height="'+$formH.val()+'"></iframe>';
			editor.insertHtml(iframebox);
			layer.close(layerIndex);
		});



    }
})