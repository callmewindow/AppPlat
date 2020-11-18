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
                    margin: '180 0 0 380',
                    xtype: 'component',
                    html: '<h1 style="color: red">请登陆系统后再访问</h1>'
                }
            ]
        });

        me.callParent(arguments);
    }

});
