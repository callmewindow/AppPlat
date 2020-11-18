/**
 * Created by Administrator on 2014/6/25.
 */

Ext.define('TaskListApp.controller.TaskController', {
    extend: 'Ext.app.Controller',
    views:[
        'TaskPanel',
        'ContextMenu',
        'TaskView',
        'EditTask.EditTaskWindow'
    ],
    stores:[
        'TaskStore',
        'EditTaskStore',
        'TaskUserStore'
    ],
    models:[
        'TaskModel'
    ],
    selectedTaskId:null,
    refs: [
        {
            ref: 'taskPanel',
            selector: 'taskpanel'
        },
        {
            ref: 'taskView',
            selector: 'taskview'
        },
        {
            ref: 'contextMenu',
            selector: 'contextmenu',
            xtype: 'contextmenu',
            autoCreate: true
        }
    ],
    require:[
        'Ext.tab.*',
        'Ext.window.*',
        'Ext.tip.*',
        'Ext.layout.container.Border'
    ],

    init: function(application) {
        var me = this;
        this.control({
            '#homeButton':{
                click:me.backToHome
            },
            '#deleteTaskItem': {
                click: me.handleDeleteClick
            },
            '#updateTaskItem': {
                click: me.handleUpdateClick
            },
            'taskview': {
                itemcontextmenu: me.showContextMenu,
                itemclick: me.onSelectClick,
                beforerender:me.beforeTaskViewRender
            }
        });

    },
    onLaunch:function(application){
    },
    onSelectClick: function(view, record, item, index, e, eOpts  ) {
        if(record.get('taskName')==null){//表示点击的是添加任务
            var win = Ext.create('TaskListApp.view.EditTask.EditTaskWindow');
            win.show();
        }
        else{
            this.selectedTaskId = record.get('taskId');
            sessionStorage.setItem(APC.SELECTED_TASK_ID,this.selectedTaskId);//传递taskId到下一个页面
            window.location.href = "../../subpage/CollaborativeArgumentation/ColArgumente.html";
        }
    },
    backToHome: function(component, e){
        window.location.href = "../../subpage/Navigation/Navigation.html";
    },
    handleDeleteClick: function (component, e ) {
        var me = this;
        var taskStore = me.getStore('TaskStore');
        var taskModel = me.taskRecord;
        var delTaskId =  me.taskRecord.get('taskId');
        Ext.Msg.show({
            title: '删除任务',
            msg: '你是否要删除' + me.taskRecord.get('taskName') + '?',
            buttons: Ext.Msg.YESNO,
            fn: function (response) {
                if (response === 'yes') {
                    // destroy the tree node on the server
                    taskStore.remove(taskModel);
                    //调用delete API
                    Ext.Ajax.request({

                        url:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/deleteTask.json",

                        method:'GET',
                        params: {
                            id: delTaskId,
                            userId:sessionStorage.getItem('userId')
                        },
                        success: function(response){
                            var jsonResult = Ext.JSON.decode(response.responseText);
                            var isOK = jsonResult.isOK;
                            if(!isOK){
                                Ext.MessageBox.show({
                                    title: '删除失败',
                                    msg: '删除任务失败,失败原因：'+jsonResult.errMsg,
                                    icon: Ext.Msg.ERROR,
                                    buttons: Ext.Msg.OK
                                });
                            }
                            //这个代码不能放在外面，否则其会先于回调函数执行，就会出现错误，这是由于后台在没有返回的
                            //时候JS代码已经在接着执行了
                            me.getStore('TaskStore').reload();//这种写法是可以的 me.getTaskStoreStore用不了
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
                            me.getStore('TaskStore').reload();//这种写法是可以的 me.getTaskStoreStore用不了
                        }
                    });


                }
            }
        });
    },
    handleUpdateClick: function (component, e) {
        sessionStorage.setItem(APC.SELECTED_TASK_ID,this.selectedTaskId);//传递taskId到下一个页面
        var win = Ext.create('TaskListApp.view.EditTask.EditTaskWindow');
        win.show();
    },
    showContextMenu: function (view, list, node, rowIndex, e) {
        var me = this;
        if(list.get('taskName')!=null){
            var contextMenu = this.getContextMenu();
            if(list.get('creatorAccount') != sessionStorage.getItem('account')){
                contextMenu.queryById('deleteTaskItem').hide();
            }else{
                contextMenu.queryById('deleteTaskItem').show();
            }
            contextMenu.setList(list);
            contextMenu.showAt(e.getX(), e.getY());
            e.preventDefault();
            this.selectedTaskId = list.get('taskId');
            me.taskRecord =list;
        }
    },
    beforeTaskViewRender:function(view, eOpts ){
        var me = this;
        Ext.apply(
            me.getStore('TaskStore').proxy.extraParams, {
                userId: sessionStorage.getItem('userId')
            });
        me.getStore('TaskStore').load();
    }
});
