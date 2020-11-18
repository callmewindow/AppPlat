
/**
 * Created by winter on 2014/8/23.
 */
Ext.define('CoverAnalysisApp.view.Window.SelectGroundStationInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.selectgroundstationinfowindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '选择卫星/地面站',
    closeAction: 'hide',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 250',
            items: [
                {
                    text: '确  定',
                    itemId:'btnSureSelect',
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
                    title: '配置A',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'param_sg',
                            fieldLabel: '卫星/地面站',
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
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 100,
                        labelAlign: 'center'
                    },
                    collapsible: false,
                    collapsed: false,
                    width: 320,
                    items: [
                        {   xtype: 'checkboxgroup',
                            itemId:'checkbox_list',
                            //fieldLabel: 'One Columns',
                            // Arrange checkboxes into two columns, distributed vertically
                            columns: 2,
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