/**
 * Created by Administrator on 2014/6/24.
 */
Ext.define('TaskListApp.model.TaskModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields: [
        { name: 'taskId'},
        { name: 'taskName'},
        { name: 'startTime'},
        { name: 'simulationStartTime'},
        { name: 'simulationEndTime'},
        { name: 'description'},
        { name: 'creator'},
        { name: 'creatorAccount'},
        { name: 'processes',type:'Array'},
        { name: 'step'}
    ]
});
