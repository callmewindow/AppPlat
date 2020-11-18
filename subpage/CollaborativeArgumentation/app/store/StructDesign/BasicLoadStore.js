Ext.define('AppPlat.store.StructDesign.BasicLoadStore', {
    extend: 'Ext.data.Store',
    requires: [
        'AppPlat.model.StructDesign.BasicLoadModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'AppPlat.model.StructDesign.BasicLoadModel',
            storeId: 'BasicLoadStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/BasicLoad.json'
                },
                reader: {
                    type: 'json',
                    root: 'basicload'
                }
            }
        }, cfg)]);
    }
});