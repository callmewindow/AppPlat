/**
 * Created by winter on 2014/9/5.
 */
/**
 * Created by winter on 2014/8/23.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.VisibilityWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.visibilitywindow',
    requires: [
        'Ext.panel.Panel'
    ],
    title: '选择可见性',
    closeAction:'hide',
    width:200,
    x:150,
    y:117,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            bodyPadding: 10,
            items: [
                {
                    xtype: 'fieldset',
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
                                    xtype: 'checkboxgroup',
                                    itemId: 'visibilityCheckboxGroup',
                                    width: 130,
                                    columns: 1,
                                    vertical: true,
                                    items: [
                                        {boxLabel: '行星轨迹', name: 'planet',itemId:'planetaryTrack',inputValue:'track'},
                                        {boxLabel: '行星坐标系', name: 'planet',itemId:'planetaryCoordinates',inputValue:'coordinates'}
                                    ]
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