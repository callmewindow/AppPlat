/**
 * Created by winter on 2014/7/10.
 */
Ext.define('AppPlat.store.OrbitDesign.SimuParaStore', {
    extend: 'Ext.data.Store',
    model: 'AppPlat.model.OrbitDesign.SimuParaModel',
    autoLoad:false,
    proxy: {
        type: 'rest',
        format:'json',
        appendId:false,
        noCache:true,
        api: {
            read:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/getNodePara",
            update:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/updateNodePara",
            destroy:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/deleteNodePara",
            create:APC.APPPLAT_SERVICE_URL_PREFIX+"PropertyManage/addNodePara"
        },
        reader: {
            type: 'json',
            messageProperty: 'message'
        }
    }
});