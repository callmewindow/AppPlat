/**
 * Created by Administrator on 2014/6/25.
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../../libs/ext/ux/DataView/');
Ext.define('TaskListApp.view.TaskView', {
    extend: 'Ext.view.View',
    alias:'widget.taskview',
    requires: [
        'Ext.data.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.ux.DataView.Animated',
        'Ext.XTemplate',
        'Ext.panel.Panel',
        'Ext.toolbar.*',
        'Ext.slider.Multi',
        'TaskListApp.model.TaskModel',
        'TaskListApp.store.TaskStore'
    ],
    id: 'taskView',
    itemSelector: 'div.out',
    overItemCls : 'task-hover',
    multiSelect : true,
    autoScroll  : true,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            deferInitialRefresh: false,
            store: 'TaskStore',
            tpl  : Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="out" style="margin-top: 7.5%; margin-left:14%">',
                '<table><tr>',
                '{%if(xindex==1)%}{%{%}<td><img src="../../libs/ext/shared/icons/fam/newTask.png"/></td>' +
                '<td class="taskInfo"><strong>点击添加新的任务</strong></td>{%}%}',
                '{%else%}{%{%}<td><img src="../../libs/ext/shared/icons/fam/task1.png"/></td>' +
                '<td><strong>名称：</strong><span>{taskName}</span><br>' +
                '<strong>创建人：</strong><span>{creator}</span><span style="visibility:hidden">{creatorAccount}</span><br>'+
                '<strong>任务开始时间：</strong><span>{startTime}</span><br>'+
                '<strong>仿真开始时间：</strong><span>{simulationStartTime}</span><br>'+
                '<strong>仿真结束时间：</strong><span>{simulationEndTime}</span><br>'+
                '<strong>步长：</strong><span>{step}</span></td>{%}%}',
               '</tr></table>',
                '</div>',
                '</tpl>'
            ),
//            plugins : [
//                Ext.create('Ext.ux.DataView.Animated', {
//                    duration  :550,
//                    idProperty: 'id'
//                })
//            ],
            renderTo: Ext.getBody()
        });
        me.callParent(arguments);
    }
});
