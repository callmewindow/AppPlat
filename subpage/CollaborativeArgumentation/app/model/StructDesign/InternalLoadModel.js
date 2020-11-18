Ext.define('AppPlat.model.StructDesign.InternalLoadModel', {
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