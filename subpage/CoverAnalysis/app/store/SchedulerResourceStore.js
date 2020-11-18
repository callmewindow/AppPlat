/**
 * Created by winter on 2014/9/19.
 */
Ext.define('CoverAnalysisApp.store.SchedulerResourceStore',{
    extend:'Sch.data.ResourceStore',
    requires:[
        'Sch.model.Resource'
    ],
    autoLoad:false,
    model : 'Sch.model.Resource',
    proxy: {
         type: 'rest',
         format:'json',
         api: {
             read:APC.APPPLAT_SERVICE_URL_PREFIX+"CoverAnalysisManage/tansferSchedulViewTable"
         },
         reader: {
             type: 'json',
             root: 'externalload'
         }
    }
})