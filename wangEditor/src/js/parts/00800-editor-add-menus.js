// 增加menus
_e(function (E, $) {

    // 存储创建菜单的函数
    E.createMenuFns = [];
    //创建的Menu 被放到一个数组当中
    E.createMenu = function (fn) {
        E.createMenuFns.push(fn);
    };

    // 创建所有菜单   
    
    E.fn.addMenus = function () {
        var editor = this;
        // 获取所有配置的menus
        var menuIds = editor.config.menus;

        // 检验 menuId 是否在配置中存在
        function check(menuId) {
            if (menuIds.indexOf(menuId) >= 0) {
                return true;
            }
            return false;
        }

        // 遍历所有的菜单创建函数，并执行
        $.each(E.createMenuFns, function (k, createMenuFn) {
            createMenuFn.call(editor, check);
        });
    };

});