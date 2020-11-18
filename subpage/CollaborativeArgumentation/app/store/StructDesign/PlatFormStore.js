Ext.define('AppPlat.store.StructDesign.PlatFormStore', {
    extend: 'Ext.data.Store',
    requires: [
        'AppPlat.model.StructDesign.PlatFormModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'AppPlat.model.StructDesign.PlatFormModel',
            storeId: 'PlatFormModel',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/Platform.json'
                },
                reader: {
                    type: 'json',
                    root: 'platform'
                }
            }
        }, cfg)]);
    }
});