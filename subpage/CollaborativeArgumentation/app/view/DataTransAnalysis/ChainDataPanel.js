/**
 * Created by Administrator on 2014/5/7.
 */
Ext.define('AppPlat.view.DataTransAnalysis.ChainDataPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chaindatapanel',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.data.*',
        'Ext.form.*'
    ],
    width: 400,
    title:'链路分析',
    xtype:'form-checkout',
    frame:true,
    bodyPadding:5,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 90,
                msgTarget: 'qtip'
            },
            items: [
                {
                    layout:'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items:[
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '卫星发射机输出功率PTS',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'PTS',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '设备解调损失LEQ',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'LEQ',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '卫星发射天线最小增益GTS',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'GTS',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '数据码速率',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'DataSpeed',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '卫星馈线损失LinS',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'LinS',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '卫星EIRP',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'EIRP',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '下行载波频率fDOWN',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'fDOWN',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '卫星对地张角α',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'a',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '卫星远地点高度ha',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'ha',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '星地间距离R',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'R',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '地面天线仰角Eg',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'Eg',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '自由空间损失LSDOWN',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'LSDOWN',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '地面天线指向损失Ltp',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'Ltp',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '地面站总接收信藻密度比',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'signalRatio',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '大气损失La',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'La',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '数据解调门限(S/NO)DOWN',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'DOWN',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '极化损失LH',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'LH',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '下行数据解调裕量',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'downlinkData',
                                    padding:'0 20 0 10'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'textfield',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    fieldLabel: '地面站(G/T)s值',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'s',
                                    padding:'0 20 0 10'
                                },
                                {
                                    fieldLabel: '下行数据需要的(Eb/NO)',
                                    labelWidth: 90,
                                    width: 162,
                                    itemId:'Eb/NO',
                                    padding:'0 20 0 10'
                                }
                            ]
                        }
                    ]
                }
            ],

            buttons: [
                {
                    text: '计算',
                    itemId:'calculate',
                    width: 40,
                    scope: this
                }
            ]
        });

        me.callParent(arguments);
    }
});