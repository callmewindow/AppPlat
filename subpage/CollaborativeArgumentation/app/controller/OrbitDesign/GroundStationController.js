/**
 * Created by winter on 2014/12/25.
 */
/**
 * Created by Taivas on 5/6/14.
 */
Ext.define('AppPlat.controller.OrbitDesign.GroundStationController', {
    extend: 'Ext.app.Controller',
    views:[
        'OrbitDesign.SimuParaWindow'
    ],
    refs: [
        {
            ref: 'groundStationInfoWindow',
            selector: 'groundstationinfowindow'
        },
        {
            ref: 'skyPointWindow',
            selector: 'skypointwindow'
        },
        {
            ref: 'skyRegionWindow',
            selector: 'skyregionwindow'
        },
        {
            ref: 'sensorWindow',
            selector: 'sensorwindow'
        }
    ],
    groundStationParentPath:null,//记录当前打开地面站节点的父路径
    groundStationFileName:null,//记录当前打开地面站节点文件的名称
    skyPointParentPath:null,
    skyPointFileName:null,
    skyReginParentPath:null,
    skyReginFileName:null,
    sensorParentPath:null,
    sensorFileName:null,
    sensorobj:null,//存放显示在面板上的传感器对象

    init: function(application) {
        this.control({
            '#btnSureNewGroundStation':{
                click:this.saveGroundStationFileByPath
            },
            '#btnSureFixSkyPoint':{
                click:this.saveScPointFileByPath
            },
            '#btnSureFixSkyRegion':{
                click:this.saveScReginFileByPath
            },
            '#btnSureFixSensor':{
                click:this.saveSensorFileByPath
            }
        });
    },
    onLaunch: function(application) {
    },
    //初始化地面站文件
    initGroundStationFileByPath:function(parentPath,fileName){
        var groundStationData = new Object();
        groundStationData.type = "groundstation";
        groundStationData.longitude = 0.0;
        groundStationData.latitude = 2.859956;
        groundStationData.height = 0.0;
        groundStationData.minAngle = 5.0;
        groundStationData.groundGT = 0.0;
        AnalysisManagement.prototype.saveFileByPath(parentPath,fileName,JSON.stringify(groundStationData));
    },
    //初始化传感器文件
    initSensorFileByPath:function(parentPath,fileName, text, id){
        var t_start = new Date("7 15,2012 04:00:00");
        var t_stop = new Date("7 16,2012 05:00:00");
        var item = new Object();
        item.name = text;
        item.type = "sensor";
        item.startTime = t_start;
        item.endTime = t_stop;
        item.azimuth = Math.PI;
        item.elevation = 0;
        item.openangle = 45;
        item.bh = 60;
        item.parentID = id;
        AnalysisManagement.prototype.saveFileByPath(parentPath,fileName,JSON.stringify(item));
    },
    //初始化天区点覆盖文件
    initSkyCoverPointFileByPath:function(parentPath,fileName, name){
        var item = new Object();
        item.name = name;
        item.type = "skypoint";
        item.ascension = -105;
        item.declination = 0;
        AnalysisManagement.prototype.saveFileByPath(parentPath,fileName,JSON.stringify(item));
    },
    //初始化天区区域覆盖文件
    initSkyCoverReginFileByPath:function(parentPath,fileName, name){
        var item = new Object();
        item.name = name;
        item.type = "skyregion";
        item.ascension = -105;
        item.declination = 0;
        item.R = 10;
        AnalysisManagement.prototype.saveFileByPath(parentPath,fileName,JSON.stringify(item));
    },
    //创建地面站属性窗口，去后台取数据
    getGsPropertyWindow:function(groundStationNode){
        var groundStationInfoWindow = Ext.create('AppPlat.view.OrbitDesign.GroundStationInfoWindow');
        var me = this;
        me.groundStationParentPath = groundStationNode.get('nodeFilePath');
        me.groundStationFileName = groundStationNode.get('id') + '.json';
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: me.groundStationParentPath+'/'+ me.groundStationFileName
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.updateGsWindowByData(data);
            },
            failure: function () {
            }
        });
    },
    //根据从后台读取的值改变属性面板的值
    updateGsWindowByData:function(data){
        this.getGroundStationInfoWindow().queryById("longitude").setValue(data.longitude);
        this.getGroundStationInfoWindow().queryById("latitude").setValue(data.latitude);
        this.getGroundStationInfoWindow().queryById("height").setValue(data.height);
        this.getGroundStationInfoWindow().queryById("minAngle").setValue(data.minAngle);
        this.getGroundStationInfoWindow().queryById("groundGT").setValue( data.groundGT);
        this.getGroundStationInfoWindow().show();
    },
    //保存属性面板上的值
    saveGroundStationFileByPath:function(button, e, eOpts){
        var groundStationData = new Object();
        groundStationData.type = "groundstation";
        groundStationData.longitude = this.getGroundStationInfoWindow().queryById("longitude").getValue();
        groundStationData.latitude = this.getGroundStationInfoWindow().queryById("latitude").getValue();
        groundStationData.height = this.getGroundStationInfoWindow().queryById("height").getValue();
        groundStationData.minAngle = this.getGroundStationInfoWindow().queryById("minAngle").getValue();
        groundStationData.groundGT = this.getGroundStationInfoWindow().queryById("groundGT").getValue();
        this.getGroundStationInfoWindow().close();
        AnalysisManagement.prototype.saveFileByPath(this.groundStationParentPath,this.groundStationFileName,JSON.stringify(groundStationData));
    },

    //创建地面站属性窗口，去后台取数据
    getScPointPropertyWindow:function(skyPointNode){
        var skyPointInfoWindow = Ext.create('AppPlat.view.CoverAnalysis.SkyPointWindow');
        var me = this;
        me.skyPointParentPath = skyPointNode.get('nodeFilePath');
        me.skyPointFileName = skyPointNode.get('id') + '.json';
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: me.skyPointParentPath+'/'+ me.skyPointFileName
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.updateScpointWindowByData(skyPointNode.get('name'),data);
            },
            failure: function () {
            }
        });
    },
    //根据从后台读取的值改变属性面板的值
    updateScpointWindowByData:function(name,data){
        this.getSkyPointWindow().queryById("skyPointName").setText(name);
        this.getSkyPointWindow().queryById("ascension").setValue(data.ascension);
        this.getSkyPointWindow().queryById("declination").setValue(data.declination);
        this.getSkyPointWindow().show();
    },
    //保存属性面板上的值
    saveScPointFileByPath:function(button, e, eOpts){
        var skyPointData = new Object();
        skyPointData.type = "skypoint";
        skyPointData.ascension = this.getSkyPointWindow().queryById("ascension").getValue();
        skyPointData.declination = this.getSkyPointWindow().queryById("declination").getValue();
        this.getSkyPointWindow().close();
        AnalysisManagement.prototype.saveFileByPath(this.skyPointParentPath,this.skyPointFileName,JSON.stringify(skyPointData));
    },

    //创建地面站属性窗口，去后台取数据
    getScReginPropertyWindow:function(skyReginNode){
        var skyReginInfoWindow = Ext.create('AppPlat.view.CoverAnalysis.SkyRegionWindow');
        var me = this;
        me.skyReginParentPath = skyReginNode.get('nodeFilePath');
        me.skyReginFileName = skyReginNode.get('id') + '.json';
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: me.skyReginParentPath+'/'+ me.skyReginFileName
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.updateScReginWindowByData(skyReginNode.get('name'),data);
            },
            failure: function () {
            }
        });
    },
    //根据从后台读取的值改变属性面板的值
    updateScReginWindowByData:function(name,data){
        this.getSkyRegionWindow().queryById("skyRegionName").setText(name);
        this.getSkyRegionWindow().queryById("ascensionr").setValue(data.ascension);
        this.getSkyRegionWindow().queryById("declinationr").setValue(data.declination);
        this.getSkyRegionWindow().queryById("regionr").setValue(data.R);
        this.getSkyRegionWindow().show();
    },
    //保存属性面板上的值
    saveScReginFileByPath:function(button, e, eOpts){
        var skyReginData = new Object();
        skyReginData.type = "skyregion";
        skyReginData.ascension = this.getSkyRegionWindow().queryById("ascensionr").getValue();
        skyReginData.declination = this.getSkyRegionWindow().queryById("declinationr").getValue();
        skyReginData.R = this.getSkyRegionWindow().queryById("regionr").getValue();
        this.getSkyRegionWindow().close();
        AnalysisManagement.prototype.saveFileByPath(this.skyReginParentPath,this.skyReginFileName,JSON.stringify(skyReginData));
    },

    getSensorPropertyWindow:function(sensorNode){
        var sensorInfoWindow = Ext.create('AppPlat.view.CoverAnalysis.SensorWindow');
        var me = this;
        me.sensorParentPath = sensorNode.get('nodeFilePath');
        me.sensorFileName = sensorNode.get('id') + '.json';
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: me.sensorParentPath+'/'+ me.sensorFileName
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.updateSensorWindowByData(sensorNode.get('name'),data);
            },
            failure: function () {
            }
        });
    },
    //根据从后台读取的值改变属性面板的值
    updateSensorWindowByData:function(name,data){
        this.sensorobj = data;
        this.getSensorWindow().queryById("sensorName").setText(name);
        this.getSensorWindow().queryById("sensorStartTime").setValue(new Date(data.startTime));
        this.getSensorWindow().queryById("sensorEndTime").setValue(new Date(data.endTime));
        this.getSensorWindow().queryById("sensorAzimuth").setValue(data.azimuth);
        this.getSensorWindow().queryById("sensorElevation").setValue(data.elevation);
        this.getSensorWindow().queryById("sensorOpenAngle").setValue(data.openangle);
        this.getSensorWindow().queryById("sensorBH").setValue(data.bh);
        this.getSensorWindow().show();
    },
    //保存属性面板上的值
    saveSensorFileByPath:function(button, e, eOpts){
        var sensorData = new Object();
        sensorData.type = "sensor";
        sensorData.startTime = this.getSensorWindow().queryById("sensorStartTime").getValue();
        sensorData.endTime = this.getSensorWindow().queryById("sensorEndTime").getValue();
        sensorData.azimuth = this.getSensorWindow().queryById("sensorAzimuth").getValue();
        sensorData.elevation = this.getSensorWindow().queryById("sensorElevation").getValue();
        sensorData.openangle = this.getSensorWindow().queryById("sensorOpenAngle").getValue();
        sensorData.bh = this.getSensorWindow().queryById("sensorBH").getValue();
        sensorData.parentID = this.sensorobj.parentID;
        // console.log("继承 parentID : "+this.sensorobj.parentID);
        if(sensorData.endTime.getTime() > sensorData.startTime.getTime() + 86400000 * 30){
            console.log("步长自动修改为3600s");
            sensorData.bh = 3600;
        }
        else if(sensorData.endTime.getTime() > sensorData.startTime.getTime() + 86400000 * 5){
//            StopSimuTime.setTime(StartSimuTime.getTime() + 2592000000);
//            obj.StopSimuTime = StopSimuTime;
//            this.satelliteInfoWindow.queryById("StopSimuTime").setValue( obj.StopSimuTime);
//            return;
            console.log("步长自动修改为360s");
            sensorData.bh = 360;
        }
        else if(sensorData.endTime.getTime() <= sensorData.startTime.getTime()){
            return;
        }
        this.getSensorWindow().close();
        AnalysisManagement.prototype.saveFileByPath(this.sensorParentPath,this.sensorFileName,JSON.stringify(sensorData));
    }
});