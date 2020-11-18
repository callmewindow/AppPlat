/**
 * Created by Administrator on 2014/8/25.
 */
Ext.define('DataTransAnalysisApp.store.TaskNameListStore', {
    extend: 'Ext.data.Store',

    requires: [
        'DataTransAnalysisApp.model.TaskNameListModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'DataTransAnalysisApp.model.TaskNameListModel',
            storeId: 'taskNameListStore',
            proxy: {
                type: 'rest',
                format:'json',
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX + "DataTransAnalysisManage/getTaskNameByUserId"
                },
                reader: {
                    type: 'json',
                    root: 'externalload'
                }
            }
        }, cfg)]);
    }
});