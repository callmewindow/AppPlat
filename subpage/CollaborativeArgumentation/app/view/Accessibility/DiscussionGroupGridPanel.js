/**
 * Created by Administrator on 2014/4/27.
 */
Ext.define('AppPlat.view.Accessibility.DiscussionGroupGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.discussiongroupgridpanel',

    requires: [
       // 'AppPlat.store.Accessibility.GroupMemberStore',
        'Ext.grid.column.Column'
    ],

    itemId: 'disscussiongridepanel',
    height: 150,
    width: 150,
    title: '讨论群组',
    scroll: 'both',
    store: 'Accessibility.GroupMemberStore',
    hideHeaders:true,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'gridcolumn',
                   // header: '头像',
                    hideHeaders:true,
                    //text: 'headPortrait',
                    width: 63,
                    renderer:getIcon,
                    dataIndex: 'state'
                },
                {
                   // xtype: 'gridcolumn',
                    header: '用户',
                   // text: 'userName',
                    width: 63,
                    dataIndex: 'userName'
                }
            ]
            //renderTo: Ext.getBody()
        });
        me.callParent(arguments);
    }

});
function getIcon(val) {
    if(val==true)
        return  '<img src="../../libs/ext/shared/icons/fam/user.png">';
    else
        return  '<img src="../../libs/ext/shared/icons/fam/leaveuser.png">';
};