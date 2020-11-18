/**
 * Created by winter on 2014/7/10.
 */
Ext.define('OrbitDesignApp.store.OrbitDesign.OrbitSectionStore', {
    extend: 'Ext.data.Store',
    requires: [
        'OrbitDesignApp.model.OrbitDesign.OrbitSectionModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        var data = [
            ["1","轨道段一","金星","地球","2012-12-12 00:00:00","2012-12-12 00:00:00","15"],
            ["2","轨道段一","金星","地球","2012-12-12 00:00:00","2012-12-12 00:00:00","15"],
            ["3","轨道段一","金星","地球","2012-12-12 00:00:00","2012-12-12 00:00:00","15"]
        ];
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'OrbitDesignApp.model.OrbitDesign.OrbitSectionModel',
            data: data
        }, cfg)]);
    }
//    proxy: {
//        type: 'rest',
//        format:'json',
//        appendId:false,
//        noCache:true,
////        api: {
////            read:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/getNodePara",
////            update:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/updateNodePara",
////            destroy:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/deleteNodePara",
////            create:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/addNodePara"
////        },
//        reader: {
//            type: 'json',
//            messageProperty: 'message'
//        }
//    }
});