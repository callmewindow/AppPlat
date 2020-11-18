
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
        'Accessibility.GroupMemberStore',
        'StructDesign.BasicLoadStore',
        'StructDesign.InternalLoadStore',
        'StructDesign.PlatFormStore',
        'StructDesign.ExternalLoadStore',
        'StructDesign.StorageStoreP',
        'StructDesign.StorageStoreC',
        'StructDesign.ExpansionLoadStore'
    ],
    controllers: [
        'AppPlat.controller.Accessibility.ChatController',
        'AppPlat.controller.StructDesign.MenuController',
        'AppPlat.controller.StructDesign.StructureController',
        'AppPlat.controller.StructDesign.ModuleController',
        'AppPlat.controller.OrbitDesign.OrbitController',
        'AppPlat.controller.OrbitDesign.OrbitSceneController',
        'AppPlat.controller.TreeController',
        'AppPlat.controller.CoverAnalysis.CoverConfigController',
        'AppPlat.controller.DataTransAnalysis.DataTransController',
        'AppPlat.controller.SceneInitController',
        'AppPlat.controller.OrbitDesign.GroundStationController'
    ],
    views:[
        'StructureViewport',
        'AppPlat.view.StructDesign.HelperWindow',
        'AppPlat.view.StructDesign.StructListWindow'
    ],
    name: 'AppPlat',

    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('AppPlat.view.StructureViewport');
        Ext.optionsToolbarAlign = 'br-br';
    }

});
