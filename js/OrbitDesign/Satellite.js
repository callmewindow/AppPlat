/**
 * Created by Taivas on 5/14/14.
 */
//Class: Satellite
ORBIT.Satellite = function(orbitpara, pid, pcentid, rad, rota, tilt, initRota, start, stop, epoch, ax, attituadeT, da, re, ps){
    var sateObj = new THREE.Object3D();
//    var loader = new THREE.OBJMTLLoader();
//    loader.load( '../../resources/objmodel/external/' + 'Opticalcamera' + '.obj',  '../../resources/objmodel/external/' + 'Opticalcamera' + '.mtl', function(object){
//        object.scale.set(0.03 * ORBIT.scaler_scene, 0.03 * ORBIT.scaler_scene, 0.03 * ORBIT.scaler_scene);
//        sateObj.add(object);
//        ORBIT.renderer.clear();
//        ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//    });
    var loader = new THREE.AssimpJSONLoader();
    loader.load('../../resources/json/' + 'HXMT' + '.json', function(object) {
            object.rotation.set(0, Math.PI/2, 0);
            object.scale.set(0.01 * ORBIT.scaler_scene, 0.01 * ORBIT.scaler_scene, 0.01 * ORBIT.scaler_scene);
            sateObj.add(object);
            ORBIT.renderer.clear();
            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
        }
    );
    this.radius = rad;
    this.velocity = 0;
    var satBox = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({opacity: 0, transparent: true}));
    this.object = satBox;
    this.object.add(sateObj);
    this.object.scale.set(20,20,20);
    this.object.id = pid;
    this.object.name = pid;
    this.centerid = pcentid;
    //TODO
    this.t_rota = rota; //fAxis's T
    this.tilt = tilt * Math.PI/180;
    this.rota_init = initRota * Math.PI/180;
    this.axis_ecliptic = new ORBIT.CoorAxes(this, 'e');
    this.axis_inertial = new ORBIT.CoorAxes(this, 'i');
    this.axis_fixed = new ORBIT.CoorAxes(this, 'f');
    this.axis_attitude = new ORBIT.CoorAxes(this, 'a');
    this.axis_orbit = null;
    this.axis_orbitZ = null;//用来记录该卫星轨道坐标系Z轴的方向

    this.t_start = start;
    this.t_stop = stop;
    this.epochTime = epoch;
    this.axis = ax;
    this.attitudeType = attituadeT;
    this.driftAzimuthal = da * Math.PI/180;
    this.rollElevation = re * Math.PI/180;
    if(attituadeT == "3axes")
        this.pitchSpinSpeed = ps * Math.PI/180;
    else
        this.pitchSpinSpeed = ps;
    //是否在场景中
    this.isExit = false;
    this.isVisable = true;
    this.isLocked = false;
    this.isSelected = false;
    //TODO need to be revised
    ORBIT.RES_ORBIT[this.id] = 100;
    this.hoverDiv = this.createHoverDiv();//用于标记卫星的div，数组，0代表text，1代表circle
};
ORBIT.Satellite.prototype = {
    lock: function(){
        this.isLocked = true;
    },
    unlock: function(){
        this.isLocked = false;
    },
    select: function(){
        this.isSelected = true;
    },
    unselect: function(){
        this.isSelected = false;
    },
    //刷新卫星的位置和速度
    refresh: function(){
        var orbit = ORBIT.orbit[this.object.id];
        var id = orbit.detectCurrentSection();
        var simu = new Date(ORBIT.t_simu.toString()), epochTime, orbitPara;
        var centerid = orbit.getCenterId();
        var planetPosition = orbit.getCenterPosition();
//        var planetPosition = ORBIT.planet[centerid].object.position;
        if(id == -1 || id == -2){
            epochTime = this.epochTime;
            orbitPara = ORBIT.orbitpara[this.object.id];
        }
        else if(id >= 0){
            epochTime = orbit.orbitSection[id].startTime;
            orbitPara = orbit.orbitSection[id].orbitPara;
        }
        var overSeconds = (julian(simu.getMonth() + 1, simu.getDate(), simu.getFullYear()) + numberSecond(simu.getHours(), simu.getMinutes(), simu.getSeconds())
            - (julian(epochTime.getMonth() + 1, epochTime.getDate(), epochTime.getFullYear()) + numberSecond(epochTime.getHours(), epochTime.getMinutes(), epochTime.getSeconds())))
            * 86400;
        var finalPosition = getPlanetTransMatrix4(overSeconds, orbitPara, 'Satellite', centerid);
        this.object.position.set(finalPosition[0].x + planetPosition.x, finalPosition[0].y + planetPosition.y, finalPosition[0].z + planetPosition.z);
//            satellite.object.rotation.set(0, theta_rota + satellite.rota_init, -satellite.tilt, 'ZXY');
        this.velocity = finalPosition[1];
//        this.object.scale.set(orbitPara.a / 1000, orbitPara.a / 1000, orbitPara.a / 1000);
        if(ORBIT.selectOrbit == this.object.id){
            orbit.setOrbitColor("#ff7e00");
//            orbit.showCharacter();
        }
        if(id == -1 || id == -2){
            this.refreshHoverDiv();
            this.hideHoverDiv();
        }
        else if(id >= 0){
            var flag = orbit.orbitSection[id].isTransferSection;
            if(flag){
                this.refreshHoverDiv();
                this.showHoverDiv()
            }
            else{
                this.refreshHoverDiv();
                this.hideHoverDiv();
            }
        }
    },
    //创建标记卫星的div
    createHoverDiv: function(){
        var position = this.object.position;
        var vector3 = new THREE.Vector3(position.x, position.y, position.z);
        var position2D = HoverText.getObjectScreenPosition(vector3);
        var hoverDiv = HoverText.darwHoverText(this.object.id, "#ffffff", position2D);
        return hoverDiv;
    },
    //刷新div
    refreshHoverDiv: function(){
        var position = this.object.position;
        var vector3 = new THREE.Vector3(position.x, position.y, position.z);
        var position2D = HoverText.getObjectScreenPosition(vector3);
        var text = this.hoverDiv[0], circle = this.hoverDiv[1], x = position2D.x, y = position2D.y;
        text.style.left = x - ORBIT.circleR + 20 + "px";
        text.style.top = y - ORBIT.circleR + "px";
        text.style.height = ORBIT.textY + "px";
        text.style.width = ORBIT.textX + "px";
        text.style.fontSize = ORBIT.textZ + "px";
        if (x - ORBIT.circleR + 20 < ORBIT.canvas.getBoundingClientRect().left || y - ORBIT.circleR < ORBIT.canvas.getBoundingClientRect().top) {
            text.display = 'none';
        } else {
            text.display = 'block';
        }
        circle.style.left = x - ORBIT.circleR + "px";
        circle.style.top = y - ORBIT.circleR + "px";
        circle.style.height = ORBIT.textY + "px";
        circle.style.width = ORBIT.textX + "px";
        ORBIT.canvas.parentNode.appendChild(text);
        ORBIT.canvas.parentNode.appendChild(circle);
    },
    //显示div
    showHoverDiv: function(){
        ORBIT.canvas.parentNode.appendChild(this.hoverDiv[0]);
        ORBIT.canvas.parentNode.appendChild(this.hoverDiv[1]);
    },
    //隐藏div
    hideHoverDiv: function(){
        ORBIT.canvas.parentNode.removeChild(this.hoverDiv[0]);
        ORBIT.canvas.parentNode.removeChild(this.hoverDiv[1]);
    }
};
//刷新所有卫星的Div
ORBIT.Satellite.refreshAllHoverDiv = function(){
    for(var i in ORBIT.satellite){
        var sat = ORBIT.satellite[i];
        var orbit = ORBIT.orbit[sat.object.id];
        var id = orbit.detectCurrentSection();
        sat.refreshHoverDiv();
        if(id == -1 || id == -2){
            sat.refreshHoverDiv();
            sat.hideHoverDiv();
        }
        else if(id >= 0){
            var flag = orbit.orbitSection[id].isTransferSection;
            if(flag){
                sat.refreshHoverDiv();
                sat.showHoverDiv()
            }
            else{
                sat.refreshHoverDiv();
                sat.hideHoverDiv();
            }
        }
    }
};
//获取被选中卫星的id
ORBIT.Satellite.getSelectedSatId = function(){
    for(var i in ORBIT.satellite){
        if(ORBIT.satellite[i].isSelected){
            return i;
        }
    }
    return null;
};
//释放被所有被选中的卫星
ORBIT.Satellite.unlockSelect = function(){
    var selectedId = ORBIT.Satellite.getSelectedSatId();
    if(selectedId){
        ORBIT.satellite[selectedId].unselect();
        ORBIT.cooperation.sendInfo("LockControl", selectedId, false);
    }
};
//获取锁定列表信息
ORBIT.Satellite.getLockList = function(){
    var idlist = new Array();
    for (var i in ORBIT.satellite){
        if (ORBIT.satellite[i].isLocked || ORBIT.satellite[i].isSelected){
            idlist[idlist.length] = i;
        }
    }
    return idlist.join();
};
//初始化锁定列表信息
ORBIT.Satellite.initLockList = function(data){
    if (data == null || data.length == 0){
        return;
    }
    var temp = data.split(',');
    for (var i = 0; i < temp.length; i++){
        ORBIT.satellite[temp[i]].lock();
    }
};
//判断场景中是否有指定的卫星
ORBIT.Satellite.isExitSatellite = function(sid){
    for(var i in ORBIT.satellite){
        if(i == sid){
            return true;
        }
    }
    return false;
};
//如果上个场景的视角是卫星视角，则将其切回其中心点的视角下，因为要清除场景所有卫星了
ORBIT.Satellite.changeCenterAngel = function(){
    if(ORBIT.tracedTargetTpye == "Sate"){
        var cid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        ORBIT.trace = true;
        ORBIT.zoom = ORBIT.v_minzoom * 2;
        ORBIT.tracedObject = ORBIT.planet[cid].object;
        ORBIT.tracedTarget = ORBIT.planet[cid];
        ORBIT.tracedTargetTpye = 'Planet';
        if(ORBIT.states_View == "magnetic"){
            ORBIT.firstOutMagnetic = true;
        }
        if(cid == "sun"){
            ORBIT.states_View = "sunlanetAxes";
        }
        else {
            ORBIT.states_View = "inertial";
        }
    }
};