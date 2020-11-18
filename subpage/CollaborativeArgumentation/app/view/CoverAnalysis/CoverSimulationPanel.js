/**
 * Created by Administrator on 2014/7/2.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverSimulationPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.coversimulationpanel',
    requires: [
    ],
    layout: 'fit',
    title: '覆盖分析仿真',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            //store: satelliteData,
            items: [
            ]
        });
        me.callParent(arguments);
    }

});