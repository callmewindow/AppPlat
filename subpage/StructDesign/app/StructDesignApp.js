/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.Loader.setConfig({
    enabled: true
//    disableCaching: false
});
Ext.require([
    'Ext.*'
]);
//Ext.Appliaction作为MVC的入口，创建一个应用实例
Ext.application({
    stores: [
        'BasicLoadStore',
        'InternalLoadStore',
        'PlatFormStore',
        'ExternalLoadStore',
        'ExpansionLoadStore'
    ],
    controllers: [
        'StructureController',
        'ModuleController',
        'MenuController'
    ],
    views:[
        'StructDesignApp.view.StructureViewport',
        'StructDesignApp.view.HelperWindow',
        'StructDesignApp.view.AdvancedControlWindow',
        'StructDesignApp.view.StructListWindow',
        'StructDesignApp.view.VideoDemoWindow'
    ],
    name: 'StructDesignApp',

    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('StructDesignApp.view.StructureViewport');
        Ext.optionsToolbarAlign = 'br-br';
    }

});
