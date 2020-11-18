/**
 * Created by Administrator on 2014/6/28.
 */
Ext.define('NavigationApp.store.ToolListStore', {
    extend: 'Ext.data.ArrayStore',
    requires: [
        'NavigationApp.model.ToolListModel'
    ],
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        var data = [
            ["OrbitDesignTool","卫星轨道交互设计工具","围绕科学目标，通过图形化、交互式手段快速构建目标轨道，并可根据用户需求即时修改。"],
            ["StructDesignTool","卫星结构与有效载荷布局工具","开展卫星结构与有效载荷布局设计研究，支持快速地形成卫星及有效载荷的安装布局。"],
            ["CoverAnalysisTool","有效载荷观测区分析工具","针对探测目标，进行覆盖范围仿真分析，并分析各项设计是否可以满足设立的科学目标，提供优化建议。"],
            ["DataTransAnalysisTool","卫星数据传输分析工具","开展卫星数据传输分析研究，支持科学数据下行满足度分析，为科学数据下行满足度分析提供决策依据。"],
            ["ArgumentionTaskTool","空间科学任务论证支持服务","支持6-10个科学家组协同论证，支持项目的用户管理、数据管理、流程管理和工具调用。"],
            ["MyTask","我的任务","查看用户所参与的论证任务和使用各种工具所创建的任务。"]
        ];
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'NavigationApp.model.ToolListModel',
            storeId: 'ToolListStore',
            sortInfo: {
                field    : 'name',
                direction: 'ASC'
            },
            data: data
        }, cfg)]);
    }
});