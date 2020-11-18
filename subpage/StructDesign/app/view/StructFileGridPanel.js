/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.StructFileGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.structfilegridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    titleAlign: 'center',
    hideHeaders: true,
    scroll: 'vertical',
    padding:'0 5 0 5',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            store: 'FileNameListStore',
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'perTaskName',
                    align:'center',
                    hideHeaders:false,
                    width:180
                }
            ]
        });

        me.callParent(arguments);
    }

});