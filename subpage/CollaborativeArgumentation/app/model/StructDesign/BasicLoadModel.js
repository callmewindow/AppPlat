Ext.define('AppPlat.model.StructDesign.BasicLoadModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields: [
        {
            name: 'name',
            type: 'string'
        }
    ]
});