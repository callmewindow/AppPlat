/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('StructDesignApp.view.ModulePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.modulepanel',

    requires: [
        'StructDesignApp.view.InternalLoadGridPanel',
        'StructDesignApp.view.PlatFormGridPanel',
        'StructDesignApp.view.ExternalLoadGridPanel',
        'StructDesignApp.view.BasicComponentGridPanel',
        'StructDesignApp.view.ExpansionGridPanel',
        'Ext.grid.Panel'
    ],

    width: 130,
    layout: 'accordion',
    collapsible: true,
    resizable:false,
    minWidth:10,
    maxWidth:130,
    animCollapse: true,
    split:true,
    splitter: Ext.define("StructDesignApp.resizer.Splitter",{override:"Ext.resizer.Splitter",size:3}),
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'basiccomponentgridpanel'
                },
                {
                    xtype: 'platformgridpanel'
                },
                {
                    xtype: 'internalloadgridpanel'
                },
                {
                    xtype: 'externalloadgridpanel'
                },
                {
                    xtype:'expansiongridpanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});