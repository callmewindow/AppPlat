Ext.define('MyTaskApp.view.MyTaskViewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'MyTaskApp.view.MyTaskPanel',
        'Ext.panel.Panel'
    ],

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'mytaskpanel',
                    itemId:'myTaskPanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});