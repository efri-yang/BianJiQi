// img 菜单
_e(function(E, $) {

    E.createMenu(function(check) {
        var menuId = 'img';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.img
        });

        menu.clickEvent = function(e) {
            var uploaderDialigId=editor.$valueContainer.attr("id")+"-imgupload-dialog";
            window.layer.open({
              type: 1,
              shade: false,
              move: '#'+uploaderDialigId+' .mine-move',
              title: false, //不显示标题
              area: '702px',
              content: $("#"+uploaderDialigId), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
              success: function(layero, index){
                editor.$valueContainer.attr("layer-index",index);
                !!editor.uploader && editor.uploader.refresh();
              },
              cancel: function(index, layero){ 
                editor.$valueContainer.removeAttr("layer-index");
              }
            });
            

            console.dir(editor.uploader);
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;






    });

    // --------------- 处理网络图片content ---------------


});