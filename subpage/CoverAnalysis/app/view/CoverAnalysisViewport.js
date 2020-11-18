/**
 * 修改 by 杜鹏宇 on 2014/8/24
 */

Ext.define('CoverAnalysisApp.view.CoverAnalysisViewport', {
    extend: 'Ext.container.Viewport',
    alias:'widget.datatransanalysisviewport',
    //使用requires进行动态加载
    requires: [
        'Ext.tab.Panel',
        'CoverAnalysisApp.view.ButtonGroupPanel',
        'CoverAnalysisApp.view.DataTransAnalysisPanel',
        'CoverAnalysisApp.view.SolutionTree',
        'CoverAnalysisApp.view.OuterCenterPanel'
    ],

    layout: 'border',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'buttongrouppanel',
                    itemId: 'buttonGroupPanel',
                    region: 'north'
                },
                {
                    xtype:'outercenterpanel',
                    itemId:'outerCenterPanel',
                    region: 'center'
                },
                {
                    xtype:'solutiontree',
                    itemId:'solutionTree',
                    region: 'west'
                }

            ]
        });

        me.callParent(arguments);
    }

});