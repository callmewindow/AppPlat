
Ext.define('OrbitDesignApp.view.OrbitDesignViewPort', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.orbitdesignviewport',
    //使用requires进行动态加载
    requires: [
        'Ext.tab.Panel',
        'OrbitDesignApp.view.OrbitDesign.OrbitScenePanel',
        'OrbitDesignApp.view.OrbitDesign.OrbitDesignPanel'
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
                    resizable:false,
                    animCollapse: false,
                    split:true,
                    collapsed:true,
                    splitter: Ext.define("StructDesignApp.resizer.Splitter",{override:"Ext.resizer.Splitter",size:3})
//                    collapseMode: 'mini'
//                    preventHeader: true
                },
                {
                    xtype: 'orbitdesignpanel',
                    itemId:'orbitDesignPanel',
                    region: 'center'
                }

            ]
        });

        me.callParent(arguments);
    }

});