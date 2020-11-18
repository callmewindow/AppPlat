/**
 * 修改 by 杜鹏宇 on 2014/11/04
 */

Ext.define('StructDesignApp.view.AdvancedControlWindow', {
    alias: 'widget.advancedcontrolwindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.Number'
    ],
    height: 550,
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
                    id: 'structName',
                    fieldLabel: '名称',
                    value: ''
                },
                {
                    xtype: 'textfield',
                    itemId: 'structQuality',
                    id: 'structQuality',
                    fieldLabel: '质量（kg）',
                    value: ''
                },
                {
                    xtype: 'textfield',
                    itemId: 'powerConsumption',
                    id: 'powerConsumption',
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
                        id: 'structPositionX',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionX');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionX');
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
                        id: 'structPositionY',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionY');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionY');
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
                        id: 'structPositionZ',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionZ');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structPositionZ');
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
                        id: 'structRotationX',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationX');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationX');
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
                        id: 'structRotationY',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationY');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationY');
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
                        id: 'structRotationZ',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationZ');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structRotationZ');
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
                        id: 'structSizeX',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeX');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeX');
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
                        id: 'structSizeY',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeY');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeY');
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
                        id: 'structSizeZ',
                        onSpinUp: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeZ');
                            paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.1);
                        },
                        onSpinDown: function(){
                            var paraENFieldCmp=Ext.getCmp('structSizeZ');
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