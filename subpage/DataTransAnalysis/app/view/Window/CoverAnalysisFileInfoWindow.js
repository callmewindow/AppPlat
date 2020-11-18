/**
 * Created by winter on 2014/8/23.
 */
Ext.define('DataTransAnalysisApp.view.Window.CoverAnalysisFileInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.coveranalysisfileinfowindow',
    requires: [
        'Ext.panel.Panel',
        'DataTransAnalysisApp.view.DateTimeField'
    ],
    title: '任务属性',
    closeAction: 'hide',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 270',
            items: [
                {
                    aligin:'center',
                    text: '确定',
                    itemId:'btnSureNewCovAnaFile',
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
                    title: '任务名称',
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
                                    xtype: 'label',
                                    itemId: 'covAnaFileName',
                                    width: 290,
                                    margin: '0 0 0 120'
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
                }
            ]
        });

        me.callParent(arguments);
    }

});