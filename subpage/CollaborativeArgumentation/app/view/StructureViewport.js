Ext.define('AppPlat.view.StructureViewport', {
    extend: 'Ext.container.Viewport',
    //使用requires进行动态加载
    requires: [
        'AppPlat.view.Accessibility.AccessibilitytabPanel',
        'AppPlat.view.AddedCenterPanel',
        'Ext.tab.Panel',
        'AppPlat.view.ButtonGroupPanel',
        'AppPlat.view.StructDesign.StructureScenePanelP',
        'AppPlat.view.OrbitDesign.OrbitScenePanel'
    ],
    layout: 'border',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'solutiontree',
                    itemId: 'treePanel',
                    region: 'west',
                    collapsible: true,
                    animCollapse: false,
                    resizable:false,
                    split:true
                },
                {
                    xtype: 'buttongrouppanel',
                    itemId: 'buttonGroupPanel',
                    region: 'north'
                },
                {
                    xtype: 'addedcenterpanel',
                    itemId: 'addedCenterPanel',
                    region: 'center'
                }

            ]
        });
        me.callParent(arguments);
    }
});