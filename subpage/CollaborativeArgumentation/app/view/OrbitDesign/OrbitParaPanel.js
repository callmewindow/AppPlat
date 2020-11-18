/**
 * Created by Taivas on 5/7/14.
 */
Ext.define('AppPlat.view.OrbitDesign.OrbitParaPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.orbitparapanel',

    requires: [
        'Ext.form.field.Number'
    ],
    title: '轨道参数',
    height: 340,
    width: 280,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: '轨道类型',
                            value: '普通轨道',
                            showText: true,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            store: new Ext.data.ArrayStore({
                                fields:['name','value'],
                                data:[['普通轨道','free'],['地球同步','earth'],['太阳同步','sun']]   //声明一个数组，提供数据
                            }),
                            valueField: 'value',
                            displayField:'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable:false,//用户不能自己输入,只能选择列表中有的记录
                            allowBlank:false
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'paraanfield',
                            id: 'paraanfield',
                            onSpinUp: function(){
                                var paraENFieldCmp=Ext.getCmp('paraanfield');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+1000);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=Ext.getCmp('paraanfield');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-1000);
                            },
                            fieldLabel: '半长轴 a (m)',
                            value: ORBIT.orbitpara['sate']['a']*1000,
                            maxValue: ORBIT.max['a'],
                            minValue: ORBIT.min['a'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'paraenfield',
                            id: 'paraenfield',
                            onSpinUp: function(){
                                var paraENFieldCmp=Ext.getCmp('paraenfield');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())+0.01);
                            },
                            onSpinDown: function(){
                                var paraENFieldCmp=Ext.getCmp('paraenfield');
                                paraENFieldCmp.setValue(Number(paraENFieldCmp.getValue())-0.01);
                            },
                            fieldLabel: '偏心率 e',
                            value: ORBIT.orbitpara['sate']['e'],
                            maxValue: ORBIT.max['e'],
                            minValue: ORBIT.min['e'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'parainfield',
                            fieldLabel: '轨道倾角 i (°)',
                            value: ORBIT.orbitpara['sate']['i']/Math.PI*180,
                            maxValue: ORBIT.max['i'],
                            minValue: ORBIT.min['i'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'paraOmnfield',
                            fieldLabel: '升交点赤经 Ω (°)',
                            value: ORBIT.orbitpara['sate']['Om']/Math.PI*180,
                            maxValue: ORBIT.max['Om'],
                            minValue: ORBIT.min['Om'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'paraomnfield',
                            fieldLabel: '近心点幅角 ω (°)',
                            value: ORBIT.orbitpara['sate']['om']/Math.PI*180,
                            maxValue: ORBIT.max['om'],
                            minValue: ORBIT.min['om'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'parathetanfield',
                            fieldLabel: '真近点角 θ (°)',
                            value: ORBIT.orbitpara['sate']['theta']/Math.PI*180,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});