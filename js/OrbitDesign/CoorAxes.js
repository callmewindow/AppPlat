/**
 * Created by Taivas on 5/14/14.
 */
//Class: Coordinate axes
ORBIT.CoorAxes = function(pobj, ptype) {
    this.type = ptype;
    this.axis_x = this.makeAxis('x', pobj);
    this.axis_x_vector =  new THREE.Vector3( 1, 0, 0 );
    this.axis_y = this.makeAxis('y', pobj);
    this.axis_y_vector =  new THREE.Vector3( 0, 1, 0 );
    this.axis_z = this.makeAxis('z', pobj);
    this.axis_z_vector =  new THREE.Vector3( 0, 0, 1 );
    this.object = this.makeCoorAxes(this.axis_x, this.axis_y, this.axis_z, this.type, pobj);
    this.matrix4 = new THREE.Matrix4;
};

ORBIT.CoorAxes.prototype.makeAxis = function(ptype, pobj){
    var radius = pobj.radius;
    if(radius < 20){
        radius = 20;
    }
    var geometry = new THREE.CylinderGeometry(1, 1, radius * 2 , 20, 1, false);
    geometry.dynamic = true;
    var gemoetryCone = new THREE.CylinderGeometry(0, 3, radius * 2/6, 20, 1, false);
    gemoetryCone.dynamic = true;
    //radiusTop — Radius of the cylinder at the top. Default is 20.
    //radiusBottom — Radius of the cylinder at the bottom. Default is 20.
    //height — Height of the cylinder. Default is 100.
    //radiusSegments — Number of segmented faces around the circumference of the cylinder. Default is 8
    //heightSegments — Number of rows of faces along the height of the cylinder. Default is 1.
    //openEnded — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
    var material = new THREE.MeshBasicMaterial( {opacity: 1.0} );
    var axisMesh = new THREE.Mesh(geometry, material);
    var axisMeshCone = new THREE.Mesh(gemoetryCone, material);
    //mesh.geometry.vertices = theObjects[i].geo.vertices;
    //geometry.verticesNeedUpdate = true;
    switch(ptype)
    {
        case 'x':
            axisMeshCone.position.y = radius + radius/6;
            axisMesh.add(axisMeshCone);

            if(pobj.object.id == "sun"){
                radius *= 100;
            }
            axisMesh.rotation.set(0, 0, -Math.PI/2, 'XYZ');
            axisMesh.updateMatrix();
            axisMesh.position.x = radius;
            axisMesh.material.color = new THREE.Color(0xFF0000);
            axisMesh.name = pobj.object.name + 'axisx';
            axisMesh.id = pobj.object.name + 'axisx';
            break;
        case 'y':
            axisMeshCone.position.y = radius + radius/6;
            axisMesh.add(axisMeshCone);

            if(pobj.object.id == "sun"){
                radius *= 100;
            }
            axisMesh.rotation.set(0, 0, 0, 'XYZ');
            axisMesh.updateMatrix();
            axisMesh.position.y = radius;
            axisMesh.material.color = new THREE.Color(0x00FF00);
            axisMesh.name = pobj.object.name + 'axisy';
            axisMesh.id = pobj.object.name + 'axisy';
            break;
        case 'z':
            axisMeshCone.position.y = radius + radius/6;
            axisMesh.add(axisMeshCone);

            if(pobj.object.id == "sun"){
                radius *= 100;
            }
            axisMesh.rotation.set(Math.PI/2, 0, 0, 'XYZ');
            axisMesh.updateMatrix();
            axisMesh.position.z = radius;
            axisMesh.material.color = new THREE.Color(0x0000FF);
            axisMesh.name = pobj.object.name + 'axisz';
            axisMesh.id = pobj.object.name + 'axisz';
            break;
        default :
            console.log('Error para in function makeAxis().');
            return -1;
    }
    return axisMesh;
};

ORBIT.CoorAxes.prototype.applyMatrix = function(m){
    this.object.applyMatrix(m);
    this.axis_x_vector.applyMatrix4(m);
    this.axis_y_vector.applyMatrix4(m);
    this.axis_z_vector.applyMatrix4(m);
};


ORBIT.CoorAxes.prototype.updateMatrix = function(m){
    this.object.updateMatrix();

};
ORBIT.CoorAxes.prototype.makeCoorAxes = function(x, y, z, ptype, pobj){
    var object = new THREE.Object3D();
    if(ptype == "o"){
        var centerPosition = ORBIT.orbit[pobj.object.id].getCenterPosition();
        var radius = pobj.radius;
        if(pobj.radius < 20){
            radius = 20;
        }
        //旋转卫星轨道坐标系的X轴到指定的位置和姿态
        var startX = new THREE.Vector3(1, 0, 0);
        var satellitePosition = pobj.object.position;
        var endX = new THREE.Vector3(centerPosition.x - satellitePosition.x, centerPosition.y - satellitePosition.y, centerPosition.z - satellitePosition.z);
        if(endX.y != 0 || endX.z != 0){
            var matrixX = Matrix.vectorRotation(startX, endX);
            x.applyMatrix(matrixX);
            x.updateMatrix();
        }
        var positionX = Matrix.middleFinal(endX, pobj.object.position, radius * ORBIT.satelliteScale);
        x.position.set(positionX.x, positionX.y, positionX.z);
        x.scale.set(ORBIT.satelliteScale, ORBIT.satelliteScale, ORBIT.satelliteScale);
        //旋转卫星轨道坐标系的Y轴到指定的位置和姿态
        var startY = new THREE.Vector3(0, 1, 0);
        var endY = Matrix.vectorProjection(endX, pobj.velocity);
        if(endY.x != 0 || endY.z != 0) {
            var matrixY = Matrix.vectorRotation(startY, endY);
            y.applyMatrix(matrixY);
            y.updateMatrix();
        }
        var positionY = Matrix.middleFinal(endY, pobj.object.position, radius * ORBIT.satelliteScale);
        y.position.set(positionY.x, positionY.y, positionY.z);
        y.scale.set(ORBIT.satelliteScale, ORBIT.satelliteScale, ORBIT.satelliteScale);
        if(pobj.object.id == ORBIT.selectOrbitId && ORBIT.selectOrbitName == "sat"){
            y.material.color.setStyle("#ffff00");
        }
        //旋转卫星轨道坐标系的Z轴到指定的位置和姿态
        var startZ = new THREE.Vector3(0, 0, 1);
        var endZ = Matrix.axisVector(endX, endY);
        pobj.axis_orbitZ = endZ;
        if(endZ.x != 0 || endZ.y != 0) {
            var matrixZ = Matrix.vectorRotation(startZ, endZ);
            z.applyMatrix(matrixZ);
            z.updateMatrix();
        }
        var positionZ = Matrix.middleFinal(endZ, pobj.object.position, radius * ORBIT.satelliteScale);
        z.position.set(positionZ.x, positionZ.y, positionZ.z);
        z.scale.set(ORBIT.satelliteScale, ORBIT.satelliteScale, ORBIT.satelliteScale);
    }
    if(pobj.object.id == "sun"){
        x.scale.set(100, 100, 100);
        y.scale.set(100, 100, 100);
        z.scale.set(100, 100, 100);
    }
    object.add(x);
    object.add(y);
    object.add(z);
    switch(ptype){
        case 'i':
        //fall through
        case 'f':
//            object.rotation.set(0, 0, -pobj.tilt, 'ZXY');
            break;
        default:
    }
    return object;
};
var SingleAxis = function(){
};
SingleAxis.prototype = {
    makeAxis: function(orbitId, pointName){
        var cylinderHeight = 100;//圆柱的高度
        var cylinderRadius = 3;//圆柱的半径
        var coneHeight = cylinderHeight/6;//圆锥的高度
        var coneRadius = 9;//圆锥的半径
        //制作圆柱
        var geometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 20, 1, false);
        geometry.dynamic = true;
        var material = new THREE.MeshBasicMaterial( {opacity: 1.0} );
        material.needsUpdate = true;
        var axisMesh = new THREE.Mesh(geometry, material);
        //制作顶部圆锥
        var geometryConeTop = new THREE.CylinderGeometry(0, coneRadius, coneHeight, 20, 1, false);
        geometryConeTop.dynamic = true;
        var axisMeshConeTop = new THREE.Mesh(geometryConeTop, material);
        axisMeshConeTop.position.y = cylinderHeight/2 + coneHeight/2;
        //制作底部圆锥
        var geometryConeBottom = new THREE.CylinderGeometry(0, coneRadius, coneHeight, 20, 1, false);
        geometryConeBottom.dynamic = true;
        var axisMeshConeBottom = new THREE.Mesh(geometryConeBottom, material);
        axisMeshConeBottom.rotation.set(0, 0, Math.PI, 'XYZ');
        axisMeshConeBottom.updateMatrix();
        axisMeshConeBottom.position.y = -cylinderHeight/2 - coneHeight/2;
        //将两个圆锥加到圆柱上形成轴
        axisMesh.add(axisMeshConeTop);
        axisMesh.add(axisMeshConeBottom);
        if(orbitId == ORBIT.selectOrbitId && pointName == ORBIT.selectOrbitName){
            axisMesh.material.color = new THREE.Color(0xFFFF00);
        }
        else{
            axisMesh.material.color = new THREE.Color(0xFF7E00);
        }

        //制作透明大圆柱

        geometry = new THREE.CylinderGeometry(20, 20, 200, 20, 1, false);
        geometry.dynamic = true;
        material = new THREE.MeshBasicMaterial( {opacity: 0, transparent: true} );
        material.needsUpdate = true;
        var axisMeshTransparent = new THREE.Mesh(geometry, material);
        axisMeshTransparent.add(axisMesh);
        axisMeshTransparent.name = pointName;
        axisMeshTransparent.id = orbitId;
        return axisMeshTransparent;
    },
    //设置远近点的横轴的位置和姿态
    setCrossAxis: function(crossAxis, position, a){
        var startAxis = new THREE.Vector3(0, 1, 0);
        var endAxis = position;
        if(endAxis.x != 0 || endAxis.z != 0) {
            var matrixAxis = Matrix.vectorRotation(startAxis, endAxis);
            crossAxis.applyMatrix(matrixAxis);
            crossAxis.updateMatrix();
        }
        crossAxis.position = position;
        crossAxis.scale.set(a / 100000, a / 100000, a / 100000);
    },
    //设置远近点的竖轴的位置和姿态
    setVerticalAxis: function(verticalAxis, position, velocity, a){
        var startAxis = new THREE.Vector3(0, 1, 0);
        var middleAxis = Matrix.vectorProjection(position, velocity);
        var endAxis = Matrix.axisVector(position, middleAxis);
        if(endAxis.x != 0 || endAxis.z != 0) {
            var matrixAxis = Matrix.vectorRotation(startAxis, endAxis);
            verticalAxis.applyMatrix(matrixAxis);
            verticalAxis.updateMatrix();
        }
        verticalAxis.position = position;
        verticalAxis.scale.set(a / 100000, a / 100000, a / 100000);
    },
    //设置近心点幅角特征点的与水平轴垂直的轴的位置和姿态
    setVCrossAxis: function(crossAxis, position, velocity, a){
        var startAxis = new THREE.Vector3(0, 1, 0);
        var endAxis = velocity;
        if(endAxis.x != 0 || endAxis.z != 0) {
            var matrixAxis = Matrix.vectorRotation(startAxis, endAxis);
            crossAxis.applyMatrix(matrixAxis);
            crossAxis.updateMatrix();
        }
        crossAxis.position = position;
        crossAxis.scale.set(a / 100000, a / 100000, a / 100000);
    },
    //设置升交点赤经特征平行于赤道的轴的位置和姿态
    setEquatorAxis: function(crossAxis, position, velocity, incline, a){
        var startAxis = new THREE.Vector3(0, 1, 0);
        var endAxis = Matrix.vectorProjection(position, new THREE.Vector3(0, 1, 0));
        if(endAxis.x != 0 || endAxis.z != 0) {
            var matrixAxis = Matrix.vectorRotation(startAxis, endAxis);
            crossAxis.applyMatrix(matrixAxis);
            crossAxis.updateMatrix();
        }
        crossAxis.position = position;
        crossAxis.scale.set(a / 100000, a / 100000, a / 100000);
    },
    //根据位置设置转移轨道的位置和姿态
    setSectionAxis: function(axis, position){
        var direction = new THREE.Vector3(-position.x, -position.y, -position.z);
        var axisZRotation = Matrix.axisZRotationMatrix(Math.PI/2);
        direction = direction.applyMatrix4(axisZRotation);

        var startAxis = new THREE.Vector3(0, 1, 0);
        if(direction.x != 0 || direction.z != 0){
            var matrixAxis = Matrix.vectorRotation(startAxis, direction);
            axis.applyMatrix(matrixAxis);
            axis.updateMatrix();
        }
        axis.position = position;
        axis.scale.set(2000, 2000, 2000);
    },
    //重置轴的颜色
    resetAxisColor: function(){
        if(ORBIT.selectOrbitId != null && ORBIT.selectOrbitName != null){
            if(ORBIT.selectOrbitName != "sat") {
                var orbit = ORBIT.orbit[ORBIT.selectOrbitId];
                for (var i in orbit.object.children) {
                    if (orbit.object.children[i].name == ORBIT.selectOrbitName) {
                        orbit.object.children[i].children[0].material.color.setStyle("#ff7e00");
                        refreshCamera();
                        break;
                    }
                }
                for(var j in orbit.orbitSection){
                    var flag = false;
                    for(var k in orbit.orbitSection[j].object.children){
                        if(j == ORBIT.selectOrbitSection){
                            if(orbit.orbitSection[j].object.children[k].name == ORBIT.selectOrbitName){
                                orbit.orbitSection[j].object.children[k].children[0].material.color.setStyle("#ff7e00");
                                refreshCamera();
                                flag = true;
                                break;
                            }
                        }
                    }
                    if(flag){
                        break;
                    }
                }
            }
            ORBIT.selectOrbitId = null;
            ORBIT.selectOrbitName = null;
            ORBIT.selectOrbitSection = null;
        }
    }
};