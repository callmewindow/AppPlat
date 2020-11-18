/**
 * Created by winter on 2014/4/23.
 */
Ext.define('CoverAnalysisApp.view.SolutionTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.solutiontree',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action'
    ],
    width: 150,

    hideHeaders: true,
    margin: '0 0 2 0',
    rootVisible: true,
    initComponent: function () {

        var me = this;
        me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];
        //初始化treeStore的信息
        var store = Ext.create('CoverAnalysisApp.store.SolutionTreeStore');
        me.store = store;
        me.columns = [
            {
                xtype: 'treecolumn',
                dataIndex: 'name',
                flex: 1,
                componentCls: 'Satellite',
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
