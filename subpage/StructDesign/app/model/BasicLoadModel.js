/**
 * 修改 by 杜鹏宇 on 2014/08/23
 */
/*
 * File: app/model/InternalLoadModel.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('StructDesignApp.model.BasicLoadModel', {
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