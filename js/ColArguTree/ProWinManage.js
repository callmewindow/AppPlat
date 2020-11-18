/**
 * Created by winter on 2014/7/15.
 */
var ProWinManage = function(){

    /*
     *为属性面板创建NumberField域，
      *  fieldLabel 标签名称，  itemId NumberField域的itemId， value 域初始值，  maxValue 域最大值，minValue 域最小值
      *  step 每次增大和减小的步长
     */
    this.createNumFieldItem = function (fieldLabel,itemId,value,maxValue,minValue,step){
        var item =
        {
            itemId:itemId,
            xtype: 'numberfield',
            fieldLabel: fieldLabel,
            value: value,
            maxValue: maxValue,
            minValue:minValue,
            step:step,
            labelAlign: 'right',
            labelPad: 10,
            margin: '5 0 5 0',
            width: 250,
            labelSeparator: ' '
        };
        return item;
    },
    /**
     * 创建一个属性段
     * sectionTitle 属性段的标题，没有的话为空，itemArray是属性item的数组
     */
    this.createSection = function(sectionTitle,itemArray) {
        var sections = {  items: [
            {
                xtype: 'fieldset',
                title:'',
                layout: 'anchor',
                margin: '5 10 5 10',
                defaults: {
                    anchor: '100%'
                },
                items:itemArray
            }
        ]
        }
        return sections;
    }
//    this.createProWin = function(proTitle) {
//        var title = {
//                title:proTitle
//        }
//        return title;
//    },
    /**
     * 创建一个ItemModel（一个属性所需要的数据），需要itemId，labelName（显示出来的标签），value
     */
    this.createItemModel = function(itemId,label,value) {
        var item =Ext.create('AppPlat.model.PropertyDesign.ItemModel');
        item.set('label',label);
        item.set('id',itemId);
        item.set('value',value);//此处需要修改，绑定场景中的值
        return item;
    },
    /**
     * 创建一个SectionModel(一个属性段所需要的数据)，需要label和item数组
     */
    this.createSectionModel =  function(label,itemArray) {
        var section = Ext.create('AppPlat.model.PropertyDesign.SectionModel');
        section.set('itemModels',itemArray);
        section.set('label',label);
        return section;
    },
    /**
     * 创建一个Propertymodel(一个属性面板所需要的数据，需要lable和字段数组)
     */
    this.createPropertyModel = function(label,sectionArray) {
        var property = Ext.create('AppPlat.model.PropertyDesign.PropertyModel');
        property.set('sectionModels',sectionArray);
        property.set('label',label);
        return property;
    },
    this.onParaaNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null && newValue <= ORBIT.max['a'] && newValue >= ORBIT.min['a']){
            onSateOrbitChange('sate', 'a', newValue/1000);
        }
    },

    this.onParaeNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null && newValue <= ORBIT.max['e'] && newValue >= ORBIT.min['e']){
            onSateOrbitChange('sate', 'e', newValue);
        }
    },
    this.onParaiNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null && newValue <= ORBIT.max['i'] && newValue >= ORBIT.min['i']){
            onSateOrbitChange('sate', 'i', newValue/180*Math.PI);
        }
    },
    this.onParaOmNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null && newValue <= ORBIT.max['Om'] && newValue >= ORBIT.min['Om']){
            onSateOrbitChange('sate', 'Om', newValue/180*Math.PI);
        }
    },
    this.onParaomNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null && newValue <= ORBIT.max['om'] && newValue >= ORBIT.min['om']){
            onSateOrbitChange('sate', 'om', newValue/180*Math.PI );
        }
    },
    this.onParathetaNFieldChg = function(field, newValue, oldValue, eOpts){
        if(newValue != null){
            onSateOrbitChange('sate', 'theta', newValue/180*Math.PI);
        }
    }
}