/**
 * Created by winter on 2014/5/7.
 */
Ext.define('AppPlat.view.DataTransAnalysis.DataTransAnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datatransanalysispanel',
    requires: [
        'AppPlat.view.DataTransAnalysis.SchedulerView',
        'AppPlat.view.DataTransAnalysis.AnalysisResultGridPanel',
        'AppPlat.view.DataTransAnalysis.SelectGroundStationInfoPanel'
    ],
    layout: 'border',
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    xtype: 'selectgroundstationinfopanel',
                    itemId: 'selectGroundStationInfoPanel',
                    region:'north'
                },
                {
                    xtype: 'schedulerview',
                    itemId: 'schedulerView',
                    region:'center'
                },
                {
                    xtype: 'analysisresultgridpanel',
                    itemId: 'analysisResultGridPanel',
                    region: 'south'
                }
            ]
        });
        me.callParent(arguments);
    }

});