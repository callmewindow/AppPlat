/**
 * Created by winter on 2014/8/23.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitSectionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.orbitsectionwindow',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.Action'
    ],
    layout: 'fit',
    closeAction: 'hide',
    width: 1062,
    height: 208,
    id: 'orbitSectionWindow',
    initComponent: function () {
        var me = this;
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            pluginId: 'rowEditing',
            saveBtnText: '保存',
            cancelBtnText: "取消",
            clicksToEdit: 2,
            autoCancel: false
        });
        Ext.define('OrbitSectionModel', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'numberId'},
                { name: 'currentPlanet'},
                { name: 'targetPlanet'},
                { name: 'startTime'},
                { name: 'endTime'},
                { name: 'speedDifference'}
            ]
        });
        var store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            autoLoad: false,
            model: 'OrbitSectionModel',
            proxy: {
                type: 'memory'
            },
            proxy: {
                type: 'rest',
                format: 'json',
                appendId: false,
                noCache: true,
                api: {
                    read: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/getOrbitSection",
                    update: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/updateOrbitSection",
                    destroy: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/deleteOrbitSection",
                    create: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/addOrbitSection"
                },
                reader: {
                    type: 'json',
                    messageProperty: 'message'
                }
            },
            sorters: [
                {
                    property: 'start',
                    direction: 'ASC'
                }
            ]
        });
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'gridpanel',
                            itemId: 'orbitSectionGridPanel',
                            width: 590,
                            height: 150,
                            frame: true,
                            bodyBorder : false,
                            plugins: [rowEditing],
                            store: store,
                            scroll: 'vertical',
                            columns: [
                                {
                                    itemId: "numberId",
                                    text: "序号",
                                    width: 50,
                                    align: 'center',
                                    dataIndex: 'numberId',
                                    tdCls: ''
                                },

                                {
                                    header: '当前星体',
                                    itemId: 'currentPlanet',
                                    align: 'center',
                                    dataIndex: 'currentPlanet',
                                    width: 70,
                                    editor: {
                                        itemId: 'currentPlanetEditor',
                                        xtype: 'textfield',
                                        disabled: true,
                                        tipText: function (thumb) {
                                            return Ext.String.format('<b>{0}</b>', thumb.value);
                                        },
                                        width: 135,
                                        minValue: 1,
                                        maxValue: 30
                                    }
                                },
                                {
                                    header: '目标星体',
                                    itemId: 'targetPlanet',
                                    dataIndex: 'targetPlanet',
                                    align: 'center',
                                    width: 70,
                                    editor: {
                                        xtype: 'combo',
                                        itemId: 'targetPlanetEditor',
                                        typeAhead: true,
                                        triggerAction: 'all',
                                        store: [
                                            ['水星', '水星'],
                                            ['金星', '金星'],
                                            ['地球', '地球'],
                                            ['火星', '火星'],
                                            ['木星', '木星'],
                                            ['土星', '土星'],
                                            ['天王星', '天王星'],
                                            ['海王星', '海王星']
                                        ]
                                    }
                                },
                                {
                                    xtype: 'datecolumn',
                                    header: '开始时间',
                                    itemId: 'startTime',
                                    dataIndex: 'startTime',
                                    align: 'center',
                                    format: 'Y-m-d H:i:s',
                                    width: 150,
                                    editor: {
                                        itemId: 'startTimeEditor',
                                        xtype: 'datetimefield',
                                        allowBlank: false,
                                        format: 'Y-m-d H:i:s'
                                    }
                                },
                                {
                                    xtype: 'datecolumn',
                                    header: '到达时间',
                                    itemId: 'endTime',
                                    align: 'center',
                                    dataIndex: 'endTime',
                                    format: 'Y-m-d H:i:s',
                                    width: 150,
                                    editor: {
                                        itemId: 'endTimeEditor',
                                        xtype: 'datetimefield',
                                        allowBlank: false,
                                        format: 'Y-m-d H:i:s'
                                    }
                                },
                                {
                                    header: '速度差',
                                    itemId: 'speedDifference',
                                    align: 'center',
                                    dataIndex: 'speedDifference',
                                    width: 90,
                                    editor: {
                                        itemId: 'speedDifferenceEditor',
                                        xtype: 'textfield',
                                        disabled: true,
                                        tipText: function (thumb) {
                                            return Ext.String.format('<b>{0}</b>', thumb.value);
                                        },
                                        width: 135,
                                        minValue: 1,
                                        maxValue: 30
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            itemId:'orbitPara',
                            border:'0 1 0 1',
                            style: {
                                borderColor: '#3F4757',
                                borderStyle: 'solid'
                            },
                            margin:'10 0 0 10',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    padding:'0 0 0 10',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            itemId: 'axescombo',
                                            align:'center',
                                            fieldLabel: '坐标系',
                                            showText: true,
                                            labelAlign: 'right',
                                            labelPad: 10,
                                            labelWidth: 120,
                                            width: 240,
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
                                            padding:'0 10 0 0'
                                        },
                                        {
                                            text: '',
                                            xtype:'label',
                                            itemId: 'errorLabel',
                                            style: {
                                                color: 'red'
                                            },
                                            width: 250,
                                            scope: this,
                                            margin:'0 0 5 30'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    padding:'10 0 0 10',
                                    items:[
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            items:[

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
                                                    width: 200,
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
                                                    width: 200,
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
                                                    width: 200,
                                                    labelSeparator: ' '
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            padding:'0 10 0 20',
                                            items:[
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
                                                    width: 200,
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
                                                    width: 200,
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
                                                    width: 200,
                                                    labelSeparator: ' '
                                                }

                                            ]
                                        }
                                    ]
                                }

//                                {
//                                    xtype: 'fieldset',
//                                    title: '轨道参数',
//                                    layout: 'anchor',
//                                    defaults: {
//                                        anchor: '100%',
//                                        labelWidth: 100,
//                                        labelAlign: 'center'
//                                    },
//                                    collapsible: false,
//                                    collapsed: false,
//                                    items: [
//                                        {
//                                            xtype: 'fieldcontainer',
//                                            items: [
//                                                {
//                                                    xtype: 'combobox',
//                                                    itemId: 'axescombo',
//                                                    fieldLabel: '坐标系',
//                                                    showText: true,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' ',
//                                                    mode: 'local',
//                                                    store: new Ext.data.ArrayStore({
//                                                        fields: ['name', 'value'],
//                                                        data: [
//                                                            ['惯性坐标系', 'iAxes']
//                                                        ]   //声明一个数组，提供数据
//                                                    }),
//                                                    displayField: 'name',
//                                                    valueField: 'value',
//                                                    value: 'iAxes',
//                                                    editable: false,
//                                                    padding: '0 10 0 0'
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'paraanfield',
//                                                    fieldLabel: '半长轴 a (km)',
////                                maxValue: ORBIT.max['a'],
////                                minValue: ORBIT.min['a'],
//                                                    step: 1000,
//                                                    value: 20000,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ''
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'paraenfield',
//                                                    fieldLabel: '偏心率 e',
////                                maxValue: ORBIT.max['e'],
////                                minValue: ORBIT.min['e'],
//                                                    step: 0.01,
//                                                    value: 0,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' '
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'parainfield',
//                                                    fieldLabel: '轨道倾角 i (°)',
////                                maxValue: ORBIT.max['i'],
////                                minValue: ORBIT.min['i'],
//                                                    value: 0,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' '
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'paraOmnfield',
//                                                    fieldLabel: '升交点赤经 Ω (°)',
////                                maxValue: ORBIT.max['Om'],
////                                minValue: ORBIT.min['Om'],
//                                                    value: 0,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' '
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'paraomnfield',
//                                                    fieldLabel: '近心点幅角 ω (°)',
////                                maxValue: ORBIT.max['om'],
////                                minValue: ORBIT.min['om'],
//                                                    value: 0,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' '
//                                                },
//                                                {
//                                                    xtype: 'numberfield',
//                                                    itemId: 'parathetanfield',
//                                                    fieldLabel: '真近点角 θ (°)',
////                                maxValue: ORBIT.max['theta'],
////                                minValue: ORBIT.min['theta'],
//                                                    value: 0,
//                                                    labelAlign: 'right',
//                                                    labelPad: 10,
//                                                    labelWidth: 100,
//                                                    width: 200,
//                                                    labelSeparator: ' '
//                                                }
//                                            ]
//                                        }
//                                    ]}
                            ]
                        }
                    ]

                }
            ],
            tbar: [
                {
                    itemId: 'addOrbitSection',
                    text: '添加轨道段',
                    width: 150
                },
                {
                    itemId: 'removeOrbitSection',
                    text: '删除轨道段',
                    width: 150
                }
            ]

        });
        me.callParent(arguments);
    }
});