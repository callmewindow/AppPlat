/**
 * Created by acm-windows on 2014/5/18.
 */
Ext.define('CloudClient.view.MainViewport', {
    extend: 'Ext.container.Viewport',
    //使用requires进行动态加载
    requires: [
        'CloudClient.view.PermissionManagerPanel',
        'CloudClient.view.AccessStatisicPanel',
        'CloudClient.view.UserVerificationPanel',
        'CloudClient.view.DigitalSignaturesPanel',
        'CloudClient.view.CloudStoreOperatePanel'
    ],
    layout: 'column',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'accessstatisicpanel',
                    itemId: 'acccessibilityTabPanel'
//                    region: 'east',
//                    split:true,
//                    collapseMode: 'mini',
//                    preventHeader: true
                },
                {
                    xtype: 'userverificationpanel',
                    itemId: 'userverificationpanel'
                   // region: 'north'
                },
                {
                    xtype: 'digitalsignaturespanel',
                    itemId: 'digitalsignaturespanel'
                    //region: 'center'
                },
                {
                    xtype: 'permissionmanagerpanel',
                    itemId: 'permissionmanagerpanel'
                    //region: 'center'
                },
                {
                    xtype: 'cloudstoreoperatepanel',
                    itemId: 'cloudstoreoperatepanel'
                    //region: 'center'
                }

            ]
        });

        me.callParent(arguments);
    }

});
