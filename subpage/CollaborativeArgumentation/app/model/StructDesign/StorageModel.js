/**
 * Created by 杜鹏宇 on 2014/7/6.
 */

Ext.define('AppPlat.model.StructDesign.StorageModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],

    fields: [
        'name',
        'data'
    ]
});