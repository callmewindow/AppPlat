/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.InternalLoadGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.internalloadgridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    height: 500,
    itemId: 'mygridpanel',
    width: 130,
    scroll: 'vertical',
    title: '内部载荷',
    store: 'InternalLoadStore',
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
                        return '<img src="../../resources/images/internalLoad/'+value+'.png">';
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});