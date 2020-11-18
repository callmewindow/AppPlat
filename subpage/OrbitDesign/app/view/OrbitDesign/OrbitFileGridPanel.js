/**
 * Created by Administrator on 2014/8/25.
 */

Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitFileGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orbitfilegridpanel',

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
            store: 'OrbitDesign.FileNameListStore',
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