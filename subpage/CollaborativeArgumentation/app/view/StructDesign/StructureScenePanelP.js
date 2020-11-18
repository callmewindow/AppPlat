/**
 * 修改 by 杜鹏宇 on 2014/07/10
 */

Ext.define('AppPlat.view.StructDesign.StructureScenePanelP', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.structurescenepanelp',

    itemId: 'structureScenePanelP',
    html: '<div id="structDesignP"></div>',
    initComponent: function() {
        var me = this;
        //场景初始化
        me.callParent(arguments);
    },
    listeners: {
        resize: {
            fn: function(el,width,height) {
                var container = document.getElementById('structDesignP');
                container.height=height;
                container.width=width;
            }
        }
    }
});