/**
 * @class SimpleTasks.view.lists.ContextMenu
 * @extends Ext.menu.Menu
 */
Ext.define('CoverAnalysisApp.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contextmenu',
    items: [
        {
            text: '新建任务',
            iconCls: 'addTask',
            itemId: 'addDataTransAnalysisFileItem'
        },
        {
            text: '新建卫星',
            iconCls: 'satellite',
            itemId: 'addSatelliteItem'
        },
        {
            text: '新建天区点目标',
            iconCls: 'SkyCoverPoint',
            itemId: 'addSkyPointItem'
        },
        {
            text: '新建天区区域目标',
            iconCls: 'SkyCoverRegin',
            itemId: 'addSkyReginItem'
        },
        {
            text: '新建传感器',
            iconCls: 'Sensor',
            itemId: 'addSensorItem'
        },
        {
            text: '新建地面点目标',
            itemId: 'addGroundStationItem',
            iconCls: 'GroundStation'
        },
        {
            text: '属性',
            iconCls: 'propertyPanel',
            itemId: 'fixAttr'
        },
        {
            text: '重命名',
            iconCls: 'rename',
            itemId: 'fixRename'
        },
        {
            text: '删除',
            iconCls: 'delete',
            itemId: 'fixDelete'
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