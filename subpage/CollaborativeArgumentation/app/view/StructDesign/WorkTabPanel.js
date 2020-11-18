/**
 * 修改 by 杜鹏宇 on 2014/07/10
 */

/*
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('AppPlat.view.StructDesign.WorkTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.worktabpanel',

    requires: [
        'AppPlat.view.StructDesign.StructureOperationToolbar',
        'AppPlat.view.StructDesign.StructureScenePanelP',
        'AppPlat.view.StructDesign.StructureScenePanelC',
        'Ext.panel.Panel',
        'Ext.tab.Tab'
    ],

    width: 400,
    activeTab: 0,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
//                    xtype: 'panel',
//                    layout: 'border',
//                    title: '个人区',
//                    itemId:'personalArea',
//                    items: [
////                        {
////                            xtype: 'structureoperationtoolbar',
////                            region: 'north'
////                        },
//                        {
//                            xtype: 'structurescenepanelp',
//                            region: 'center'
//                        }
//                        ,
//                        {
//                            xtype: 'storagepanelp',
//                            region: 'south',
//                            collapseMode: 'mini',
//                            preventHeader: true
//                        }
//                    ]
//                },
//                {
//                    xtype: 'panel',
//                    layout: 'border',
//                    itemId:'collaborativeArea',
//                    title: '协同区',
//                    items: [
////                        {
////                            xtype: 'structureoperationtoolbar',
////                            region: 'north'
////                        },
//                        {
//                            xtype: 'structurescenepanelc',
//                            region: 'center'
//                        }
//                        ,
//                        {
//                            xtype: 'storagepanelc',
//                            region: 'south',
//                            collapseMode: 'mini',
//                            preventHeader: true
//                        }
//
//                    ]
//                }

            ]
        });

        me.callParent(arguments);
    }

});