/**
 * Created by winter on 2014/8/23.
 */
Ext.define('AppPlat.view.CoverAnalysis.SkyRegionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.skyregionwindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '天区区域目标属性',
    closeAction: 'hide',
    width:300,
    height:280,
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
                    itemId: 'btnSureFixSkyRegion',
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
                    title: '天区区域目标名称',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'label',
                            itemId: 'skyRegionName',
                            width: 250,
                            margin: '0 0 0 80'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '天区区域目标参数',
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
                                    itemId: 'ascensionr',
                                    fieldLabel: '赤经',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0,
                                    labelAlign: 'center',
                                    labelPad: 10,
                                    labelWidth: 60,
                                    width: 250,
                                    labelSeparator: ' ',
                                    decimalPrecision:10
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'declinationr',
                                    fieldLabel: '赤纬',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'center',
                                    labelPad: 10,
                                    labelWidth: 60,
                                    width: 250,
                                    labelSeparator: ' ',
                                    decimalPrecision:10
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'regionr',
                                    fieldLabel: '半径',
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                    value: 0.0,
                                    labelAlign: 'center',
                                    labelPad: 10,
                                    labelWidth: 60,
                                    width: 250,
                                    labelSeparator: ' ',
                                    decimalPrecision:10
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