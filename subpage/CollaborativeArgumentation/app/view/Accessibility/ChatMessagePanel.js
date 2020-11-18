/**
 * Created by Administrator on 2014/4/28.
 */
Ext.define('AppPlat.view.Accessibility.ChatMessagePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chatmessagepanel',

    requires: [
        'Ext.form.field.TextArea',
        'Ext.button.Button',
        'AppPlat.view.Accessibility.SendPanel',
        'AppPlat.view.Accessibility.ChatMessageGridPanel'
    ],
    height: 239,
    width: 150,
    title: '聊天内容',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',//chatmessagegrid
                    region:'center',
                    height: 300,
                    autoScroll: true,
                    html: '<div> <b>ndh</b>  ：' +
                        '大家好，我是新加入的成员。<br>' +
                        ' <b>dpy</b>  ：' +
                        '你好，有什么事我们多交流。</div>'
                },
                {
                    xtype: 'sendpanel',
                    region: 'south'
                }
            ]
        });

        me.callParent(arguments);
    }

});
