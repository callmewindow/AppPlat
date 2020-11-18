/**
 * Created by winter on 2014/6/13.
 */
Ext.define('TaskListApp.store.EditTaskStore',{
    extends:'Ext.data.Store',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model:'TaskListApp.model.EditTaskModel'
        }, cfg)]);
    }
});
