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
        'ToolListStore'
    ],
    controllers:[
        'ToolListController'
    ],
    views: [
        'ToolListPanel',
        'ToolViewPort',
        'ToolListView'
    ],
    name: 'NavigationApp',
    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('NavigationApp.view.ToolViewPort');
    }
});
