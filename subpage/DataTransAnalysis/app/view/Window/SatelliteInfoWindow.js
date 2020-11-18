/**
 * Created by winter on 2014/8/23.
 */
//var navigate = function (panel, direction) {
//    var layout = panel.getLayout();
//    layout[direction]();
//    panel.queryById('move-prev').setDisabled(!layout.getPrev());
//    panel.queryById('move-next').setDisabled(!layout.getNext());
//    if(!layout.getNext()){
//        panel.queryById('btnSureAddSatellite').show();
//        panel.queryById('move-next').hide();
//
//    }else{
//        panel.queryById('move-next').show();
//        panel.queryById('btnSureAddSatellite').hide();
//    }
//
//};
Ext.define('DataTransAnalysisApp.view.Window.SatelliteInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.satelliteinfowindow',
    requires: [
        'Ext.panel.Panel',
        'DataTransAnalysisApp.view.DateTimeField'
    ],
    layout: 'card',
    title: '卫星属性',
    closeAction: 'hide',
    x:358,
    y:133,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 280',
            items: [
                {
                    aligin: 'center',
                    text: '确定',
                    xtype:'button',
                    itemId: 'btnSureAddSatellite',
                    scope: this
                }
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '卫星名称',
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },
                            collapsible: false,
                            collapsed: false,
                            items: [
                                {
                                    xtype: 'label',
                                    itemId: 'satelliteFileName',
                                    width: 290,
                                    margin: '0 0 0 120'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '轨道参数',
                            itemId: 'orbitPara',
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%',
                                labelWidth: 120,
                                labelAlign: 'center'
                            },
                            collapsible: false,
                            collapsed: false,
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            itemId: 'starcombo',
                                            fieldLabel: '中心星体',
                                            showText: true,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            mode: 'local',
                                            store: new Ext.data.ArrayStore({
                                                fields: ['name', 'value'],
                                                data: [
                                                    ['太阳', 'sun'],
                                                    ['水星', 'mercury'],
                                                    ['金星', 'venus'],
                                                    ['地球', 'earth'],
                                                    ['火星', 'mars'],
                                                    ['木星', 'jupiter'],
                                                    ['土星', 'saturn'],
                                                    ['天王星', 'uranus'],
                                                    ['海王星', 'neptune'],
                                                    ['月球', 'moon']
                                                ]   //声明一个数组，提供数据
                                            }),
                                            displayField: 'name',
                                            valueField: 'value',
                                            value: 'earth',
                                            editable: false,
                                            padding: '0 10 0 0'
                                        },
                                        {
                                            xtype: 'datetimefield',
                                            itemId: 'StartSimuTime',
                                            renderTo: Ext.getBody(),
                                            value: '2012-12-12 00:00:00',
                                            format: 'Y-m-d H:i:s',
                                            fieldLabel: '仿真开始时间(UTC)',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            padding: '0 0 10 0'
                                        },
                                        {
                                            xtype: 'datetimefield',
                                            itemId: 'StopSimuTime',
                                            renderTo: Ext.getBody(),
                                            value: '2014-12-12 00:00:00',
                                            format: 'Y-m-d H:i:s',
                                            fieldLabel: '仿真结束时间(UTC)',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            padding: '0 0 10 0'
                                        },
                                        {
                                            xtype: 'datetimefield',
                                            itemId: 'epochTime',
                                            renderTo: Ext.getBody(),
                                            value: '2012-12-12 00:00:00',
                                            format: 'Y-m-d H:i:s',
                                            fieldLabel: '历元时刻(UTC)',
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            padding: '0 0 10 0'
                                        },

                                        {
                                            xtype: 'combobox',
                                            itemId: 'axescombo',
                                            fieldLabel: '坐标系',
                                            showText: true,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            mode: 'local',
                                            store: new Ext.data.ArrayStore({
                                                fields: ['name', 'value'],
                                                data: [
                                                    ['惯性坐标系', 'iAxes']
                                                ]   //声明一个数组，提供数据
                                            }),
                                            displayField: 'name',
                                            valueField: 'value',
                                            value: 'iAxes',
                                            editable: false,
                                            padding: '0 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'halfR',
                                            fieldLabel: '半长轴 a (km)',
                                            value: 20000,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: '',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'pE',
                                            fieldLabel: '偏心率 e',
                                            value: 0.1,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'gdqJ',
                                            fieldLabel: '轨道倾角 i (°)',
                                            value: 45.0,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'sjdcjO',
                                            fieldLabel: '升交点赤经 Ω (°)',
                                            value: 0,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'jxdfJ',
                                            fieldLabel: '近心点幅角 ω (°)',
                                            value: 45.0,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'zjdjQ',
                                            fieldLabel: '真近点角 θ (°)',
                                            value: 20,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            decimalPrecision:10
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'hb',
                                            fieldLabel: '步长(s)',
                                            value: 60,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 290,
                                            labelSeparator: ' ',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            editable:false
                                        }

                                    ]
                                }
                            ]}
                    ]

                }

//                {
//                    xtype: 'fieldset',
//                    itemId: 'attitudePara',
//                    title: '姿态参数',
//                    layout: 'anchor',
//                    defaults: {
//                        anchor: '100%'
//                    },
//                    collapsible: false,
//                    collapsed: false,
//                    items: [
//                        {
//
//                            xtype: 'combobox',
//                            fieldLabel: '姿态类型',
//                            itemId: 'attitudeType',
//                            value: '3axes',
//                            showText: true,
//                            labelAlign: 'right',
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            store: new Ext.data.ArrayStore({
//                                fields: ['name', 'value'],
//                                data: [
//                                    ['三轴稳定', '3axes'],
//                                    ['自旋稳定', 'rota']
//                                ]   //声明一个数组，提供数据
//                            }),
//                            valueField: 'value',
//                            displayField: 'name',
//                            mode: 'local',
//                            triggerAction: 'all',
//                            editable: false,//用户不能自己输入,只能选择列表中有的记录
//                            allowBlank: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '俯仰角（X轴）',
//                            itemId: 'driftAnglenX',
//                            labelAlign: 'right',
//                            value: 0,
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '偏航角（Y轴）',
//                            itemId: 'driftAnglenY',
//                            maxValue: ORBIT.max['i'],
//                            minValue: ORBIT.min['i'],
//                            value: 0,
//                            labelAlign: 'right',
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '滚转角（Z轴）',
//                            itemId: 'driftAnglenZ',
//                            labelAlign: 'right',
//                            value: 0,
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '方位角',
//                            itemId: 'azimuthalAnglenfield',
//                            maxValue: ORBIT.max['i'],
//                            minValue: ORBIT.min['i'],
//                            labelAlign: 'right',
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hidden: true,
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '仰角',
//                            itemId: 'elevationAnglenfield',
//                            labelAlign: 'right',
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hidden: true,
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        },
//                        {
//                            xtype: 'numberfield',
//                            fieldLabel: '自旋速度',
//                            itemId: 'spinSpeednfield',
//                            labelAlign: 'right',
//                            labelPad: 10,
//                            labelWidth: 120,
//                            width: 290,
//                            labelSeparator: ' ',
//                            hidden: true,
//                            hideTrigger: true,
//                            keyNavEnabled: false,
//                            mouseWheelEnabled: false
//                        }
//                    ]
//                }

            ]

        });

        me.callParent(arguments);
    }

});