/**
 * Created by dell on 2015/1/27.
 */
var Matrix = {
    //A与B两个不平行的向量，决定平面a。求一个向量，使其满足垂直A向量，并且在a平面上
    vectorProjection: function(vectorBefore, vectorAfter){
        var k = (vectorBefore.x * vectorAfter.x + vectorBefore.y * vectorAfter.y + vectorBefore.z * vectorAfter.z)/(Math.pow(vectorBefore.x, 2) + Math.pow(vectorBefore.y, 2) + Math.pow(vectorBefore.z, 2));
        var start = new THREE.Vector3(k * vectorBefore.x, k * vectorBefore.y, k * vectorBefore.z);
        var projectionVector = new THREE.Vector3(vectorAfter.x - start.x, vectorAfter.y - start.y, vectorAfter.z - start.z);
        return projectionVector;
    },
     //已知两个坐标轴的向量，求另一个坐标轴的向量
    axisVector: function(vector1, vector2){
        var vector3 = new THREE.Vector3(vector1.y * vector2.z - vector1.z * vector2.y, vector1.z * vector2.x - vector1.x * vector2.z, vector1.x * vector2.y - vector1.y * vector2.x);
        return vector3;
    }
};