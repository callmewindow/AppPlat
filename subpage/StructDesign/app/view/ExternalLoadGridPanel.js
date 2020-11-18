/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.ExternalLoadGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.externalloadgridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    height: 500,
    width: 130,
    scroll: 'vertical',
    title: '外部载荷',
    hideHeaders: true,
    store: 'ExternalLoadStore',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        return '<img src="../../resources/images/externalLoad/'+value+'.png">';
                    },
                    text: 'icon'
                }
            ]
        });

        me.callParent(arguments);
    }
});