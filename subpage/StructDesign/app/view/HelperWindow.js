/**
 * 修改 by 杜鹏宇 on 2014/8/25
 */

var navigate = function(panel, direction){
    var layout = panel.getLayout();
    layout[direction]();
    Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
    Ext.getCmp('move-next').setDisabled(!layout.getNext());
};
Ext.define('StructDesignApp.view.HelperWindow', {
    alias: 'widget.helperwindow',
    extend: 'Ext.window.Window',
    requires: [
        'Ext.panel.Panel',
        'Ext.form.field.Number'
    ],
    height: 110,
    width: 400,
    title: '结构设计助手',
    closeAction: 'hide',
    resizable: false,
    layout:'card',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
            {
                id: 'move-prev',
                text: '上一步',
                handler: function(btn) {
                    navigate(btn.up("panel"), "prev");
                },
                disabled: true
            },
            '->',
            {
                id: 'move-next',
                text: '下一步',
                handler: function(btn) {
                    navigate(btn.up("panel"), "next");
                }
            }
        ]
    }],

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '通过本助手您可以知道创建一个卫星的基本步骤。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(1/10)展开右侧“平台”组件列表，双击任意平台，将其加入场景。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(2/10)单击“属性板”，在展开的面板中修改参数，或直接拖动控制轴，以改变组件。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(3/10)同样，展开“内部载荷”、“外部载荷”组件列表，可添加相应组件。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(4/10)单击“平移”、“旋转”、“缩放”按钮，可切换相应控制轴。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(5/10)单击“对齐”按钮，可将选中的多个组件按轴对齐。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(6/10)单击“组合”、“分离”按钮，可将选中的多个组件组合成一个整体或将一个整体分离。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(7/10)单击“吸附”按钮，可将两个组件的两个面吸附到一起。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(8/10)单击“选框”按钮，或者按住CTRL键，都是选中多个组件的办法。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(9/10)单击“复制”、“删除”按钮，可复制或删除选中的组件。'
                },
                {
                    margin: '5 5 5 5',
                    xtype: 'component',
                    html: '(10/10)结合以上操作，便能设计您的卫星了。'
                }
            ]
        });

        me.callParent(arguments);
    }
});