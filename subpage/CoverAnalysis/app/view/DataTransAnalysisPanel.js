/**
 * Created by winter on 2014/5/7.
 */
Ext.define('CoverAnalysisApp.view.DataTransAnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datatransanalysispanel',
    requires: [
        'CoverAnalysisApp.view.SchedulerView',
        'CoverAnalysisApp.view.AnalysisResultGridPanel'
    ],
    layout: 'border',
    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    xtype: 'schedulerview',
                    itemId: 'schedulerView',
                    region:'north'
                },
                {
                    xtype: 'analysisresultgridpanel',
                    itemId: 'analysisResultGridPanel',
                    region: 'center'
                }
            ]
        });

        me.callParent(arguments);
    }

});