Ext.define('LoginRemindApp.view.LoginRemindPanel', {
    extend: 'Ext.panel.Panel',
    alias:'widget.loginremindpanel',
    requires: [
    ],
    height: 400,
    titleAlign: 'center',
//
//    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    margin: '180 0 0 0',
                    xtype: 'component',
                    html: '<h1 style="color: red;width:100%;text-align:center">请在登录系统后访问</h1>'
                }
            ]
        });

        me.callParent(arguments);
    }

});
