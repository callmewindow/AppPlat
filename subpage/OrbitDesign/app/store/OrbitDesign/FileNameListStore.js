/**
 * Created by Administrator on 2014/8/25.
 */
Ext.define('OrbitDesignApp.store.OrbitDesign.FileNameListStore', {
    extend: 'Ext.data.Store',

    requires: [
        'OrbitDesignApp.model.OrbitDesign.FileNameListModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'OrbitDesignApp.model.OrbitDesign.FileNameListModel',
            storeId: 'fileNameListStore',
            proxy: {
                type: 'rest',
                format:'json',
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getTaskNameByUserId"
                },
                reader: {
                    type: 'json',
                    root: 'externalload'
                }
            }
        }, cfg)]);
    }
});