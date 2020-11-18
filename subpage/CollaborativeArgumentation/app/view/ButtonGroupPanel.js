Ext.define('AppPlat.view.ButtonGroupPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttongrouppanel',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.container.ButtonGroup',
        'Ext.button.Button'
    ],
    titleAlign: 'center',
    margin: '0 0 -2 0', // 上边距   右边距 下边距   左边距
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
                                text: '新建',
                                iconCls: 'addTask',
                                itemId: 'newNodeGroup',
                                xtype: 'button',
                                menu: {
                                    items: [
                                        {
                                            text: '方案',
                                            iconCls: APC.NODETYPE_SOLUTION,
                                            itemId: "newSolutionMenu"
                                        },
                                        {
                                            text: '卫星',
                                            iconCls: APC.NODETYPE_SATELLITE,
                                            itemId: "newSatelliteMenu",
                                            hidden: true
                                        },
                                        {
                                            text: '结构',
                                            iconCls: APC.NODETYPE_STRUCTURE,
                                            itemId: 'newStructureMenu',
                                            hidden: true
                                        },
                                        {
                                            text: '地面站',
                                            itemId: "newGroundStationMenu",
                                            iconCls: APC.NODETYPE_GROUNDSTATION,
                                            hidden: true
                                        },
                                        {
                                            text: '覆盖分析',
                                            itemId: "newCoverAnalyMenu",
                                            iconCls: APC.NODETYPE_COVER_ANALYSIS,
                                            hidden: true
                                        },
                                        {
                                            text: '数传分析',
                                            itemId: "newDataTransAnalyMenu",
                                            iconCls: APC.NODETYPE_DATATRANS_ANALYSIS,
                                            hidden: true
                                        },
                                        {
                                            text: '传感器',
                                            iconCls: 'Sensor',
                                            itemId: 'addSensorMenu',
                                            hidden: true
                                        },
                                        {
                                            text: '天区点目标',
                                            iconCls: 'SkyCoverPoint',
                                            itemId: 'addSkyPointMenu',
                                            hidden: true
                                        },
                                        {
                                            text: '天区区域目标',
                                            iconCls: 'SkyCoverRegin',
                                            itemId: 'addSkyReginMenu',
                                            hidden: true
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'button',
                                text: '仿真参数',
                                itemId: 'simuparaBtn',
                                tooltip: '仿真参数',
                                tooltipType:'title',
                                iconCls: 'simupara'
                            },
                            {
                                itemId:'VisibileCtrlButton',
                                xtype: 'button',
                                iconCls: 'visibile',
                                text: '可见性',
                                tooltip:'可见性',
                                tooltipType:'title',
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
                                                xtype: 'checkboxgroup',
                                                itemId: 'visibilityCheckboxGroup',
                                                width: 130,
                                                columns: 1,
                                                vertical: true,
                                                items: [
                                                    {boxLabel: '行星轨迹', name: 'planet',itemId:'planetaryTrack',inputValue:'track'},
                                                    {boxLabel: '行星坐标系', name: 'planet',itemId:'planetaryCoordinates',inputValue:'coordinates'},
                                                    {boxLabel: '地球磁场', name: 'planet',itemId:'earthTrace',inputValue:'trace'},
                                                    {boxLabel: '太阳风', name: 'planet',itemId:'sunWind',inputValue:'wind'}
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                itemId: 'simuPLBtn',
                                id: 'simuPLBtn',//need to change iconCls
                                iconCls: 'start',
                                tooltip:'开始',
                                text:'开始',
                                tooltipType:'title'
                            },
                            {
                                xtype: 'button',
                                itemId: 'simuRWBtn',
                                tooltip:'减小步长',
                                text:'减小',
                                iconCls: 'slow',
                                tooltipType:'title'
                            },
                            {
                                xtype: 'button',
                                itemId: 'simuSTBtn',
                                tooltip:'重置',
                                text:'重置',
                                iconCls: 'reset',
                                tooltipType:'title'
                            },
                            {
                                xtype: 'button',
                                itemId: 'simuFFBtn',
                                tooltip:'增大步长',
                                text:'增大',
                                iconCls: 'fast',
                                tooltipType:'title'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'simutime',
                                width: 160,
                                readOnly: true,
                                disabled:true
                            },
                            {
                                width: 100,
                                xtype: 'combo',
                                itemId: 'planetCombo',
                                emptyText: '.',
                                trackResetOnLoad:true,
                                mode: 'local',
                                store:
                                    new Ext.data.ArrayStore({
                                        fields:['name','value'],
                                        data:[['', "noPlanet"],['自由视角', "angelFreedom"],['太阳','angelSun'],['水星','angelMercury'],['金星','angelVenus'],['地球','angelEarth'],['火星','angelMars'],['木星','angelJupiter'],['土星','angelSaturn'],['天王星','angelUranus'],['海王星','angelNeptune'],['月球','angelMoon']]  //声明一个数组，提供数据
                                    }),
                                displayField: 'name',
                                valueField: 'value',
                                value:'angelSun',
                                editable: false,
                                fieldStyle: 'font-size:14px'
                            },
                            {
                                width: 140,
                                xtype: 'combo',
                                itemId: 'planetAxesCombo',
                                emptyText: '.',
                                trackResetOnLoad:true,
                                mode: 'local',
                                store:
                                    new Ext.data.ArrayStore({
                                        fields:['name','value'],
                                        data:[['', "noAxes"],['日星黄道坐标系','sunlanetAxes']]  //声明一个数组，提供数据
                                    }),
                                displayField: 'name',
                                valueField: 'value',
                                value:'sunlanetAxes',
                                editable: false,
                                fieldStyle: 'font-size:14px'
                            },
                            {
                                width: 140,
                                xtype: 'combo',
                                itemId: 'earthAxesCombo',
                                hidden:true,
                                emptyText: '.',
                                trackResetOnLoad:true,
                                mode: 'local',
                                store:
                                    new Ext.data.ArrayStore({
                                        fields:['name','value'],
                                        data:[['', "noAxes"],['惯性坐标系','inertial'],['固连坐标系','fixed'],['磁场坐标系','magnetic']]  //声明一个数组，提供数据
                                    }),
                                displayField: 'name',
                                valueField: 'value',
                                value:'inertial',
                                editable: false,
                                fieldStyle: 'font-size:14px'
                            },
                            {
                                width: 140,
                                xtype: 'combo',
                                itemId: 'otherAxesCombo',
                                hidden:true,
                                emptyText: '.',
                                trackResetOnLoad:true,
                                mode: 'local',
                                store:
                                    new Ext.data.ArrayStore({
                                        fields:['name','value'],
                                        data:[['', "noAxes"],['惯性坐标系','inertial'],['固连坐标系','fixed']]  //声明一个数组，提供数据
                                    }),
                                displayField: 'name',
                                valueField: 'value',
                                value:'inertial',
                                editable: false,
                                fieldStyle: 'font-size:14px'
                            },
                            
                            {
                                xtype: 'slider',
                                itemId:'planetScaleSlider',
                                tipText: function(thumb){
                                    return Ext.String.format('<b>{0}</b>', thumb.value);//行星比例:
                                },
                                width: 135,
                                minValue: 1,
                                maxValue:30
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
                                iconCls:'observe',
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
                        '-',
                        {
                            text: '提交',
                            itemId: 'btnUpdate',
                            iconCls: 'exportTask',
                            xtype: 'button'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }

});