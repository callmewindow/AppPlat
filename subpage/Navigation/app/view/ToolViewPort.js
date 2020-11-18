Ext.define('NavigationApp.view.ToolViewPort', {
    extend: 'Ext.container.Viewport',

    requires: [
        'NavigationApp.view.ToolListPanel',
        'Ext.panel.Panel'
    ],

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'toollistpanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});