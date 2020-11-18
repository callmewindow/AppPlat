Ext.define('MyTaskApp.view.MyTaskPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mytaskpanel',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.tip.QuickTipManager',
        'MyTaskApp.store.TaskStore',
        'MyTaskApp.store.PersonalTaskStore'
    ],
    height: 700,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    flex: 1,
                    title: '任务',
                    id: 'personalTaskList',
                    titleAlign: 'center',
                    enableColumnHide: false,
                    store: 'PersonalTaskStore',
                    scroll:'vertical',
                    columns: [
                        {
                            xtype: "rownumberer",
                            text: "序号",
                            width: 50,
                            align: 'center',
                            tdCls: ''
                        },
                        {
                            xtype: 'gridcolumn',
                            text: '任务名称',
                            dataIndex: 'perTaskName',
                            align: 'center',
                            resizable: false,
                            width: 340
                        },
                        {
                            xtype: 'gridcolumn',
                            text: '任务类型',
                            dataIndex: 'taskType',
                            align: 'center',
                            resizable: false,
                            width: 330
                        },
                        {
                            xtype: 'gridcolumn',
                            text: '最近修改时间',
                            dataIndex: 'recentlyModified',
                            align: 'center',
                            resizable: false,
                            width: 396
                        },
                        {
                            xtype: 'actioncolumn',
                            header: '删除',
                            itemId:'deleteTaskItem',
                            width: 50,
                            hidden: false,
                            align: 'center',
                            items: [
                                {
                                    iconCls: 'delete',
                                    tooltip: '删除',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var taskStore = Ext.getCmp("personalTaskList").getStore();
                                        var value = taskStore.getAt(rowIndex);
                                        var taskModel = grid.selModel;
                                        var delTaskId = value.data.perTaskId;
                                        var taskType = value.data.taskType;
                                        if(taskType == APC.TASK_TYPE_COLLABORATIVE_ARGUMENT){
                                            Ext.Msg.show({
                                                msg: '您没有删除这个任务的权限！',
                                                buttons: Ext.Msg.OK
                                            });
                                            return;
                                        }
                                        Ext.Msg.show({
                                            title: '删除任务',
                                            msg: '您是否要删除' + value.data.perTaskName + '?',
                                            buttons: Ext.Msg.YESNO,
                                            fn: function (response) {
                                                if (response === 'yes') {
                                                    // destroy the tree node on the server
                                                    taskStore.remove(taskModel);
                                                    //调用delete API
                                                    Ext.Ajax.request({

                                                        url: APC.APPPLAT_SERVICE_URL_PREFIX + "TaskManage/deletePersonalTaskInfo.json",

                                                        method: 'GET',
                                                        params: {
                                                            id: delTaskId,
                                                            userId: sessionStorage.getItem('userId')
                                                        },
                                                        success: function (response) {
                                                            var jsonResult = Ext.JSON.decode(response.responseText);
                                                            var isOK = jsonResult.isOK;
                                                            if (!isOK) {
                                                                Ext.MessageBox.show({
                                                                    title: '删除失败',
                                                                    msg: '删除任务失败,失败原因：' + jsonResult.errMsg,
                                                                    icon: Ext.Msg.ERROR,
                                                                    buttons: Ext.Msg.OK
                                                                });
                                                            }
                                                            //这个代码不能放在外面，否则其会先于回调函数执行，就会出现错误，这是由于后台在没有返回的
                                                            //时候JS代码已经在接着执行了
                                                            taskStore.reload();//这种写法是可以的 me.getTaskStoreStore用不了
                                                        },
                                                        failure: function (batch, options) {
                                                            var error = batch.exceptions[0].getError(),
                                                                msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                                                            Ext.MessageBox.show({
                                                                title: '删除任务失败',
                                                                msg: msg,
                                                                icon: Ext.Msg.ERROR,
                                                                buttons: Ext.Msg.OK
                                                            });
                                                            taskStore.reload();//这种写法是可以的 me.getTaskStoreStore用不了
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
});