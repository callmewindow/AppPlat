/**
 * Created by Administrator on 2014/6/24.
 */
Ext.define('TaskListApp.store.TaskStore', {
    extend: 'Ext.data.ArrayStore',
    requires: [
        'TaskListApp.model.TaskModel'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};

        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'TaskListApp.model.TaskModel',
            storeId: 'TaskStore',
            sortInfo: {
                field    : 'name',
                direction: 'ASC'
            },
            proxy:  {
                type: 'rest',
                format:'json',
                appendId:false,
                noCache:true,
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/getMyColTask"
                },
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});