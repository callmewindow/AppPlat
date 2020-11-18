/**
 * @class SimpleTasks.view.lists.ContextMenu
 * @extends Ext.menu.Menu
 */
Ext.define('OrbitDesignApp.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contextmenu',
    items: [
        {
            text: '新建任务',
            iconCls: 'addTask',
            id: 'newOrbitFileItem'
        },
        {
            text: '添加卫星',
            iconCls: 'satellite',
            id: 'addSatelliteItem'
        },
        {
            text: '仿真参数',
            iconCls: 'simupara',
            id: 'simuparaItem'
        },
        {
            text: '属性',
            iconCls: 'propertyPanel',
            id: 'propertyItem'
        },
        {
            text: '轨道段设计',
            iconCls: 'propertyPanel',
            id: 'orbitSectionDesignItem'
        },
        {
            text: '重命名',
            id: 'renameNodeItem',
            iconCls: 'rename'

        },
        {
            text: '显示',
            iconCls: 'visibile',
            id: 'showSatelliteOrbitItem'
        },
        {
            text: '隐藏',
            iconCls: 'invisible',
            id: 'hideSatelliteOrbitItem'
        },
        {
            text: '删除',
            iconCls: 'delete',
            id: 'deleteNodeItem'
        }
    ],
    /**
     * Associates this menu with a specific list.
     * @param {SimpleTasks.model.List} list
     */
    setList: function (list) {
        this.list = list;
    },

    /**
     * Gets the list associated with this menu
     * @return {Task.model.List}
     */
    getList: function () {
        return this.list;
    }

});