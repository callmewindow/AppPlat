/**
 * Created by Administrator on 2014/8/27.
 */
Ext.define('MyTaskApp.model.PersonalTaskModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields: [
        { name: 'perTaskId'},
        { name: 'perTaskName'},
        { name: 'taskType'},
        { name: 'recentlyModified'},
        { name: 'isSaved'},
        { name: 'userId'},
        { name: 'taskDirPath'}
    ]
});
