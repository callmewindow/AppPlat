/**
 * Created by winter on 2014/7/9.
 */
Ext.define('AppPlat.model.PropertyDesign.PropertyModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id'   },//该配件或者节点对应的ID
        { name: 'label'},//所存储的属性配置文件的显示名称
        { name: 'name' }//所存储额属性配置文件的名称,存储的值为节点的类型
    ],
    hasMany  : {model: 'AppPlat.model.PropertyDesign.SectionModel', name: 'sectionModels'}
});