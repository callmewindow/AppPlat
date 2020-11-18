/**
 * Created by Administrator on 2014/4/28.
 */
Ext.define('AppPlat.model.Accessibility.GroupMemberModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields:
        [
        {
            name: 'state',
            type: 'boolean'
        },
        {
            name: 'userName',
            type: 'string'
        }
    ]
});
