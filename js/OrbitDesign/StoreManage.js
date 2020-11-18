/**
 * Created by Administrator on 2014/8/22.
 */
var StoreManage = function(){
};
StoreManage.prototype = {
    //初始化场景
    sceneRead: function(path, nodeId){
        var me = this;
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getFileByString.json",
            method:'GET',
            async:false,
            params: {
                path:path,
                nodeId:nodeId
            },
            success: function(response){
                var data = JSON.parse(response.responseText);
                me.refreshScene(data);
            }
        });
    },
    //根据得到的data，刷新场景
    refreshScene: function(data){
        initSimuTime(data["t_start"], data["t_stop"], data["step"], data["t_simu"], data["speedscalar"], data["count"]);
        resetScene();
        //如果上个场景的视角是卫星视角，则将其切回其中心点的视角下，因为要清楚场景所有卫星了
        ORBIT.Satellite.changeCenterAngel();
        initSateOrbit();
        if(data["orbitData"] != undefined) {
            for (var j = 0; j < data["orbitData"].length; j++) {
                var cid = data["orbitData"][j]["centerid"];
                var sid = data["orbitData"][j]["id"];
                var rad = data["orbitData"][j]["radius"];
                var t_rota = data["orbitData"][j]["t_rota"];
                var tilt = data["orbitData"][j]["tilt"];
                var initRota = data["orbitData"][j]["rota_init"];
                var i = data["orbitData"][j]["i"];
                var a = data["orbitData"][j]["a"];
                var e = data["orbitData"][j]["e"];
                var Om = data["orbitData"][j]["Om"];
                var om = data["orbitData"][j]["om"];
                var theta = data["orbitData"][j]["theta"];

                var t_start = data["orbitData"][j]["t_start"];
                var t_stop = data["orbitData"][j]["t_stop"];
                var epochTime = data["orbitData"][j]["epochTime"];
                var axis = data["orbitData"][j]["axis"];
                var attitudeType = data["orbitData"][j]["attitudeType"];
                var driftAzimuthal = data["orbitData"][j]["driftAzimuthal"];
                var rollElevation = data["orbitData"][j]["rollElevation"];
                var pitchSpinSpeed = data["orbitData"][j]["pitchSpinSpeed"];
                var orbitPara = new ORBIT.OrbitPara(i, a, e, Om, om, theta, cid);
                var orbit = new ORBIT.Orbit(orbitPara, sid, 'Satellite', cid);
                var satellite = new ORBIT.Satellite(orbitPara, sid, cid, rad, t_rota, tilt, initRota, new Date(t_start), new Date(t_stop), new Date(epochTime), axis, attitudeType, driftAzimuthal, rollElevation, pitchSpinSpeed);
                addSateOrbit(orbitPara, orbit, satellite);
                if(data["orbitData"][j]["orbitSection"] != undefined){
                    for(var k = 0; k < data["orbitData"][j]["orbitSection"].length; k++){
                        var orbitSection = data["orbitData"][j]["orbitSection"][k];
                        var orbitSectionPara = new ORBIT.OrbitPara(orbitSection["i"], orbitSection["a"], orbitSection["e"], orbitSection["Om"], orbitSection["om"], orbitSection["theta"], orbitSection["centerid"]);
                        var section = new OrbitSection(k, sid, orbitSection["centerid"], orbitSection["startCenter"], orbitSection["endCenter"], orbitSectionPara, new Date(orbitSection["startTime"]), new Date(orbitSection["endTime"]), orbitSection["speed"], orbitSection["isTransferSection"]);
                        ORBIT.orbit[sid].addSection(section);
                    }
                }
            }
        }
        ORBIT.isSelectSat = false;
        ORBIT.selectOrbit = null;
        hideCharacter();
        ORBIT.Orbit.resetOrbitColor();
        HoverText.hideSatellitePara();
        ORBIT.Orbit.showAllOrbit();
        refreshObject();
        refreshCamera();
    },
    //初始化一个卫星数据
    initSatelliteData: function(){
        var cid;
        //在太阳视角下为地球添加卫星，在其它视角下为对应的星体添加卫星
        if(ORBIT.tracedObject.id == 'sun'){
            cid = 'earth';
        }
        else{
            cid = ORBIT.tracedObject.id;
        }
        var satelliteData = "{\"centerid\":\"" + cid + "\",\n";
        satelliteData += "\"radius\":" + 5  + ",\n";
        satelliteData += "\"t_rota\":" + 0.08  + ",\n";
        satelliteData += "\"tilt\":" + 23.5 + ",\n";
        satelliteData += "\"rota_init\":" + 0 + ",\n";

        satelliteData += "\"t_start\":\"7 15,2012 04:00:00\",\n";
        satelliteData += "\"t_stop\":\"7 15,2014 04:00:00\",\n";
        satelliteData += "\"epochTime\":\"7 15,2012 04:00:00\",\n";
        satelliteData += "\"axis\":\"iAxes\",\n";
        satelliteData += "\"attitudeType\":\"3axes\",\n";
        satelliteData += "\"driftAzimuthal\":" + 0  + ",\n";
        satelliteData += "\"rollElevation\":" + 0 + ",\n";
        satelliteData += "\"pitchSpinSpeed\":" + 0 + ",\n";
        satelliteData += "\"i\":" + 45 + ",\n";
        satelliteData += "\"a\":" + 20000 + ",\n";
        satelliteData += "\"e\":" + 0.1 + ",\n";
        satelliteData += "\"Om\":" + 0 + ",\n";
        satelliteData += "\"om\":" + 45 + ",\n";
        satelliteData += "\"theta\":" + 20 + "}";
        return satelliteData;
    },
    //添加卫星文件
    addSatelliteFile: function(userId, path, name){
        this.addFile(path, name, this.initSatelliteData());
    },
    //初始化场景文件
    initScendFile: function(){
        var scenData = "{\"t_start\":\"7 15,2012 04:00:00\",\n";
        scenData += "\"t_stop\":\"7 15,2022 04:00:00\",\n";
        scenData += "\"step\":" + 3600 + ",\n";
        scenData += "\"speedscalar\":" + 1 + ",\n";
        scenData += "\"t_simu\":\"7 15,2012 04:00:00\"\n";
        return scenData;
    },
    //添加场景文件
    addSceneFile: function(userId, path, name){
        this.addFile(path, name, this.initScendFile())
    },
    //向后台发请求添加文件
    addFile: function(path, name, data){
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/saveOrbit.json",
            method:'POST',
            async: false,
            jsonData: {
                parentPath: path,
                fileName: name,
                data: data
            },
            success: function(response){
            },
            failure: function(){
                Ext.MessageBox.show({
                    title: '新建文件',
                    msg: '新建失败',
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //场景保存
    sceneSave: function(userId, path, name, sateName){
        this.createFolders(userId, path, name, sateName);
    },
    //将场景中的数据保存到文件
    createFolders: function(userId, path, name, sateName){
        var me = this;
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/saveOrbit.json",
            method:'POST',
            async: false,
            jsonData: {
                parentPath:path,
                fileName: name,
                data:this.getSceneData(sateName)
            },
            success: function(response){
            },
            failure: function(){
                Ext.MessageBox.show({
                    title: '轨道文件保存',
                    msg: '保存失败',
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //删除卫星文件
    deleteSatellite:function(userId, path, name){
        var me = this;
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/deleteOrbit.json",
            method:'POST',
            jsonData: {
                parentPath:path,
                fileName:name
            },
            success: function(response){
            },
            failure: function(){
                Ext.MessageBox.show({
                    title: '卫星删除',
                    msg: '删除失败',
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //删除场景文件夹
    deleteScene: function(userId, path){
        var me = this;
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/deleteSceneDir.json",
            method:'POST',
            jsonData: {
                parentPath:path
            },
            success: function(response){
            },
            failure: function(){
                Ext.MessageBox.show({
                    title: '场景删除',
                    msg: '删除失败',
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    mergeTaskToDB:function(userId,path,name,isSave){
        var me = this;
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/mergeTaskToDB.json",
            method:'POST',
            jsonData: {
                userId:userId,
                parentPath:path,
                fileName:name
            },
            success: function(response){
                if(response.responseText == "true"){
                    if(isSave == true){
                        Ext.MessageBox.show({
                            title: '轨道文件保存',
                            msg: '保存成功',
                            buttons: Ext.Msg.OK
                        });
                    }
                }
                else{
                    Ext.MessageBox.show({
                        title: '轨道文件保存',
                        msg: '保存失败',
                        buttons: Ext.Msg.OK
                    });
                }
            },
            failure: function(){
                Ext.MessageBox.show({
                    title: '轨道文件保存',
                    msg: '保存失败',
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //场景数据提取
    getSceneData: function(sateName){
        if(sateName == null || sateName == undefined){
            var scenData = "{\"t_start\":\"" + ORBIT.t_start.toString() + "\",\n";
            scenData += "\"t_stop\":\"" + ORBIT.t_stop.toString() + "\",\n";
            scenData += "\"step\":" + ORBIT.step + ",\n";
            scenData += "\"speedscalar\":" + ORBIT.speedscalar + ",\n";
            scenData += "\"t_simu\":\"" + ORBIT.t_simu.toString() + "\"\n";
            return scenData;
        }
        else{
            var satellite = ORBIT.satellite[sateName];
            var satelliteData = "{\"centerid\":\"" + satellite.centerid + "\",\n";
            satelliteData += "\"radius\":" + satellite.radius  + ",\n";
            satelliteData += "\"t_rota\":" + satellite.t_rota  + ",\n";
            satelliteData += "\"tilt\":" + satellite.tilt * 180/Math.PI + ",\n";
            satelliteData += "\"rota_init\":" + satellite.rota_init * 180/Math.PI + ",\n";

            satelliteData += "\"t_start\":\"" + satellite.t_start  + "\",\n";
            satelliteData += "\"t_stop\":\"" + satellite.t_stop  + "\",\n";
            satelliteData += "\"epochTime\":\"" + satellite.epochTime  + "\",\n";
            satelliteData += "\"axis\":\"" + satellite.axis  + "\",\n";
            satelliteData += "\"attitudeType\":\"" + satellite.attitudeType  + "\",\n";
            satelliteData += "\"driftAzimuthal\":" + satellite.driftAzimuthal * 180/Math.PI  + ",\n";
            satelliteData += "\"rollElevation\":" + satellite.rollElevation * 180/Math.PI  + ",\n";
            if(satellite.attitudeType == "3axes")
                satelliteData += "\"pitchSpinSpeed\":" + satellite.pitchSpinSpeed * 180/Math.PI  + ",\n";
            else
                satelliteData += "\"pitchSpinSpeed\":" + satellite.pitchSpinSpeed + ",\n";
            var sorbit = ORBIT.orbitpara[satellite.object.id];
            satelliteData += "\"i\":" + sorbit.i * 180/Math.PI + ",\n";
            satelliteData += "\"a\":" + sorbit.a + ",\n";
            satelliteData += "\"e\":" + sorbit.e + ",\n";
            satelliteData += "\"Om\":" + sorbit.Om * 180/Math.PI + ",\n";
            satelliteData += "\"om\":" + sorbit.om * 180/Math.PI + ",\n";
            satelliteData += "\"theta\":" + sorbit.theta * 180/Math.PI;

            var orbit = ORBIT.orbit[sateName];
            for(var i = 0; i < orbit.orbitSection.length; i++){
                if(i == 0){
                    satelliteData += ",\"orbitSection\":[";
                }
                satelliteData += "{\"centerid\":\"" + orbit.orbitSection[i].centerid + "\",";
                satelliteData += "\"startCenter\":\"" + orbit.orbitSection[i].startCenter + "\",";
                satelliteData += "\"endCenter\":\"" + orbit.orbitSection[i].endCenter + "\",";
                satelliteData += "\"startTime\":\"" + orbit.orbitSection[i].startTime + "\",";
                satelliteData += "\"endTime\":\"" + orbit.orbitSection[i].endTime + "\",";
                satelliteData += "\"speed\":" + orbit.orbitSection[i].speed + ",";
                satelliteData += "\"isTransferSection\":" + orbit.orbitSection[i].isTransferSection + ",";
                var rToA = 180 / Math.PI;
                satelliteData += "\"a\":" + orbit.orbitSection[i].orbitPara.a + ",";
                satelliteData += "\"e\":" + orbit.orbitSection[i].orbitPara.e + ",";
                satelliteData += "\"i\":" + orbit.orbitSection[i].orbitPara.i * rToA + ",";
                satelliteData += "\"Om\":" + orbit.orbitSection[i].orbitPara.Om * rToA + ",";
                satelliteData += "\"om\":" + orbit.orbitSection[i].orbitPara.om * rToA + ",";
                satelliteData += "\"theta\":" + orbit.orbitSection[i].orbitPara.theta * rToA + "}";
                if(i == orbit.orbitSection.length - 1){
                    satelliteData += "]";
                }
                else{
                    satelliteData += ",";
                }
            }
            satelliteData += "}";
            return satelliteData;
        }
//        var scenData = "{\"t_start\":\"" + ORBIT.t_start.toString() + "\",\n";
//        scenData += "\"t_stop\":\"" + ORBIT.t_stop.toString() + "\",\n";
//        scenData += "\"step\":" + ORBIT.step + ",\n";
//        scenData += "\"speedscalar\":" + ORBIT.speedscalar + ",\n";
//        scenData += "\"count\":" + ORBIT.count + ",\n";
//        scenData += "\"t_simu\":\"" + ORBIT.t_simu.toString() + "\"\n";
//        var flag = false;
//        var length = 0;
//        for(var i in ORBIT.satellite){
//            if(length == 0)
//                scenData += ",\"orbitData\":[" + "\n";
//            if(flag)
//                scenData += ",\n";
//            scenData += "{\"centerid\":\"" + ORBIT.satellite[i].centerid + "\",\n";
//            scenData += "\"id\":\"" + ORBIT.satellite[i].object.id  + "\",\n";
//            scenData += "\"radius\":" + ORBIT.satellite[i].radius  + ",\n";
//            scenData += "\"t_rota\":" + ORBIT.satellite[i].t_rota  + ",\n";
//            scenData += "\"tilt\":" + ORBIT.satellite[i].tilt * 180/Math.PI + ",\n";
//            scenData += "\"rota_init\":" + ORBIT.satellite[i].rota_init * 180/Math.PI + ",\n";
//            var sorbit = ORBIT.orbitpara[ORBIT.satellite[i].object.id];
//            scenData += "\"i\":" + sorbit.i * 180/Math.PI + ",\n";
//            scenData += "\"a\":" + sorbit.a + ",\n";
//            scenData += "\"e\":" + sorbit.e + ",\n";
//            scenData += "\"Om\":" + sorbit.Om * 180/Math.PI + ",\n";
//            scenData += "\"om\":" + sorbit.om * 180/Math.PI + ",\n";
//            scenData += "\"theta\":" + sorbit.theta * 180/Math.PI + "}";
//            flag = true;
//            length++;
//        }
//        if(length != 0)
//            scenData += "\n]\n}";
//        else
//            scenData  += "}";
//        return scenData;
    },
    getSceneJsonData: function(){
        var scenData = "{\"t_start\":\"" + ORBIT.t_start.toString() + "\",\n";
        scenData += "\"t_stop\":\"" + ORBIT.t_stop.toString() + "\",\n";
        scenData += "\"step\":" + ORBIT.step + ",\n";
        scenData += "\"speedscalar\":" + ORBIT.speedscalar + ",\n";
        scenData += "\"t_simu\":\"" + ORBIT.t_simu.toString() + "\"\n";
        var num = 0, length = 0;
        for(var i in ORBIT.satellite){
            length++;
        }
        for(var i in ORBIT.satellite){
            if(num == 0){
                scenData += ",\"orbitData\":[";
            }
            var satellite = ORBIT.satellite[i];
            scenData += "{\"centerid\":\"" + satellite.centerid + "\",\n";
            scenData += "\"radius\":" + satellite.radius  + ",\n";
            scenData += "\"t_rota\":" + satellite.t_rota  + ",\n";
            scenData += "\"tilt\":" + satellite.tilt * 180/Math.PI + ",\n";
            scenData += "\"rota_init\":" + satellite.rota_init * 180/Math.PI + ",\n";

            scenData += "\"t_start\":\"" + satellite.t_start  + "\",\n";
            scenData += "\"t_stop\":\"" + satellite.t_stop  + "\",\n";
            scenData += "\"epochTime\":\"" + satellite.epochTime  + "\",\n";
            scenData += "\"axis\":\"" + satellite.axis  + "\",\n";
            scenData += "\"attitudeType\":\"" + satellite.attitudeType  + "\",\n";
            scenData += "\"driftAzimuthal\":" + satellite.driftAzimuthal * 180/Math.PI  + ",\n";
            scenData += "\"rollElevation\":" + satellite.rollElevation * 180/Math.PI  + ",\n";
            if(satellite.attitudeType == "3axes")
                scenData += "\"pitchSpinSpeed\":" + satellite.pitchSpinSpeed * 180/Math.PI  + ",\n";
            else
                scenData += "\"pitchSpinSpeed\":" + satellite.pitchSpinSpeed + ",\n";
            var sorbit = ORBIT.orbitpara[satellite.object.id];
            scenData += "\"i\":" + sorbit.i * 180/Math.PI + ",\n";
            scenData += "\"a\":" + sorbit.a + ",\n";
            scenData += "\"e\":" + sorbit.e + ",\n";
            scenData += "\"Om\":" + sorbit.Om * 180/Math.PI + ",\n";
            scenData += "\"om\":" + sorbit.om * 180/Math.PI + ",\n";
            scenData += "\"theta\":" + sorbit.theta * 180/Math.PI + ",\n";
            scenData += "\"id\":\"" + i + "\"}";
            if(num == length - 1){
                scenData += "]";
            }
            else{
                scenData += ",";
            }
            num ++;
        }
        scenData += "}";
        return scenData;
    },
    //导出场景数据
    exportSceneData: function() {
        var scenData = "场景中的参数\r\n";
        scenData += "场景的仿真开始时间:" + formatDate(ORBIT.t_start) + "\r\n";
        scenData += "场景的仿真结束时间:" + formatDate(ORBIT.t_stop) + "\r\n";
        scenData += "场景的仿真步长:" + ORBIT.step + "秒\r\n";
        scenData += "当前场景的时间:" + formatDate(ORBIT.t_simu) + "\r\n";

        var satelliteData = "\r\n场景中不存在卫星";
        var num = 0;
        for(var i in ORBIT.satellite) {
            var satellite = ORBIT.satellite[i];
            if(num > 0){
                satelliteData += "\r\n\r\n";
            }
            else{
                satelliteData = "\r\n场景中的卫星及其参数\r\n"
            }
            satelliteData += "卫星名:" + satellite.object.id + "\r\n";
            switch(satellite.centerid){
                case "sun":satelliteData += "中心星体:太阳\r\n";break;
                case "mercury":satelliteData += "中心星体:水星\r\n";break;
                case "venus":satelliteData += "中心星体:金星\r\n";break;
                case "earth":satelliteData += "中心星体:地球\r\n";break;
                case "mars":satelliteData += "中心星体:火星\r\n";break;
                case "jupiter":satelliteData += "中心星体:木星\r\n";break;
                case "saturn":satelliteData += "中心星体:土星\r\n";break;
                case "uranus":satelliteData += "中心星体:天王星\r\n";break;
                case "neptune":satelliteData += "中心星体:海王星\r\n";break;
                case "moon":satelliteData += "中心星体:月球\r\n";break;
            }
//            satelliteData += "\"radius\":" + satellite.radius + ",\n";

            satelliteData += "仿真开始时间:" + formatDate(satellite.t_start) + "\r\n";
            satelliteData += "仿真结束时间:" + formatDate(satellite.t_stop) + "\r\n";
            satelliteData += "历元时刻:" + formatDate(satellite.epochTime) + "\r\n";
            switch(satellite.axis){
                case "iAxes":satelliteData += "所在中心星体的坐标系:惯性坐标系\r\n";break;
            }
            var sorbit = ORBIT.orbitpara[satellite.object.id];
            satelliteData += "半长轴:" + sorbit.a.toFixed(2) + "km\r\n";
            satelliteData += "偏心率:" + sorbit.e.toFixed(2) + "\r\n";
            satelliteData += "轨道倾角:" + (sorbit.i * 180 / Math.PI).toFixed(2) + "°\r\n";
            satelliteData += "升交点赤经:" + (sorbit.Om * 180 / Math.PI).toFixed(2) + "°\r\n";
            satelliteData += "近心点幅角:" + (sorbit.om * 180 / Math.PI).toFixed(2) + "°\r\n";
            satelliteData += "真近心点:" + (sorbit.theta * 180 / Math.PI).toFixed(2) + "°\r\n";
            if (satellite.attitudeType == "3axes") {
                satelliteData += "姿态类型:三轴稳定\r\n";
                satelliteData += "偏航角:" + (satellite.driftAzimuthal * 180 / Math.PI).toFixed(2) + "°\r\n";
                satelliteData += "滚转角:" + (satellite.rollElevation * 180 / Math.PI).toFixed(2) + "°\r\n";
                satelliteData += "俯仰角:" + (satellite.pitchSpinSpeed * 180 / Math.PI).toFixed(2) + "°";
            }
            else {
                satelliteData += "姿态类型:自旋稳定\r\n";
                satelliteData += "方位角:" + (satellite.driftAzimuthal * 180 / Math.PI).toFixed(2) + "°\r\n";
                satelliteData += "仰角:" + (satellite.rollElevation * 180 / Math.PI).toFixed(2) + "°\r\n";
                satelliteData += "自旋速度:" + satellite.pitchSpinSpeed.toFixed(2) + "";
            }
            num++;
        }
        return scenData + satelliteData;
    }
};