/**
 * Created by acm-windows on 2014/5/18.
 */

Ext.Loader.setConfig({
    enabled: true
//    disableCaching: false
});
//Ext.Appliaction作为MVC的入口，创建一个应用实例
Ext.application({
    stores: [
    ],
    controllers: [
        'PermissionManagerController',
        'AccessStatisicController',
        'UserVerificationController',
        'DigitalSignaturesController',
        'CloudStoreOperateController'
    ],
    views:[
        'CloudClient.view.MainViewport'
    ],
    name: 'CloudClient',

    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('CloudClient.view.MainViewport');
        Ext.optionsToolbarAlign = 'br-br';
    }

});
