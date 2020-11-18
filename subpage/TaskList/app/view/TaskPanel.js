/**
 * Created by Administrator on 2014/6/24.
 */
Ext.define('TaskListApp.view.TaskPanel', {
    extend: 'Ext.panel.Panel',
    alias:'widget.taskpanel',
    requires: [
        'Ext.data.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.button.Button',
        'Ext.ux.DataView.Animated',
        'Ext.XTemplate',
        'Ext.panel.Panel',
        'Ext.toolbar.*',
        'Ext.slider.Multi',
        'TaskListApp.model.TaskModel',
        'TaskListApp.view.TaskView'
    ],
    height: 800,
    width: 1000,
    title: '论证首页',
    bodyCls: 'content-panel-body',
    titleAlign: 'center',
    layout: 'fit',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items:[
                {
                    xtype: 'taskview',
                    itemId: 'dataViewId'
                }
               ]

        });
        me.callParent(arguments);
    }
});

      //TODO: the suspend/resume hack can be removed once Filtering has been updated