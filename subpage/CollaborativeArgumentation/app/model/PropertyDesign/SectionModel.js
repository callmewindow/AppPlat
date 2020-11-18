/**
 * Created by winter on 2014/7/9.
 */

Ext.define('AppPlat.model.PropertyDesign.SectionModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id'   },
        { name: 'label' },//属性节的标题
        { name: 'name' }//属性节的名称，最终需要存储在配置文件中
    ],
    belongsTo:'AppPlat.model.PropertyDesign.PropertyModel',
    hasMany  : {model: 'AppPlat.model.PropertyDesign.ItemModel', name: 'itemModels'}
});