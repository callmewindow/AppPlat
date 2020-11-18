/**
 * Created by Administrator on 2014/7/7.
 */
Ext.define('MyTaskApp.store.PersonalTaskStore', {
    extend: 'Ext.data.ArrayStore',
    requires: [
        'MyTaskApp.model.PersonalTaskModel'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};

        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'MyTaskApp.model.PersonalTaskModel',
            storeId: 'personalTaskStore',
            sorters: [{
                sorterFn: function(o1, o2){
                    var getRank = function(o){
                            var name = o.get('taskType');
                            if (name == APC.PER_TASK_TYPE_ORBIT_DESIGN) {
                                return 1;
                            } else if (name == APC.PER_TASK_TYPE_STRUCTURE_DESIGN) {
                                return 2;
                            } else if (name == APC.PER_TASK_TYPE_COVER_ANALYSIS) {
                                return 3;
                            } else if (name == APC.PER_TASK_TYPE_DATATRANS_ANALYSIS) {
                                return 4;
                            }else if (name == APC.TASK_TYPE_COLLABORATIVE_ARGUMENT) {
                                return 5;
                            }
                        },
                        rank1 = getRank(o1),
                        rank2 = getRank(o2);

                    if (rank1 === rank2) {
                        return 0;
                    }

                    return rank1 < rank2 ? -1 : 1;
                }
            }],
            proxy:  {
                type: 'rest',
                format:'json',
                appendId:false,
                noCache:true,
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/getAllMyTask"
                },
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }

});