/**
 * @class SimpleTasks.view.lists.ContextMenu
 * @extends Ext.menu.Menu
 */
Ext.define('AppPlat.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contextmenu',
    items: [
        {
            text: '新建',
            itemId:'newBuildItem',
            iconCls: 'addTask',
            menu:new Ext.menu.Menu({                              //二级菜单
                items:[
                    {
                        text: '方案',
                        iconCls: APC.NODETYPE_SOLUTION,
                        itemId: 'newSolutionItem'
                    },
                    {
                        text: '卫星',
                        iconCls: APC.NODETYPE_SATELLITE,
                        itemId: 'newSatelliteItem'
                    },
                    {
                        text: '地面站',
                        iconCls: APC.NODETYPE_GROUNDSTATION,
                        itemId: 'newGroundStationItem'
                    },
                    {
                        text: '覆盖分析',
                        iconCls: APC.NODETYPE_COVER_ANALYSIS,
                        itemId: 'newCoverAnalysisItem'
                    },
                    {
                        text: '数传分析',
                        iconCls: APC.NODETYPE_DATATRANS_ANALYSIS,
                        itemId: 'newDataTransAnalysisItem'
                    },
                    {
                        text: '天区点目标',
                        iconCls: 'SkyCoverPoint',
                        itemId: 'addSkyPointItem'
                    },
                    {
                        text: '天区区域目标',
                        iconCls: 'SkyCoverRegin',
                        itemId: 'addSkyReginItem'
                    },
                    {
                        text: '传感器',
                        iconCls: 'Sensor',
                        itemId: 'addSensorItem'
                    },
//                    {
//                        text: '过站分析',
//                        iconCls: 'tasks-new-folder',
//                        itemId: 'newOverStaAnalyItem'
//                    },
//                    {
//                        text: '链路分析',
//                        iconCls: 'tasks-new-folder',
//                        itemId: 'newChainAnalyItem'
//                    },
                    {
                        text: '结构',
                        iconCls: APC.NODETYPE_STRUCTURE,
                        itemId: 'newStructureItem'
                    }
//                    {
//                        text: '传感器',
//                        iconCls: 'tasks-new',
//                        itemId: 'newSensorItem'
//                    }

                ]
            })
        },

        {
            text: '属性',
            iconCls: 'propertyPanel',
            itemId: 'propertyItem'
        },
        {
            text: '加载',
            iconCls: 'download',
            itemId: 'loadStruct'
        },
         {
            text: '重命名',
            iconCls: 'rename',
            itemId: 'renameNodeItem'
        },
        {
            text: '删除',
            iconCls: 'delete',
            itemId: 'deleteNodeItem'
        }
    ],

    /**
     * Associates this menu with a specific list.
     * @param {SimpleTasks.model.List} list
     */
    setList: function(list) {
        this.list = list;
    },
    
    /**
     * Gets the list associated with this menu
     * @return {Task.model.List}
     */
    getList: function() {
        return this.list;
    }

});