/**
 * Created by Administrator on 2014/7/2.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverResultPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.coverresultpanel',
    requires: [
    ],
    layout: 'fit',
    title: '覆盖分析结果',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
            ]
        });
        me.callParent(arguments);
    }

});