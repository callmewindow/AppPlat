/**
 * Created by Administrator on 2014/4/28.
 */
Ext.define('AppPlat.store.Accessibility.GroupMemberStore', {
    extend: 'Ext.data.Store',

    requires: [
        'AppPlat.model.Accessibility.GroupMemberModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'AppPlat.model.Accessibility.GroupMemberModel',
            storeId: 'GroupMemberStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/MemberState.json'
                },
                reader: {
                    type: 'json',
                    root: 'memberstate',
                    successProperty: 'success'
                }
            }
        }, cfg)]);
    }
});
