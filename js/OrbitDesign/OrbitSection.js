/**
 * Created by dell on 2015/1/29.
 */
//轨道段
var OrbitSection = function(id, sid, centerid, startCenter, endCenter, orbitPara, startTime, endTime, speed, isTransfer){
    this.id = id;
    this.sid = sid;
    this.centerid = centerid;
    this.startCenter = startCenter;
    this.endCenter = endCenter;
    this.startTime = new Date(Date.parse(startTime.toString()));
    this.endTime = new Date(Date.parse(endTime.toString()));
    this.speed = speed;
    this.isTransferSection = isTransfer;
    var rToA = 180 / Math.PI;
    this.orbitPara = new ORBIT.OrbitPara(orbitPara.i * rToA, orbitPara.a, orbitPara.e, orbitPara.Om * rToA, orbitPara.om * rToA, orbitPara.theta * rToA, centerid);
    this.startPosition = null;//轨道段的起点位置
    this.endPosition = null;//轨道段的终止位置
    this.object = this.makeOrbit();
};
//画轨道段
OrbitSection.prototype.makeOrbit = function(){
    var geometry = new THREE.Geometry();
    geometry.dynamic = true;
    var material;
    if(this.sid == ORBIT.selectOrbit){
        material = new THREE.LineBasicMaterial({color: 0xff7e00, opacity: 1});
    }
    else{
        material = new THREE.LineBasicMaterial({color: 0x00ffff, opacity: 1});
    }
    material.transparent = true;
    material.needsUpdate = true;

    var mu = ORBIT.GravitationalConstant[this.centerid];
    var coe = ORBIT.orbitCoe;

    var T = this.orbitPara.T/470;
    if(this.isTransferSection){
        T = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
        T /= 470;
    }

    var startPV = orb2rv(new Array([this.orbitPara.a * (1 - Math.pow(this.orbitPara.e, 2))])[0], new Array([this.orbitPara.e])[0], new Array([this.orbitPara.i])[0], new Array([this.orbitPara.Om])[0], new Array([this.orbitPara.om])[0], new Array([this.orbitPara.theta])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    var nextPV = keplerUniversal(startPV[0][0], startPV[1][0], new Array([0])[0], new Array([mu])[0]);
    var vector3 = new THREE.Vector3(nextPV[0][0][0]/coe, nextPV[0][0][1]/coe, nextPV[0][0][2]/coe);
    geometry.vertices.push(vector3);
    //设置轨道段的起点位置
    this.startPosition = vector3;
    for(var i = 0; i < 470; i++){
        nextPV = keplerUniversal(startPV[0][0], startPV[1][0], new Array([T])[0], new Array([mu])[0]);
        vector3 = new THREE.Vector3(nextPV[0][0][0]/coe, nextPV[0][0][1]/coe, nextPV[0][0][2]/coe);
        geometry.vertices.push(vector3);
        startPV = nextPV ;
    }
    //设置轨道段的终点位置
    this.endPosition = vector3;
    var line = new THREE.Line( geometry, material, THREE.LineStrip );
    if(this.centerid != "sun"){
        line.applyMatrix(ORBIT.PlanetJ2000Matrix[this.centerid]);
        if(this.centerid == "moon"){
            line.applyMatrix(ORBIT.PlanetJ2000Matrix["earth"]);
        }
        line.updateMatrix();
        //为轨道加特征点
        var nearPlanetPointPV = getPlanetTransMatrix4(0, this.orbitPara, 'Satellite', this.centerid, "near");//近地点的位置和速度
        var middlePlanetPointPV = getPlanetTransMatrix4(0, this.orbitPara, 'Satellite', this.centerid, "middle");//轨道倾角点的位置和速度
        var farPlanetPointPV = getPlanetTransMatrix4(0, this.orbitPara, 'Satellite', this.centerid, "far");//远地点的位置和速度
        var OmPlanetPointPV = getPlanetTransMatrix4(0, this.orbitPara, 'Satellite', this.centerid, "Om");//升交点赤经特征点的位置和速度

        //为特征点加轴
        ORBIT.singleAxis = new SingleAxis();
        //设置近地点的横轴
        var nearCrossAxis = ORBIT.singleAxis.makeAxis(this.sid, "near");
        ORBIT.singleAxis.setCrossAxis(nearCrossAxis, nearPlanetPointPV[0], this.orbitPara.a);
        //设置轨道倾角点的轴
        var middleVerticalAxis = ORBIT.singleAxis.makeAxis(this.sid, "middle");
        ORBIT.singleAxis.setVerticalAxis(middleVerticalAxis, middlePlanetPointPV[0], middlePlanetPointPV[1], this.orbitPara.a);
        //设置远地点的横轴
        var farCrossAxis = ORBIT.singleAxis.makeAxis(this.sid, "far");
        ORBIT.singleAxis.setCrossAxis(farCrossAxis, farPlanetPointPV[0], this.orbitPara.a);
        //设置近心点幅角点的轴
        var omCrossAxis =  ORBIT.singleAxis.makeAxis( this.sid, "om");
        ORBIT.singleAxis.setVCrossAxis(omCrossAxis, nearPlanetPointPV[0], nearPlanetPointPV[1], this.orbitPara.a);
        //设置升交点赤经点的轴
        var OmCrossAxis = ORBIT.singleAxis.makeAxis( this.sid, "Om");
        ORBIT.singleAxis.setEquatorAxis(OmCrossAxis, OmPlanetPointPV[0], OmPlanetPointPV[1], this.orbitPara.i, this.orbitPara.a);
        line.add(nearCrossAxis);
        line.add(middleVerticalAxis);
        line.add(farCrossAxis);
        line.add(omCrossAxis);
        line.add(OmCrossAxis);
    }
    else{
        //设置转移轨道起始位置的特征轴
        var sTimeAxis = ORBIT.singleAxis.makeAxis(this.sid, "sTime");
        ORBIT.singleAxis.setSectionAxis(sTimeAxis, this.startPosition);
        //设置转移轨道终止位置的特征轴
        var eTimeAxis = ORBIT.singleAxis.makeAxis(this.sid, "eTime");
        ORBIT.singleAxis.setSectionAxis(eTimeAxis, this.endPosition);
        line.add(sTimeAxis);
        line.add(eTimeAxis);
    }
    return line;
};
//显示轨道段
OrbitSection.prototype.show = function(){
    ORBIT.scene.add(this.object);
};
//隐藏轨道段
OrbitSection.prototype.hide = function(){
    ORBIT.scene.remove(this.object);
};
//设置轨道段位置
OrbitSection.prototype.setPosition = function(currentTime){
    var overTime = julian(currentTime.getMonth() + 1, currentTime.getDate(), currentTime.getFullYear())
                   + numberSecond(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
    var pPosition = ORBIT.Orbit1.getPlanetPosition(this.centerid, overTime);
    var planetPosition, pid;
    if(ORBIT.tracedTargetTpye == 'Planet'){
        pid = ORBIT.tracedObject.id;
    }
    else{
        var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
        var id = orbit.detectCurrentSection();
        pid = orbit.getCenter(id);
//        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(pid != this.centerid){
        planetPosition = new THREE.Vector3(pPosition[0] / ORBIT.orbitCoe, pPosition[1] / ORBIT.orbitCoe, pPosition[2] / ORBIT.orbitCoe);
    }
    else{
        planetPosition = ORBIT.planet[this.centerid].object.position;
    }
    this.object.position.x = planetPosition.x;
    this.object.position.y = planetPosition.y;
    this.object.position.z = planetPosition.z;
};