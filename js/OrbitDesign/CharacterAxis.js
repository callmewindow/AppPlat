/**
 * Created by dell on 2015/6/3.
 */
//特征轴类
var CharacterAxis = function(){
    //轴当前指向
    this.currentDirection = null;
    this.object = this.makeAxis();
    this.setScale(2000);
};
//制作特征轴
CharacterAxis.prototype.makeAxis = function(){
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
    axisMesh.material.color = new THREE.Color(0xFF7E00);

    //制作透明大圆柱

    geometry = new THREE.CylinderGeometry(20, 20, 200, 20, 1, false);
    geometry.dynamic = true;
    material = new THREE.MeshBasicMaterial( {opacity: 0, transparent: true} );
    material.needsUpdate = true;
    var axisMeshTransparent = new THREE.Mesh(geometry, material);
    axisMeshTransparent.add(axisMesh);
    return axisMeshTransparent;
};
//设置轴的颜色
CharacterAxis.prototype.setColor = function(color){
    this.object.material.needsUpdate = true;
    this.object.children[0].material.color.setStyle(color);
};
//设置轴的位置
CharacterAxis.prototype.setPosition = function(position){
    this.object.position.set(position.x, position.y, position.z);
};
//设置轴的方向
CharacterAxis.prototype.setDirection = function(direction){
    var startAxis = new THREE.Vector3(0, 1, 0);
    var endAxis = direction;
    if(endAxis.x != 0 || endAxis.z != 0) {
        if(this.currentDirection != null){
            this.currentDirection.getInverse(this.currentDirection);
            this.object.applyMatrix(this.currentDirection);
            this.object.updateMatrix();
        }
        var matrixAxis = Matrix.vectorRotation(startAxis, endAxis);
        this.object.applyMatrix(matrixAxis);
        this.object.updateMatrix();
        this.currentDirection = matrixAxis;
    }
};
//显示轴
CharacterAxis.prototype.show = function(){
    ORBIT.scene.add(this.object);
};
//隐藏轴
CharacterAxis.prototype.hide = function(){
    ORBIT.scene.remove(this.object);
};
//设置显示比例
CharacterAxis.prototype.setScale = function(scale){
    this.object.scale.set(scale, scale, scale);
};