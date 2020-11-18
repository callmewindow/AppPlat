/**
 * Created by winter on 2014/8/23.
 */
Ext.define('DataTransAnalysisApp.view.Window.AntennaInfoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.antennainfowindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '任务列表',
    closeAction: 'hide',
    width:300,
    height:400,
    autoScroll : true,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            padding:'5 0 5 220',
            items: [
                {
                    aligin:'center',
                    text: '打 开',
                    itemId:'btnSureNewAntenna',
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
                    title: '请选择任务',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    collapsible: false,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'radiogroup',
                            // Arrange radio buttons into two columns, distributed vertically
                            columns: 1,
                            vertical: true,
                            itemId: "tasklist",
                            items: [
                                { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
                                { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true},
                                { boxLabel: 'Item 3', name: 'rb', inputValue: '3' },
                                { boxLabel: 'Item 4', name: 'rb', inputValue: '4' },
                                { boxLabel: 'Item 5', name: 'rb', inputValue: '5' },
                                { boxLabel: 'Item 6', name: 'rb', inputValue: '6' }
                            ]
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }

});