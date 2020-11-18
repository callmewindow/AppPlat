Ext.define('AppPlat.view.OrbitDesign.SatelliteParaWindow', {
    alias: 'widget.satelliteparawindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.Number'
    ],
    height: 630,
    width: 350,
    title: '卫星属性',
//    x:150,
//    y:117,
    closeAction: 'hide',
    resizable: false,
    id:'satelliteParaWindow',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            bodyPadding: 10,
            items: [{
                xtype: 'fieldset',
                title: '轨道参数',
                layout:'anchor',
                defaults:{
                    anchor:'100%',
                    labelWidth:120,
                    labelAlign: 'center'
                },
                collapsible:false,
                collapsed: false,
                items:[
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
                                itemId: 'startSimuTime',
                                renderTo:Ext.getBody(),
                                value:'2012-12-12 00:00:00',
                                format:'Y-m-d H:i:s',
                                fieldLabel: '仿真开始时间(UTC)',
                                editable: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' ',
                                padding:'0 0 10 0'
                            },
                            {
                                xtype: 'datetimefield',
                                itemId: 'stopSimuTime',
                                renderTo:Ext.getBody(),
                                value:'2014-12-12 00:00:00',
                                format:'Y-m-d H:i:s',
                                fieldLabel: '仿真结束时间(UTC)',
                                editable: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' ',
                                padding:'0 0 10 0'
                            },
                            {
                                xtype: 'datetimefield',
                                itemId: 'epochTime',
                                renderTo: Ext.getBody(),
                                value:'2014-12-12 00:00:00',
                                format: 'Y-m-d H:i:s',
                                fieldLabel: '历元时刻(UTC)',
                                editable: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' ',
                                padding: '0 0 5 0'

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
                                itemId: 'paraanfield',
                                fieldLabel: '半长轴 a (km)',
//                                maxValue: ORBIT.max['a'],
//                                minValue: ORBIT.min['a'],
                                step: 1000,
                                value: 20000,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ''
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'paraenfield',
                                fieldLabel: '偏心率 e',
//                                maxValue: ORBIT.max['e'],
//                                minValue: ORBIT.min['e'],
                                step: 0.01,
                                value: 0,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'parainfield',
                                fieldLabel: '轨道倾角 i (°)',
//                                maxValue: ORBIT.max['i'],
//                                minValue: ORBIT.min['i'],
                                value: 0,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'paraOmnfield',
                                fieldLabel: '升交点赤经 Ω (°)',
//                                maxValue: ORBIT.max['Om'],
//                                minValue: ORBIT.min['Om'],
                                value: 0,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'paraomnfield',
                                fieldLabel: '近心点幅角 ω (°)',
//                                maxValue: ORBIT.max['om'],
//                                minValue: ORBIT.min['om'],
                                value: 0,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'parathetanfield',
                                fieldLabel: '真近点角 θ (°)',
//                                maxValue: ORBIT.max['theta'],
//                                minValue: ORBIT.min['theta'],
                                value: 0,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            }
                        ]
                    }
                ]},

                {
                    xtype: 'fieldset',
                    title: '姿态参数',
                    layout:'anchor',
                    defaults:{
                        anchor:'100%',
                        labelWidth:120,
                        labelAlign: 'center'
                    },
                    collapsible:false,
                    collapsed: false,
                    items:[
                        {

                            xtype: 'combobox',
                            fieldLabel: '姿态类型',
                            itemId: 'attitudeType',
                            value: '3axes',
                            showText: true,
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' ',
                            store: new Ext.data.ArrayStore({
                                fields: ['name', 'value'],
                                data: [
                                    ['三轴稳定', '3axes'],
                                    ['自旋稳定', 'rota']
                                ]   //声明一个数组，提供数据
                            }),
                            valueField: 'value',
                            displayField: 'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,//用户不能自己输入,只能选择列表中有的记录
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '偏航角（Y轴）',
                            itemId: 'driftAnglenfield',
                            value: 0,
//                            maxValue: ORBIT.max['driftAnglenfield'],
//                            minValue: ORBIT.min['driftAnglenfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '滚转角（Z轴）',
                            itemId: 'rollAnglenfield',
                            value: 0,
//                            maxValue: ORBIT.max['rollAnglenfield'],
//                            minValue: ORBIT.min['rollAnglenfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '俯仰角（X轴）',
                            itemId: 'pitchAnglenfield',
                            value: 0,
//                            maxValue: ORBIT.max['pitchAnglenfield'],
//                            minValue: ORBIT.min['pitchAnglenfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '方位角',
                            itemId: 'azimuthalAnglenfield',
                            value: 0,
//                            maxValue: ORBIT.max['azimuthalAnglenfield'],
//                            minValue: ORBIT.min['azimuthalAnglenfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' ',
                            hidden: true
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '仰角',
                            itemId: 'elevationAnglenfield',
                            value: 0,
//                            maxValue: ORBIT.max['elevationAnglenfield'],
//                            minValue: ORBIT.min['elevationAnglenfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' ',
                            hidden: true
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '自旋速度',
                            itemId: 'spinSpeednfield',
                            value: 0,
//                            maxValue: ORBIT.max['spinSpeednfield'],
//                            minValue: ORBIT.min['spinSpeednfield'],
                            labelAlign: 'right',
                            labelPad: 10,
                            labelWidth: 120,
                            width: 290,
                            labelSeparator: ' ',
                            hidden: true
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    dock: 'bottom',
                    layout:'hbox',
                    items:[
                        {
                            text: '',
                            xtype:'label',
                            itemId: 'errorLabel',
                            style: {
                                color: 'red'
                            },
                            width: 300,
                            scope: this,
                            margin:'5 0 5 40'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});