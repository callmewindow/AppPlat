/**
 * Created by Administrator on 2014/8/25.
 */
Ext.define('CoverAnalysisApp.model.TaskNameListModel', {
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