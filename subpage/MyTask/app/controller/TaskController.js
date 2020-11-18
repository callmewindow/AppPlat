/**
 * Created by winter on 2014/8/28.
 */
Ext.define('MyTaskApp.controller.TaskController',{
    extend: 'Ext.app.Controller',
    stores:[
        'PersonalTaskStore',
        'TaskStore'
    ],
    refs: [
        {
            ref: 'myTaskPanel',
            selector: 'mytaskpanel'
        }
    ],
    init: function (application) {
        var me =this;
        this.control({
            // > 表示子控件中所有满足条件的
            'mytaskpanel > gridpanel[id=personalTaskList]':{
                itemdblclick: me.openPersonalTask
            },
            'mytaskpanel':{
                beforerender:me.handleBeforeRender,
                afterrender:me.handleAfterrender
            }
        });
    },
    handleBeforeRender:function(panel,eOpts){
        Ext.apply(
        this.getStore('PersonalTaskStore').proxy.extraParams, {
            userId: sessionStorage.getItem('userId')
        });
        this.getStore('PersonalTaskStore').load();
    },
    handleAfterrender:function(panel,eOpts){
      console.log(panel);
    },
    openPersonalTask:function(grid, anRecord, e){
        var record = grid.getSelectionModel().getSelection();
        if(anRecord.get('taskType') == APC.PER_TASK_TYPE_ORBIT_DESIGN){
            window.location.href="../../subpage/OrbitDesign/OrbitDesign.html";
            sessionStorage.setItem(APC.SELECTED_TASK_ID,record[0].data.perTaskId);
        }else if(anRecord.get('taskType') == APC.PER_TASK_TYPE_STRUCTURE_DESIGN){
            window.location.href="../../subpage/StructDesign/StructDesign.html";
            sessionStorage.setItem(APC.SELECTED_TASK_ID,record[0].data.perTaskId);
        }else if(anRecord.get('taskType') == APC.PER_TASK_TYPE_COVER_ANALYSIS){
            window.location.href="../../subpage/CoverAnalysis/CoverAnalysis.html";
            sessionStorage.setItem(APC.SELECTED_TASK_ID,record[0].data.perTaskId);
        }else if(anRecord.get('taskType') == APC.PER_TASK_TYPE_DATATRANS_ANALYSIS){
            window.location.href="../../subpage/DataTransAnalysis/DataTransAnalysis.html";
            sessionStorage.setItem(APC.SELECTED_TASK_ID,record[0].data.perTaskId);
        }
        else if(anRecord.get('taskType') == APC.TASK_TYPE_COLLABORATIVE_ARGUMENT){
            this.selectedTaskId = anRecord.data.perTaskId;
            sessionStorage.setItem(APC.SELECTED_TASK_ID,this.selectedTaskId);//传递taskId到下一个页面
            window.location.href = "../../subpage/CollaborativeArgumentation/ColArgumente.html";
        }
    },
    onLaunch: function (application) {
    }
})
