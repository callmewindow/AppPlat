Ext.define('TaskListApp.view.TaskListViewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'TaskListApp.view.TaskPanel',
        'Ext.panel.Panel'
    ],
    layout:'border',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'taskpanel',
                    region:'center',
                    preventHeader: true
                }
            ]
        });

        me.callParent(arguments);
    }

});