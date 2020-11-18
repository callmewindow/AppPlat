Ext.define('AppPlat.store.StructDesign.ExternalLoadStore', {
    extend: 'Ext.data.Store',

    requires: [
        'AppPlat.model.StructDesign.ExternalLoadModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'AppPlat.model.StructDesign.ExternalLoadModel',
            storeId: 'ExternalLoadStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/ExternalLoad.json'
                },
                reader: {
                    type: 'json',
                    root: 'externalload'
                }
            }
        }, cfg)]);
    }
});