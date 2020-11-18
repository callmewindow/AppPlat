/**
 * Created by winter on 2014/4/26.
 */
Ext.Loader.setConfig({
    enabled: true
});
//Ext.Appliaction作为MVC的入口，创建一个应用实例
Ext.application({

    stores:[
        'PersonalTaskStore',
        'TaskStore'
    ],
    views: [
        'MyTaskViewport'
    ],
    controllers:[
        'TaskController'
    ],
    name: 'MyTaskApp',
    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('MyTaskApp.view.MyTaskViewport');
    }

});
