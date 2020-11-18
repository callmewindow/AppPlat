/**
 * Created by Administrator on 2014/6/28.
 */
// 此处为将store中定义的数据转为模型，以便view中的代码更规范的进行调用
Ext.define('NavigationApp.model.ToolListModel', {
    extend: 'Ext.data.Model',
    // model类型的定义
    requires: [
        'Ext.data.Field',
        'Ext.data.reader.Json'
    ],
    // model内部数据格式的定义，对应着ToolViewView中三个显示的字段
    fields: [
        'id',
        'name',
        'description'
    ]
});