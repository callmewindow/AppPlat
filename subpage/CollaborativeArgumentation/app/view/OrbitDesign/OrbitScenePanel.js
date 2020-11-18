/**
 * Created by Taivas on 5/4/14.
 */
Ext.define('AppPlat.view.OrbitDesign.OrbitScenePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.orbitscenepanel',
    html: '<div name="orbitdesigndiv" width="400" height="400" ></div>',
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});