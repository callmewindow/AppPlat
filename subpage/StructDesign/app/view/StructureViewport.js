/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.StructureViewport', {
    extend: 'Ext.container.Viewport',
    alias:'widget.structureviewport',
    //使用requires进行动态加载
    requires: [
        'Ext.tab.Panel',
        'StructDesignApp.view.ButtonGroupPanel',
        'StructDesignApp.view.StructDesignPanel'
    ],

    layout: 'border',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'buttongrouppanel',
                    itemId: 'buttonGroupPanel',
                    region: 'north'
                },
                {
                    xtype:'structdesignpanel',
                    itemId:'structDesignPanel',
                    region: 'center'
                }

            ]
        });

        me.callParent(arguments);
    }

});