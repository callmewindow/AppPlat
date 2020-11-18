/**
 * Created by Administrator on 2014/6/28.
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', '../../libs/ext/ux/DataView/');
Ext.define('NavigationApp.view.ToolListView', {
    extend: 'Ext.view.View',
    alias:'widget.toollistview',
    requires: [
        'Ext.data.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.ux.DataView.Animated',
        'Ext.XTemplate',
        'Ext.panel.Panel',
        'Ext.toolbar.*',
        'Ext.slider.Multi',
        'NavigationApp.store.ToolListStore'
    ],

    id: 'navication',
    itemSelector: 'div.toolList',
    overItemCls : 'toolList-hover',
    multiSelect : true,
    autoScroll  : true,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            deferInitialRefresh: false,
            store: 'ToolListStore',
            tpl  : Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class = toolList style="  margin-top: 7.5%; margin-left:14%">',
                '<table ><tr>',
                    '<td><img src="../../libs/ext/shared/icons/fam/{[values.id]}.png"/></td>' +
                    // id为标识，表示工具的内容
                    '<td><span style="color:#ffffff;font-size:15px;font-family:微软雅黑 ">{name}</span><br><br>' +
                    // name为工具的中文名称
                    '<span style="color:#ffffff;font-family:微软雅黑 ; font-size:10px">{description}</span></td>',
                    // description为工具的功能简介
                '</tr></table>',
                '</div>',
                '</tpl>'
            ),
            // 有关各个工具的数据定义，可在外层的同级目录store/ToolListStore中找到具体的定义
            plugins : [
                Ext.create('Ext.ux.DataView.Animated', {
                    duration  :550,
                    idProperty: 'id'
                })
            ],
            renderTo: Ext.getBody()
        });
        me.callParent(arguments);
    }
});