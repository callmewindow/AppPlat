/**
 * Created by winter on 2014/7/9.
 */
Ext.define('AppPlat.model.OrbitDesign.SimuParaModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.Ajax'
    ],
    fields: [
        { name: 'id'},//卫星节点id
        { name: 'simuStartTime'   },//仿真开始时间
        { name: 'simuEndTime' },//仿真结束时间
        { name: 'step' }//步长
    ]
});