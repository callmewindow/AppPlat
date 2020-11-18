/**
 * Created by winter on 2014/7/9.
 */
Ext.define('OrbitDesignApp.model.OrbitDesign.OrbitParaModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.Ajax'
    ],
    fields: [
        { name: 'id'},//轨道参数节点id
        { name: 'halfLengthShaft'   },//半长轴
        { name: 'eccentricity' },//偏心率
        { name: 'orbitInclination' },//轨道倾角
        { name: 'RAAN'},//升交点赤经
        { name: 'paiapsiiArgument'},//近地点幅角
        { name: 'trueAnomaly'}//真近点角
    ]
});