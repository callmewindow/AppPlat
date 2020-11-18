/**
 * Created by Administrator on 2014/7/4.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverCircularWindow', {
    alias: 'widget.cvercircularwindow',
    extend: 'Ext.window.Window',
    requires: [
        'AppPlat.view.CoverAnalysis.CoverConfigPanel'
    ],

    height: 194,
    width: 180,
    title: '圆形区域覆盖',
    closeAction: 'hide',
    resizable: false,
    layout: {
        type: 'anchor',
        hideCollapseTool: true,
        animate: true
    },
    defaults: {
        anchor: '100%'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype:'container',
                    layout:'vbox',
                    defaultType:'textfield',
                    margin:'15 0 15 0',
                    items:[
                        {
                            fieldLabel:'经度',
                            labelWidth:40,
                            width:130,
                            itemId:'longitude',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'纬度',
                            labelWidth:40,
                            width:130,
                            itemId:'latitude',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'半径',
                            labelWidth:40,
                            width:130,
                            itemId:'radius',
                            padding:'0 0 0 15'
                        }
                    ]
                }
            ],
            buttons:[
                {
                    text:'保存',
                    itemId:'saveCircular',
                    width:40,
                    scope:this
                }
            ]
        });

        me.callParent(arguments);
    }

});