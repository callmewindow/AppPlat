/**
 * 修改 by 杜鹏宇 on 2014/07/10
 */

Ext.define('AppPlat.view.StructDesign.StructureOperationToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.structureoperationtoolbar',

    initComponent: function() {
        var me = this;
        Ext.apply(this,{
           items:[
//               {
//                   itemId:'btnMode',
//                   text:'模式',
//                   xtype: 'button',
//                   menu: {
//                       items: [
//                           {
//                               itemId:'btnViewMode',
//                               text:'观察'
//                           },
//                           {
//                               itemId: 'btnControlMode',
//                               text:'控制'
//                           },
//                           {
//                               itemId: 'btnInitview',
//                               text:'恢复初始视角'
//                           }
//                       ]
//                   }
//               },
               {
                   itemId:'btnViewMode',
                   xtype: 'button',
                   iconCls:'Eye',
                   margin:'0, 7, 0, 0'
               },
               {
                   itemId:'btnAdvancedPanel',
                   xtype: 'button',
                   iconCls:'Controlleradd',
                   margin:'0, 7, 0, 0'
               },
               {
                   itemId:'btnInitview',
                   xtype: 'button',
                   iconCls:'Arrowrefresh',
                   margin:'0, 7, 0, 0'
               },
               {
                   itemId:'btnSelectBox',
                   xtype: 'button',
                   iconCls:'Bulletshape',
                   margin:'0, 7, 0, 0'
               },
               '-',
//               {
//                   itemId:'btnControl',
//                   text:'控制',
//                   xtype: 'button',
//                   menu: {
//                       items: [
//                           {
//                               itemId: 'btnNot',
//                               text:'无'
//                           },
//                           {
//                               itemId: 'btnTranslate',
//                               text:'位移'
//                           },
//                           {
//                               itemId: 'btnRotate',
//                               text:'旋转'
//                           },
//                           {
//                               itemId: 'btnScale',
//                               text:'缩放'
//                           }
//                       ]
//                   }
//               },
               {
                   itemId:'btnSelect',
                   xtype: 'button',
                   iconCls:'Asteriskorange',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnTranslate',
                   xtype: 'button',
                   iconCls:'Arrownsew',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnRotate',
                   xtype: 'button',
                   iconCls:'Arrowrotateclockwise',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnScale',
                   xtype: 'button',
                   iconCls:'Arrowoutlonger',
                   margin:'0, 7, 0, 0'
               },
               '-',
//               {
//                   itemId:'btnAlign',
//                   text:'排列',
//                   xtype: 'button',
//                   menu: {
//                       items: [
//                           {
//                               itemId: 'btnAlignmentX',
//                               text:'X轴对齐'
//                           },
//                           {
//                               itemId: 'btnAlignmentY',
//                               text:'Y轴对齐'
//                           },
//                           {
//                               itemId: 'btnAlignmentZ',
//                               text:'Z轴对齐'
//                           }
//                       ]
//                   }
//               },
               {
                   itemId:'btnAlignmentX',
                   xtype: 'button',
                   text:'X',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnAlignmentY',
                   xtype: 'button',
                   text:'Y',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnAlignmentZ',
                   xtype: 'button',
                   text:'Z',
                   margin:'0, 7, 0, 0'
               },
               '-',
//               {
//                   itemId:'btnAssembled',
//                   text:'组装',
//                   xtype: 'button',
//                   menu: {
//                       items: [
//                           {
//                               itemId: 'btnCombine',
//                               text:'组合'
//                           },
//                           {
//                               itemId: 'btnSeparate',
//                               text:'分离'
//                           },
//                           {
//                               itemId: 'btnAssembly',
//                               text:'装配'
//                           }
//                       ]
//                   }
//               }
               {
                   itemId:'btnCombine',
                   xtype: 'button',
                   iconCls:'Link',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnSeparate',
                   xtype: 'button',
                   iconCls:'Linkbreak',
                   margin:'0, 2, 0, 0'
               },
               {
                   itemId:'btnAssembly',
                   xtype: 'button',
                   iconCls:'Disconnect',
                   margin:'0, 7, 0, 0'
               },
               '-',
               {
                   itemId:'btnCopy',
                   xtype: 'button',
                   iconCls:'Pagecopy',
                   margin:'0, 7, 0, 0'
               },
               {
                   itemId:'btnDelete',
                   xtype: 'button',
                   iconCls:'Bulletcross',
                   margin:'0, 2, 0, 0'
               }
           ]
       })

        me.callParent(arguments);
    }
});
