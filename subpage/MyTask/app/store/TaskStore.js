/**
 * Created by Administrator on 2014/7/6.
 */
Ext.define('MyTaskApp.store.TaskStore', {
    extend: 'Ext.data.Store',
    requires: [
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
//        var data = [
//            {"id":"1","name":"论证任务一","startTime":"2014.01.09 14:56:32","lastTime":"2014-02-04 05:23:31","creator":"张三","number":2,"orbitDesign":'lightoff',"structDesign":'lightopen',"coverAnalysis":'lightopen',"dataTransAnalysis":'lightopen'}
////            {"id":"2","name":"论证任务一","startTime":"2014.01.09 20:12:30","lastTime":"2014.02.02 10:50:30","creator":"李四","number":3,"state":"1222"},
////            {"id":"3","name":"论证任务一","startTime":"2014.01.09 20:12:30","lastTime":"2014.02.02 10:50:30","creator":"赵五","number":4,"state":"2121"},
////            {"id":"4","name":"论证任务一","startTime":"2014.01.09 20:12:30","lastTime":"2014.02.02 10:50:30","creator":"赵五","number":4,"state":"1221"},
////            {"id":"5","name":"论证任务一","startTime":"2014.01.09 20:12:30","lastTime":"2014.02.02 10:50:30","creator":"赵五","number":4,"state":"2111"}
//        ];
        me.callParent([Ext.apply({
            autoLoad: false,
            storeId: 'taskStore',
            fields:['taskId','taskName','startTime','creatorName','menberNumber',"recentlyModified","orbitDesign","structDesign","coverAnalysis","dataTransAnalysis"],
            proxy:  {
                type: 'rest',
                format:'json',
                appendId:false,
                noCache:true,
                api: {
                    read:APC.APPPLAT_SERVICE_URL_PREFIX+"TaskManage/getAllMyColTask"
                },
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});