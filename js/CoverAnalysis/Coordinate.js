/**
 * Created by dell on 2015/1/26.
 */
//坐标系类
var Coordinate = function(){
};
//获取传感器在惯性坐标系下的指向
Coordinate.getSensorVector = function(centerid, echoTime, a, e, i, Om, om, theta, startTime, endTime, bh, arr, ix, iy, iz){
    var numberSecond = function(h, m, s) {
        return (h * 3600 + m * 60 + s)/86400;
    }; 
    //根据中心星体和卫星轨道六根数算出卫星的初始位置和速度
    var mu = ORBIT.GravitationalConstant[centerid];
    var startPV = orb2rv(new Array([a * (1 - Math.pow(e, 2))])[0], new Array([e])[0], new Array([i])[0], new Array([Om])[0], new Array([om])[0], new Array([theta])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    var startP = startPV[0][0], startV = startPV[1][0];
    //计算每一步长的卫星的速度和位置
    var startSatTime = (startTime.getTime() - echoTime.getTime()) / 1000;
    var endSatTime = (endTime.getTime() - echoTime.getTime()) / 1000;
    var startPlanetTime = julian(startTime.getMonth() + 1, startTime.getDate(), startTime.getFullYear()) + numberSecond(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
    var endPlanetTime = julian(endTime.getMonth() + 1, endTime.getDate(), endTime.getFullYear()) + numberSecond(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
    var sat = startSatTime - bh, planet = startPlanetTime - bh/86400;
    while(sat < endSatTime){
        sat += bh;
        planet += bh/86400;
        if(sat > endSatTime){
            sat = endSatTime;
            planet = endPlanetTime;
        }
        var planetP = Orbit.getPlanetPosition(centerid, planet);
//        var planetPosition = new THREE.Vector3(planetP[0], planetP[1], planetP[2]);
        var planetPosition = new THREE.Vector3(0, 0, 0);
        var satPV = keplerUniversal(startP, startV, new Array([sat])[0], new Array([mu])[0]);
        var satP = new THREE.Vector3(satPV[0][0][0], satPV[0][0][1], satPV[0][0][2]), satV = new THREE.Vector3(satPV[1][0][0], satPV[1][0][1], satPV[1][0][2]);

//        var rotationM4 = ORBIT.PlanetJ2000Matrix[centerid];
//        satP.applyMatrix4(rotationM4);
//        satV.applyMatrix4(rotationM4);
//        if(centerid == "moon"){
//            satP.applyMatrix4(ORBIT.PlanetJ2000Matrix["earth"]);
//            satV.applyMatrix4(ORBIT.PlanetJ2000Matrix["earth"]);
//        }
        satP.x += planetPosition.x;
        satP.y += planetPosition.y;
        satP.z += planetPosition.z;
        //计算轨道坐标系(根据卫星的位置、速度及中心星体的位置)
        var orbitAxis = Coordinate.calculateOrbitAxis(planetPosition, satP, satV);
        //计算行星惯性坐标系到卫星轨道坐标系的转换矩阵
        var planetx = new THREE.Vector3(1, 0, 0);
        var planety = new THREE.Vector3(0, 1, 0);
        var planetz = new THREE.Vector3(0, 0, 1);
        var transferMatrix = Coordinate.orbitToEcliptic(orbitAxis, new Array(planetx, planety, planetz), centerid);
        var orbitVector = new THREE.Vector3(ix, iy, iz);
        orbitVector.applyMatrix4(transferMatrix);
        orbitVector.normalize();
        arr.push(orbitVector.x + "," + orbitVector.y + "," + orbitVector.z);
    }

};

Coordinate.dataTransfer = function(data){
    var str = data.toString();
    if(str.indexOf(".")>-1){
        var zs = str.split(".")[0];
        var xs = str.split(".")[1];
        if(xs.length > 10){
            xs = xs.substr(0,10);

        }
        return zs+"."+xs;
    }
    return str;
};
//根据中心星体的位置以及卫星的位置和速度计算卫星轨道坐标系
Coordinate.calculateOrbitAxis = function(centerPosition, satellitePosition, satelliteVelocity){
    var endX = new THREE.Vector3(centerPosition.x - satellitePosition.x, centerPosition.y - satellitePosition.y, centerPosition.z - satellitePosition.z);
    var endY = Matrix.vectorProjection(endX, satelliteVelocity);
    var endZ = Matrix.axisVector(endX, endY);
    return new Array(endX, endY, endZ);
};
//将轨道坐标系下的向量转换到黄道坐标系
Coordinate.orbitToEcliptic = function(orbit, ecliptic){
//    var rotationM4 = ORBIT.PlanetJ2000Matrix[centerid];
//    intertia[0].applyMatrix4(rotationM4);
//    intertia[1].applyMatrix4(rotationM4);
//    intertia[2].applyMatrix4(rotationM4);
//    if(centerid == "moon"){
//        intertia[0].applyMatrix4(ORBIT.PlanetJ2000Matrix["earth"]);
//        intertia[1].applyMatrix4(ORBIT.PlanetJ2000Matrix["earth"]);
//        intertia[2].applyMatrix4(ORBIT.PlanetJ2000Matrix["earth"]);
//    }
    //轨道坐标系基底构成的矩阵
    var orbitMatrix = new THREE.Matrix4(orbit[0].x, orbit[1].x, orbit[2].x, 0,
                                        orbit[0].y, orbit[1].y, orbit[2].y, 0,
                                        orbit[0].z, orbit[1].z, orbit[2].z, 0,
                                           0,          0,          0,       1);
    //惯性坐标系基底构成的矩阵
    var intertiaMatrix = new THREE.Matrix4(ecliptic[0].x, ecliptic[1].x, ecliptic[2].x, 0,
                                           ecliptic[0].y, ecliptic[1].y, ecliptic[2].y, 0,
                                           ecliptic[0].z, ecliptic[1].z, ecliptic[2].z, 0,
                                               0,             0,             0,         1);
    intertiaMatrix = intertiaMatrix.getInverse(intertiaMatrix);
    return intertiaMatrix.multiply(orbitMatrix);
};
