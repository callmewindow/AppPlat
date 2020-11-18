/**
 * Created by winter on 2014/7/9.
 */

Ext.define('AppPlat.model.PropertyDesign.ItemModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id'   },
        { name: 'label' },//界面中显示的属性标签名称
        { name: 'name' },//这个属性的名称，最终需要存储在配置文件中
        { name: 'value'},//该属性的值
        { name: 'valueType'},
        { name: 'dirty', type:'boolean'}//该属性是否已经被修改
    ]
});