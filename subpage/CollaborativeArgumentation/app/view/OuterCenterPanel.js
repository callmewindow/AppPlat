/**
 * Created by winter on 2014/4/26.
 */
Ext.define('AppPlat.view.OuterCenterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.outercenterpanel',
    requires: [
        'AppPlat.view.StructDesign.StructDesignPanel',
        'AppPlat.view.OrbitDesign.OrbitDesignPanel',
        'AppPlat.view.CoverAnalysis.CoverAnalysisPanel',
        'AppPlat.view.DataTransAnalysis.OverStationAnalysisPanel',
        'AppPlat.view.DataTransAnalysis.ChainAnalysisPanel',
        'Ext.panel.Panel'
    ],
    layout: 'fit',
    margin:'-4 -2 -1 -2',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            ]
        });
        me.callParent(arguments);
    }
});