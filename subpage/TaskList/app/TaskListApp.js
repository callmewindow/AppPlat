/**
 * Created by winter on 2014/4/26.
 */
Ext.Loader.setConfig({
    enabled: true
});
Ext.require([
    'Ext.*'
]);
//Ext.Appliaction作为MVC的入口，创建一个应用实例
Ext.application({
    stores: [
        'TaskStore',
        'EditTaskStore',
        'TaskUserStore'
    ],
    model:[
        'EditTaskModel'
    ],
    controllers: [
        'TaskController',
        'EditTaskController'
    ],
    views: [
        'TaskView',
        'TaskPanel',
        'TaskListViewport',
        'EditTask.EditTaskWindow'
    ],
    requires: [
        'Ext.ux.DataView.Animated'
    ],
    name: 'TaskListApp',
    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('TaskListApp.view.TaskListViewport');
    }

});
