/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.PermissionManagerPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.permissionmanagerpanel',

    requires: [
        'Ext.form.field.Text',
        'Ext.panel.Panel',
        'Ext.button.Button'
    ],

    height: 475,
    width: 257,
    title: '权限管理',
    itemId: 'permissionmanagerpanel',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'textfield',
                    width: 256,
                    fieldLabel: '用户ID',
                    itemId: 'userId'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '域',
                    itemId: 'domain'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '权限',
                    itemId: 'permission'
                },
                {
                    xtype: 'panel',
                    height: 32,
                    layout: 'border',
                    title: '',
                    items: [
                        {
                            xtype: 'button',
                            region: 'center',
                            itemId: 'findPerBtn',
                            text: '查询权限'
                        },
                        {
                            xtype: 'button',
                            region: 'west',
                            itemId: 'findUserBtn',
                            width: 80,
                            text: '查询用户'
                        },
                        {
                            xtype: 'button',
                            region: 'east',
                            itemId: 'updatePerBtn',
                            width: 85,
                            text: '修改权限'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    height: 318,
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