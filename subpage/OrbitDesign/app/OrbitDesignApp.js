
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
        'OrbitDesign.FileNameListStore'
    ],
    controllers: [
        'TreeController',
        'OrbitDesign.OrbitSceneController',
        'OrbitDesign.OrbitController'
    ],
    views:[
        'OrbitDesignApp.view.OrbitDesignViewPort'
    ],
    name: 'OrbitDesignApp',

    //This is fired as soon as the page is ready
    launch: function() {
        Ext.create('OrbitDesignApp.view.OrbitDesignViewPort');
        Ext.optionsToolbarAlign = 'br-br';
    }

});
