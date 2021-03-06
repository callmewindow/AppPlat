Ext.define('DataTransAnalysisApp.view.ButtonGroupPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttongrouppanel',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.container.ButtonGroup',
        'Ext.button.Button'
    ],

    padding: '2 2 0 2', // 上边距   右边距 下边距   左边距
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'buttongroup',
                            columns: 1,
                            items: [
                                {
                                    text: '菜单',
                                    itemId:'CovAnaMenu',
                                    xtype: 'button',
                                    height: 44,
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
                                                    text: '新建任务',
                                                    itemId: 'btnNewCovAnaFile',
                                                    xtype: 'button',
                                                    iconCls: 'addTask'
                                                },
                                                {
                                                    text: '打开任务',
                                                    itemId: 'btnOpenCovAnaFile',
                                                    xtype: 'button',
                                                    iconCls: 'openTask'
                                                },
                                                {
                                                    text: '保存任务',
                                                    itemId: 'btnSaveCovAnaFile',
                                                    xtype: 'button',
                                                    iconCls: 'saveTask'
                                                },
//                                                {
//                                                    text: '导出',
//                                                    itemId: 'btnExportCovAnaFile',
//                                                    xtype: 'button',
//                                                    iconCls: 'Daochu'
//                                                },
                                                {
                                                    text: '返回',
                                                    itemId: 'btnBackNavigation',
                                                    xtype: 'button',
                                                    iconCls: 'back'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'buttongroup',
                            columns: 3,
                            defaults: {
                                iconAlign: 'top'
                            },
                            items: [
                                {
                                    text: '卫星',
                                    itemId: 'btnAddSatellite',
                                    xtype: 'button',
                                    iconCls: 'satellite',
                                    disabled:true
                                },
//                                {
//                                    text: '星上天线',
//                                    itemId: 'btnAddAntenna',
//                                    iconCls: 'antenna',
//                                    xtype: 'button',
//                                    disabled:true
//                                },
                                {
                                    text: '地面站',
                                    itemId: 'btnAddGroundStation',
                                    iconCls: 'GroundStation',
                                    xtype: 'button',
                                    disabled:true
                                }
                            ]
                        },
                        {
                            xtype: 'buttongroup',
                            columns: 2,
                            defaults: {
                                iconAlign: 'top'
                            },
                            items: [
                                {
                                    text: '过站分析',
                                    itemId: 'btnOverStationAnalysis',
                                    xtype: 'button',
                                    iconCls: 'overstation'
                                },
                                {
                                    text: '链路分析',
                                    itemId: 'btnChainAnalysis',
                                    xtype: 'button',
                                    iconCls: 'ChainAnalysis'
                                }
                            ]
                        }

                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});