/**
 * Created by Taivas on 5/7/14.
 */
Ext.define('AppPlat.view.OrbitDesign.SateParaPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.sateparapanel',

    requires: [
        'Ext.form.field.Number',
        'AppPlat.store.OrbitDesign.SimuParaStore'
    ],
    title: '属性',
    collapsed: true,
    flex:1,
    height: 340,
    layout: 'hbox',
    width: 300,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: '卫星姿态',
                    layout: 'anchor',
                    margin: '0 0 0 10',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {

                            xtype: 'combobox',
                            fieldLabel: '姿态类型',
                            itemId:'attitudeType',
                            value: '3axes',
                            showText: true,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            store: new Ext.data.ArrayStore({
                                fields:['name','value'],
                                data:[['三轴稳定','3axes'], ['自旋稳定','rota']]   //声明一个数组，提供数据
                            }),
                            valueField: 'value',
                            displayField:'name',
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false,//用户不能自己输入,只能选择列表中有的记录
                            allowBlank:false
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '偏航角（Y轴）',
                            itemId:'driftAnglenfield',
                            value: 0,
                            maxValue: ORBIT.max['i'],
                            minValue: ORBIT.min['i'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            itemId:'rollAngle',
                            xtype: 'numberfield',
                            fieldLabel: '滚转角（Z轴）',
                            itemId:'rollAnglenfield',
                            value: 0,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            itemId:'pitchAngle',
                            xtype: 'numberfield',
                            fieldLabel: '俯仰角（X轴）',
                            itemId:'pitchAnglenfield',
                            value: 0,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' '
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '方位角',
                            itemId:'azimuthalAnglenfield',
                            value: 0,
                            maxValue: ORBIT.max['i'],
                            minValue: ORBIT.min['i'],
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            hidden:true
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '仰角',
                            itemId:'elevationAnglenfield',
                            value: 0,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            hidden:true
                        },
                        {
                            xtype:'combobox',
                            itemId: 'starcombo',
                            fieldLabel: '星体',
                            showText: true,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            mode: 'local',
                            store:
                                new Ext.data.ArrayStore({
                                    fields:['name','value'],
                                    data:[['地球','earth'],['月球','moon']]   //声明一个数组，提供数据
                                }),
                            displayField: 'name',
                            valueField: 'value',
                            value:'earth',
                            editable: false,
                            padding:'0 27 0 0'
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '自旋速度',
                            itemId:'spinSpeednfield',
                            value: 0,
                            labelAlign: 'right',
                            labelPad: 10,
                            width: 250,
                            labelSeparator: ' ',
                            hidden:true
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});