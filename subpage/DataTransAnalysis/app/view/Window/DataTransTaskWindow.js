/**
 * Created by Administrator on 2014/8/25.
 */

Ext.define('DataTransAnalysisApp.view.Window.DataTransTaskWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.datatranstaskwindow',

    requires: [
        'DataTransAnalysisApp.view.Window.DataTransTaskGridPanel',
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
                    xtype: 'datatranstaskgridpanel',
                    itemId:'dataTransTaskGridPanel'
                }
            ]
        });
        me.callParent(arguments);
    }

});