Ext.define('NavigationApp.view.ToolListPanel', {
    extend: 'Ext.panel.Panel',
    alias:'widget.toollistpanel',
    requires: [
        'Ext.data.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.button.Button',
        'Ext.ux.DataView.Animated',
        'Ext.XTemplate',
        'Ext.panel.Panel',
        'Ext.toolbar.*',
        'Ext.slider.Multi',
        'NavigationApp.view.ToolListView'
    ],
    height: 800,
    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'toollistview',
                    itemId: 'dataViewId'
                }
            ]
        });

        me.callParent(arguments);
    }

});
