/**
 * Created by Taivas on 5/4/14.
 */
Ext.define('AppPlat.view.OrbitDesign.OrbitOperationToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.orbitoperationtoolbar',

    requires: [
        'Ext.container.ButtonGroup',
        'Ext.button.Cycle',
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',
        'Ext.form.field.Number'
    ],

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items:
            [
                {
                    text: '属性板',
                    itemId: 'btnAdvancedPanel',
                    iconCls: 'Kongzhiban',
                    xtype: 'button'
                },
                {
                    text: '列表板',
                    itemId: 'btnList',
                    iconCls: 'Liebiaoban',
                    xtype: 'button'
                },
                {
                    xtype: 'button',
                    itemId: 'simuparaBtn',
                    tooltip: '仿真参数',
                    tooltipType:'title',
                    iconCls: 'Fangzhencanshu'
                },
                '-'
                ,
                {
                    itemId:'VisibileCtrlButton',
                    xtype: 'button',
                    iconCls: 'Eye',
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
                                        {boxLabel: '地球磁场', name: 'planet',itemId:'earthTrace',inputValue:'trace'}
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
                    iconCls: 'Kaishi',
                    tooltip:'开始',
                    text:'开始',
                    tooltipType:'title'
                },
                {
                    xtype: 'button',
                    itemId: 'simuRWBtn',
                    tooltip:'减小步长',
                    text:'减小',
                    iconCls: 'Jianxiaobuchang',
                    tooltipType:'title'
                },
                {
                    xtype: 'button',
                    itemId: 'simuSTBtn',
                    tooltip:'重置',
                    text:'重置',
                    iconCls: 'Chongzhi',
                    tooltipType:'title'
                },
                {
                    xtype: 'button',
                    itemId: 'simuFFBtn',
                    tooltip:'增大步长',
                    text:'增大',
                    iconCls: 'Zengdabuchang',
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