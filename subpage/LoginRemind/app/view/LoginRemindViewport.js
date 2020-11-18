Ext.define('LoginRemindApp.view.LoginRemindViewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'LoginRemindApp.view.LoginRemindPanel',
        'Ext.panel.Panel'
    ],

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'loginremindpanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});