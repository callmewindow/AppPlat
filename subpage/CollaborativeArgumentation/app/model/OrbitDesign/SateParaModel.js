/**
 * Created by winter on 2014/7/9.
 */
Ext.define('AppPlat.model.OrbitDesign.SateParaModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.Ajax'
    ],
    fields: [
        { name: 'id'},//姿态参数id
        { name: 'yawAngle'   },//偏航角
        { name: 'rollAngle' },//滚转角
        { name: 'pitchAngle' }//俯仰角
    ]
});