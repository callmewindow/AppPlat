
/**
 * Created by winter on 2014/8/23.
 */
Ext.define('AppPlat.view.DataTransAnalysis.SelectGroundStationInfoPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.selectgroundstationinfopanel',
    requires: [
        'Ext.panel.Panel'
    ],
    width: 800,
    height:120,
    layout: 'hbox',
    bodyPadding: 5,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: '配置A',
                    style: 'font-size:20px',
                    height:80,
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    collapsible: false,
                    collapsed: false,
                    margin: '0 10 0 0',
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'param_sg',
                            labelPad: 10,
                            labelWidth: 90,
                            width: 250,
                            labelAlign: 'right',
                            labelSeparator: ' ',
                            displayField: 'name',
                            valueField: 'value',
                            editable: false,
                            padding: '0 10 0 0'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '配置B',
                    width: 700,
                    height:80,
                    layout: 'anchor',
                    autoScroll : true,
                    defaults: {
                        anchor: '100%',
                        labelWidth: 80,
                        labelAlign: 'center'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {   xtype: 'checkboxgroup',
                            itemId:'checkbox_list',
                            //fieldLabel: 'One Columns',
                            // Arrange checkboxes into two columns, distributed vertically
                            columns: 5,
                            vertical: true,
                            items: []
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }

});