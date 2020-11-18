/**
 * Created by winter on 2014/9/19.
 */
Ext.define('DataTransAnalysisApp.model.SchedulerEventModel', {
    //表示在日程表中的一个事件
    extend : 'Sch.model.Event',
    // Reuse the resource id for CSS styling
    clsField : 'ResourceId',//根据ResourceId字段确定该model的css类
    fields : [
        {name: 'Title'}
    ]
});