/**
 * Created by winter on 2014/7/10.
 */
Ext.define('TaskListApp.store.TaskUserStore', {
    extend: 'Ext.data.Store',
    requires: [
        'TaskListApp.model.TaskUserModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    autoDestroy: true,
    autoLoad: false,
    model: 'TaskListApp.model.TaskUserModel',
    proxy: {
        type: 'rest',
        format:'json',
        appendId:false,
        noCache:true,
        api: {
            read:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManageImpl/getTaskUser",
            update:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManageImpl/updateTaskUser",
            destroy:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManageImpl/deleteTaskUser",
            create:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManageImpl/addTaskUser"
        },
        reader: {
            type: 'json',
            messageProperty: 'message'
        }
    },
    sorters: [{
        property: 'start',
        direction: 'ASC'
    }]

});