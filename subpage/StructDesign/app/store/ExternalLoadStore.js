/**
 * 修改 by 杜鹏宇 on 2014/08/23
 */
/*
 * File: app/store/ExternalLoadStore.js
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

Ext.define('StructDesignApp.store.ExternalLoadStore', {
    extend: 'Ext.data.Store',

    requires: [
        'StructDesignApp.model.ExternalLoadModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'StructDesignApp.model.ExternalLoadModel',
            storeId: 'ExternalLoadStore',
            proxy: {
                type: 'ajax',
                api: {
                    read: '../../resources/data/ExternalLoad.json'
                },
                reader: {
                    type: 'json',
                    root: 'externalload'
                }
            }
        }, cfg)]);
    }
});