/**
 * Created by Administrator on 2014/8/25.
 */

Ext.define('CoverAnalysisApp.view.Window.CoverAnalysisTaskWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.coveranalysistaskwindow',

    requires: [
        'CoverAnalysisApp.view.Window.CoverAnalysisTskGridPanel',
        'Ext.grid.Panel'
    ],
    height:300,
    title:'数传分析任务列表',
    closeAction: 'hide',
    layout: 'fit',
    width: 200,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'coveranalysistaskgridpanel',
                    itemId:'coverAnalysisTaskGridPanel'
                }
            ]
        });
        me.callParent(arguments);
    }

});