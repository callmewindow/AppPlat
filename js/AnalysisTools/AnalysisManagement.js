/**
 * Created by winter on 2014/12/12.
 */

var AnalysisManagement = function(){
    this.gsData = null;
    this.taData = null;
};
AnalysisManagement.prototype.saveFileByPath = function(parentPath,fileName,fileData){
    Ext.Ajax.request({
        url:APC.APPPLAT_SERVICE_URL_PREFIX+"DataTransAnalysisManage/saveDataTransFile.json",
        method:'POST',
        async: false,
        jsonData: {
            parentPath:parentPath,
            fileName: fileName,
            data:fileData
        },
        success: function(response){
        },
        failure: function(){
            Ext.MessageBox.show({
                title: '数据传输文件保存',
                msg: '保存失败',
                buttons: Ext.Msg.OK
            });
        }
    });
}

AnalysisManagement.prototype.saveFileByPathCover = function(parentPath,fileName,fileData){
    Ext.Ajax.request({
        url:APC.APPPLAT_SERVICE_URL_PREFIX+"CoverAnalysisManage/saveDataTransFile.json",
        method:'POST',
        async: false,
        jsonData: {
            parentPath:parentPath,
            fileName: fileName,
            data:fileData
        },
        success: function(response){
        },
        failure: function(){
            Ext.MessageBox.show({
                title: '数据传输文件保存',
                msg: '保存失败',
                buttons: Ext.Msg.OK
            });
        }
    });
}

//向gsData添加任务数据
AnalysisManagement.prototype.initTaskData = function(text){
    AnalysisManagement.gsData = new Array();
    AnalysisManagement.gsData[0] = new Object();
    AnalysisManagement.gsData[0].satellite = false;
    AnalysisManagement.gsData[0].groundstation = false;
    AnalysisManagement.gsData[0].sky = false;
    AnalysisManagement.gsData[0].sensor = false;
    AnalysisManagement.gsData[0].task = text;
    AnalysisManagement.gsData[0].hb = 60;
}
//向gsData中添加卫星数据
AnalysisManagement.prototype.addSatelliteData = function(text){
    var t_start = new Date();
    t_start.setFullYear(2012);
    t_start.setMonth(6);
    t_start.setDate(15);
    t_start.setHours(4);
    t_start.setMinutes(0);
    t_start.setSeconds(0);
    var t_stop = new Date();
    t_stop.setFullYear(2012);
    t_stop.setMonth(6);
    t_stop.setDate(16);
    t_stop.setHours(5);
    t_stop.setMinutes(0);
    t_stop.setSeconds(0);
    var epochTime = new Date();
    epochTime.setFullYear(2012);
    epochTime.setMonth(6);
    epochTime.setDate(15);
    epochTime.setHours(4);
    epochTime.setMinutes(0);
    epochTime.setSeconds(0);
    var item = new Object();
    item.name = text;
    item.type = "satellite";
    item.starcombo = "earth";//中心星体
    item.StartSimuTime = t_start;//开始仿真时间
    item.StopSimuTime = t_stop;//结束仿真时间
    item.epochTime = epochTime;//历元时刻
    item.a = 20000;//半长轴
    item.e = 0.1;//偏心率
    item.i = 45.0;//轨道倾角
    item.Om = 0.0;//升交点赤经
    item.om = 45.0;//近心点幅角 ω (°)
    item.theta = 20.0;//真近点角 θ (°)
    item.attitudeType = "3axes";//姿态类型
    item.driftAnglenX = 0.0;//俯仰角（X轴）
    item.driftAnglenY = 0.0;//偏航角（Y轴）
    item.driftAnglenZ = 0.0;//俯仰角（Z轴）
    item.hb = 60;
    AnalysisManagement.gsData.push(item);
    AnalysisManagement.gsData[0].satellite = true;
}
//向gsData中添加地面站数据
AnalysisManagement.prototype.addGroundStationData = function (text){
    var item = new Object();
    item.name = text;
    item.type = "groundstation";
    item.longitude = 0.0;
    item.latitude = 2.859956;
    item.height = 0.0;
    item.minAngle = 5.0;
    item.groundGT = 0.0;
    AnalysisManagement.gsData.push(item);
    AnalysisManagement.gsData[0].groundstation = true;
}
//向gsData中添加天区点目标
AnalysisManagement.prototype.addSkyPointData = function (text){
    var item = new Object();
    item.name = text;
    item.type = "skypoint";
    item.ascension = -105;
    item.declination = 0;
    AnalysisManagement.gsData.push(item);
}
//向gsData中添加天区区域目标
AnalysisManagement.prototype.addSkyRegionData = function (text){
    var item = new Object();
    item.name = text;
    item.type = "skyregion";
    item.ascension = -105;
    item.declination = 0;
    item.R = 10;
    AnalysisManagement.gsData.push(item);
}
//向gsData中添加传感器
AnalysisManagement.prototype.addSensorData = function (text, id){
    var t_start = new Date();
    t_start.setFullYear(2012);
    t_start.setMonth(6);
    t_start.setDate(15);
    t_start.setHours(4);
    t_start.setMinutes(0);
    t_start.setSeconds(0);
    var t_stop = new Date();
    t_stop.setFullYear(2012);
    t_stop.setMonth(6);
    t_stop.setDate(16);
    t_stop.setHours(5);
    t_stop.setMinutes(0);
    t_stop.setSeconds(0);
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
    AnalysisManagement.gsData.push(item);
}
AnalysisManagement.prototype.getSimuData = function(){
    var scenData = "{\"t_start\":\"" + AnalysisParameter.t_start.toString() + "\",\n";
    scenData += "\"t_stop\":\"" + AnalysisParameter.t_stop.toString() + "\",\n";
    scenData += "\"step\":" + AnalysisParameter.step + ",\n";
    scenData += '}';
    return scenData;
}
AnalysisManagement.prototype.initSimuData = function(){
    var startTime = new Date();
    startTime.setFullYear(2012);
    startTime.setMonth(6);
    startTime.setDate(15);
    startTime.setHours(4);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    var stopTime = new Date();
    stopTime.setFullYear(2022);
    stopTime.setMonth(6);
    stopTime.setDate(15);
    stopTime.setHours(4);
    stopTime.setMinutes(0);
    stopTime.setSeconds(0);
    var step = 60;
    AnalysisParameter.t_start = startTime;
    AnalysisParameter.t_stop = stopTime;
    AnalysisParameter.step =step;
}

AnalysisManagement.prototype.TYPE_TASK = "task";
AnalysisManagement.prototype.TYPE_SATELLITE = "satellite";
AnalysisManagement.prototype.TYPE_GROUNDSTATION = "groundstation";
AnalysisManagement.prototype.TYPE_CHAINANAYLSIS = "chainanaylsis";
AnalysisManagement.prototype.PARAM_MAIN = "main-param";
AnalysisManagement.prototype.PARAMP_AFFILIATED = "affiliated-param";
AnalysisManagement.prototype.NO_DATA = "NO DATA";