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
    views: [
        'LoginRemindViewport'
    ],
    name: 'LoginRemindApp',
    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('LoginRemindApp.view.LoginRemindViewport');
    }
});
