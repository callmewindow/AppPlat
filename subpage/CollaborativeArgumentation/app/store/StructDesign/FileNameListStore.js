Ext.define('AppPlat.store.StructDesign.FileNameListStore', {
    extend: 'Ext.data.Store',

    requires: [
        'StructDesignApp.model.FileNameListModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'StructDesignApp.model.FileNameListModel',
            storeId: 'fileNameListStore',
            proxy: {
                type: 'rest',
                format:'json',
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"StructFileManage/getFilesNameWithoutExtension"
                },
                reader: {
                    type: 'json',
                    root: 'externalload'
                }
            }
        }, cfg)]);
    }
});
