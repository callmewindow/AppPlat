Ext.define('NavigationApp.view.ToolViewport', {
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