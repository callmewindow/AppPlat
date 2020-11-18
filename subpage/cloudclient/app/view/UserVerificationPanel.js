/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.UserVerificationPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userverificationpanel',

    requires: [
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Ext.panel.Panel'
    ],

    height: 363,
    width: 257,
    title: '用户验证',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'textfield',
                    width: 256,
                    fieldLabel: '账户',
                    itemId: 'account'
                },
                {
                    xtype: 'textfield',
                    width: 256,
                    fieldLabel: '密码',
                    itemId: 'pwd'
                },
                {
                    xtype: 'button',
                    text: '验证',
                    itemId: 'verificationBtn'
                },
                {
                    xtype: 'panel',
                    height: 260,
                    title: '返回结果',
                    layout: 'fit',
                    autoScroll: true,
                    itemId: 'result'
                }
            ]
        });

        me.callParent(arguments);
    }

});