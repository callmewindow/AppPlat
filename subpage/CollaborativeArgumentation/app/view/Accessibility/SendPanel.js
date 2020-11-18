/**
 * Created by Administrator on 2014/5/6.
 */
Ext.define('AppPlat.view.Accessibility.SendPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sendpanel',

    requires: [
        'Ext.form.field.TextArea',
        'Ext.button.Button'
    ],
    height: 72,
    width: 145,
    title: '',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'textareafield',
                    dock: 'top',
                    height: 47,
                    width: 150,
                    fieldLabel: 'messageTextArea',
                    hideLabel: true
                },
                {
                    xtype: 'button',
                    height: '30',
                    dock: 'right',
                    itemId: 'sendBtn',
                    text: '发送'
                },
                {
                    xtype: 'button',
                    //html: '<input type="button" id="chatBtn" value="聊天"/><br/><br/>',
                    height: '30',
                    dock: 'left',
                    itemId: 'chatBtn',
                    text: '聊天'
                }
            ]
        });

        me.callParent(arguments);
    }

});