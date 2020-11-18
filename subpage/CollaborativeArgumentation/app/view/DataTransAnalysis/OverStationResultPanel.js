/**
 * Created by Administrator on 2014/5/7.
 */
Ext.define('AppPlat.view.DataTransAnalysis.OverStationResultPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.overstationresultpanel',
    title: '输出结果',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                }
            ]
        });

        me.callParent(arguments);
    }
});