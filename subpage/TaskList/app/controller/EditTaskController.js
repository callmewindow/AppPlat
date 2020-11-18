/**
 * Created by winter on 2014/6/13.
 */
Ext.define('TaskListApp.controller.EditTaskController', {
    extend: 'Ext.app.Controller',

    stores: [
        'TaskStore'
    ],
    models: [
        'TaskModel',
        'EditTaskModel'
    ],
    refs: [
        {
            ref: 'editTaskWindow',
            selector: 'edittaskwindow'
        },
        {
            ref: 'taskView',
            selector: 'taskview'
        }
    ],
    init: function (application) {
        var me = this;
        this.control({
            '#addTaskUser': {
                click: me.handleAddTaskUser
            },
            '#commitButton': {
                click: me.handleCommmitClick
            },
            'edittaskwindow': {
                render: me.addParas,
                beforeclose:me.handleEdittaskwindowClose
            },
            '#simulationStartTime': {
                change: me.changeStartTime
            },
            '#simulationEndTime': {
                change: me.changeEndTime
            },
            "#taskUserGridPanel":{
                select: me.selectRow,
                itemdblclick:me.taskUserIemdbclick,
                validateedit:me.validateEdit,
                edit:me.afterEdit,
                canceledit:me.cancelEdit
            },
            '#removeTaskUser': {
                click: me.handleRemoveTaskUser
            }

        });
    },
    onLaunch: function (application) {
    },
    changeStartTime: function (numberfield, newValue, oldValue, eOpts) {
        var compareTime = function (start, stop) {
            if (start == null || stop == null) return 1;
            if ((new Date(start)).getTime() < (new Date(stop)).getTime()) {
                return 1;
            }
            else if ((new Date(start)).getTime() == (new Date(stop)).getTime()) {
                return 0;
            }
            else {
                return -1;
            }
        };

        if (compareTime(newValue, this.getEditTaskWindow().queryById('simulationEndTime').getValue()) < 0) {
            this.getEditTaskWindow().queryById('simulationStartTime').setValue(oldValue);
            this.getEditTaskWindow().queryById('errorLabel').setText(APC.ERROR_START_TIME_LATE);
        }
        else{
            this.getEditTaskWindow().queryById('errorLabel').setText('');
        }
    },

    changeEndTime: function (numberfield, newValue, oldValue, eOpts) {
        var compareTime = function (start, stop) {
            if (start == null || stop == null) return 1;
            if ((new Date(start)).getTime() < (new Date(stop)).getTime()) {
                return 1;
            }
            else if ((new Date(start)).getTime() == (new Date(stop)).getTime()) {
                return 0;
            }
            else {
                return -1;
            }
        };

        if (compareTime(this.getEditTaskWindow().queryById('simulationStartTime').getValue(), newValue) < 0) {
            this.getEditTaskWindow().queryById('simulationEndTime').setValue(oldValue);
            this.getEditTaskWindow().queryById('errorLabel').setText(APC.ERROR_END_TIME_EARLY);
        }else{
            this.getEditTaskWindow().queryById('errorLabel').setText('');
        }
    },

    handleCommmitClick: function (button, e, eOpts) {
        var me = this;
        var editTaskWindow = this.getEditTaskWindow();
        var taskName = editTaskWindow.queryById('taskName').getValue();
        var description =  editTaskWindow.queryById('description').getValue();
        var startTime = editTaskWindow.queryById('startTime').getValue();
        var simulationEndTime =editTaskWindow.queryById('simulationEndTime').getValue();
        var simulationStartTime = editTaskWindow.queryById('simulationStartTime').getValue();
        var step = editTaskWindow.queryById('step').getValue();
        if(taskName == ''||startTime == null || simulationEndTime == null || simulationStartTime == null || step == null ){
            this.getEditTaskWindow().queryById('errorLabel').setText(APC.ERROR_TETX_TASK_INFO_INCOMPLETE);
            return;
        }else if(me.getEditTaskWindow().queryById('errorLabel').text == APC.ERROR_END_TIME_EARLY||me.getEditTaskWindow().queryById('errorLabel').text == APC.ERROR_START_TIME_LATE){
            return;
        }
        var taskRecord = Ext.create('TaskListApp.model.EditTaskModel');
        if (sessionStorage.getItem(APC.SELECTED_TASK_ID) != 'null'&&sessionStorage.getItem(APC.SELECTED_TASK_ID) != null) {
            taskRecord.set('taskId', sessionStorage.getItem(APC.SELECTED_TASK_ID));
        }
        taskRecord.set('taskName', taskName);//queryById可快速找到任意级别的控件
        taskRecord.set('description', description);
        taskRecord.set('startTime', startTime);
        taskRecord.set('simulationStartTime',simulationStartTime);
        taskRecord.set('simulationEndTime', simulationEndTime);
        taskRecord.set('step', step);
        var processArray = new Array();
        var num = 0;
        //删除对流程的配置部分
//        if (this.getEditTaskWindow().queryById('isOrbitDesign').getValue()) {
            processArray[num++] = APC.PROCESS_ORBIT_DESIGN;
//        }
//        if (this.getEditTaskWindow().queryById('isStructDesign').getValue()) {
            processArray[num++] = APC.PROCESS_STRUCT_DESIGN;
//        }
//        if (this.getEditTaskWindow().queryById('isCoverAnalysis').getValue()) {
            processArray[num++] = APC.PROCESS_COVER_ANALYSIS;
//        }
//        if (this.getEditTaskWindow().queryById('isDataTransAnalysis').getValue()) {
            processArray[num++] = APC.PROCESS_DATATRANS_ANALYSIS;
//        }
        taskRecord.set('processes', processArray);
        taskRecord.set('creator',sessionStorage.getItem('name'));
        var taskUserArray = new Array();
        var panel = me.getEditTaskWindow().queryById("taskUserGridPanel");
        var records = panel.getStore().data.items;
        for(i =0; i < records.length; i++){
            taskUserArray.push(records[i].data.account)
        }
        taskRecord.set('taskUserAccounts', taskUserArray);
        taskRecord.proxy.extraParams = {
            userId: sessionStorage.getItem('userId')
        };
        taskRecord.save({
            success: function (record) {
                editTaskWindow.close();
                taskRecord.set('taskId', record.get('taskId'));
                sessionStorage.removeItem(APC.SELECTED_TASK_ID);
                me.getStore('TaskStore').reload();//这种写法是可以的 me.getTaskStoreStore用不了
            },
            failure: function (record) {
                var error = record.getError(),
                    msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                Ext.MessageBox.show({
                    title: '添加失败',
                    msg: msg,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                sessionStorage.removeItem(APC.SELECTED_TASK_ID);
            }
        });
    },

    addParas: function (panel) {
        var editTaskPanel = this.getEditTaskWindow();
        var taskId = sessionStorage.getItem(APC.SELECTED_TASK_ID);
        if (taskId != 'null'&&taskId != null) {//当APC.SELECTED_TASK_ID没有被存入session的时候获得的为'null'字符串，当被移除以后为null型变量，所以这么写
            this.getModel('EditTaskModel').load(taskId, {
                success: function (record, operation) {
                },
                failure: function (record, operation) {
                },
                callback: function (record, operation, success) {
                    var me = this;
                    editTaskPanel.queryById('taskName').setValue(record.get('taskName'));
                    editTaskPanel.queryById('description').setValue(record.get('description'));
                    editTaskPanel.queryById('startTime').setValue(record.get('startTime'));
                    editTaskPanel.queryById('simulationStartTime').setValue(record.get('simulationStartTime'));
                    editTaskPanel.queryById('simulationEndTime').setValue(record.get('simulationEndTime'));
                    editTaskPanel.queryById('step').setValue(record.get('step'));
                    var processes = record.get('processes');
                    var models = new Array();
                    for(i =0;i < record.get('taskUserAccounts').length;i++){
                        var r = Ext.create('TaskListApp.model.TaskUserModel', {
                            account:record.get('taskUserAccounts')[i]
                        });
                        models.push(r);
                    }
                    //这里并未给taskUserGridPanel设置store，而是直接创建一个store实例然后加载model即可，避免了bufffered的错误。
                    editTaskPanel.queryById("taskUserGridPanel").getStore().loadData(models);
                    if(record.get('creatorAccount') != sessionStorage.getItem('account')){
                        editTaskPanel.queryById('addTaskUser').hide();
                        editTaskPanel.queryById('removeTaskUser').hide();
                    }
//                    var isOrbitDesign = isRecordContain(APC.PROCESS_ORBIT_DESIGN, processes);
//                    var isStructDesign = isRecordContain(APC.PROCESS_STRUCT_DESIGN, processes);
//                    var isCoverAnalysis = isRecordContain(APC.PROCESS_COVER_ANALYSIS, processes);
//                    var isDataTransAnalysis = isRecordContain(APC.PROCESS_DATATRANS_ANALYSIS, processes);
//                    editTaskPanel.queryById('isOrbitDesign').setValue(isOrbitDesign);
//                    editTaskPanel.queryById('isStructDesign').setValue(isStructDesign);
//                    editTaskPanel.queryById('isCoverAnalysis').setValue(isCoverAnalysis);
//                    editTaskPanel.queryById('isDataTransAnalysis').setValue(isDataTransAnalysis);
                }
            });
        }
    },

    handleAddTaskUser:function (component, e) {
        var me = this;
        var r = Ext.create('TaskListApp.model.TaskUserModel', {
            account:'请填写参与成员(非创建人)账户'
        });
        me.getEditTaskWindow().queryById("taskUserGridPanel").getStore().insert(0, r);
        me.getEditTaskWindow().queryById("taskUserGridPanel").getPlugin('rowEditing').startEdit(0, 0);
    },
    selectRow: function(rowModel, record, index, eOpts){
        var me = this;
        var panel = me.getEditTaskWindow().queryById("taskUserGridPanel");
        panel.down('#removeTaskUser').setDisabled(false);
    },
    handleRemoveTaskUser: function (component, e) {
        var me = this;
        var panel = me.getEditTaskWindow().queryById("taskUserGridPanel");
        var store = panel.getStore();
        var sm = panel.getSelectionModel();
        panel.getPlugin('rowEditing').cancelEdit();
        var selectRow = sm.getSelection()[0];
        store.remove(selectRow);
        if (store.getCount() > 0) {
            sm.select(0);
        }
    },
    handleEdittaskwindowClose:function( panel, eOpts ){
        sessionStorage.removeItem(APC.SELECTED_TASK_ID);
        this.getEditTaskWindow().queryById("taskUserGridPanel").getStore().reload();
    },
    taskUserIemdbclick:function(view, record, item, index, e, eOpts ){
        var me  =this;
        me.getEditTaskWindow().queryById("taskUserGridPanel").getPlugin('rowEditing').cancelEdit();
    },
    validateEdit:function ( editor, context, eOpts ){
        if(context.newValues.account == sessionStorage.getItem('account')){
             this.getEditTaskWindow().queryById('errorLabel').setText(APC.TIP_OF_ADD_TASK_USER);
            return false;
        }
    },
    afterEdit:function( editor, context, eOpts ){
        this.getEditTaskWindow().queryById('errorLabel').setText('');
    },
    cancelEdit:function( editor, context, eOpts ){
        this.getEditTaskWindow().queryById('errorLabel').setText('');
    }
});
