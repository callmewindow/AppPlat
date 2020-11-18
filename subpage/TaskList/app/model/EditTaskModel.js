/**
 * Created by winter on 2014/6/13.
 */
Ext.define('TaskListApp.model.EditTaskModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'taskId'},
        { name: 'taskName'},
        { name: 'startTime'},
        { name: 'simulationStartTime'},
        { name: 'simulationEndTime'},
        { name: 'description'},
        { name: 'creator'},
        { name: 'creatorAccount'},
        { name: 'taskUserAccounts',type:'Array'},
        { name: 'processes',type:'Array'},
        { name: 'step'},
        { name: 'isOK'},
        { name: 'errMsg'}
    ],
    proxy:  {
        type: 'rest',
        format:'json',
        appendId:false,
        noCache:true,
        api: {
            create:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/addTaskInfo",
            read:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/getTaskInfo",
            update:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/updateTaskInfo"
        },
        reader: {
            type: 'json'
        }
    }
});