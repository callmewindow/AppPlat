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
        'CoverAnalysisApp.store.SchedulerResourceStore',
        'CoverAnalysisApp.store.SchedulerEventStore',
        'TaskNameListStore'
    ],
    controllers: [
        'CoverAnalysisApp.controller.CoverController',
        'CoverAnalysisApp.controller.TreeController'
    ],
    views:[
        'CoverAnalysisApp.view.CoverAnalysisViewport'
    ],
    name: 'CoverAnalysisApp',
    launch: function() {
        Ext.create('CoverAnalysisApp.view.CoverAnalysisViewport');
        Ext.optionsToolbarAlign = 'br-br';
    }

});
