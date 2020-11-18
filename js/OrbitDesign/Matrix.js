var Matrix = {
    //绕X轴旋转矩阵(弧度制参数)
    axisXRotationMatrix: function (angle) {
        var matrix = new THREE.Matrix4();
        matrix.set(
            1, 0, 0, 0,
            0, Math.cos(angle), -Math.sin(angle), 0,
            0, Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1
        );
        return matrix;
    },

    //绕Y轴旋转矩阵(弧度制参数)
    axisYRotationMatrix: function (angle) {
        var matrix = new THREE.Matrix4();
        matrix.set(
            Math.cos(angle), 0, Math.sin(angle), 0,
            0, 1, 0, 0,
            -Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1
        );
        return matrix;
    },

    //绕Z轴旋转矩阵(弧度制参数)
    axisZRotationMatrix: function (angle) {
        var matrix = new THREE.Matrix4();
        matrix.set(
            Math.cos(angle), -Math.sin(angle), 0, 0,
            Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        return matrix;
    },

    //A向量旋转成B向量的变换矩阵
    vectorRotation: function (vectorBefore, vectorAfter) {
        //计算旋转轴
        var a = vectorBefore;
        var b = vectorAfter;
        var cosa = (a.x * b.x + a.y * b.y + a.z * b.z) / Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) / Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
        if (Math.abs(cosa - 1) <= 0.0001) return new THREE.Matrix4(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        if (Math.abs(cosa + 1) <= 0.0001) return new THREE.Matrix4(-1,0,0,0,0,-1,0,0,0,0,-1,0,0,0,0,1);
        var c = new THREE.Vector3();
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        var rotationAxis = c;
        //计算旋转角度
        a = vectorBefore.x * vectorAfter.x + vectorBefore.y * vectorAfter.y + vectorBefore.z * vectorAfter.z;
        b = Math.sqrt(vectorBefore.x * vectorBefore.x + vectorBefore.y * vectorBefore.y + vectorBefore.z * vectorBefore.z);
        c = Math.sqrt(vectorAfter.x * vectorAfter.x + vectorAfter.y * vectorAfter.y + vectorAfter.z * vectorAfter.z)
        var rotationAngle = Math.acos(a / b / c);
        //计算旋转矩阵
        var angle = rotationAngle;
        var u = rotationAxis;
        var norm = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
        var rotatinMatrix = new THREE.Matrix4();
        u.x = u.x / norm;
        u.y = u.y / norm;
        u.z = u.z / norm;
        rotatinMatrix.set(
            Math.cos(angle) + u.x * u.x * (1 - Math.cos(angle)),
            u.x * u.y * (1 - Math.cos(angle)) - u.z * Math.sin(angle),
            u.y * Math.sin(angle) + u.x * u.z * (1 - Math.cos(angle)),
            0,

            u.z * Math.sin(angle) + u.x * u.y * (1 - Math.cos(angle)),
            Math.cos(angle) + u.y * u.y * (1 - Math.cos(angle)),
            -u.x * Math.sin(angle) + u.y * u.z * (1 - Math.cos(angle)),
            0,

            -u.y * Math.sin(angle) + u.x * u.z * (1 - Math.cos(angle)),
            u.x * Math.sin(angle) + u.y * u.z * (1 - Math.cos(angle)),
            Math.cos(angle) + u.z * u.z * (1 - Math.cos(angle)),
            0,

            0, 0, 0, 1
        );
        return rotatinMatrix;
    },
    //将一个二维向量的绝对坐标转到原点在跟踪物体的坐标系下的相对坐标
    changeVector2ToTrace: function(vector2){
        var tracePosition = new THREE.Vector3;
        if(ORBIT.tracedTargetTpye == "Planet"){
            tracePosition.x = ORBIT.tracedObject.position.x;
            tracePosition.y = ORBIT.tracedObject.position.y;
            tracePosition.z = ORBIT.tracedObject.position.z;
        }
        else if(ORBIT.tracedTargetTpye == "Sate"){
            var cid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
            tracePosition.x = ORBIT.planet[cid].object.position.x;
            tracePosition.y = ORBIT.planet[cid].object.position.y;
            tracePosition.z = ORBIT.planet[cid].object.position.z;
        }
        var center = HoverText.getObjectScreenPosition(tracePosition);
        center = corTransform(center.x, center.y);
        vector2.x -= center.x;
        vector2.y -= center.y;
    },
    //求两个坐标系之间的转换矩阵
    changeAxis: function(startMatrix, endMatrix){
        var orbitMatrix = new THREE.Matrix4(startMatrix[0].x, startMatrix[1].x, startMatrix[2].x, 0,
                                            startMatrix[0].y, startMatrix[1].y, startMatrix[2].y, 0,
                                            startMatrix[0].z, startMatrix[1].z, startMatrix[2].z, 0,
                                                0,                 0,                 0,          1);
        //惯性坐标系基底构成的矩阵
        var intertiaMatrix = new THREE.Matrix4(endMatrix[0].x, endMatrix[1].x, endMatrix[2].x, 0,
                                               endMatrix[0].y, endMatrix[1].y, endMatrix[2].y, 0,
                                               endMatrix[0].z, endMatrix[1].z, endMatrix[2].z, 0,
                                                    0,              0,             0,          1);
        orbitMatrix = orbitMatrix.getInverse(orbitMatrix);
        return orbitMatrix.multiply(intertiaMatrix);
    },
    //求一向量的单位向量
    unitVector: function(vector){
        var n = 1 / Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
        return new THREE.Vector3(n * vector.x, n * vector.y, n * vector.z);
    },
    //已知地球的位置，求从地球沿地球到太阳方向总距离L后的坐标
    calculateDistanceByL: function(position, l){
        var d = Math.pow(position.x, 2) + Math.pow(position.y, 2) + Math.pow(position.z, 2);
        var a = d / Math.pow(position.y, 2);
        var b = -2 * d / position.y;
        var c = d - Math.pow(l, 2);
        var b2Minus4ac = Math.pow(b, 2) - 4 * a * c;
        if(b2Minus4ac < 0){//当l == 0时，由于精度问题会导致b方减4ac略微小于0
            b2Minus4ac = 0;
        }
        var y = (-b - Math.sqrt(b2Minus4ac)) / (2 * a);
        var x = position.x * y / position.y;
        var z = position.z * y / position.y;
        return new THREE.Vector3(x, y, z);
    },
    //已知一向量方向、长度、它的中心坐标，求其终点的坐标
    middleFinal: function(vector, middlePosition, halfLength){
        var n = halfLength / (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2)));
        var finalPosition = new THREE.Vector3(middlePosition.x + n * vector.x, middlePosition.y + n * vector.y, middlePosition.z + n * vector.z);
        return finalPosition;
    },

    //A与B两个不平行的向量，决定平面a。求一个向量，使其满足垂直A向量，并且在a平面上
    vectorProjection: function(vectorBefore, vectorAfter){
        var k = (vectorBefore.x * vectorAfter.x + vectorBefore.y * vectorAfter.y + vectorBefore.z * vectorAfter.z)/(Math.pow(vectorBefore.x, 2) + Math.pow(vectorBefore.y, 2) + Math.pow(vectorBefore.z, 2))
        var start = new THREE.Vector3(k * vectorBefore.x, k * vectorBefore.y, k * vectorBefore.z);
        var projectionVector = new THREE.Vector3(vectorAfter.x - start.x, vectorAfter.y - start.y, vectorAfter.z - start.z);
        return projectionVector;
    },

    //已知两个坐标轴的向量，求另一个坐标轴的向量
    axisVector: function(vector1, vector2){
        var vector3 = new THREE.Vector3(vector1.y * vector2.z - vector1.z * vector2.y, vector1.z * vector2.x - vector1.x * vector2.z, vector1.x * vector2.y - vector1.y * vector2.x);
        return vector3;
    },
    //求两个三维向量的夹角（弧度）
    angleVector3: function(startVector3, endVector3){
        var ab = startVector3.x * endVector3.x + startVector3.y * endVector3.y + startVector3.z * endVector3.z;//两个向量的点乘
        var a = Math.sqrt(Math.pow(startVector3.x, 2) + Math.pow(startVector3.y, 2) + Math.pow(startVector3.z, 2));//a向量的长度
        var b = Math.sqrt(Math.pow(endVector3.x, 2) + Math.pow(endVector3.y, 2) + Math.pow(endVector3.z, 2));//b向量的长度
        var angle = Math.acos(ab/(a * b));
        return angle;
    },
    //求两个二维向量的夹角(弧度)，针对轨道倾角
    angleVector2Incline: function(startVector2, endVector2){
        if(ORBIT.freedomAngle){
            this.changeVector2ToTrace(startVector2);
            this.changeVector2ToTrace(endVector2);
        }
        var ab = startVector2.x * endVector2.x + startVector2.y * endVector2.y;//两个向量的点乘
        var a = Math.sqrt(Math.pow(startVector2.x, 2) + Math.pow(startVector2.y, 2));//a向量的长度
        var b = Math.sqrt(Math.pow(endVector2.x, 2) + Math.pow(endVector2.y, 2));//b向量的长度
        var cosAngle = ab/(a * b);
        if(cosAngle > 1){
            cosAngle = 1;
        }
        else if(cosAngle < -1){
            cosAngle = -1;
        }
        var angle = -Math.acos(cosAngle);
        if(startVector2.x != 0){//不在y轴上
            if(ORBIT.startIncline > (ORBIT.max["i"] - 90) * Math.PI / 180 || ORBIT.startIncline < (ORBIT.max["i"] - 270) * Math.PI / 180){
                if(endVector2.x * ORBIT.startMouseposi.x > 0){//如果终点的x坐标和最开始鼠标按下去的时候的坐标同号
                    if(endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0){
                        angle = -angle;
                    }
                }
                else{
                    if(endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0){
                        angle = -angle;
                    }
                }
            }
            else{
                if(endVector2.x * ORBIT.startMouseposi.x > 0){//如果终点的x坐标和最开始鼠标按下去的时候的坐标同号
                    if(endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0){
                        angle = -angle;
                    }
                }
                else{
                    if(endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0){
                        angle = -angle;
                    }
                }
            }
        }
        else{//y轴
            if(endVector2.x > 0){
                angle = -angle;
            }
        }
        return angle;
    },
    //求两个二维向量的夹角(弧度)，针对近心点幅角和真近心点
    angleVector2ThetaAom: function(startVector2, endVector2){
        if(ORBIT.freedomAngle){
            this.changeVector2ToTrace(startVector2);
            this.changeVector2ToTrace(endVector2);
        }
        var ab = startVector2.x * endVector2.x + startVector2.y * endVector2.y;//两个向量的点乘
        var a = Math.sqrt(Math.pow(startVector2.x, 2) + Math.pow(startVector2.y, 2));//a向量的长度
        var b = Math.sqrt(Math.pow(endVector2.x, 2) + Math.pow(endVector2.y, 2));//b向量的长度
        var cosAngle = ab/(a * b);
        if(cosAngle > 1){
            cosAngle = 1;
        }
        else if(cosAngle < -1){
            cosAngle = -1;
        }
        var angle = Math.acos(cosAngle);
        if(startVector2.x != 0){//不在y轴上
            if(ORBIT.startAngle > Math.PI/2) {
                if (startVector2.x > 0) {
                    if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                        angle = -angle;
                    }
                }
                else {
                    if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                        angle = -angle;
                    }
                }
            }
            else{
                if (startVector2.x > 0) {
                    if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                        angle = -angle;
                    }
                }
                else {
                    if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                        angle = -angle;
                    }
                }
            }
        }
        else{//y轴
            if(endVector2.x < 0){
                angle = -angle;
            }
        }
        return angle;
    },
    //求两个二维向量的夹角(弧度)，针对升交点赤经
    angleVector2Om: function(startVector2, endVector2){
        if(ORBIT.freedomAngle){
            this.changeVector2ToTrace(startVector2);
            this.changeVector2ToTrace(endVector2);
        }
        var ab = startVector2.x * endVector2.x + startVector2.y * endVector2.y;//两个向量的点乘
        var a = Math.sqrt(Math.pow(startVector2.x, 2) + Math.pow(startVector2.y, 2));//a向量的长度
        var b = Math.sqrt(Math.pow(endVector2.x, 2) + Math.pow(endVector2.y, 2));//b向量的长度
        var cosAngle = ab/(a * b);
        if(cosAngle > 1){
            cosAngle = 1;
        }
        else if(cosAngle < -1){
            cosAngle = -1;
        }
        var angle = Math.acos(cosAngle);
        if(startVector2.x != 0){//不在y轴上
            if(ORBIT.startMouseposi.y > 0){
                if(ORBIT.startOmAngle < Math.PI / 2){
                    if (startVector2.x > 0) {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                            angle = -angle;
                        }
                    }
                    else {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                            angle = -angle;
                        }
                    }
                }
                else{
                    if (startVector2.x > 0) {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                            angle = -angle;
                        }
                    }
                    else {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                            angle = -angle;
                        }
                    }
                }
            }
            else{
                if(ORBIT.startOmAngle < Math.PI / 2){
                    if (startVector2.x > 0) {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                            angle = -angle;
                        }
                    }
                    else {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                            angle = -angle;
                        }
                    }
                }
                else{
                    if (startVector2.x > 0) {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x > 0) {
                            angle = -angle;
                        }
                    }
                    else {
                        if (endVector2.y - endVector2.x * startVector2.y / startVector2.x < 0) {
                            angle = -angle;
                        }
                    }
                }
            }
        }
        else{//y轴
            if(endVector2.x < 0){
                angle = -angle;
            }
        }
        return angle;
    },
    //求两点的距离
    distanceVector2: function(startVector2, endVector2, center){
        if(ORBIT.freedomAngle){
            this.changeVector2ToTrace(startVector2);
            this.changeVector2ToTrace(endVector2);
        }
        var rstart = Math.pow(startVector2.x, 2) + Math.pow(startVector2.y, 2);
        var rend = Math.pow(endVector2.x, 2) + Math.pow(endVector2.y, 2);
        var distance = Math.sqrt(Math.pow(endVector2.x - startVector2.x, 2) + Math.pow(endVector2.y - startVector2.y, 2));
        if(rend < rstart){
            distance = -distance;
        }
        var camera = ORBIT.camera.position;
        var centerToCamera = Math.sqrt(Math.pow(camera.x - center.x , 2) + Math.pow(camera.y - center.y , 2) + Math.pow(camera.z - center.z , 2));
//        console.log(centerToCamera);
        return distance * centerToCamera * 125 / 4;
    },
    distanceVector3: function(startVector3, endVector3){
        return Math.sqrt(Math.pow(endVector3.x - startVector3.x, 2) + Math.pow(endVector3.y - startVector3.y, 2) + Math.pow(endVector3.z - startVector3.z, 2));
    },
    //计算两向量长度差(取绝对值)
    calculateVectorMinus: function(v1, v2){
        var v1Len = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2) + Math.pow(v1.z, 2));
        var v2Len = Math.sqrt(Math.pow(v2.x, 2) + Math.pow(v2.y, 2) + Math.pow(v2.z, 2));
        if(v1Len >= v2Len){
            return v1Len - v2Len;
        }
        else{
            return v2Len - v1Len;
        }
    },
    //计算向量长度
    calculateVectorLength: function(v){
        return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
    },
    //根据直线方程（参数式）和平面方程（点法式）计算线面交点
    /*
    *pointL: 直线上的一点
    * directionVector: 指向的方向向量
    * pointP: 平面上的一点
    * normalVector: 平面的法向量
     */
    calculateInterSectionLAndP: function(pointL, directionVector, pointP, normalVector){
        var denominator = (normalVector.x * directionVector.x + normalVector.y * directionVector.y + normalVector.z * directionVector.z);
        if(denominator == 0){
            return null;
        }
        var t = ((pointP.x - pointL.x) * normalVector.x + (pointP.y - pointL.y) * normalVector.y + (pointP.z - pointL.z) * normalVector.z) / denominator;
        var x = pointL.x + directionVector.x * t;
        var y = pointL.y + directionVector.y * t;
        var z = pointL.z + directionVector.z * t;
        return new THREE.Vector3(x, y, z);
    }
};