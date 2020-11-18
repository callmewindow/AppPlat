/**
 * Created by Taivas on 5/4/14.
 */
Ext.define('OrbitDesignApp.view.OrbitDesign.OrbitScenePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.orbitscenepanel',
    html: '<div id="orbitdesigndiv" ></div>',
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});