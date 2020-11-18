/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.Loader.setConfig({
    enabled: true
});
Ext.require([
    'Ext.*'
]);
Ext.application({
    stores: [
        'DataTransAnalysisApp.store.SchedulerResourceStore',
        'DataTransAnalysisApp.store.SchedulerEventStore',
        'TaskNameListStore'
    ],
    controllers: [
        'DataTransAnalysisApp.controller.DataTransController',
        'DataTransAnalysisApp.controller.TreeController'
    ],
    views:[
        'DataTransAnalysisApp.view.DataTransAnalysisViewport'
    ],
    name: 'DataTransAnalysisApp',
    launch: function() {
        Ext.create('DataTransAnalysisApp.view.DataTransAnalysisViewport');
        Ext.optionsToolbarAlign = 'br-br';
    }
});
