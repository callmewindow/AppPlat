/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.DigitalSignaturesPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.digitalsignaturespanel',

    requires: [
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Ext.panel.Panel'
    ],

    height: 363,
    width: 257,
    title: '数字签名',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'textfield',
                    width: 255,
                    fieldLabel: '数字签名',
                    itemId: 'signature'
                },
                {
                    xtype: 'button',
                    text: '验证',
                    itemId: 'verficationBtn'
                },
                {
                    xtype: 'panel',
                    height: 287,
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