/**
 * Created by Administrator on 2014/5/7.
 */
Ext.define('AppPlat.view.DataTransAnalysis.SelectNodePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.selectnodepanel',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.data.*',
        'Ext.form.*'
    ],
    xtype:'form-checkout',
    frame:true,
    title: '',//过站分析配置
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
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items:[
                        {
                            xtype:'container',
                            defaultType:'combobox',
                            layout:'hbox',
                            margin:'15 0 15 0',
                            items:[
                                {
                                    width:240,
                                    fieldLabel:'选择卫星',
                                    labelWidth:60,
                                    itemId:'satellite',
                                    emptyText:'请选择...',
                                    mode:'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['卫星一','satellite1'],['卫星二','satellite2'],['卫星三','satellite3']]
                                        }),
                                    displayField:'name',
                                    valueField:'value',
                                    editable: false,
                                    multiSelect:true,
                                    padding:'0 27 0 20'
                                },
                                {
                                    width:240,
                                    fieldLabel:'选择地面站',
                                    labelWidth:70,
                                    itemId:'groundStation',
                                    emptyText:'请选择...',
                                    mode:'local',
                                    store:
                                        new Ext.data.ArrayStore({
                                            fields:['name','value'],
                                            data:[['地面站一','groundStation1'],['地面站二','groundStation2'],['地面站三','groundStation3']]
                                        }),
                                    displayField:'name',
                                    valueField:'value',
                                    editable: false,
                                    multiSelect:true,
                                    padding:'0 27 0 20'
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