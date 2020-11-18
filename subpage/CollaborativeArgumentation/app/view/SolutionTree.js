/**
 * Created by winter on 2014/4/23.
 */
Ext.define('AppPlat.view.SolutionTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.solutiontree',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action'
    ],
    width: 140,
    hideHeaders: true,
    margin: '0 -1 0 0',
    rootVisible: false,
    initComponent: function () {
        var me = this;
        me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];

        //初始化treeStore的信息
        var store = Ext.create('AppPlat.store.SolutionTreeStore');
        var taskId =sessionStorage.getItem(APC.SELECTED_TASK_ID);
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"TreeManage/getRootNode.json",
            method:'GET',
            params: {
                id: taskId
            },
            success: function(response){
                var jsonResult = Ext.JSON.decode(response.responseText);
                store.setRootNode({
                id: jsonResult.id,
                nodeType: jsonResult.nodeType,
                leaf: jsonResult.leaf,
                name: jsonResult.name,
                parentId: jsonResult.parentId,
                rootId: jsonResult.rootId,
                isRoot:jsonResult.isRoot,
                dataId:jsonResult.dataId,
                nodeOrder:jsonResult.nodeOrder,
                nodeFilePath:jsonResult.nodeFilePath
                 });
            }
        });
        me.store = store;
        me.columns = [
            {
                xtype: 'treecolumn',
                dataIndex: 'name',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    selectOnFocus: true,
                    allowOnlyWhitespace: false
                }
            }
        ];
        me.callParent(arguments);
    },
    refreshView: function () {
        // refresh the data in the view.  This will trigger the column renderers to run, making sure the task counts are up to date.
        this.getView().refresh();
    }

});
