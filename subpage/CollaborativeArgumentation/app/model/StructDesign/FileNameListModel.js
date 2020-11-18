Ext.define('AppPlat.model.StructDesign.FileNameListModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'name',
            type: 'string'
        }
    ]
});