/**
 * Created by winter on 2014/4/26.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitDesignPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.orbitdesignpanel',
    requires: [
        'OrbitDesignApp.view.OrbitDesign.OrbitOperationToolbar',
        'OrbitDesignApp.view.OrbitDesign.OrbitScenePanel',
        'Ext.toolbar.Toolbar'
    ],
    layout: 'border',
    margin:'-1 1 0 0',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'orbitoperationtoolbar',
                    itemId: 'orbitOperationToolbar',
                    region: 'north'
                },
                {
                    xtype: 'orbitscenepanel',
                    itemId: 'orbitScenePanel',
                    region: 'center'
                }
            ]
        });

        me.callParent(arguments);
    }
});