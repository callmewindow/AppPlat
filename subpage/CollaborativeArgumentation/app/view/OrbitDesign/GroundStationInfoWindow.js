
/**
 * Created by winter on 2014/8/23.
 */
Ext.define('AppPlat.view.OrbitDesign.GroundStationInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.groundstationinfowindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '地面站信息',
    closeAction: 'hide',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 240',
            items: [
                {
                    aligin:'center',
                    text: '确定',
                    itemId:'btnSureNewGroundStation',
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
                    title: '地面站参数',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 80,
                        labelAlign: 'center'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {   xtype: 'fieldcontainer',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    itemId: 'longitude',
                                    fieldLabel: '经度',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
//                                    value: 2.859956,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 80,
                                    width: 250,
                                    labelSeparator: ' '
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'latitude',
                                    fieldLabel: '纬度',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
//                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 80,
                                    width: 250,
                                    labelSeparator: ' '
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'height',
                                    fieldLabel: '高度',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
//                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 80,
                                    width: 250,
                                    labelSeparator: ' '
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'minAngle',
                                    fieldLabel: '最小仰角',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
//                                    value: 5.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 80,
                                    width: 250,
                                    labelSeparator: ' '
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '地面站（G/T）值(dBi/K)',
                                    itemId: 'groundGT',
                                    labelAlign: 'right',
//                                    value:0,
                                    labelPad: 10,
                                    labelWidth: 140,
                                    width: 250,
                                    labelSeparator: ' ',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false
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