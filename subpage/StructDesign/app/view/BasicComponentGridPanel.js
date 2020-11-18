/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.BasicComponentGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.basiccomponentgridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    height: 500,
    width: 130,
    title: '基础模型',
    scroll: 'vertical',
    store: 'BasicLoadStore',
    hideHeaders:true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    hideHeaders:true,
                    width:120,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        return '<img src="../../resources/images/basicLoad/'+value+'.png">';
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});