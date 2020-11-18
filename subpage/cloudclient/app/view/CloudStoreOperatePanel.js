/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.CloudStoreOperatePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cloudstoreoperatepanel',

    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.ComboBox',
        'Ext.button.Button'
    ],

    height: 475,
    width: 514,
    layout: 'border',
    title: '云存储操作',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    title: '文件操作',
                    itemId: 'fileOperate',
                    items: [
                        {
                            xtype: 'textfield',
                            width: 213,
                            fieldLabel: '用户ID',
                            itemId: 'userId'
                        },
                        {
                            xtype: 'textfield',
                            width: 212,
                            fieldLabel: '云端文件名',
                            itemId: 'filePath'
                        },
                        {
                            xtype: 'combobox',
                            width: 213,
                            fieldLabel: '操作类型',
                            itemId: 'type',
                            emptyText: '请选择...',
                            value: 'copy',
                            mode: 'local',
                            store:
                                new Ext.data.ArrayStore({
                                fields:['opr','value'],
                                data:[['复制','copy'],['移动','move'],['重命名','rename']]   //声明一个数组，提供数据
                            }),
                            displayField: 'opr',
                            valueField: 'value',
                            editable: false
                        },
                        {
                            xtype: 'textfield',
                            width: 211,
                            fieldLabel: '目标路径',
                            itemId: 'destFileOrDir'
                        },
                        {
                            xtype: 'panel',
                            height: 31,
                            title: '',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '查询',
                                    itemId: 'findFileDataBtn'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '修改',
                                    itemId: 'updateFileBtn'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '删除',
                                    itemId: 'delFileBtn'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height: 200,
                            title: '返回结果',
                            layout: 'fit',
                            autoScroll: true,
                            itemId: 'result'
                        },
                        {
                            xtype: 'panel',
                            height: 55,
                            layout: 'border',
                            title: '',
                            itemId: 'fileLoad',
                            items: [
                                {
                                    xtype: 'textfield',
                                    region: 'north',
                                    height: 25,
                                    fieldLabel: '本地文件路径',
                                    itemId: 'localFileDir'
                                },
                                {
                                    xtype: 'button',
                                    region: 'west',
                                    width: 112,
                                    text: '上传',
                                    itemId: 'uploadBtn'
                                },
                                {
                                    xtype: 'button',
                                    region: 'center',
                                    text: '下载',
                                    itemId: 'downloadBtn'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'west',
                    width: 257,
                    itemId: 'dirOperate',
                    title: '目录操作',
                    items: [
                        {
                            xtype: 'textfield',
                            width: 258,
                            fieldLabel: '用户ID',
                            itemId: 'userId'
                        },
                        {
                            xtype: 'textfield',
                            width: 254,
                            fieldLabel: '云端目录',
                            itemId: 'directory'
                        },
                        {
                            xtype: 'combobox',
                            width: 255,
                            fieldLabel: '操作类型',
                            itemId: 'type',
                            emptyText: '请选择...',
                            value: 'copy',
                            mode: 'local',
                            store:
                                new Ext.data.ArrayStore({
                                    fields:['opr','value'],
                                    data:[['复制','copy'],['移动','move'],['重命名','rename']]   //声明一个数组，提供数据
                                }),
                            displayField: 'opr',
                            valueField: 'value',
                            editable: false
                        },
                        {
                            xtype: 'textfield',
                            width: 256,
                            fieldLabel: '目标路径',
                            itemId: 'destDirectory'
                        },
                        {
                            xtype: 'panel',
                            height: 31,
                            width: 256,
                            title: '',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '查询',
                                    itemId: 'findDirBtn'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '创建',
                                    itemId: 'createDirBtn'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: '修改',
                                    itemId: 'updateDirBtn'
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    width: 53,
                                    text: '删除',
                                    itemId: 'delDirBtn'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height: 257,
                            title: '返回结果',
                            layout: 'fit',
                            autoScroll: true,
                            itemId: 'result'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});