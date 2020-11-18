/**
 * Created by winter on 2014/9/5.
 */
/**
 * Created by winter on 2014/8/23.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.AngleWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.anglewindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '选择视角',
    closeAction:'hide',
    width:200,
    x:150,
    y:117,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 130',
            items: [
                {
                    aligin:'center',
                    text: '确定',
                    itemId:'btnSureAngle',
                    scope: this

                }
            ]
        }
    ],
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            bodyPadding: 10,
            items: [
                {
                    xtype: 'fieldset',
                    title: '选择行星',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 120,
                        labelAlign: 'center'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {   xtype: 'fieldcontainer',
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    itemId: 'angleRadio',
                                    width: 130,
                                    columns: 1,
                                    vertical: true,
                                    items: [
                                        {boxLabel: '太阳', name: 'planet',itemId:'sun',inputValue:'sun'},
                                        {boxLabel: '水星', name: 'planet',itemId:'mercury',inputValue:'mercury'},
                                        {boxLabel: '金星', name: 'planet',itemId:'venus',inputValue:'venus'},
                                        {boxLabel: '地球', name: 'planet',itemId:'earth',inputValue:'earth'},
                                        {boxLabel: '火星', name: 'planet',itemId:'mars',inputValue:'mars'},
                                        {boxLabel: '木星', name: 'planet',itemId:'jupiter',inputValue:'jupiter'},
                                        {boxLabel: '土星', name: 'planet',itemId:'saturn',inputValue:'saturn'},
                                        {boxLabel: '天王星', name: 'planet',itemId:'uranus',inputValue:'uranus'},
                                        {boxLabel: '海王星', name: 'planet',itemId:'neptune',inputValue:'neptune'},
                                        {boxLabel: '月球', name: 'planet',itemId:'moon',inputValue:'moon'}
                                    ]
                                }
                            ]

                        }


                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '选择坐标系',
                    itemId:'orbitPara',
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
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'combobox',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    width: 130,
                                    itemId: 'sunAxesCombo',
                                    emptyText: '.',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['日星黄道坐标系','sunlanetAxes']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    value:'sunlanetAxes',
                                    editable: false,
                                    padding:'0 27 0 0',
                                    hidden:true
                                },
                                {
                                    width: 130,
                                    itemId: 'earthAxesCombo',
                                    emptyText: '.',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['惯性坐标系','earthInertial'],['固连坐标系','earthFixed'],['磁场坐标系','earthMagnetic']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    value:'earthInertial',
                                    editable: false,
                                    padding:'0 27 0 0',
                                    hidden:true
                                },
                                {
                                    width: 130,
                                    itemId: 'otherAxesCombo',
                                    emptyText: '.',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['惯性坐标系','otherInertial'],['固连坐标系','otherFixed']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    value:'otherInertial',
                                    editable: false,
                                    padding:'0 27 0 0',
                                    hidden:true
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