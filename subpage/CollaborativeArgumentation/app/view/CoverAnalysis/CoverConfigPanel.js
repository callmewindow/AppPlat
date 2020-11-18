/**
 * Created by Administrator on 2014/7/2.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverConfigPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.coverconfigpanel',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.data.*',
        'Ext.form.*'
    ],
    xtype:'form-checkout',
    frame:true,
    title: '',//覆盖分析配置
    bodyPadding:5,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 90,
                msgTarget: 'qtip'
            },
            items:[
                {
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items:[
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'combobox',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    width: 300,
                                    fieldLabel: '选择卫星',
                                    itemId: 'satellite',
                                    labelWidth:60,
                                    emptyText: '请选择...',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['卫星一','copy'],['卫星二','move'],['卫星三','rename']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    editable: false,
                                    multiSelect:true,
                                    padding:'0 200 0 20'
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:'hbox',
                            defaultType:'combobox',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    width: 200,
                                    fieldLabel: '覆盖类型',
                                    itemId: 'coverType',
                                    labelWidth: 60,
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['对天覆盖','sky'],['对地覆盖','earth']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    value:'sky',
                                    editable: false,
                                    padding:'0 27 0 20'
                                },
                                {
                                    width: 147,
                                    itemId: 'coverRangeType',
                                    emptyText: '.',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['全球覆盖','allEarth'],['区域覆盖','area'],["点覆盖","point"]]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    //value:'allEarth',
                                    editable: false,
                                    padding:'0 27 0 0',
                                    hidden:true
                                },
                                {
                                    width: 147,
                                    itemId: 'coverSharpType',
                                    emptyText: '.',
                                    mode: 'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['方形区域','square'],['圆形区域','circular']]   //声明一个数组，提供数据
                                        }),
                                    displayField: 'name',
                                    valueField: 'value',
                                    //value:'square',
                                    editable: false,
                                    padding:'0 27 0 0',
                                    hidden:true
                                },
                                {
                                 xtype:'button',
                                 text:'计算',
                                 itemId:'calculate',
                                 width:50
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