/**
 * Created by Administrator on 2014/6/28.
 */

Ext.define('TaskListApp.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contextmenu',
    items: [
        {
            text: '编辑',
            iconCls: 'tasks-new',
            itemId: 'updateTaskItem'
        },
        {
            text: '删除',
            iconCls: 'tasks-delete',
            itemId: 'deleteTaskItem'
        }
    ],
    setList: function(list) {
        this.list = list;
    },
    getList: function() {
        return this.list;
    }
});