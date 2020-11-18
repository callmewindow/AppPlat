/**
 * 修改 by 杜鹏宇 on 2015/3/31
 */

Ext.define('AppPlat.view.StructDesign.ExpansionGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.expansiongridpanel',

    requires: [
        'Ext.grid.column.Column'
    ],

    height: 500,
    width: 130,
    title: '拓展包',
    scroll: 'vertical',
    store: 'StructDesign.ExpansionLoadStore',
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
                        return '<img src="../../resources/images/expansionLoad/'+value+'.png">';
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});