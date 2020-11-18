/**
 * Created by winter on 2014/5/7.
 */
/**
 * Created by winter on 2014/5/7.
 */
/**
 * Created by winter on 2014/4/26.
 */
Ext.define('AppPlat.view.DataTransAnalysis.OverStationAnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.overstationanalysispanel',
    requires: [
        'AppPlat.view.DataTransAnalysis.SelectNodePanel',
        'AppPlat.view.DataTransAnalysis.OverStationResultPanel'
    ],
    layout: 'border',
    title: '过站分析',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'selectnodepanel',
                    region:  'north',
                    height: 80
                },
                {
                    xtype: 'overstationresultpanel',
                    region: 'center'
                }
        ]
        });

        me.callParent(arguments);
    }

});