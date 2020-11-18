/**
 * 修改 by 杜鹏宇 on 2014/07/10
 */

Ext.define('StructDesignApp.view.PlatFormGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.platformgridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    height: 500,
    width: 130,
    title: '平台',
    scroll: 'vertical',
    store: 'PlatFormStore',
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
                        return '<img src="../../resources/images/platformLoad/'+value+'.png">';
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});