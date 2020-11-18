
Ext.define('AppPlat.view.StructDesign.StructureScenePanelC', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.structurescenepanelc',

    itemId: 'structureScenePanelC',
    html: '<div id="structDesignC"></div>',
    initComponent: function() {
        var me = this;
        //场景初始化
        me.callParent(arguments);
    },
    listeners: {
        resize: {
            fn: function(el,width,height) {
                var container = document.getElementById('structDesignC');
                container.height=height;
                container.width=width;
            }
        }
    }
});