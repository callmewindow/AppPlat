/**
 * Created by Administrator on 2014/6/28.
 */
Ext.define('NavigationApp.model.ToolListModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields: [
        'id',
        'name',
        'description'
    ]
});