

Ext.define('AppPlat.view.Accessibility.AccessibilitytabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.accessibilitytabpanel',

    requires: [
        'AppPlat.view.Accessibility.ChatAreaPanel',
        'Ext.panel.Panel',
        'Ext.tab.Tab'
    ],

    maxWidth: 150,
    minWidth: 150,
    width: 150,
    collapsible: true,
    animCollapse: true,
    padding:'0 8 8 0',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
//                {
//                    xtype: 'chatareapanel'
//                },
                {
                    xtype: 'panel',
                    title: '公告区',
                    autoScroll: true,
                    html: '<div>ndh 登陆系统 2014-05-23 16:55:50<br><br>' +
                        'dpy 登陆系统 2014-05-23 16:55:56<br><br>' +
                        'ndh 在方案一卫星轨道交互设计工具中添加名为监显卫星的卫星 2014-05-23 16:56:46<br><br>' +
                        'dpy 在方案一卫星结构与有效载荷布局工具中，为公共服务模型添加名为探测器三的探测器 2014-05-23 16:57:02</div>'
                }
            ]
        });

        me.callParent(arguments);
    }

});