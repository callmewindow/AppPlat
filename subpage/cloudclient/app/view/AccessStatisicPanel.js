/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.AccessStatisicPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.accessstatisicpanel',

    requires: [
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Ext.panel.Panel'
    ],

    height: 363,
    width: 257,
    title: '访问统计',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'textfield',
                    width: 255,
                    fieldLabel: '账号',
                    itemId: 'account'
                },
                {
                    xtype: 'textfield',
                    width: 255,
                    fieldLabel: '所属域',
                    itemId: 'domain'
                },
                {
                    xtype: 'textfield',
                    width: 254,
                    fieldLabel: 'url',
                    itemId: 'url'
                },
                {
                    xtype: 'textfield',
                    width: 254,
                    fieldLabel: '访问描述',
                    itemId: 'describe'
                },
                {
                    xtype: 'textfield',
                    width: 256,
                    fieldLabel: 'IP地址',
                    itemId: 'ip'
                },
                {
                    xtype: 'button',
                    text: '插入',
                    itemId: 'insertBtn'
                },
                {
                    xtype: 'panel',
                    height: 184,
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