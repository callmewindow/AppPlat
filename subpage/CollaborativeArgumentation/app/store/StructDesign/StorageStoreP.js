Ext.define('AppPlat.store.StructDesign.StorageStoreP', {
    extend: 'Ext.data.ArrayStore',
    requires: [
        'AppPlat.model.StructDesign.StorageModel'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
//        var path = this.getApplication().getController('TreeController').getSolutionTree().getSelectionModel().getSelection()[0].get('nodeFilePath') + "/PersonalArea/" + sessionStorage.getItem("userId") + "/";
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'AppPlat.model.StructDesign.StorageModel',
            proxy:  {
                type: 'rest',
//                extraParams:{
//                    path: path
//                },
                format:'json',
                appendId:false,
                noCache:true,
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"StructFileManage/getSaveList"
                },
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});