/**
 * Created by Taivas on 5/4/14.
 * Not in use in a while
 */
Ext.define('AppPlat.view.OrbitDesign.OrbitParaWindow', {
    alias: 'widget.orbitparawindow',
    extend: 'Ext.window.Window',
    requires: [
        'AppPlat.view.OrbitDesign.OrbitParaPanel',
        'AppPlat.view.OrbitDesign.SateParaPanel',
        'AppPlat.view.OrbitDesign.SimuParaPanel',
        'Ext.panel.Panel'
    ],
    id:'orbitParaWindow',
    height: 340,
    width: 280,
    title: '参数设定',
    closeAction: 'hide',
    resizable: false,
    layout: {
        type: 'accordion',
        hideCollapseTool: true,
        animate: true
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'orbitparapanel',
                    collapsible: true,
                    autoScroll: true,
                    itemId: 'orbitparapanel',
                    title: '轨道参数'

                },
                {
                    xtype: 'sateparapanel',
                    collapsible: true,
                    autoScroll: true,
                    itemId: 'sateparapanel',
                    title: '姿态参数'
                },
                {
                    xtype: 'simuparapanel',
                    collapsible: true,
                    autoScroll: true,
                    itemId: 'simuparapanel',
                    title: '仿真参数'
                }
            ]
        });

        me.callParent(arguments);
    }

});