/**
 * Created by Administrator on 2014/6/28.
 */

Ext.define('NavigationApp.controller.ToolListController', {
    extend: 'Ext.app.Controller',
    views:[
        'ToolListPanel'
    ],
    refs: [
        {
            ref: 'toolListPanel',
            selector: 'toollistpanel'
        }
    ],
    require:[
        'Ext.tab.*',
        'Ext.window.*',
        'Ext.tip.*',
        'Ext.layout.container.Border'
    ],
    init: function(application) {
        this.control({
//            "#dataViewId": {
//                itemclick: 'onSelectClick'
//            }
        });
    },
    onLaunch:function(application){
    }
//    onSelectClick: function(view, record, item, index, e, eOpts  ) {
//        if(record.get('id') == 'OrbitDesignTool'){
//            window.location.href="../../subpage/OrbitDesign/OrbitDesign.html";
//        }
//        else if(record.get('id') == 'StructDesignTool'){
//            window.location.href="../../subpage/StructDesign/StructDesign.html";
//        }
//        else if(record.get('id') == 'CoverAnalysisTool')
//            ;
//        else if(record.get('id') == 'DataTransAnalysisTool')
//            ;
//        else if(record.get('id') == 'ArgumentionTaskTool')
//            window.location.href="../../subpage/TaskList/TaskList.html";
//        else if(record.get('id') == "MyTask")
//            window.location.href="../../subpage/MyTask/MyTask.html";//这是直接在当前页跳转
//    }
});