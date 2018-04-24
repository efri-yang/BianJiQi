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
            
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;






    });

    // --------------- 处理网络图片content ---------------


});