/**
 * Created by Taivas on 5/14/14.
 */

//////////////////////////////////////////
var res = {
    'sun':		0,
    'mercury': 	100,
    'venus': 	300,
    'earth': 	365,
    'mars': 	700,
    'jupiter': 	4500,
    'saturn': 	10759,
    'uranus': 	30685,
    'neptune': 	60190,
    'moon': 	27
};
var tilt = {
    'sun':		0,
    'mercury': 	7.005 * Math.PI / 180,
    'venus': 	3.395 * Math.PI / 180,
    'earth': 	0.000 * Math.PI / 180,
    'mars': 	1.850 * Math.PI / 180,
    'jupiter': 	1.303 * Math.PI / 180,
    'saturn': 	2.489 * Math.PI / 180,
    'uranus': 	0.773 * Math.PI / 180,
    'neptune': 	1.770 * Math.PI / 180,
    'moon': 	5.145 * Math.PI / 180
};
ORBIT.Orbit = function(porbit, pname, ptype, pcid){
    this.sid = pname;
    this.id = pname + "Orbit";
    this.name = pname + "Orbit";
    this.object = this.makeOrbit(porbit, ptype, pcid, pname);
//    if(ptype == "Satellite"){
//        this.object.rotation.set(-ORBIT.planet[pcid].tilt, 0, 0, 'ZXY');
////        this.refreshAttiAndPosition(porbit, ptype, pcid);//
//    }
    this.Matrix4 = new THREE.Matrix4();
    this.centerid = pcid;
    this.type = ptype;
    this.orbitSection = [];//用于存储轨道段
};

ORBIT.Orbit.prototype.makeOrbit = function(porbit, ptype, pcid, pname, flag) {

    var resolution = Math.round(porbit.a/4) > 100 ? Math.round(porbit.a/4) : 100;
    var size = 360.0/resolution;
    var deltasegment = size * Math.PI/180;
    var segment = 0;
    var geometry = new THREE.Geometry();
    geometry.dynamic = true;
    var material;
    //add segment of orbit
    if(ptype == "Planet"){
        for(var i = 0; i <= resolution; i++) {
            var vector3 = new THREE.Vector3(Math.sin(segment) * porbit.b, 0, -porbit.c + Math.cos(segment) * porbit.a);
            geometry.vertices.push(vector3);
            segment += deltasegment;
//        if(i == resolution && this.id == "earthOrbit"){
//            alert(vector3.x);
//            alert(vector3.y);
//            alert(vector3.z);
//        }
        }


        //set orbit color based on the type
        switch(ptype){
            case 'Planet':
                material = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.5});
                break;
            case 'Satellite':
                material = new THREE.LineBasicMaterial({color: 0x00ffff, opacity: 1});
//            //for test
//            geometry.vertices.push(new THREE.Vector3(0, 0, -porbit.c));
//            geometry.vertices.push(new THREE.Vector3(-porbit.b, 0, -porbit.c));
//            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                break;
            default:
        }
        var v_temp = geometry.vertices.pop();//if(this.id == "earthOrbit"){alert(i);alert(resolution);}
        for(; i <= ORBIT.max_vertices; i++) {
            geometry.vertices.push(v_temp);
        }
        //set orbit transparent
        material.transparent = true;
        var line = new THREE.Line( geometry, material, THREE.LineStrip );//LinePieces
        return line;
    }
    else if(ptype == "Satellite"){
        var mu = ORBIT.GravitationalConstant[pcid];
        var coe = ORBIT.orbitCoe;
        var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([porbit.theta])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);//console.log(position);console.log(position[0][0]);console.log(position[1][0]);
        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([0])[0], new Array([mu])[0]);
        var vector3 = new THREE.Vector3(finalPosition[0][0][0]/coe, finalPosition[0][0][1]/coe, finalPosition[0][0][2]/coe);
        geometry.vertices.push(vector3);
        var nextPosition;
        var T =  porbit.T/470;
//        console.log("[" + finalPosition[0][0][0] + "," + finalPosition[0][0][1] + "," + finalPosition[0][0][2] + "," + finalPosition[1][0][0] + "," + finalPosition[1][0][1] + "," + finalPosition[1][0][2] + "],");
//        console.log(finalPosition[0][0][0] + " " + finalPosition[0][0][1] + " " + finalPosition[0][0][2]);
        for(var i = 0; i < 470; i++){
            nextPosition = keplerUniversal(finalPosition[0][0], finalPosition[1][0], new Array([T])[0], new Array([mu])[0]);
            vector3 = new THREE.Vector3(nextPosition[0][0][0]/coe, nextPosition[0][0][1]/coe, nextPosition[0][0][2]/coe);
            finalPosition = nextPosition ;
//            console.log("[" + nextPosition[0][0][0] + "," + nextPosition[0][0][1] + "," + nextPosition[0][0][2] + "," + nextPosition[1][0][0] + "," + nextPosition[1][0][1] + "," + nextPosition[1][0][2] + "],");
//            console.log(nextPosition[0][0][0] + " " + nextPosition[0][0][1] + " " + nextPosition[0][0][2]);
            geometry.vertices.push(vector3);//console.log(finalPosition[0][0]);
        }
        if(pname == ORBIT.selectOrbit){
            material = new THREE.LineBasicMaterial({color: 0xff7e00, opacity: 1});
        }
        else{
            material = new THREE.LineBasicMaterial({color: 0x00ffff, opacity: 1});
        }
        material.transparent = true;
        material.needsUpdate = true;
        var line = new THREE.Line( geometry, material, THREE.LineStrip );
//        line.rotation.set(-ORBIT.planet[pcid].tilt, 0, 0, 'ZXY');
        if(pcid != "sun"){
            line.applyMatrix(ORBIT.planet[pcid].j2000Matrix);
            if(pcid == "moon"){
                line.applyMatrix(ORBIT.planet["earth"].j2000Matrix);
            }
        }
        line.updateMatrix();
        //为轨道加特征点
        var nearPlanetPointPV = getPlanetTransMatrix4(0, porbit, 'Satellite', pcid, "near");//近地点的位置和速度
        var middlePlanetPointPV = getPlanetTransMatrix4(0, porbit, 'Satellite', pcid, "middle");//轨道倾角点的位置和速度
        var farPlanetPointPV = getPlanetTransMatrix4(0, porbit, 'Satellite', pcid, "far");//远地点的位置和速度
        var OmPlanetPointPV = getPlanetTransMatrix4(0, porbit, 'Satellite', pcid, "Om");//升交点赤经特征点的位置和速度
//        var nearPlanetPoint = new THREE.Mesh(new THREE.SphereGeometry(ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint),
//            new THREE.MeshLambertMaterial({map: new THREE.ImageUtils.loadTexture("../../resources/images/planettexture/sun_halo.png", null, function(object){
//                ORBIT.renderer.clear();
//                ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//            })}));//近地点
//        var middlePlanetPoint = new THREE.Mesh(new THREE.SphereGeometry(ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint),
//            new THREE.MeshLambertMaterial({map: new THREE.ImageUtils.loadTexture("../../resources/images/planettexture/sun_halo.png", null, function(object){
//                ORBIT.renderer.clear();
//                ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//            })}));//用来调轨道倾角的点
//        var farPlanetPoint = new THREE.Mesh(new THREE.SphereGeometry(ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint, ORBIT.nfPlanetPoint),
//            new THREE.MeshLambertMaterial({map: new THREE.ImageUtils.loadTexture("../../resources/images/planettexture/sun_halo.png", null, function(object){
//                ORBIT.renderer.clear();
//                ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//            })}));//远地点
        //设特征点的显示比例
//        nearPlanetPoint.scale.set(ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale);
//        middlePlanetPoint.scale.set(ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale);
//        farPlanetPoint.scale.set(ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale, ORBIT.nfPlanetPointScale);
        //设特征点的位置
//        nearPlanetPoint.position.set(nearPlanetPointPV[0].x, nearPlanetPointPV[0].y, nearPlanetPointPV[0].z);
//        middlePlanetPoint.position.set(middlePlanetPointPV[0].x, middlePlanetPointPV[0].y, middlePlanetPointPV[0].z);
//        farPlanetPoint.position.set(farPlanetPointPV[0].x, farPlanetPointPV[0].y, farPlanetPointPV[0].z);
        //为特征点加轴
        ORBIT.singleAxis = new SingleAxis();
        //设置近地点的横轴
        var nearCrossAxis = ORBIT.singleAxis.makeAxis( pname, "near");
        if(flag){
            ORBIT.singleAxis.setCrossAxis(nearCrossAxis, farPlanetPointPV[0], porbit.a);
        }
        else{
            ORBIT.singleAxis.setCrossAxis(nearCrossAxis, nearPlanetPointPV[0], porbit.a);
        }
        //设置轨道倾角点的轴
        var middleVerticalAxis = ORBIT.singleAxis.makeAxis(pname, "middle");
        ORBIT.singleAxis.setVerticalAxis(middleVerticalAxis, middlePlanetPointPV[0], middlePlanetPointPV[1], porbit.a);
        //设置远地点的横轴
        var farCrossAxis = ORBIT.singleAxis.makeAxis(pname, "far");
        if(flag){
            ORBIT.singleAxis.setCrossAxis(farCrossAxis, nearPlanetPointPV[0], porbit.a);
        }
        else{
            ORBIT.singleAxis.setCrossAxis(farCrossAxis, farPlanetPointPV[0], porbit.a);
        }
        //设置近心点幅角点的轴
        var omCrossAxis =  ORBIT.singleAxis.makeAxis( pname, "om");
        ORBIT.singleAxis.setVCrossAxis(omCrossAxis, nearPlanetPointPV[0], nearPlanetPointPV[1], porbit.a);
        //设置升交点赤经点的轴
        var OmCrossAxis = ORBIT.singleAxis.makeAxis( pname, "Om");
        ORBIT.singleAxis.setEquatorAxis(OmCrossAxis, OmPlanetPointPV[0], OmPlanetPointPV[1], porbit.i, porbit.a);
        line.add(nearCrossAxis);
        line.add(middleVerticalAxis);
        line.add(farCrossAxis);
        line.add(omCrossAxis);
        line.add(OmCrossAxis);
//        hideCharacter();
//        if(ORBIT.selectOrbitId != null && ORBIT.selectOrbitId == pname){
//            showCharacter(ORBIT.selectOrbitId);
//        }
        //将特征点添加到轨道上
//        line.add(nearPlanetPoint);
//        line.add(middlePlanetPoint);
//        line.add(farPlanetPoint);
        return line;
    }
};
ORBIT.Orbit.prototype.setOrbitColor = function(color){
    this.object.material.color.setStyle(color);
    for(var i in this.orbitSection){
        this.orbitSection[i].object.material.color.setStyle(color);
    }
//    var id = this.detectCurrentSection();
//    if(id == -1 || id == -2){
//        this.object.material.color.setStyle(color);
//    }
//    else{
//        this.orbitSection[id].object.material.color.setStyle(color);
//    }
};
//隐藏轨道特征点
ORBIT.Orbit.prototype.hideCharacter = function(){
    var sat = this.object;
    for(var j in sat.children){
        sat.children[j].scale.set(0, 0, 0);
    }
    for(var i in this.orbitSection){
        sat = this.orbitSection[i].object;
        for(var k in sat.children){
            sat.children[k].scale.set(0, 0, 0);
        }
    }
};
//显示特征点
ORBIT.Orbit.prototype.showCharacter = function(){
    var sat, a;
    var len = this.orbitSection.length;
    //显示第一段的特征点
    sat = this.object;
    a = ORBIT.orbitpara[this.sid].a;
    for(var i in sat.children){
        sat.children[i].scale.set(a / 100000, a / 100000, a / 100000);
    }
    //显示各子段的特征点
    for(var i = 0; i < len; i++){
        sat = this.orbitSection[i].object;
        if(!this.orbitSection[i].isTransferSection){
            a = this.orbitSection[i].orbitPara.a;
            for(var j in sat.children){
                sat.children[j].scale.set(a / 100000, a / 100000, a / 100000);
            }
        }
        else{
            for(var j in sat.children){
                if(ORBIT.tracedObject.id == "sun"){
                    sat.children[j].scale.set(2000, 2000, 2000);
                }
                else{
                    sat.children[j].scale.set(0, 0, 0);
                }
            }
        }
    }


//    var id = this.detectCurrentSection();
//    if(id == -1){
//        sat = this.object;
//        a = ORBIT.orbitpara[this.sid].a;
//        for(var i in sat.children){
//            sat.children[i].scale.set(a / 100000, a / 100000, a / 100000);
//        }
//    }
//    else if(id >= 0){
//        sat = this.orbitSection[id].object;
//        a = this.orbitSection[id].orbitPara.a;
//        for(var i in sat.children){
//            sat.children[i].scale.set(a / 100000, a / 100000, a / 100000);
//        }
//    }

};
ORBIT.Orbit.resetOrbitColor = function(){
    for(var i in ORBIT.orbit){
        ORBIT.orbit[i].object.material.color.setStyle("#00ffff");
        for(var j in ORBIT.orbit[i].orbitSection){
            var orbitSection = ORBIT.orbit[i].orbitSection[j];
            orbitSection.object.material.color.setStyle("#00ffff");
        }
    }
};
//将超过PI和-PI的弧度转换到-PI到PI
var changeAngel = function(angel){
    if(angel > Math.PI){
        angel -= Math.PI;
    }
    else if(angel < -Math.PI){
        angel += Math.PI;
    }
    return angel;
};
//刷新轨道的位置
ORBIT.Orbit.prototype.refresh = function(){
    var simu = new Date(ORBIT.t_simu.toString());
    //刷新第一段轨道的位置
    var planetPosition = ORBIT.planet[this.centerid].object.position;
    this.object.position.x = planetPosition.x;
    this.object.position.y = planetPosition.y;
    this.object.position.z = planetPosition.z;
    //刷星各轨道段的位置
    for(var i in this.orbitSection){
        this.orbitSection[i].setPosition(simu);
    }
    if(ORBIT.satellite[this.sid].isSelected){
        this.showCharacter();
    }
    else{
        this.hideCharacter();
    }
    //根据当前仿真时间显示相应的轨道段
//    var id = this.detectCurrentSection();
//    if(id == -2){
//        this.hideSection();
//        this.hideOrbit();
//    }
//    else if(id == -1){
//        var planetPosition = ORBIT.planet[this.centerid].object.position;
//        this.object.position.x = planetPosition.x;
//        this.object.position.y = planetPosition.y;
//        this.object.position.z = planetPosition.z;
//        //显示当前轨道，隐藏其他轨道段
//        this.hideSection();
//        this.showOrbit();
//    }
//    else if(id > -1){
//        this.orbitSection[id].setPosition(simu);
//        this.hideSection();
//        this.hideOrbit();
//        this.showSection(id);
//    }
//    if(this.sid == ORBIT.selectOrbitSectionId){
//        this.showAllSection();
//    }
};
//显示轨道段
ORBIT.Orbit.prototype.showSection = function(id){
    this.orbitSection[id].show();
};
//显示轨道
ORBIT.Orbit.prototype.showOrbit = function(){
    ORBIT.scene.add(this.object);
};
//隐藏轨道段
ORBIT.Orbit.prototype.hideSection = function(id){
    if(id != null && id != undefined){
        if(id == -1){
            this.hideOrbit();
        }
        else{
            this.orbitSection[id].hide();
        }
    }
    else{
        for(var i in this.orbitSection){
            this.orbitSection[i].hide();
        }
    }
};
//隐藏轨道
ORBIT.Orbit.prototype.hideOrbit = function(){
    ORBIT.scene.remove(this.object);
};
//显示指定轨道的所有轨道段
ORBIT.Orbit.prototype.showAllSection = function(){
//    ORBIT.Orbit.hideAllSection();
    this.showOrbit();
    for(var i in this.orbitSection){
        this.showSection(i);
    }
};
//隐藏所有轨道及其轨道段
ORBIT.Orbit.hideAllSection = function(){
    for(var i in ORBIT.orbit){
        ORBIT.orbit[i].hideOrbit();
        ORBIT.orbit[i].hideSection();
    }
};
//隐藏所有轨道的特征点
ORBIT.Orbit.hideAllCharacter = function(){
    for(var i in ORBIT.orbit){
        ORBIT.orbit[i].hideCharacter();
    }
};
//检测当前轨道段id
ORBIT.Orbit.prototype.detectCurrentSection = function(certainTime){
    var simu;
    if(certainTime == null || certainTime == undefined){
        simu = new Date(ORBIT.t_simu.toString());
    }
    else{
        simu = new Date(certainTime.toString());
    }
    var satellite = ORBIT.satellite[this.sid];
    //如果卫星无轨道段
    if(this.orbitSection.length == 0){
        if(simu.getTime() >= satellite.t_start.getTime() && simu.getTime() >= satellite.epochTime.getTime() && simu.getTime() <= satellite.t_stop.getTime()){
            return -1;
        }
    }
    else{
        //如果卫星在初始轨道的位置
        if(simu.getTime() >= satellite.t_start.getTime() && simu.getTime() >= satellite.epochTime.getTime() && simu.getTime() <= this.orbitSection[0].startTime.getTime()){
            return -1;
        }
        else{
            for(var i in this.orbitSection){
                if(simu.getTime() > this.orbitSection[i].startTime.getTime() && simu.getTime() <= this.orbitSection[i].endTime.getTime()){
                    return this.orbitSection[i].id;
                }
            }
        }
    }
    return -2;
};
//根据当前视角查找相应的段
ORBIT.Orbit.prototype.detectSectionByAngle = function(){
    var len = this.orbitSection.length;
    var target = ORBIT.tracedObject;
    if(len == 0){
        return -1;
    }
    if(this.centerid == target.id){
        return -1;
    }
    for(var i = 0; i < len; i++){
        if(this.orbitSection[i].centerid == target.id && !this.orbitSection[i].isTransferSection){
            return i;
        }
    }
    if(target.id == "sun" && !this.orbitSection[len - 1].isTransferSection){
        return len - 1;
    }
    return -1;
};
//显示轨道参数
ORBIT.Orbit.prototype.showOrbitPara = function(){
//    var id = this.detectCurrentSection();
    var id = this.detectSectionByAngle();
    var a, e, i, Om, om, theta, pi = 180 / Math.PI;
    if(id == -1){
        var orbitPara = ORBIT.orbitpara[this.sid];
        a = orbitPara.a * 1.0;
        e = orbitPara.e * 1.0;
        i = orbitPara.i * pi;
        Om = orbitPara.Om * pi;
        om = orbitPara.om * pi;
        theta = orbitPara.theta * pi;
    }
    else if(id >= 0){
        a = this.orbitSection[id].orbitPara.a * 1.0;
        e = this.orbitSection[id].orbitPara.e * 1.0;
        i = this.orbitSection[id].orbitPara.i * pi;
        Om = this.orbitSection[id].orbitPara.Om * pi;
        om = this.orbitSection[id].orbitPara.om * pi;
        theta = this.orbitSection[id].orbitPara.theta * pi;
    }
    else{
        return;
    }
    HoverText.initOrRefreshHoverTextDiv((a).toFixed(2),(e).toFixed(2),(i).toFixed(2),(Om).toFixed(2),(om).toFixed(2),(theta).toFixed(2),ORBIT.basePosition);

};
//获取卫星轨道中心星体
ORBIT.Orbit.prototype.getCenterId = function(certainTime){
    var centerid;
    var id = this.detectCurrentSection(certainTime);
    if(id == -1 || id == -2){
        centerid = this.centerid;
    }
    else if(id >= 0){
        centerid = this.orbitSection[id].centerid;
    }
    return centerid;
};
//获取卫星轨道中心星体的位置
ORBIT.Orbit.prototype.getCenterPosition = function(certainTime){
    var centerid = this.getCenterId(certainTime), centerPosition, simu;
    if(certainTime == null || certainTime == undefined){
        simu = ORBIT.t_simu;
    }
    else{
        simu = certainTime;
    }
    var overTime = julian(simu.getMonth() + 1, simu.getDate(),
        simu.getFullYear()) + numberSecond(simu.getHours(),
        simu.getMinutes(), simu.getSeconds());
    var pPosition = ORBIT.Orbit1.getPlanetPosition(centerid, overTime);
    if(ORBIT.tracedTargetTpye == 'Planet'){
        pid = ORBIT.tracedObject.id;
    }
    else{
        var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
        var id = orbit.detectCurrentSection();
        pid = orbit.getCenter(id);
//        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(pid != centerid){
        centerPosition = new THREE.Vector3(pPosition[0] / ORBIT.orbitCoe, pPosition[1] / ORBIT.orbitCoe, pPosition[2] / ORBIT.orbitCoe);
    }
    else{
        centerPosition = ORBIT.planet[centerid].object.position;
    }
    return new THREE.Vector3(centerPosition.x, centerPosition.y, centerPosition.z);
};
//根据指定时间获取中心星体的位置
ORBIT.Orbit.prototype.getCenterPositionByTime = function(certainTime, centerid){
    var centerPosition, simu = certainTime;
    var overTime = julian(simu.getMonth() + 1, simu.getDate(),
        simu.getFullYear()) + numberSecond(simu.getHours(),
        simu.getMinutes(), simu.getSeconds());
    var pPosition = ORBIT.Orbit1.getPlanetPosition(centerid, overTime);
    if(ORBIT.tracedTargetTpye == 'Planet'){
        pid = ORBIT.tracedObject.id;
    }
    else{
        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(pid != centerid){
        centerPosition = new THREE.Vector3(pPosition[0] / ORBIT.orbitCoe, pPosition[1] / ORBIT.orbitCoe, pPosition[2] / ORBIT.orbitCoe);
    }
    else{
        centerPosition = ORBIT.planet[centerid].object.position;
    }
    return new THREE.Vector3(centerPosition.x, centerPosition.y, centerPosition.z);
};
//根据视角获取中心星体
ORBIT.Orbit.prototype.getCenterIdByAngle = function(){
    var id = this.detectSectionByAngle(), centerid;
    if(id == -1){
        centerid = this.centerid;
    }
    else{
        centerid = this.orbitSection[id].centerid;
    }
    return centerid;
};
//根据视角获取中心星体的位置
ORBIT.Orbit.prototype.getCenterPositionByAngle = function(){
    var id = this.detectSectionByAngle(), position;
    if(id == -1){
        position = ORBIT.planet[this.centerid].object.position;
    }
    else{
        position = ORBIT.planet[this.orbitSection[id].centerid].object.position;
    }
    return new THREE.Vector3(position.x, position.y, position.z);
};
//获取轨道六根数
ORBIT.Orbit.prototype.getOrbitPara = function(){
    var id = this.detectCurrentSection();
    var orbitPara;
    if(id == -1 || id == -2){
        orbitPara = ORBIT.orbitpara[this.sid];
    }
    else{
        orbitPara = this.orbitSection[id].orbitPara;
    }
    return orbitPara;
};
//获取卫星最后一段的中心星体
ORBIT.Orbit.prototype.getLastCenter = function(){
    var len = this.orbitSection.length;
    if(len > 0){
        return this.orbitSection[len - 1].centerid;
    }
    else{
        return this.centerid;
    }
};
//获取指定轨道段的前一段的中心星体
ORBIT.Orbit.prototype.getPreCenter = function(id){
    if(id <= 1){
        return this.centerid;
    }
    else{
        return this.orbitSection[id - 2].centerid;
    }
};
//获取指定轨道段的后一段的中心星体
ORBIT.Orbit.prototype.getNextCenter = function(id){
    return this.orbitSection[id + 1].centerid;
};
//获取指定段的中心星体
ORBIT.Orbit.prototype.getCenter = function(id){
    if(id == -1){
        return this.centerid;
    }
    else{
        return this.orbitSection[id].centerid;
    }
};
//获取指定段的起始星体
ORBIT.Orbit.prototype.getStartCenter = function(id){
    if(id == -1){
        return this.centerid;
    }
    else{
        return this.orbitSection[id].startCenter;
    }
};
//获取指定段的结束星体
ORBIT.Orbit.prototype.getEndCenter = function(id){
    if(id == -1){
        return this.centerid;
    }
    else{
        return this.orbitSection[id].endCenter;
    }
};
//获取指定段的开始时间
ORBIT.Orbit.prototype.getStartTime = function(id){
    if(id == -1){
        return ORBIT.satellite[this.sid].t_start;
    }
    else{
        return this.orbitSection[id].startTime;
    }
};
//获取指定段的结束时间
ORBIT.Orbit.prototype.getEndTime = function(id){
    if(id == -1){
        return ORBIT.satellite[this.sid].t_stop;
    }
    else{
        return this.orbitSection[id].endTime;
    }
};
//获取指定段的速度差
ORBIT.Orbit.prototype.getSpeedDifference = function(id){
    if(id == -1){
        return 0;
    }
    else{
        return this.orbitSection[id].speed;
    }
};
//获取指定段的类型（即是否可转移）
ORBIT.Orbit.prototype.getIsTransfer = function(id){
    if(id == -1){
        return false;
    }
    else{
        return this.orbitSection[id].isTransferSection;
    }
};
//获取轨道段通过ID
ORBIT.Orbit.prototype.getOrbitSectionById = function(id){
    if(id == -1){
        return this;
    }
    else{
        return this.orbitSection[id];
    }
};
//获取指定段的六根数
ORBIT.Orbit.prototype.getOrbitSectionPara = function(id){
    if(id == -1){
        return ORBIT.orbitpara[this.sid];
    }
    else{
        return this.orbitSection[id].orbitPara;
    }
};
//修改指定段的开始时间
ORBIT.Orbit.prototype.updateStartTime = function(id, startTime){
    if(id == -1){
        ORBIT.satellite[this.sid].t_start = startTime;
    }
    else{
        this.orbitSection[id].startTime = startTime;
    }
};
//修改指定段的结束时间
ORBIT.Orbit.prototype.updateEndTime = function(id, endTime){
    if(id == -1){
        ORBIT.satellite[this.sid].t_stop = endTime;
    }
    else{
        this.orbitSection[id].endTime = endTime;
    }
};
//修改轨道段是否可转移
ORBIT.Orbit.prototype.updateIsTransfer = function(id, flag){
    if(id != -1){
        this.orbitSection[id].isTransferSection = flag;
    }
};
//获取倒数第二段的结束时间
ORBIT.Orbit.prototype.getLastETime = function(id){
    if(id == null || id == undefined){
        var len = this.orbitSection.length;
        var endTime, eTime;
        if(len <= 2){
            eTime = ORBIT.satellite[this.sid].epochTime.getTime();
            endTime = new Date(eTime);
        }
        else{
            eTime = this.orbitSection[len - 4].endTime.getTime();
            endTime = new Date(eTime);
        }
        return endTime;
    }
};
//获取默认的添加轨道段的开始时间
ORBIT.Orbit.prototype.getDefaultSTime = function(){
    var len = this.orbitSection.length;
    var startTime, sTime, eTime;
    if(len == 0){
        sTime = ORBIT.satellite[this.sid].epochTime.getTime();
        eTime = ORBIT.satellite[this.sid].t_stop.getTime();
        if(sTime + 24 * 3600 * 1000 > eTime){
            startTime = new Date(sTime);
        }
        else{
            startTime = new Date(sTime + 24 * 3600 * 1000);
        }
    }
    else{
        sTime = this.orbitSection[len - 1].startTime.getTime();
        eTime = this.orbitSection[len - 1].endTime.getTime();
        if(sTime + 24 * 3600 * 1000 > eTime){
            startTime = new Date(sTime);
        }
        else{
            startTime = new Date(sTime + 24 * 3600 * 1000);
        }
    }
    return startTime;
};
//根据时间获取指定段卫星位置
ORBIT.Orbit.prototype.getSatPosition = function(certainTime, id){
    var cTime = new Date(certainTime.toString()), epochTime, orbitPara;
    var centerid = this.getCenter(id);
    var planetPosition = this.getCenterPositionByTime(certainTime, centerid);
    var sat = ORBIT.satellite[this.sid];
    if(id == -1){
        epochTime = sat.epochTime;
        orbitPara = ORBIT.orbitpara[this.sid];
    }
    else if(id >= 0){
        epochTime = this.orbitSection[id].startTime;
        orbitPara = this.orbitSection[id].orbitPara;
    }
    var overSeconds = (julian(cTime.getMonth() + 1, cTime.getDate(), cTime.getFullYear()) + numberSecond(cTime.getHours(), cTime.getMinutes(), cTime.getSeconds())
        - (julian(epochTime.getMonth() + 1, epochTime.getDate(), epochTime.getFullYear()) + numberSecond(epochTime.getHours(), epochTime.getMinutes(), epochTime.getSeconds())))
        * 86400;
    var finalPosition = getPlanetTransMatrix4(overSeconds, orbitPara, 'Satellite', centerid);
    var x = (finalPosition[0].x + planetPosition.x) * ORBIT.orbitCoe;
    var y = (finalPosition[0].y + planetPosition.y) * ORBIT.orbitCoe;
    var z = (finalPosition[0].z + planetPosition.z) * ORBIT.orbitCoe;
    return new THREE.Vector3(x, y, z);
};
//获取轨道段段数
ORBIT.Orbit.prototype.getSectionSum = function(){
    var len = this.orbitSection.length;
    return len;
};
//获取轨道段列表
ORBIT.Orbit.prototype.getOrbitSection = function(){
    var sectionList = [];
    var len = this.orbitSection.length;
    var row;
    for(var i = -1; i < len; i++){
        if(i == -1){
            row = {
                numberId: 0,
                currentPlanet: ORBIT.Planet.toChinese(this.centerid),
                targetPlanet: ORBIT.Planet.toChinese(this.centerid),
                startTime: formatDate(ORBIT.satellite[this.sid].t_start),
                endTime: formatDate(ORBIT.satellite[this.sid].t_stop),
                speedDifference: 0
            };
        }
        else{
            row = {
                numberId: i + 1,
                currentPlanet: ORBIT.Planet.toChinese(this.getStartCenter(i)),
                targetPlanet: ORBIT.Planet.toChinese(this.getEndCenter(i)),
                startTime: formatDate(this.getStartTime(i)),
                endTime: formatDate(this.getEndTime(i)),
                speedDifference: this.getSpeedDifference(i)
            };
        }
        sectionList[sectionList.length] = row;
    }
    return sectionList;
};
//检测轨道段的合法性
ORBIT.Orbit.prototype.isSectionValid = function(){
    var len = this.orbitSection.length;
    var flag = true, startTime, endTime, startCenter, endCenter, lastIsTransfer, nextIsTransfer;//判断是否合法

    for(var i = -1; i < len; i++){
        if(i == -1){
        //比较各段时间是否合法
            startTime = ORBIT.satellite[this.sid].t_start;
            endTime = ORBIT.satellite[this.sid].t_stop;
            if(startTime.getTime() > endTime.getTime()){
                flag = false;
                break;
            }
        }
        else{
            //比较各段时间是否合法
            startTime = this.getEndTime(i - 1);
            endTime = this.getStartTime(i);
            if(startTime.getTime() != endTime.getTime()){
                flag = false;
                break;
            }
            startTime = this.getEndTime(i);
            if(startTime.getTime() < endTime.getTime()){
                flag = false;
                break;
            }
            //比较各段星体是否合法
            startCenter = this.getEndCenter(i - 1);
            endCenter = this.getStartCenter(i);
            if(endCenter != startCenter){
                flag = false;
                break;
            }
            //判断相邻两段的转移性是否相同
            lastIsTransfer = this.getIsTransfer(i - 1);
            nextIsTransfer = this.getIsTransfer(i);
            if(lastIsTransfer == nextIsTransfer){
                flag = false;
                break;
            }
        }
    }
    return flag;
};
//判断轨道能否转移
ORBIT.Orbit.prototype.isTransfer = function(id, sTime, startCenter, endPlanet, eTime){
    var startTime = sTime.getTime();
    var endTime = eTime.getTime();
    var startPos = this.getSatPosition(sTime, id - 1);
    var startPosition = [
        startPos.x,
        startPos.y,
        startPos.z
    ];
    //获取目标星体的位置
    var endDate = julian(eTime.getMonth() + 1, eTime.getDate(), eTime.getFullYear()) + numberSecond(eTime.getHours(), eTime.getMinutes(), eTime.getSeconds());
    var end = ORBIT.Orbit1.getPlanetPosition(endPlanet, endDate);
    var endPos = new THREE.Vector3(end[0], end[1], end[2]);

    var position = orb2rv(new Array([ORBIT.orbitPara["a"] * (1 - Math.pow(ORBIT.orbitPara["e"], 2))])[0], new Array([ORBIT.orbitPara["e"]])[0], new Array([ORBIT.orbitPara["i"]])[0], new Array([ORBIT.orbitPara["Om"]])[0], new Array([ORBIT.orbitPara["om"]])[0], new Array([ORBIT.orbitPara["theta"]])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([ORBIT.GravitationalConstant[endPlanet]])[0]);
    var endPosition = new THREE.Vector3(position[0][0][0], position[0][0][1], position[0][0][2]);
    endPosition.applyMatrix4(ORBIT.PlanetJ2000Matrix[endPlanet]);
    endPosition.x += endPos.x;
    endPosition.y += endPos.y;
    endPosition.z += endPos.z;
    var FTIME = (endTime - startTime) / 1000;
    var velocity = ORBIT.lambert.getSatTransferVelocity(startPos, endPosition, FTIME);
    var startVelocity = [
        velocity[0].x,
        velocity[0].y,
        velocity[0].z
    ];
    var orb = rv2orb(startPosition, startVelocity, ORBIT.GravitationalConstant["sun"]);
    if(!(orb[0] > 0)){
        return false;
    }
    if(!(orb[1] > 0 && orb[1] < 1)){
        return false;
    }
    if(!(orb[2] >= 0 && orb[2] <= Math.PI)){
        return false;
    }
    for(var i = 3; i < 6; i++){
        if(!(orb[i] >= 0 && orb[i] <= 2 * Math.PI)){
            return false;
        }
    }
    return true;
//    if(Matrix.calculateVectorLength(velocity[0]) == 0 ||
//        Matrix.calculateVectorLength(velocity[1]) == 0){
//        return false;
//    }
//    else{
//        return true;
//    }
};
//添加默认的的轨道段
ORBIT.Orbit.prototype.addDefaultSection = function(selectId){
    var isTransfer, startCenter, endCenter;
    isTransfer = this.getIsTransfer(selectId);
    startCenter = this.getEndCenter(selectId);
    endCenter = ORBIT.Planet.getDefaultPlanet(startCenter);
    var sTime = this.getEndTime(selectId);
    var endTime = new Date(sTime.getTime());// + 365 * 2 * 24 * 3600 * 1000
    if(isTransfer){
        this.addOrbitSection(selectId + 1, sTime, startCenter, endTime);
    }
    else{
        this.addOrbitTransfer(selectId + 1, sTime, startCenter, endCenter);
    }
};
//添加行星上的轨道段
ORBIT.Orbit.prototype.addOrbitSection = function(id, sTime, endPlanet, eTime){
    var rToA = 180 / Math.PI;
    var orbitPara = new ORBIT.OrbitPara(ORBIT.orbitPara["i"] * rToA, ORBIT.orbitPara["a"], ORBIT.orbitPara["e"], ORBIT.orbitPara["Om"] * rToA, ORBIT.orbitPara["om"] * rToA, ORBIT.orbitPara["theta"] * rToA, endPlanet);
    var orbit = this.makeOrbitSection(id, sTime, endPlanet, eTime, orbitPara);
    this.addSection(orbit, id - 1);
};
//添加转移轨道
ORBIT.Orbit.prototype.addOrbitTransfer = function(id, sTime, startCenter, endPlanet, toTime){
    var eTime;
    if(toTime != null && toTime != undefined){
        eTime = new Date(toTime.toString());
    }
    else{
        eTime = ORBIT.Orbit.calculateEndTime(sTime, startCenter, endPlanet);
    }
    var orbit = this.makeOrbitTransfer(id, sTime, startCenter, endPlanet, toTime, "add");
    this.addSection(orbit, id - 1);
//    var rToA = 180 / Math.PI;
//    var orbitPara1 = new ORBIT.OrbitPara(ORBIT.orbitPara["i"] * rToA, ORBIT.orbitPara["a"], ORBIT.orbitPara["e"], ORBIT.orbitPara["Om"] * rToA, ORBIT.orbitPara["om"] * rToA, ORBIT.orbitPara["theta"] * rToA, endPlanet);
//    var orbit1 = new OrbitSection(this.orbitSection.length, this.sid, endPlanet, endPlanet, endPlanet, orbitPara1, new Date(eTime.toString()), new Date(ORBIT.satellite[this.sid].t_stop.toString()), 0, false);
//    orbit1.setPosition(new Date(ORBIT.t_simu.toString()));
//    this.addSection(orbit1);
//    this.hideCharacter();
    //将前一轨道段的结束时间改为此段的开始时间
//    var lastId = this.orbitSection.length - 2;
//    this.updateEndTime(lastId, new Date(sTime.toString()));
//    if(lastId >= 0){
//        this.orbitSection[lastId].endTime = new Date(sTime.toString());
//    }
};
//添加轨道段
ORBIT.Orbit.prototype.addSection = function(orbitSection, id){
    var len = this.orbitSection.length;
    if(id != null && id != undefined && len != 0){
        for(var i = len; i > id + 1; i--){
            this.orbitSection[i] = this.orbitSection[i - 1];
            this.orbitSection[i].id += 1;
        }
        this.orbitSection[i] = orbitSection;
    }
    else{
        this.orbitSection[len] = orbitSection;
    }
};
//修改指定轨道段
ORBIT.Orbit.prototype.updateSection = function(id, sTime, startCenter, endPlanet, toTime){
    var section;
    if(id == -1){
        ORBIT.satellite[this.sid].t_start = sTime;
        ORBIT.satellite[this.sid].t_stop = toTime;
    }
    else{
        if(startCenter == endPlanet){
            this.hideSection(id);
            var orbitPara;
            if(this.getIsTransfer(id)){//如果改之前是转移轨道
                var rToA = 180 / Math.PI;
                orbitPara = new ORBIT.OrbitPara(ORBIT.orbitPara["i"] * rToA, ORBIT.orbitPara["a"], ORBIT.orbitPara["e"], ORBIT.orbitPara["Om"] * rToA, ORBIT.orbitPara["om"] * rToA, ORBIT.orbitPara["theta"] * rToA, endPlanet);
            }
            else{
                orbitPara = this.getOrbitSectionPara(id);
            }
            section = this.makeOrbitSection(id, sTime, endPlanet, toTime, orbitPara);
            this.updateIsTransfer(id, false);
        }
        else{
            this.hideSection(id);
            section = this.makeOrbitTransfer(id, sTime, startCenter, endPlanet, toTime, "update");
            this.updateIsTransfer(id, true);
        }
        this.orbitSection[id] = section;
        this.orbitSection[id].show();
    }
};
//删除轨道段
ORBIT.Orbit.prototype.deleteSection = function(id){
    var len = this.orbitSection.length;
    if(id != null && id != undefined){
        if(id != -1){
            this.orbitSection[id].hide();
            for(var i = id; i < len - 1; i++){
                this.orbitSection[i] = this.orbitSection[i + 1];
                this.orbitSection[i].id -= 1;
            }
            delete this.orbitSection[len - 1];
            this.orbitSection.length -= 1;
        }
    }
    else{
        var len = this.orbitSection.length;
        if(len >= 2){
            this.orbitSection[len - 1].hide();
            delete this.orbitSection[len - 1];
            this.orbitSection.length -= 1;
            this.orbitSection[len - 2].hide();
            delete this.orbitSection[len - 2];
            this.orbitSection.length -= 1;
            if(len - 2 > 0){
                var endTime = new Date(ORBIT.satellite[this.sid].t_stop.toString());
                this.orbitSection[len - 3].endTime = endTime;
            }
        }
    }
};
//绘制行星上轨道段
ORBIT.Orbit.prototype.makeOrbitSection = function(id, sTime, endPlanet, eTime, orbitPara){
    var orbit = new OrbitSection(id, this.sid, endPlanet, endPlanet, endPlanet, orbitPara, new Date(sTime.toString()), new Date(eTime.toString()), 0, false);
    orbit.setPosition(new Date(ORBIT.t_simu.toString()));
    return orbit;
};
//绘制转移轨道段
ORBIT.Orbit.prototype.makeOrbitTransfer = function(id, sTime, startCenter, endPlanet, toTime, operation){
    var eTime;
    if(toTime != null && toTime != undefined){
        eTime = new Date(toTime.toString());
    }
    else{
        eTime = ORBIT.Orbit.calculateEndTime(sTime, startCenter, endPlanet);
    }
    var startTime = sTime.getTime();
    var endTime = eTime.getTime();
    var startPos;
    //如果上一段是非转移轨道，就获取上一段的卫星的位置
    if(this.getIsTransfer(id - 1)){
        startPos = ORBIT.Orbit1.getPlanetPosition(startCenter,
        julian(sTime.getMonth() + 1, sTime.getDate(), sTime.getFullYear())
                + numberSecond(sTime.getHours(), sTime.getMinutes(), sTime.getSeconds())
        );
        startPos = new THREE.Vector3(startPos[0], startPos[1], startPos[2]);
    }
    else{
        startPos = this.getSatPosition(sTime, id - 1);
    }
    var startPosition = [
        startPos.x,
        startPos.y,
        startPos.z
    ];
    //获取目标星体的位置
    var endDate = julian(eTime.getMonth() + 1, eTime.getDate(), eTime.getFullYear()) + numberSecond(eTime.getHours(), eTime.getMinutes(), eTime.getSeconds());
    var end = ORBIT.Orbit1.getPlanetPosition(endPlanet, endDate);
    var endPos = new THREE.Vector3(end[0], end[1], end[2]);

    var position = orb2rv(new Array([ORBIT.orbitPara["a"] * (1 - Math.pow(ORBIT.orbitPara["e"], 2))])[0], new Array([ORBIT.orbitPara["e"]])[0], new Array([ORBIT.orbitPara["i"]])[0], new Array([ORBIT.orbitPara["Om"]])[0], new Array([ORBIT.orbitPara["om"]])[0], new Array([ORBIT.orbitPara["theta"]])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([ORBIT.GravitationalConstant[endPlanet]])[0]);
    var endPosition = new THREE.Vector3(position[0][0][0], position[0][0][1], position[0][0][2]);
    endPosition.applyMatrix4(ORBIT.PlanetJ2000Matrix[endPlanet]);
    endPosition.x += endPos.x;
    endPosition.y += endPos.y;
    endPosition.z += endPos.z;
    var FTIME = (endTime - startTime) / 1000;
    var velocity = ORBIT.lambert.getSatTransferVelocity(startPos, endPosition, FTIME);

    var startVelocity = [
        velocity[0].x,
        velocity[0].y,
        velocity[0].z
    ];
    var orb = rv2orb(startPosition, startVelocity, ORBIT.GravitationalConstant["sun"]);
    var rToA = 180 / Math.PI;
    var orbitPara = new ORBIT.OrbitPara(orb[2] * rToA, orb[0], orb[1], orb[3] * rToA, orb[4] * rToA, orb[5] * rToA, "sun");
    var speed = (Matrix.calculateVectorMinus(velocity[0], velocity[1])).toFixed(2);
    var orbit = new OrbitSection(id, this.sid, "sun", startCenter, endPlanet, orbitPara, new Date(sTime.toString()), new Date(eTime.toString()), speed, true);
    return orbit;
};
//显示所有的卫星轨道
ORBIT.Orbit.showAllOrbit = function(){
    for(var i in ORBIT.orbit) {
        var orbit = ORBIT.orbit[i];
        orbit.showOrbit();
        orbit.showAllSection();
    }
};
//刷新轨道段的特征轴
ORBIT.Orbit.refreshOrbitSectionAxis = function(){
    if(ORBIT.selectOrbitSectionId != null){
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        var len = orbit.orbitSection.length;
        if(len > 0){
            var orbitSection = orbit.orbitSection[len - 2];
            var startPosition = orbitSection.startPosition, endPosition = orbitSection.endPosition;
            var sDirection = new THREE.Vector3(-startPosition.x, -startPosition.y, -startPosition.z);
            var eDirection = new THREE.Vector3(-endPosition.x, -endPosition.y, -endPosition.z);
            var axisZRotation = Matrix.axisZRotationMatrix(Math.PI/2);
            var startDirection = sDirection.applyMatrix4(axisZRotation);
            var endDirection = eDirection.applyMatrix4(axisZRotation);
            //设置轴的方向
            ORBIT.characterAxis["sTime"].setDirection(startDirection);
            ORBIT.characterAxis["eTime"].setDirection(endDirection);
            //设置轴的位置
            ORBIT.characterAxis["sTime"].setPosition(startPosition);
            ORBIT.characterAxis["eTime"].setPosition(endPosition);
        }
        else{
            removeOrbitSectionAxis();
        }
    }
};
//计算星际间转移到达时间
ORBIT.Orbit.calculateEndTime = function(sTime, startCenter, endPlanet){
    var trana;//转移轨道半长轴
    if(startCenter == "moon" && endPlanet == "earth" ||
        endPlanet == "moon" && startCenter == "earth"){
        trana = ORBIT.planetA["moon"];
    }
    else{
        trana = (ORBIT.planetA[startCenter] + ORBIT.planetA[endPlanet]) / 2;
    }
    //轨道转移时间
    var tranTime = 2 * Math.PI * Math.pow(Math.pow(trana, 3) / ORBIT.GravitationalConstant["sun"], 0.5);
    var startTime = sTime.getTime();
    var endTime = startTime + tranTime / 2 * 1000;
    return new Date(endTime);
};
//卫星轨道转移
var endVelocity, endPosition, startFlag = false, endFlag = false;
ORBIT.Orbit.satOrbitTransfer = function(sid, endPlanet){
    if(startFlag)
        return;
    var coe = ORBIT.orbitCoe;
    var currentTime = ORBIT.t_simu.getTime();
    var sTime = new Date("7 17,2012 04:00:00");
    var eTime = new Date("10 10,2012 04:00:00");
    var startTime = sTime.getTime();
    var endTime = eTime.getTime();
    var startPos = new THREE.Vector3(ORBIT.satellite[sid].object.position.x * coe, ORBIT.satellite[sid].object.position.y * coe, ORBIT.satellite[sid].object.position.z * coe);
    var startPosition = [
        startPos.x,
        startPos.y,
        startPos.z
    ];
    var endDate = julian(eTime.getMonth() + 1, eTime.getDate(), eTime.getFullYear()) + numberSecond(eTime.getHours(), eTime.getMinutes(), eTime.getSeconds());
    var end = venus(endDate);
    var endPos = new THREE.Vector3(end[0], end[1], end[2]);

    var position = orb2rv(new Array([20000 * (1 - Math.pow(0.1, 2))])[0], new Array([0.1])[0], new Array([Math.PI / 4])[0], new Array([0])[0], new Array([Math.PI / 4])[0], new Array([20 / 180 * Math.PI])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([ORBIT.GravitationalConstant[endPlanet]])[0]);
    endPosition = new THREE.Vector3(position[0][0][0], position[0][0][1], position[0][0][2]);
    endPosition.applyMatrix4(ORBIT.PlanetJ2000Matrix[endPlanet]);
    endPosition.x += endPos.x;
    endPosition.y += endPos.y;
    endPosition.z += endPos.z;
    var FTIME = (endTime - startTime) / 1000;
//如果仿真开始时间等于开始转移时间,开始将轨道向太阳转移
    if(currentTime >= startTime && !startFlag){
        startFlag = true;
        var velocity = ORBIT.lambert.getSatTransferVelocity(startPos, endPosition, FTIME);
        var startVelocity = [
            velocity[0].x,
            velocity[0].y,
            velocity[0].z
        ];
        endVelocity = [
            velocity[1].x,
            velocity[1].y,
            velocity[1].z
        ];
        var orb = rv2orb(startPosition, startVelocity, ORBIT.GravitationalConstant["sun"]);
        var rToA = 180 / Math.PI;
        var orbitPara = new ORBIT.OrbitPara(orb[2] * rToA, orb[0], orb[1], orb[3] * rToA, orb[4] * rToA, orb[5] * rToA, "sun");
        var speed = 1;
        var t_simu = new Date(ORBIT.t_simu.toString());
        var orbit = new OrbitSection(0, "卫星1", "sun", orbitPara, t_simu, new Date(eTime.toString()), speed);
        ORBIT.orbit[sid].addSection(orbit);
        ORBIT.orbit[sid].orbitSection[0].show();

        var orbitPara1 = new ORBIT.OrbitPara(Math.PI / 4, 20000, 0.1, 0, Math.PI / 4, 20 * Math.PI / 180, endPlanet);
        var orbit1 = new OrbitSection(1, "卫星1", endPlanet, orbitPara1, new Date(eTime.toString()), ORBIT.satellite[sid].t_stop, speed);
        orbit1.setPosition(new Date(eTime.toString()));
        ORBIT.orbit[sid].addSection(orbit1);
        ORBIT.orbit[sid].hideCharacter();
        ORBIT.orbit[sid].orbitSection[1].show();
    }
};
ORBIT.Orbit.prototype.resetShape = function(porbit, ptype) {
    this.object.geometry.vertices = [];
    //TODO Math.round need to be revise
    var resolution = Math.round(porbit.a/4) > 100 ? Math.round(porbit.a/4) : 100;
    var size = 360.0/resolution;
    var deltasegment = size * Math.PI/180;
    var segment = 0;
    //console.log(porbit);
    //add segment of orbit
    for(var i = 0; i <= resolution; i++) {
        var vector3 = new THREE.Vector3(Math.sin(segment) * porbit.b, 0, -porbit.c + Math.cos(segment) * porbit.a);
        this.object.geometry.vertices.push(vector3);
        segment += deltasegment;
    }
    switch(ptype){
        case 'Satellite':
//            //TODO for test
//            this.object.geometry.vertices.push(new THREE.Vector3(0, 0, -porbit.c));
//            this.object.geometry.vertices.push(new THREE.Vector3(-porbit.b, 0, -porbit.c));
//            this.object.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            break;
        default:
    }
    var v_temp = this.object.geometry.vertices.pop();
    for(; i <= ORBIT.max_vertices; i++) {
        this.object.geometry.vertices.push(v_temp);
    }
    this.object.geometry.verticesNeedUpdate = true;
};

ORBIT.Orbit.prototype.refreshAttiAndPosition = function(porbit, ptype, pcid){
    this.object.matrix = new THREE.Matrix4();
    var m1 = new THREE.Matrix4();
    if( 'Satellite' == ptype ) {
        m1.makeRotationFromEuler(new THREE.Euler(0, 0, -ORBIT.planet[pcid].tilt, 'XYZ'));
    }
    var m2 = new THREE.Matrix4();
    m2.makeRotationFromEuler(new THREE.Euler(0, porbit.Om, porbit.i, 'XYZ'));
    var m3 = new THREE.Matrix4();
    m3.multiplyMatrices(m1,m2); //this = p1 * p2
    var pivot1 = new THREE.Vector3(0, 1, 0);
    pivot1.applyMatrix4(m3);
    pivot1 = pivot1.normalize();
    var m4 = new THREE.Matrix4();
    m4.makeRotationAxis(pivot1, porbit.om);
    var m5 = new THREE.Matrix4();
    m5.multiplyMatrices(m4,m3); //set rotation matrix
    var m6 = new THREE.Matrix4(); //set position matrix
    m6.setPosition(ORBIT.planet[pcid].object.position);
    var m7 = new THREE.Matrix4();
    m7.multiplyMatrices(m6,m5);
    this.object.applyMatrix(m7); //line.m = p * this
    this.object.geometry.verticesNeedUpdate = true;//if(this.id == "earthOrbit")alert(this.object.position.getX);
};
//////////////////////////////////////////
ORBIT.Orbit1 = function(pname, ptype, pcent,color){
    this.object = this.makeOrbit1(pname, ptype,color);
    this.centerid = pcent;
    this.Matrix4 = new THREE.Matrix4();
};
////初始化轨道的尾巴
//var initTailById = function(pname, position){
//    var pos = [];
//    pos[0] = position[0] / ORBIT.orbitCoe;
//    pos[1] = position[1] / ORBIT.orbitCoe;
//    pos[2] = position[2] / ORBIT.orbitCoe;
//    ORBIT.tail[pname].pushStack(pos);
//};
//根据不同的行星以及时间计算其位置
ORBIT.Orbit1.getPlanetPosition = function(pname, overTime){
    var position ;
    switch(pname){
        case "mercury":
            position = mercury(overTime);
            break;
        case "venus":
            position = venus(overTime);
            break;
        case "earth":
            position = earth(overTime);
            break;
        case "mars":
            position = mars(overTime);
            break;
        case "jupiter":
            position = jupiter(overTime);
            break;
        case "saturn":
            position = saturn(overTime);
            break;
        case "uranus":
            position = uranus(overTime);
            break;
        case "neptune":
            position = neptune(overTime);
            break;
        case "moon":
            var moonPositin = moon(overTime);
            var earthPosition = earth(overTime);
            position = new Array(3);
            position[0] = moonPositin[0] + earthPosition[0];
            position[1] = moonPositin[1] + earthPosition[1];
            position[2] = moonPositin[2] + earthPosition[2];
            break;
        case "sun":
            position = new Array(3);
            position[0] = 0;
            position[1] = 0;
            position[2] = 0;
            break;
    }
    return position;
};
var drawOrbit = function (pname, smonth, sday, syear){
    var geometry = new THREE.Geometry();
    geometry.dynamic = true;
    var coe = ORBIT.orbitCoe;
    var start = julian(smonth, sday, syear);
    var endDate = calculateEndDate(sday, smonth, syear ,res[pname]+1);
    var end = julian(endDate.getMonth()+1, endDate.getDate(), endDate.getFullYear());
    for(var i = start;i <= end; i++){
        var position =ORBIT.Orbit1.getPlanetPosition(pname,i);
        var vector3 = new THREE.Vector3(position[0]/coe, position[1]/coe, position[2]/coe);
        geometry.vertices.push(vector3);
    }
    return geometry;
};

var calcuPosition =  function(pname,smonth, sday, syear){
    var start = julian(smonth, sday, syear);
    var position;
    switch(pname){
        case "mercury":position = mercury(start);break;
        case "venus":position = venus(start);break;
        case "earth":position = earth(start);break;
        case "mars":position = mars(start);break;
        case "jupiter":position = jupiter(start);break;
        case "saturn":position = saturn(start);break;
        case "uranus":position = uranus(start);break;
        case "neptune":position = neptune(start);break;
    }
    return position;
}
ORBIT.Orbit1.prototype.makeOrbit1 = function(pname, ptype,color) {

    var geometry = new THREE.Geometry();
    geometry.dynamic = true;
    var material;
    if(pname != "moon" && pname != "sate"){
        geometry = drawOrbit(pname, 1, 1, 2012);
    }
    else if(pname == "moon"){
        var coe = ORBIT.orbitCoe;
        var start = julian(1, 1, 2012);
        var endDate = calculateEndDate(1,1,2012 ,res[pname] + 1);
        var end = julian(endDate.getMonth()+1, endDate.getDate(), endDate.getFullYear());
        for(var i = start;i <= end; i++){
            for(var j = i; j < i+1; j += 0.1){
                if(j >= end - 0.6){
                    var moonParamter = moon(start);
                    var vector3 = new THREE.Vector3(moonParamter[0]/coe, moonParamter[1]/coe,moonParamter[2]/coe);
                    geometry.vertices.push(vector3);
                    break;
                }
                var moonParamter = moon(j);
                var vector3 = new THREE.Vector3(moonParamter[0]/coe, moonParamter[1]/coe,moonParamter[2]/coe);
                geometry.vertices.push(vector3);
            }
        }
    }
    else if(pname == "sate"){

    }
    material = new THREE.LineBasicMaterial({color: color, opacity: 0.5});
    material.transparent = true;
    var line = new THREE.Line(geometry ,material,THREE.LineStrip);
    return line;



//    var loc = Location[pname];
//    var resolution = res[pname];//pla.distance/2;
//    var geometry = new THREE.Geometry();
//    var material;
//    var j = 0;
//    var coe = 100000;
//    if('moon' == pname) coe = 2000;
//    //add segment of orbit
//    for(var i = 0; i <= resolution; i++) {
//        var vector3 = new THREE.Vector3(loc[j+1]/coe, loc[j+2]/coe, loc[j]/coe);
//        geometry.vertices.push(vector3);
//        j+=3;
//    }
//    geometry.dynamic = true;
//    //set orbit color based on the type
//    switch(ptype){
//        case 'Planet':
//            material = new THREE.LineBasicMaterial({color: 0xffff00, opacity: 0.5});
//            break;
//        case 'Satellite':
//            material = new THREE.LineBasicMaterial({color: 0xff00ff, opacity: 1});
//            break;
//        default:
//    }
//    //set orbit transparent
//    material.transparent = true;
//    return new THREE.Line( geometry, material, THREE.LineStrip );//LinePieces



};