/**
 * Created by winter on 2014/5/7.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverAnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.coveranalysispanel',
    requires: [
        'AppPlat.view.CoverAnalysis.CoverConfigPanel',
        'AppPlat.view.CoverAnalysis.CoverSimulationPanel',
        'AppPlat.view.CoverAnalysis.CoverResultPanel'
    ],
    layout: 'border',
    title: '覆盖分析',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'coverconfigpanel',
                    region:  'north',
                    width: 400,
                    height: 117
                },
                {
                    xtype: 'coversimulationpanel',
                    region: 'center'
                },
                {
                    xtype: 'coverresultpanel',
                    region:  'east',
                    width:350
                }
            ]
        });

        me.callParent(arguments);
    }

});