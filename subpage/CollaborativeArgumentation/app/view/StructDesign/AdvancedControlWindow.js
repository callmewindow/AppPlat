/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('AppPlat.view.StructDesign.AdvancedControlWindow', {
    alias: 'widget.advancedcontrolwindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.Number'
    ],
    height: 560,
    width: 270,
    title: '属性面板',
    closeAction: 'hide',
    resizable: false,
    collapsible: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            bodyPadding: 10,

            items: [{
                xtype: 'fieldset',
                title: '基本信息',
                layout:'anchor',
                defaults:{
                    anchor:'100%',
                    labelWidth:120,
                    labelAlign: 'center'
                    //labelSeparator: ' '
                },
                collapsible:false,
                collapsed: false,
                items:[{
                    xtype: 'textfield',
                    itemId: 'structName',
                    fieldLabel: '名称',
                    value: ''
                },
                    {
                        xtype: 'textfield',
                        itemId: 'structQuality',
                        fieldLabel: '质量（kg）',
                        value: ''
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'powerConsumption',
                        fieldLabel: '功耗（w）',
                        value: ''
                    }
                ]},

                {
                    xtype: 'fieldset',
                    title: '三维参数',
                    layout:'anchor',
                    defaults:{
                        anchor:'100%',
                        labelWidth:120,
                        labelAlign: 'center'
                        //labelSeparator: ' '
                    },
                    collapsible:false,
                    collapsed: false,
                    items:[{
                        xtype: 'numberfield',
                        itemId: 'structPositionX',
                        onSpinUp: function(){
                            var paraENFieldCmp=me.queryById('structPositionX');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=me.queryById('structPositionX');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                        },
                        fieldLabel: '安装位置 X',
                        value: '',
                        maxValue: 1000,
                        minValue: -1000
                    },
                        {
                            xtype: 'numberfield',
                            itemId: 'structPositionY',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structPositionY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structPositionY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                            },
                            fieldLabel: '安装位置 Y',
                            value: '',
                            maxValue: 1000,
                            minValue: -1000
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structPositionZ',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structPositionZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structPositionZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                            },
                            fieldLabel: '安装位置 Z',
                            value: '',
                            maxValue: 1000,
                            minValue: -1000
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structRotationX',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structRotationX');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structRotationX');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                            },
                            fieldLabel: '欧拉转角 X（度）',
                            value: '',
                            maxValue: 360,
                            minValue: -360
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structRotationY',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structRotationY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structRotationY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                            },
                            fieldLabel: '欧拉转角 Y（度）',
                            value: '',
                            maxValue: 360,
                            minValue: -360
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structRotationZ',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structRotationZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structRotationZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1);
                            },
                            fieldLabel: '欧拉转角 Z（度）',
                            value: '',
                            maxValue: 360,
                            minValue: -360
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structSizeX',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structSizeX');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structSizeX');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-0.1);
                            },
                            fieldLabel: '包络尺寸 X（m）',
                            value: '',
                            maxValue: 20,
                            minValue: 0.01
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structSizeY',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structSizeY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structSizeY');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-0.1);
                            },
                            fieldLabel: '包络尺寸 Y（m）',
                            value: '',
                            maxValue: 20,
                            minValue: 0.01
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'structSizeZ',
                            onSpinUp: function(){
                                var paraENFieldCmp=me.queryById('structSizeZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=me.queryById('structSizeZ');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-0.1);
                            },
                            fieldLabel: '包络尺寸 Z（m）',
                            value: '',
                            maxValue: 20,
                            minValue: 0.01
                        }
                    ]}
            ]
        });

        me.callParent(arguments);
    }
});