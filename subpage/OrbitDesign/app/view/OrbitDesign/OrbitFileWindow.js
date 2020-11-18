/**
 * Created by Administrator on 2014/8/25.
 */

Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitFileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.orbitfilewindow',

    requires: [
        'OrbitDesignApp.view.OrbitDesign.OrbitFileGridPanel',
        'Ext.grid.Panel'
    ],
    height:300,
    title:'卫星轨道文件',
    closeAction: 'hide',
    layout: 'fit',
    width: 200,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'orbitfilegridpanel',
                    itemId:'orbitFileGridPanel'
                }
            ]
        });
        me.callParent(arguments);
    }

});