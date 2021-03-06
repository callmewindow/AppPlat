/**
 * Created by winter on 2014/9/19.
 */
Ext.define('DataTransAnalysisApp.store.SchedulerEventStore',{
    extend:'Sch.data.EventStore',
    requires:[
        'DataTransAnalysisApp.model.SchedulerEventModel'
    ],
    autoLoad:false,
    model : 'DataTransAnalysisApp.model.SchedulerEventModel',
    // proxy : {
    //     type : 'ajax',
    //     url : '../../resources/data/SchedulerTime.json'
    // }
    proxy : {
        type : 'ajax',
        timeout: 2000000,
        extraParams:{
            //jsonstr:'[{"ResourceId":"satellite0","satellite":"SatelliteSA1","groundstation":"GSTATION"},{"ResourceId":"satellite1","satellite":"SatelliteSA2","groundstation":"GSTATION"},{"ResourceId":"satellite2","satellite":"SatelliteSC1","groundstation":"GSTATION"},{"ResourceId":"satellite3","satellite":"SatelliteSC2","groundstation":"GSTATION"}]' 
            jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
            filepath:"S:\\Users\\xpzsoft\\Desktop\\coverjson\\data\\"
        },
        url : APC.APPPLAT_SERVICE_URL_PREFIX+"DataTransAnalysisManage/coverCompute.json"
    }
    // proxy: {
    //     type: 'rest',
    //     format:'json',

    //     api: {
    //         read:APC.APPPLAT_SERVICE_URL_PREFIX+"DataTransAnalysisManage/coverCompute"
    //     },
    //     reader: {
    //         type: 'json',
    //         root: 'externalload'
    //     }
    // }
})