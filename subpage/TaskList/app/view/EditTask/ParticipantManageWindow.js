Ext.define('TaskListApp.view.EditTask.ParticipantManageWindow', {
    extend: 'Ext.window.Window',
    alias:'widget.participantmanagewindow',
    requires: [
        'TaskListApp.view.EditTask.ParticipantManageGridPanel'
    ],
    title: '添加群组',
    store:'EditTaskStore',
    height:300,
    width: 700,
    minimizable:true,
        initComponent: function(){
        Ext.apply(this, {
                items: [{
                    xtype:'participantmanagegridpanel',
                    itemId:'participantManageGridPanel'

                }
              ]
        });
        this.callParent();
    }
});