/**
 * Created by Taivas on 5/4/14.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitOperationToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.orbitoperationtoolbar',
    id: 'orbitOperationToolbar',
    requires: [
        'Ext.container.ButtonGroup',
        'Ext.button.Cycle',
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',
        'Ext.form.field.Number',
        'Ext.slider.Single'
    ],
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items:
            [
                {
                    tooltip: '菜单',
                    iconCls: 'menu',
                    text:'菜单',
                    itemId:'OrbitMenu',
                    xtype: 'button',
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
                                    text: '新建任务',
                                    itemId: 'btnNewOrbitFile',
                                    xtype: 'button',
                                    iconCls: 'addTask'
                                },
                                {
                                    text: '添加卫星',
                                    itemId: 'btnAddSatellite',
                                    xtype: 'button',
                                    iconCls: 'satellite'
                                },
                                {
                                    text: '打开任务',
                                    itemId: 'btnOpenOrbitFile',
                                    xtype: 'button',
                                    iconCls: 'openTask'
                                },
                                {
                                    text: '保存任务',
                                    itemId: 'btnSaveOrbitFile',
                                    xtype: 'button',
                                    iconCls: 'saveTask'
                                },
                                {
                                    text: '导出任务',
                                    itemId: 'btnExportOrbitFile',
                                    xtype: 'button',
                                    iconCls: 'exportTask'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'simuparaBtn',
                                    text: '仿真参数',
                                    iconCls: 'simupara'
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

                '-',
                {
                    itemId:'VisibileCtrlButton',
                    xtype: 'button',
                    iconCls: 'visibile',
                    text:'可见性',
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
                                        {boxLabel: '坐标系', name: 'planet',itemId:'planetaryCoordinates',inputValue:'coordinates'},
                                        {boxLabel: '地球磁场', name: 'planet',itemId:'earthTrace',inputValue:'trace'},
                                        {boxLabel: '太阳风', name: 'planet',itemId:'sunWind',inputValue:'wind'},
                                        {boxLabel: '太阳风', name: 'planet',itemId:'sunWind',inputValue:'wind'}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                '-',
//                {
//                    xtype: 'button',
//                    itemId: 'angelSun',
//                    iconCls: 'sun',
//                    tooltip:'太阳',
//                    shadow:true,
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelMercury',
//                    iconCls: 'mercury',
//                    tooltip:'水星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelVenus',
//                    iconCls: 'venus',
//                    tooltip:'金星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelEarth',
//                    iconCls: 'earth',
//                    tooltip:'地球',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelMars',
//                    iconCls: 'mars',
//                    tooltip:'火星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelJupiter',
//                    iconCls: 'jupiter',
//                    tooltip:'木星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelSaturn',
//                    iconCls: 'saturn',
//                    tooltip:'土星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelUranus',
//                    iconCls: 'uranus',
//                    tooltip:'天王星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelNeptune',
//                    iconCls: 'neptune',
//                    tooltip:'海王星',
//                    tooltipType:'title'
//                },
//                {
//                    xtype: 'button',
//                    itemId: 'angelMoon',
//                    iconCls: 'moon',
//                    tooltip:'月球',
//                    tooltipType:'title'
//                },


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
                '-',
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
                '-',
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
                '-',
                {
                    xtype: 'slider',
                    itemId:'planetScaleSlider',
                    tipText: function(thumb){
                        return Ext.String.format('<b>{0}</b>', thumb.value);//行星比例:
                    },
                    width: 135,
                    minValue: 1,
                    maxValue:30
                }
            ]
        });
        me.callParent(arguments);
    }

});