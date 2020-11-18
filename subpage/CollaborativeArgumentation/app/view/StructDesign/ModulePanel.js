/**
 * 修改 by 杜鹏宇 on 2014/07/10
 */

Ext.define('AppPlat.view.StructDesign.ModulePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.modulepanel',

    requires: [
        'AppPlat.view.StructDesign.BasicComponentGridPanel',
        'AppPlat.view.StructDesign.InternalLoadGridPanel',
        'AppPlat.view.StructDesign.PlatFormGridPanel',
        'AppPlat.view.StructDesign.ExternalLoadGridPanel',
        'AppPlat.view.StructDesign.ExpansionGridPanel',
        'Ext.grid.Panel'
    ],

    width: 130,

    layout: 'accordion',
    collapsible: true,
    animCollapse: true,
    split:true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'basiccomponentgridpanel'
                },
                {
                    xtype: 'internalloadgridpanel'
                },
                {
                    xtype: 'platformgridpanel'
                },
                {
                    xtype: 'externalloadgridpanel'
                },
                {
                    xtype: 'expansiongridpanel'
                }
            ]
        });

        me.callParent(arguments);
    }

});