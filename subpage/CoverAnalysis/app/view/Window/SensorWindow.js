/**
 * Created by winter on 2014/8/23.
 */
Ext.define('CoverAnalysisApp.view.Window.SensorWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.sensorwindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '传感器属性',
    closeAction: 'hide',
    width:350,
    height:430,
    autoScroll : true,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 200',
            items: [
                {
                    aligin: 'center',
                    text: '确定',
                    xtype:'button',
                    itemId: 'btnSureFixSensor',
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
                    title: '传感器名称',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'label',
                            itemId: 'sensorName',
                            width: 250,
                            margin: '0 0 0 110'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '传感器参数',
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
                                    xtype: 'datetimefield',
                                    itemId: 'sensorStartTime',
                                    value: '2012-12-12 00:00:00',
                                    format: 'Y-m-d H:i:s',
                                    fieldLabel: '开始时间(UTC)',
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0'
                                },
                                {
                                    xtype: 'datetimefield',
                                    itemId: 'sensorEndTime',
                                    value: '2012-12-13 00:00:00',
                                    format: 'Y-m-d H:i:s',
                                    fieldLabel: '结束时间(UTC)',
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0'
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'sensorAzimuth',
                                    fieldLabel: '视场指向方位角(rad)',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0',
                                    decimalPrecision:10
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'sensorElevation',
                                    fieldLabel: '视场指向仰角(°)',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0',
                                    decimalPrecision:10
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'sensorOpenAngle',
                                    fieldLabel: '张角(°)',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0',
                                    decimalPrecision:10
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'sensorBH',
                                    fieldLabel: '步长(s)',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    padding: '0 0 10 0',
                                    editable:false
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