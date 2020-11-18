/**
 * 修改 by 杜鹏宇 on 2014/8/28
 */

Ext.define('StructDesignApp.view.StructListWindow', {
    alias: 'widget.structlistwindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.Number'
    ],
    id:'structlistwindow',
    height: 605,
    width: 200,
    title: '场景结构列表',
    closeAction: 'hide',
    resizable: false,
    collapsed: true,
    overflowY:'auto',
    collapsible: true
});