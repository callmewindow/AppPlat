/**
 * Created by winter on 2014/5/7.
 */
Ext.define('AppPlat.view.AddedCenterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.addedcenterpanel',

    requires: [
        'AppPlat.view.TaskInfoPanel',
        'AppPlat.view.OuterCenterPanel',
        'Ext.panel.Panel'
    ],
    layout: 'fit',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype:'outercenterpanel',
                    region:'fit'
                }
            ]
        });

        me.callParent(arguments);
    }

});