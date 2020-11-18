Ext.define('AppPlat.store.StructDesign.InternalLoadStore', {
    extend: 'Ext.data.Store',

    requires: [
        'AppPlat.model.StructDesign.InternalLoadModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'AppPlat.model.StructDesign.InternalLoadModel',
            storeId: 'InternalLoadStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/InterLoad.json'
                },
                reader: {
                    type: 'json',
                    root: 'interload'
                }
            }
        }, cfg)]);
    }
});