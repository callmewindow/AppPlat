/**
 * Created by winter on 2014/8/23.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitFileInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.orbitfileinfowindow',
    requires: [
        'Ext.panel.Panel',
        'OrbitDesignApp.view.DateTime.DateTimeField'
    ],
    title: '新建文件',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 280',
            items: [
                {
                    aligin:'center',
                    text: '确定',
                    itemId:'btnSureNewOritFile',
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
                    title: '文件参数',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 120,
                        labelAlign: 'center'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            items: [
                                {
                                    xtype: 'textfield',
                                    itemId: 'orbitFileName',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290,
                                    labelSeparator: ' ',
                                    fieldLabel: '文件名称',
                                    labelAlign: 'right'
                                }
                            ]

                        }


                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '仿真参数',
                    itemId:'orbitPara',
                    layout:'anchor',
                    defaults:{
                        anchor:'100%',
                        labelWidth:120,
                        labelAlign: 'center'
                    },
                    collapsible:false,
                    collapsed: false,
                    items:[{
                        xtype: 'fieldcontainer',
                        itemId: 'simuPara',
                        items: [
                            {
                                xtype: 'datetimefield',
                                itemId: 'startSimuTime',
                                renderTo: Ext.getBody(),
                                value: '2012-12-12 00:00:00',
                                format: 'Y-m-d H:i:s',
                                fieldLabel: '仿真开始时间(UTC)',
                                editable: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' ',
                                padding: '0 0 10 0'
                            },
                            {
                                xtype: 'datetimefield',
                                itemId: 'stopSimuTime',
                                renderTo: Ext.getBody(),
                                value: '2014-12-12 00:00:00',
                                format: 'Y-m-d H:i:s',
                                fieldLabel: '仿真结束时间(UTC)',
                                editable: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' ',
                                padding: '0 0 10 0'
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'stepLength',
                                value: 60,
//                                minValue: ORBIT.min['step'],
//                                maxValue: ORBIT.max['step'],
                                fieldLabel: '步长 (s)',
                                hideTrigger: true,
                                keyNavEnabled: false,
                                mouseWheelEnabled: false,
                                labelAlign: 'right',
                                labelPad: 10,
                                labelWidth: 120,
                                width: 290,
                                labelSeparator: ' '
                            }
                        ]
                    }
                    ]
                },
                {
                    xtype: 'fieldset',
                    layout:'anchor',
                    collapsible:false,
                    collapsed: false,
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            items:[
                                {
                                    xtype: 'textfield',
                                    itemId: 'prompt',
                                    fieldStyle: {
                                        color: '#ff0000',
                                        fontWeight: 'bold'
                                    },
                                    disabled: true,
                                    labelAlign: 'right',
                                    labelPad: 10,
                                    labelWidth: 120,
                                    width: 290
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