/**
 * Created by Administrator on 2014/8/25.
 */

Ext.define('DataTransAnalysisApp.view.Window.DataTransTaskGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.datatranstaskgridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    titleAlign: 'center',
    hideHeaders: true,
    scroll: 'vertical',
    padding:'0 5 0 5',
    width: 200,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            store: 'TaskNameListStore',
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'perTaskName',
                    width:180
                }
            ]
        });

        me.callParent(arguments);
    }

});