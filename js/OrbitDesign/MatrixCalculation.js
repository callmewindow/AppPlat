/**
 * Created by Taivas on 5/14/14.
 */
var getPlaTransMatrix4 = function(ptheta_revol, porbit, ptype) {
    //Make translation Matrix
    var tVector3 = new THREE.Vector3(porbit.b * Math.sin(ptheta_revol + porbit.theta),
        0,
        -porbit.c + porbit.a * Math.cos(ptheta_revol + porbit.theta));
    var pivot = new THREE.Vector3(0, 1, 0);
    var euler = new THREE.Euler(0, porbit.Om, porbit.i, 'XYZ');
    pivot.applyEuler(euler);
    tVector3.applyEuler(euler);
    if( 'Satellite' == ptype ) {
        var euler1 = new THREE.Euler(0, 0, -ORBIT.planet['earth'].tilt, 'XYZ')
        pivot.applyEuler(euler1);
        tVector3.applyEuler(euler1);
    }
    tVector3.applyAxisAngle(pivot, porbit.om);
    //Make rotation Quaternion
    var quaternion = new THREE.Quaternion(0, 0, 0, 1);
    quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
    //Make scalar Matrix
    var sVector3 = new THREE.Vector3(1, 1, 1);
    var M4 = new THREE.Matrix4();
    M4.compose(tVector3, quaternion, sVector3);
    return M4;
};

var getPlanetTransMatrix4 = function(overSeconds, porbit, ptype, centerid, point) {
    //Make translation Matrix
    var mu = ORBIT.GravitationalConstant[centerid];
//    switch(centerid){
//        case "sun": mu = ORBIT.GravitationalConstant["sun"];break;
//        case "mercury": mu = ORBIT.GravitationalConstant["mercury"];break;
//        case "venus": mu = ORBIT.GravitationalConstant["venus"];break;
//        case "earth": mu = ORBIT.GravitationalConstant["earth"];break;
//        case "mars": mu = ORBIT.GravitationalConstant["mars"];break;
//        case "jupiter": mu = ORBIT.GravitationalConstant["jupiter"];break;
//        case "saturn": mu = ORBIT.GravitationalConstant["saturn"];break;
//        case "uranus": mu = ORBIT.GravitationalConstant["uranus"];break;
//        case "neptune": mu = ORBIT.GravitationalConstant["neptune"];break;
//        case "moon": mu = ORBIT.GravitationalConstant["moon"];break;
//    }
    var coe = ORBIT.orbitCoe;
    var position;
    if(point == "near"){
        position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    }
    else if(point == "far"){
        if(porbit.e == 0){
            overSeconds = porbit.T/2;
        }
        position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([Math.PI])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    }
    else if(point == "middle"){
        if(porbit.e == 0){
            overSeconds = porbit.T/4;
        }
        position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([Math.PI/2 - porbit.om])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    }
    else if(point == "Om"){
        if(porbit.e == 0){
            position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
        }
        else{
            position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([-porbit.om])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
        }
    }
    else{
        position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i])[0], new Array([porbit.Om])[0], new Array([porbit.om])[0], new Array([porbit.theta])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
    }

    var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([overSeconds])[0], new Array([mu])[0]);
    var sateOrbitV3 = new THREE.Vector3(finalPosition[0][0][0]/coe, finalPosition[0][0][1]/coe, finalPosition[0][0][2]/coe);
    var sateVelocity = new THREE.Vector3(finalPosition[1][0][0]/coe, finalPosition[1][0][1]/coe, finalPosition[1][0][2]/coe);
    if(point != "far" && point != "near" && point != "middle" && point != "Om"){
        if(centerid != "sun"){
            var rotationM4 = ORBIT.planet[centerid].j2000Matrix;
            sateOrbitV3.applyMatrix4(rotationM4);
            sateVelocity.applyMatrix4(rotationM4);
            if(centerid == "moon"){
                sateOrbitV3.applyMatrix4(ORBIT.planet["earth"].j2000Matrix);
                sateVelocity.applyMatrix4(ORBIT.planet["earth"].j2000Matrix);
            }
        }
    }
    return new Array(sateOrbitV3, sateVelocity);
//    var tVector3 = new THREE.Vector3(finalPosition[0][0][1]/coe, finalPosition[0][0][2]/coe, finalPosition[0][0][0]/coe);
//    var pivot = new THREE.Vector3(0, 1, 0);
//    var euler = new THREE.Euler(0, porbit.Om, porbit.i/2, 'XYZ');
//    pivot.applyEuler(euler);
//    tVector3.applyEuler(euler);
//    if( 'Satellite' == ptype ) {
//        var euler1 = new THREE.Euler(0, 0, -ORBIT.planet[centerid].tilt, 'XYZ');
//        pivot.applyEuler(euler1);
//        tVector3.applyEuler(euler1);
//    }
//    tVector3.applyAxisAngle(pivot, porbit.om);
//    //Make rotation Quaternion
//    var quaternion = new THREE.Quaternion(0, 0, 0, 1);
//    quaternion.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
//    //Make scalar Matrix
//    var sVector3 = new THREE.Vector3(1, 1, 1);
//    var M4 = new THREE.Matrix4();
//    M4.compose(tVector3, quaternion, sVector3);
//    return M4;
};
var matrixToAngle = function (M4){
    var angle = new Array(3);

    var start = new THREE.Vector3(1, 1, 1);
    var min = start.applyMatrix4(M4);
    var end = new THREE.Vector3(min.x, min.y, min.z);
    start = new THREE.Vector3(1, 1, 1);

    angle[0] = Math.acos((start.y * end.y + start.z * end.z) / Math.sqrt((Math.pow(start.y, 2) + Math.pow(start.z, 2)) * (Math.pow(end.y, 2) + Math.pow(end.z, 2))));
    // console.log(start);console.log(end);
    angle[1] = Math.acos((start.x * end.x + start.z * end.z) / Math.sqrt((Math.pow(start.x, 2) + Math.pow(start.z, 2)) * (Math.pow(end.x, 2) + Math.pow(end.z, 2))));
    // console.log(start);console.log(end);
    angle[2] = Math.acos((start.x * end.x + start.y * end.y) / Math.sqrt((Math.pow(start.x, 2) + Math.pow(start.y, 2)) * (Math.pow(end.x, 2) + Math.pow(end.y, 2))));

    return angle;
}