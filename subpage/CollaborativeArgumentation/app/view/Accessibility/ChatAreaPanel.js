/**
 * Created by Administrator on 2014/4/27.
 */
Ext.define('AppPlat.view.Accessibility.ChatAreaPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chatareapanel',

    requires: [
        'AppPlat.view.Accessibility.DiscussionGroupGridPanel',
        'AppPlat.view.Accessibility.ChatMessagePanel',
        'AppPlat.view.Accessibility.DiscussionGroupGridPanel',
        'Ext.grid.Panel'
    ],

    height: 429,
    width: 150,
    layout: 'border',
    title: '聊天区',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'discussiongroupgridpanel',//
                    region: 'north',
                    height: 332
                },
                {
                    xtype: 'chatmessagepanel',//
                    region: 'center'
                }
            ]
        });

        me.callParent(arguments);
    }

});
