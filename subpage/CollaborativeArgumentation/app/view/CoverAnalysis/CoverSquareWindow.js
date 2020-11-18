/**
 * Created by Administrator on 2014/7/4.
 */
Ext.define('AppPlat.view.CoverAnalysis.CoverSquareWindow', {
    alias: 'widget.coversquarewindow',
    extend: 'Ext.window.Window',
    requires: [
        'AppPlat.view.CoverAnalysis.CoverConfigPanel'
    ],

    height: 280,
    width: 326,
    title: '方形区域覆盖',
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
                    xtype:'label',
                    text:'按照顺时针方式输入方形区域四个顶点',
                    margin:'15 0 0 45'
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    defaultType:'textfield',
                    margin:'15 0 15 0',
                    items:[
                        {
                            fieldLabel:'经度',
                            labelWidth:40,
                            width:130,
                            itemId:'longitude1',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'纬度',
                            labelWidth:40,
                            width:130,
                            itemId:'latitude1',
                            padding:'0 0 0 15'
                        }
                    ]
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    defaultType:'textfield',
                    margin:'15 0 15 0',
                    items:[
                        {
                            fieldLabel:'经度',
                            labelWidth:40,
                            width:130,
                            itemId:'longitude2',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'纬度',
                            labelWidth:40,
                            width:130,
                            itemId:'latitude2',
                            padding:'0 0 0 15'
                        }
                    ]
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    defaultType:'textfield',
                    margin:'15 0 15 0',
                    items:[
                        {
                            fieldLabel:'经度',
                            labelWidth:40,
                            width:130,
                            itemId:'longitude3',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'纬度',
                            labelWidth:40,
                            width:130,
                            itemId:'latitude3',
                            padding:'0 0 0 15'
                        }
                    ]
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    defaultType:'textfield',
                    margin:'15 0 15 0',
                    items:[
                        {
                            fieldLabel:'经度',
                            labelWidth:40,
                            width:130,
                            itemId:'longitude4',
                            padding:'0 0 0 15'
                        },
                        {
                            fieldLabel:'纬度',
                            labelWidth:40,
                            width:130,
                            itemId:'latitude4',
                            padding:'0 0 0 15'
                        }
                    ]
                }
            ],
            buttons:[
                {
                    text:'保存',
                    itemId:'saveSquare',
                    width:40,
                    scope:this
                }
            ]
        });

        me.callParent(arguments);
    }

});