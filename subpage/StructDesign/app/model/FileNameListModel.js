/**
 * Created by winter on 2014/8/21.
 */

Ext.define('StructDesignApp.model.FileNameListModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'perTaskName',
            type: 'string'
        },
        {
            name: 'perTaskId',
            type: 'string'
        }
    ]
});