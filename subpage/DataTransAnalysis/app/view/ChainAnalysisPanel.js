/**
 * Created by winter on 2014/11/20.
 */
Ext.define('DataTransAnalysisApp.view.ChainAnalysisPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chainanalysispanel',
    requires: [
        'Ext.panel.Panel'
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 840',
            items: [
                {
                    aligin:'center',
                    text: '计 算',
                    itemId:'btnChainAnalysisCompute',
                    scope: this,
                    height:50

                },
                {
                    aligin:'center',
                    text: '保 存',
                    itemId:'btnChainAnalysisComputeSave',
                    scope: this,
                    disabled:true,
                    height:50
                }
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            bodyPadding: 10,
            items: [
                {
                    xtype: 'fieldset',
                    title: '链路分析参数',
                    itemId:'chainAnalysisPara',
                    layout:'table',
                    width: '100%',
                    defaults:{
                        labelWidth:160,
                        labelAlign: 'center'
                    },
                    collapsible:false,
                    collapsed: false,

                        items: [
                            {
                                xtype: 'fieldcontainer',
                                itemId: '',
                                layout:{
                                    type:'table',
                                    columns: 2
                                },
                                colspan: 2,
                                items:[
                                    {
                                        xtype: 'label',
                                        text: '输入/INPUT',
                                        colspan: 2,
                                        style: {
                                            marginLeft: '220px'
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星发射机输出功率PTS(W)',
                                        itemId: 'transmitterPower',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:100.0
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星发射天线最小增益GTS(dBi)',
                                        itemId: 'minGain',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:42.7
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星馈线损失LlineS(dB)',
                                        itemId: 'feederLoss',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:-0.5,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '指向损耗(db)',
                                        itemId: 'downCarrierFrequency',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:-2.0,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '下行载波频率fDOWN(MHz)',
                                        itemId: 'satelliteEIRP',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:8400.0,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星轨道远地点高度ha(km)',
                                        itemId: 'apogeeHeight',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:900000000,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '地面天线仰角Eg(deg)',
                                        itemId: 'groundAntennaElevation',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:5.0,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '波长(m)',
                                        itemId: 'groundGT',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        decimalPrecision:10,
                                        value:0.0356301,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '地面天线指向损失Ltp(dB)',
                                        itemId: 'openingAngle',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:-1.0,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '大气损失La(dB)',
                                        itemId: 'starDistance',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:-0.5,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '极化损失LH(dB)',
                                        itemId: 'atmosphericLoss',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:0.0,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '地面站(G/T)s值(dBi/K)',
                                        itemId: 'polarizationLoss',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:53.5,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '下行数据需要的(Eb/N0)req(Pe=1*10-5)(dB)',
                                        itemId: 'equipmentLoss',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:1.4,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '设备解调损失LEQ(dB)',
                                        itemId: 'leqsbtj',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:-0.8,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '数据码速率(bps)',
                                        itemId: 'dsl',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 100,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:32000,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '波尔兹曼常数K(dBw/Hz·K)',
                                        itemId: 'bezmcs',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:228.6,
                                        editable:false,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '地球半径(km)',
                                        itemId: 'rearth',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:6378,
                                        editable:false,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: 'Pi',
                                        itemId: 'rpi',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:3.141592654,
                                        decimalPrecision:10,
                                        editable:false,
                                        margin : '20 0 0 0'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '光速(m/s)',
                                        itemId: 'rls',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        value:299292458,
                                        editable:false,
                                        margin : '20 0 0 0'
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                itemId: 'simuParaOutput',
                                layout:{
                                    type:'table',
                                    columns: 1
                                },
                                items:[
                                    {
                                        xtype: 'label',
                                        text: '输出/OUTPUT',
                                        style: {
                                            marginLeft: '140px'
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星发射机输出功率PTS(dBW)',
                                        itemId: 'output_pts',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '0 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星EIRP(dBW)',
                                        itemId: 'output_eirp',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '卫星对地张角α(deg)',
                                        itemId: 'output_a',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '星地间距离R(km)',
                                        itemId: 'output_km',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '自由空间损失LSDOWN(dB)',
                                        itemId: 'output_lsdown',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '地面站总接收信噪密度比（S/N0）DOWN(dBHz)',
                                        itemId: 'output_dbhz',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '数据码速率(dB)',
                                        itemId: 'output_dsl',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '数据解调门限（S/N0）DOWN(dBH)',
                                        itemId: 'output_sno',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '下行数据解调裕量(dB)',
                                        itemId: 'output_xxdb',
                                        labelAlign: 'right',
                                        labelPad: 10,
                                        labelWidth: 160,
                                        width: 300,
                                        labelSeparator: ' ',
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        editable:false,
                                        disabled:true,
                                        margin : '23 0 0 60'
                                    },
                                    {
                                        xtype: 'label',
                                        text: '',
                                        style: {
                                            marginLeft: '50px'
                                        }
                                    },
                                    {
                                        xtype: 'label',
                                        text: '',
                                        style: {
                                            marginLeft: '50px'
                                        }
                                    }
                                     ]
                            }

                          ]
                    }
                    ]
                }
          );

        me.callParent(arguments);
    }

});