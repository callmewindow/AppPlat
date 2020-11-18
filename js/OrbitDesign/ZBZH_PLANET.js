/**
 * Created by Administrator on 2014/9/2.
 */
var ZBZH_PLANET = function(){
};
ZBZH_PLANET.prototype = {
    //获取星体位置
    getPlanetPosition: function(date, pid){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();
        var sec = date.getSeconds();
        var a = 4, aT = 11, b = 1, bT;
        if(pid == "moon"){
           a = 1;aT = 3;
        }
        switch(pid){
            case "mercury":bT = 1;break;
            case "venus":bT = 2;break;
            case "earth":bT = 3;break;
            case "mars":bT = 4;break;
            case "jupiter":bT = 5;break;
            case "saturn":bT = 6;break;
            case "uranus":bT = 7;break;
            case "neptune":bT = 8;break;
            case "moon":bT = 10;break;
            case "sun":bT = 11;break;
        }
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/getPlanetPosition.json",
            method:'GET',
            async: false,
            params: {
                y:y,
                m:m,
                d:d,
                h:h,
                mi:mi,
                sec:sec,
                a:a,
                aT:aT,
                b:b,
                bT:bT
            },
            success: function(response){
                var data = JSON.parse(response.responseText);
                var position = new Array(3), matrixJ2000 = new Array(9), matrixFixed = new Array(9), matrixGSM = new Array(9), upDown;
                position[0] = data["position"][0]["x"];
                position[1] = data["position"][0]["y"];
                position[2] = data["position"][0]["z"];

                matrixJ2000[0] = data["matrixJ2000"][0]["0"];
                matrixJ2000[1] = data["matrixJ2000"][0]["1"];
                matrixJ2000[2] = data["matrixJ2000"][0]["2"];
                matrixJ2000[3] = data["matrixJ2000"][0]["3"];
                matrixJ2000[4] = data["matrixJ2000"][0]["4"];
                matrixJ2000[5] = data["matrixJ2000"][0]["5"];
                matrixJ2000[6] = data["matrixJ2000"][0]["6"];
                matrixJ2000[7] = data["matrixJ2000"][0]["7"];
                matrixJ2000[8] = data["matrixJ2000"][0]["8"];

                matrixFixed[0] = data["matrixFixed"][0]["0"];
                matrixFixed[1] = data["matrixFixed"][0]["1"];
                matrixFixed[2] = data["matrixFixed"][0]["2"];
                matrixFixed[3] = data["matrixFixed"][0]["3"];
                matrixFixed[4] = data["matrixFixed"][0]["4"];
                matrixFixed[5] = data["matrixFixed"][0]["5"];
                matrixFixed[6] = data["matrixFixed"][0]["6"];
                matrixFixed[7] = data["matrixFixed"][0]["7"];
                matrixFixed[8] = data["matrixFixed"][0]["8"];
                if(pid == "earth"){
                    matrixGSM[0] = data["matrixGSM"][0]["0"];
                    matrixGSM[1] = data["matrixGSM"][0]["1"];
                    matrixGSM[2] = data["matrixGSM"][0]["2"];
                    matrixGSM[3] = data["matrixGSM"][0]["3"];
                    matrixGSM[4] = data["matrixGSM"][0]["4"];
                    matrixGSM[5] = data["matrixGSM"][0]["5"];
                    matrixGSM[6] = data["matrixGSM"][0]["6"];
                    matrixGSM[7] = data["matrixGSM"][0]["7"];
                    matrixGSM[8] = data["matrixGSM"][0]["8"];
                }
                var theta_rota = 2 * Math.PI * ORBIT.count/ORBIT.planet[pid].t_rota;
                var obj_center = ORBIT.scene.getObjectById(ORBIT.planet[pid].centerid, true);

                //set planet's pivot-rotation
                //如果黄道坐标系和惯性坐标系未被初始化则对其初始化
                var rotationM4J2000 = new THREE.Matrix4(), rotationM4Fixed = new THREE.Matrix4(), rotationGSM = new THREE.Matrix4();
                var rotationM4J2000NI = new THREE.Matrix4(), rotationM4FixedNI = new THREE.Matrix4(), rotationGSMNI = new THREE.Matrix4();
                rotationM4J2000NI .set(
                    matrixJ2000[0], matrixJ2000[1], matrixJ2000[2], 0,
                    matrixJ2000[3], matrixJ2000[4], matrixJ2000[5], 0,
                    matrixJ2000[6], matrixJ2000[7], matrixJ2000[8], 0,
                    0,0,0,1);
                rotationM4FixedNI .set(
                    matrixFixed[0], matrixFixed[1], matrixFixed[2], 0,
                    matrixFixed[3], matrixFixed[4], matrixFixed[5], 0,
                    matrixFixed[6], matrixFixed[7], matrixFixed[8], 0,
                    0,0,0,1);
                if(pid == "earth"){
                    rotationGSMNI.set(
                        matrixGSM[0], matrixGSM[1], matrixGSM[2], 0,
                        matrixGSM[3], matrixGSM[4], matrixGSM[5], 0,
                        matrixGSM[6], matrixGSM[7], matrixGSM[8], 0,
                        0,0,0,1);
                }
                rotationM4J2000.set(
                    matrixJ2000[0], matrixJ2000[1], matrixJ2000[2], 0,
                    matrixJ2000[3], matrixJ2000[4], matrixJ2000[5], 0,
                    matrixJ2000[6], matrixJ2000[7], matrixJ2000[8], 0,
                    0,0,0,1);
                rotationM4Fixed.set(
                    matrixFixed[0], matrixFixed[1], matrixFixed[2], 0,
                    matrixFixed[3], matrixFixed[4], matrixFixed[5], 0,
                    matrixFixed[6], matrixFixed[7], matrixFixed[8], 0,
                    0,0,0,1);
                if(pid == "earth") {
                    rotationGSM.set(
                        matrixGSM[0], matrixGSM[1], matrixGSM[2], 0,
                        matrixGSM[3], matrixGSM[4], matrixGSM[5], 0,
                        matrixGSM[6], matrixGSM[7], matrixGSM[8], 0,
                        0, 0, 0, 1);
                }

                rotationM4J2000.getInverse(rotationM4J2000);
                rotationM4Fixed.getInverse(rotationM4Fixed);
                if(pid == "earth") {
                    rotationGSM.getInverse(rotationGSM);
                }

                var planet = ORBIT.planet[pid];
                planet.j2000Matrix = rotationM4J2000;
                planet.fixed = rotationM4Fixed;
                if(pid == "earth"){
                    planet.GSM = rotationGSM;
                }

                planet.position = position;
                if(!planet.isInitIAxis){
                    planet.j2000MatrixNI = rotationM4J2000NI;
                    planet.fixedNI = rotationM4FixedNI;
                    if(pid == "earth"){
                        planet.GSMNI = rotationGSMNI;
                    }
                    planet.j2000NINow = rotationM4J2000NI;
                    planet.fixedNINow = rotationM4FixedNI;
                    if(pid == "earth"){
                        planet.GSMNINow = rotationGSMNI;
                    }
                }
                else{
                    planet.j2000NINow = rotationM4J2000NI;
                    planet.fixedNINow = rotationM4FixedNI;
                    if(pid == "earth"){
                        planet.GSMNINow = rotationGSMNI;
                    }
                }
                ORBIT.planet[pid].rotaLock = false;
//                if('inertial' == ORBIT.states_View){
//                    if(pid == ORBIT.tracedObject.id){
//                        if(pid != "moon") {
//                            var cameraUpset = new THREE.Vector3(0, 0, 1);
//                            cameraUpset.applyMatrix4(rotationM4J2000);
//                            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);
//
//                            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
//                            traceObject.position = ORBIT.tracedObject.position;
//                            camera.position = ORBIT.camera.position;
//                            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
//                            cameraTrace.applyMatrix4(rotationM4J2000);
//                            ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
//                            ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
//                            ORBIT.renderer.clear();
//                            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//                        }
//                        else{
//                            var cid = ORBIT.planet[pid].centerid;
//                            var cameraUpset = new THREE.Vector3(0, 0, 1);
//                            cameraUpset.applyMatrix4(rotationM4J2000);
//                            cameraUpset.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
//                            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);
//
//                            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
//                            traceObject.position = ORBIT.tracedObject.position;
//                            camera.position = ORBIT.camera.position;
//                            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
//                            cameraTrace.applyMatrix4(rotationM4J2000);
//                            cameraTrace.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
//                            ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
//                            ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
//                            ORBIT.renderer.clear();
//                            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//                        }
//                    }
//                }
//                else if("fixed" == ORBIT.states_View){
//                    if(pid == ORBIT.tracedObject.id){
//                        if(pid != "moon") {
//                            var cameraUpset = new THREE.Vector3(0, 0, 1);
//                            cameraUpset.applyMatrix4(rotationM4Fixed);
//                            cameraUpset.applyMatrix4(rotationM4J2000);
//                            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);
//
//                            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
//                            camera.name = "camera";
//                            traceObject.position = ORBIT.tracedObject.position;
//                            camera.position = ORBIT.camera.position;
//                            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
//                            cameraTrace.applyMatrix4(rotationM4Fixed);
//                            cameraTrace.applyMatrix4(rotationM4J2000);
//                            ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
//                            ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
//
//                            ORBIT.renderer.clear();
//                            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//
//
////                            var axis_fixed = ORBIT.planet[pid].axis_fixed;
////                            var i = axis_fixed.axis_x_vector;
////                            var j = axis_fixed.axis_y_vector;
////                            var k = axis_fixed.axis_z_vector;
////                            var camera_fixed = ORBIT.camera;
////                            camera_fixed.up.set(k.x, k.y, k.z);//up = 0*i+0*j+1*k
////                            i.normalize();
////                            camera_fixed.position.add(i);
////                            camera_fixed.lookAt({x:axis_fixed.object.x, y:axis_fixed.object.y, z:axis_fixed.object.z});
////                            ORBIT.renderer.clear();
////                            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//                        }
//                        else{
//                            var cid = ORBIT.planet[pid].centerid;
//                            var cameraUpset = new THREE.Vector3(0, 0, 1);
//                            cameraUpset.applyMatrix4(rotationM4Fixed);
//                            cameraUpset.applyMatrix4(rotationM4J2000);
//                            cameraUpset.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
//                            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);
//
//                            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
//                            camera.name = "camera";
//                            traceObject.position = ORBIT.tracedObject.position;
//                            camera.position = ORBIT.camera.position;
//                            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
//                            cameraTrace.applyMatrix4(rotationM4Fixed);
//                            cameraTrace.applyMatrix4(rotationM4J2000);
//                            cameraTrace.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
//                            ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
//                            ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
//                            ORBIT.renderer.clear();
//                            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//                        }
//                    }
//                }



//                if(!ORBIT.planet[pid].isInitIAxis){
//                    ORBIT.planet[pid].j2000MatrixNI = rotationM4J2000NI;
//                    ORBIT.planet[pid].fixedNI = rotationM4FixedNI;
//                    ORBIT.planet[pid].j2000Matrix = rotationM4J2000;
//                    //更新星体的惯性坐标系
//                    if(pid == "moon"){
//                        var cid = ORBIT.planet[pid].centerid;
//                        ORBIT.planet[pid].axis_inertial.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].axis_inertial.applyMatrix(ORBIT.planet[cid].j2000Matrix);
//                        ORBIT.planet[pid].axis_inertial.updateMatrix();
//                        //更新月球
//                        var xPIHalf = Matrix.axisXRotationMatrix(Math.PI / 2);//绕x轴旋转九十度的矩阵
//                        ORBIT.planet[pid].object.applyMatrix(xPIHalf);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[cid].j2000Matrix);
//                        ORBIT.planet[pid].object.updateMatrix();
//
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[cid].j2000Matrix);
//                        ORBIT.planet[pid].axis_fixed.updateMatrix();
//                    }
//                    else{
//                        //更新惯性坐标系
//                        ORBIT.planet[pid].axis_inertial.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].axis_inertial.updateMatrix();
//
//                        //更新行星
//                        var xPIHalf = Matrix.axisXRotationMatrix(Math.PI / 2);//绕x轴旋转九十度的矩阵
//                        ORBIT.planet[pid].object.applyMatrix(xPIHalf);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].object.updateMatrix();
//                        //更新固连坐标系
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].axis_fixed.updateMatrix();
//                    }
//                    ORBIT.planet[pid].isInitIAxis = true;
//                }
//                else{
//                    if(pid == "moon"){
//                        //将月球和其固连坐标系转到上次位置
//                        var cid = ORBIT.planet[pid].centerid;
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[cid].j2000MatrixNI);
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[pid].j2000MatrixNI);
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[pid].fixedNI);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[cid].j2000MatrixNI);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[pid].j2000MatrixNI);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[pid].fixedNI);
//                        //记录本次的惯性矩阵和固连矩阵
//                        ORBIT.planet[pid].j2000MatrixNI = rotationM4J2000NI;
//                        ORBIT.planet[pid].fixedNI = rotationM4FixedNI;
//                        //更新月球
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[cid].j2000Matrix);
//                        ORBIT.planet[pid].object.updateMatrix();
//                        //更新月球的固连坐标系
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[cid].j2000Matrix);
//                        ORBIT.planet[pid].axis_fixed.updateMatrix();
//                    }
//                    else{
//                        //将行星和固连坐标系转到上次位置
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[pid].j2000MatrixNI);
//                        ORBIT.planet[pid].object.applyMatrix(ORBIT.planet[pid].fixedNI);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[pid].j2000MatrixNI);
//                        ORBIT.planet[pid].axis_fixed.applyMatrix(ORBIT.planet[pid].fixedNI);
//                        //记录本次的惯性矩阵和固连矩阵
//                        ORBIT.planet[pid].j2000MatrixNI = rotationM4J2000NI;
//                        ORBIT.planet[pid].fixedNI = rotationM4FixedNI;
//                        //更新行星到固连坐标系
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4Fixed);
//                        ORBIT.planet[pid].object.applyMatrix(rotationM4J2000);
//                        ORBIT.planet[pid].object.updateMatrix();
//                        //更新固连坐标系
//                        var axis = ORBIT.planet[pid].axis_fixed;
//                        axis.applyMatrix(rotationM4Fixed);
//                        axis.applyMatrix(rotationM4J2000);
//                        axis.updateMatrix();
//
//                    }
//                }
//                //set planet's position
//                if(pid != "moon"){
//                    var coe =100;
//                    ORBIT.planet[pid].object.position.set(position[0]/coe, position[1]/coe, position[2]/coe);
//                }
//                else {
//                    var coe = ORBIT.orbitCoe;
//                    ORBIT.planet[pid].object.position.set(position[0]/coe, position[1]/coe, position[2]/coe);
//                    ORBIT.planet[pid].object.position.add(obj_center.position);
//                }
            }
        });
    }
};