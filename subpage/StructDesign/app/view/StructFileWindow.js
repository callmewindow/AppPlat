/**
 * Created by winter on 2014/8/19.
 */

Ext.define('StructDesignApp.view.StructFileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.structfilewindow',

    requires: [
        'StructDesignApp.view.StructFileGridPanel',
        'Ext.panel.Panel',
        'Ext.grid.Panel',
        'Ext.form.field.Number'
    ],
    height:300,
    title:'卫星结构文件',
    layout: 'fit',
    width: 200,
    resizable: false,

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'structfilegridpanel',
                    itemId:'structFileGridPanel'
                }
            ]
        });
        me.callParent(arguments);
    }

});