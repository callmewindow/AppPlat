/**
 * 修改 by 杜鹏宇 on 2014/8/31
 */

Ext.define('StructDesignApp.view.ButtonGroupPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttongrouppanel',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.container.ButtonGroup',
        'Ext.button.Button'
    ],
    padding:'2 2 0 2', // 上边距   右边距 下边距   左边距
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items:
                        [
                            {
                                text: '菜单',
                                itemId:'StructMenu',
                                xtype: 'button',
                                iconCls: 'menu',
                                menu: [
                                    {
                                        xtype: 'buttongroup',
                                        columns: 1,
                                        defaults: {
                                            iconAlign: 'left',
                                            width: 100
                                        },
                                        items: [
                                            {
                                                text: '新建',
                                                itemId: 'btnNewStructFile',
                                                xtype: 'button',
                                                iconCls: 'addTask'
                                            },
                                            {
                                                text: '打开',
                                                itemId: 'btnOpenStructFile',
                                                xtype: 'button',
                                                iconCls: 'openTask'
                                            },
                                            {
                                                text: '保存',
                                                itemId: 'btnSaveStructFile',
                                                xtype: 'button',
                                                iconCls: 'saveTask'
                                            },
                                            {
                                                text: '导出',
                                                itemId: 'btnExport',
                                                xtype: 'button',
                                                iconCls: 'exportTask'
                                            },
                                            {
                                                text: '返回',
                                                itemId: 'btnBackNavigation',
                                                xtype: 'button',
                                                iconCls: 'back'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                text: '属性板',
                                itemId: 'btnAdvancedPanel',
                                iconCls: 'propertyPanel',
                                xtype: 'button'
                            },
                            {
                                text: '列表板',
                                itemId: 'btnList',
                                iconCls: 'listPanel',
                                xtype: 'button'
                            },
                            {
                                text: '平移',
                                itemId: 'btnTranslate',
                                iconCls: 'translate',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '旋转',
                                itemId: 'btnRotate',
                                iconCls: 'rotate',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '缩放',
                                itemId: 'btnScale',
                                iconCls: 'scale',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '组合',
                                itemId: 'btnCombine',
                                iconCls: 'combine',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '分离',
                                itemId: 'btnSeparate',
                                iconCls: 'separate',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '吸附',
                                itemId: 'btnAssembly',
                                iconCls: 'assembly',
                                xtype: 'button'
                            },
                            {
                                text: '对齐',
                                xtype: 'button',
                                itemId: 'StructAlign',
                                iconCls: 'align',
                                disabled: true,
                                menu: [
                                    {
                                        xtype: 'buttongroup',
                                        columns: 1,
                                        defaults: {
                                            iconAlign: 'left',
                                            width: 100
                                        },
                                        items: [
                                            {
                                                text: '按X',
                                                itemId: 'btnAlignmentX',
                                                iconCls: 'x',
                                                xtype: 'button'
                                            },
                                            {
                                                text: '按Y',
                                                itemId: 'btnAlignmentY',
                                                iconCls: 'y',
                                                xtype: 'button'

                                            },
                                            {
                                                text: '按Z',
                                                itemId: 'btnAlignmentZ',
                                                iconCls: 'z',
                                                xtype: 'button'

                                            }
                                        ]}
                                ]
                            },
                            {
                                text: '选框',
                                itemId: 'btnSelectBox',
                                iconCls: 'selectBox',
                                xtype: 'button'
                            },
                            {
                                text: '复制',
                                itemId: 'btnCopy',
                                iconCls: 'copy',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '删除',
                                itemId: 'btnDelete',
                                iconCls: 'delete',
                                xtype: 'button',
                                disabled: true
                            },
                            {
                                text: '观察',
                                xtype: 'button',
                                iconCls: 'observe',
                                itemId: 'StructObservation',
                                menu: [
                                    {
                                        xtype: 'buttongroup',
                                        columns: 1,
                                        defaults: {
                                            iconAlign: 'left',
                                            width: 100
                                        },
                                        items: [
                                            {
                                                text: '漫游',
                                                itemId: 'btnViewMode',
                                                iconCls: 'view',
                                                xtype: 'button'
                                            },
                                            {
                                                text: '初始',
                                                itemId: 'btnInitview',
                                                iconCls: 'initView',
                                                xtype: 'button'

                                            }
                                        ]}
                                ]
                            },
                            {
                                text: '帮助',
                                xtype: 'button',
                                itemId:'StructHelp',
                                iconCls: 'help',
                                menu: [
                                    {
                                        xtype: 'buttongroup',
                                        columns: 1,
                                        defaults: {
                                            iconAlign: 'left',
                                            width: 100
                                        },
                                        items: [
                                            {
                                                text: '助手',
                                                itemId: 'btnHelper',
                                                xtype: 'button',
                                                iconCls: 'Helper'
                                            },
                                            {
                                                text: '演示',
                                                itemId: 'btnMovie',
                                                xtype: 'button',
                                                iconCls: 'movie'
                                            }
                                        ]}
                                ]
                            }
                        ]
                }
                ]




//            dockedItems: [
//                {
//                    xtype: 'toolbar',
//                    dock: 'top',
//                    items: [
//                        {
//                            xtype: 'buttongroup',
//                            columns: 1,
//                            items: [
//                                {
//                                    text: '菜单',
//                                    itemId:'StructMenu',
//                                    xtype: 'button',
//                                    height: 44,
//                                    //iconCls: 'Arrowoutlonger',
//                                    menu: [
//                                        {
//                                            xtype: 'buttongroup',
//                                            columns: 1,
//                                            defaults: {
//                                                iconAlign: 'left',
//                                                width: 100
//                                            },
//                                            items: [
//                                                {
//                                                    text: '新建',
//                                                    itemId: 'btnNewStructFile',
//                                                    xtype: 'button',
//                                                    iconCls: 'Pageadd'
//                                                },
//                                                {
//                                                    text: '打开',
//                                                    itemId: 'btnOpenStructFile',
//                                                    xtype: 'button',
//                                                    iconCls: 'Folderpage'
//                                                },
//                                                {
//                                                    text: '保存',
//                                                    itemId: 'btnSaveStructFile',
//                                                    xtype: 'button',
//                                                    iconCls: 'Disk'
//                                                },
//                                                {
//                                                    text: '导出',
//                                                    itemId: 'btnExport',
//                                                    xtype: 'button',
//                                                    iconCls: 'Daochu'
//                                                },
//                                                {
//                                                    text: '返回',
//                                                    itemId: 'btnBackNavigation',
//                                                    xtype: 'button',
//                                                    iconCls: 'Fanhui'
//                                                }
//                                            ]
//                                        }
//                                    ]
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 2,
//                            defaults: {
//                                iconAlign: 'top'
//                            },
//                            items: [
//                                {
//                                    text: '属性板',
//                                    itemId: 'btnAdvancedPanel',
//                                    iconCls: 'Kongzhiban',
//                                    xtype: 'button'
//                                },
//                                {
//                                    text: '列表板',
//                                    itemId: 'btnList',
//                                    iconCls: 'Liebiaoban',
//                                    xtype: 'button'
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 3,
//                            defaults: {
//                                iconAlign: 'top'
//                            },
//                            items: [
//                                {
//                                    text: '平移',
//                                    itemId: 'btnTranslate',
//                                    iconCls: 'Pingyi',
//                                    xtype: 'button',
//                                    disabled: true
//                                },
//                                {
//                                    text: '旋转',
//                                    itemId: 'btnRotate',
//                                    iconCls: 'Xuanzhuan',
//                                    xtype: 'button',
//                                    disabled: true
//                                },
//                                {
//                                    text: '缩放',
//                                    itemId: 'btnScale',
//                                    iconCls: 'Suofang',
//                                    xtype: 'button',
//                                    disabled: true
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 3,
//                            defaults: {
//                                iconAlign: 'top'
//                            },
//                            items: [
//                                {
//                                    text: '组合',
//                                    itemId: 'btnCombine',
//                                    iconCls: 'Zuhe',
//                                    xtype: 'button',
//                                    disabled: true
//                                },
//                                {
//                                    text: '分离',
//                                    itemId: 'btnSeparate',
//                                    iconCls: 'Fenli',
//                                    xtype: 'button',
//                                    disabled: true
//                                },
//                                {
//                                    text: '吸附',
//                                    itemId: 'btnAssembly',
//                                    iconCls: 'Disconnect',
//                                    xtype: 'button'
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 4,
//                            defaults: {
//                                iconAlign: 'top'
//                            },
//                            items: [
//                                {
//                                    text: '对齐',
//                                    xtype: 'button',
//                                    height: 44,
//                                    itemId:'StructAlign',
//                                    iconCls: 'Duiqi',
//                                    disabled: true,
//                                    menu: [
//                                        {
//                                            xtype: 'buttongroup',
//                                            columns: 1,
//                                            defaults: {
//                                                iconAlign: 'left',
//                                                width: 100
//                                            },
//                                            items: [
//                                                {
//                                                    text: '按X',
//                                                    itemId: 'btnAlignmentX',
//                                                    iconCls: 'Byx',
//                                                    xtype: 'button'
//                                                },
//                                                {
//                                                    text: '按Y',
//                                                    itemId: 'btnAlignmentY',
//                                                    iconCls: 'Byy',
//                                                    xtype: 'button'
//
//                                                },
//                                                {
//                                                    text: '按Z',
//                                                    itemId: 'btnAlignmentZ',
//                                                    iconCls: 'Byz',
//                                                    xtype: 'button'
//
//                                                }
//                                            ]}
//                                    ]
//                                },
//                                {
//                                    text: '选框',
//                                    itemId: 'btnSelectBox',
//                                    iconCls: 'Xuankuang',
//                                    xtype: 'button'
//                                },
//                                {
//                                    text: '复制',
//                                    itemId: 'btnCopy',
//                                    iconCls: 'Fuzhi',
//                                    xtype: 'button',
//                                    disabled: true
//                                },
//                                {
//                                    text: '删除',
//                                    itemId: 'btnDelete',
//                                    iconCls: 'Bulletcross',
//                                    xtype: 'button',
//                                    disabled: true
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 1,
//                            items: [
//                                {
//                                    text: '观察',
//                                    xtype: 'button',
//                                    height: 44,
//                                    itemId:'StructObservation',
//                                    //iconCls: 'Arrowoutlonger',
//                                    menu: [
//                                        {
//                                            xtype: 'buttongroup',
//                                            columns: 1,
//                                            defaults: {
//                                                iconAlign: 'left',
//                                                width: 100
//                                            },
//                                            items: [
//                                                {
//                                                    text: '漫游',
//                                                    itemId: 'btnViewMode',
//                                                    iconCls: 'Manyou',
//                                                    xtype: 'button'
//                                                },
//                                                {
//                                                    text: '初始',
//                                                    itemId: 'btnInitview',
//                                                    iconCls: 'Chushi',
//                                                    xtype: 'button'
//
//                                                },
//                                                {
//                                                    text: '全屏',
//                                                    itemId: 'btnMax',
//                                                    xtype: 'button',
//                                                    iconCls: 'Quanpin'
//                                                },
//                                                {
//                                                    text: '还原',
//                                                    itemId: 'btnRestore',
//                                                    xtype: 'button',
//                                                    iconCls: 'Huanyuan'
//                                                }
//                                            ]}
//                                    ]
//                                }
//                            ]
//                        },
//
//                        {
//                            xtype: 'buttongroup',
//                            columns: 1,
//                            items: [
//                                {
//                                    text: '帮助',
//                                    xtype: 'button',
//                                    height: 44,
//                                    itemId:'StructHelp',
//                                    //iconCls: 'Arrowoutlonger',
//                                    menu: [
//                                        {
//                                            xtype: 'buttongroup',
//                                            columns: 1,
//                                            defaults: {
//                                                iconAlign: 'left',
//                                                width: 100
//                                            },
//                                            items: [
//                                                {
//                                                    text: '助手',
//                                                    itemId: 'btnHelper',
//                                                    xtype: 'button',
//                                                    iconCls: 'Help'
//                                                },
//                                                {
//                                                    text: '演示',
//                                                    itemId: 'btnMovie',
//                                                    xtype: 'button',
//                                                    iconCls: 'Camerastart'
//                                                }
//                                            ]}
//                                    ]
//                                }
//                            ]
//                        }
//                    ]
//                }
//            ]
        });

        me.callParent(arguments);
    }
});