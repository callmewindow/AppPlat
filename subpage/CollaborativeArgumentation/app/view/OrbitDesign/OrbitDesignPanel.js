/**
 * Created by winter on 2014/4/26.
 */
Ext.define('AppPlat.view.OrbitDesign.OrbitDesignPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.orbitdesignpanel',
    requires: [
        'AppPlat.view.OrbitDesign.OrbitOperationToolbar',
        'AppPlat.view.OrbitDesign.OrbitScenePanel',
        'Ext.toolbar.Toolbar'
    ],
    layout: 'border',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
//                {
//                    xtype: 'orbitoperationtoolbar',
//                    itemId: 'orbitOperationToolbar',
//                    region: 'north'
//                },
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