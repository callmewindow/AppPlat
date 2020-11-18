/**
 * Created by dell on 2015/3/15.
 */
//行星尾巴类（利用粒子系统实现）
var TailParticle = function(id, sum, size, span, minZoom, maxZoom, sizeScale, material){
    this.pid = id;//行星id
    this.particleSum = sum;//粒子总数
    this.initSize = size;//初始粒子大小
    this.timeSpan = span;//两个粒子之间的时间间隔
    this.material = material;//粒子的材质
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
    this.sizeScale = sizeScale;
    this.object = this.initTail(sum, size, material);
};
//初始化粒子
TailParticle.prototype.initTail = function(){//sum, size, material
    var geometryP = new THREE.Geometry();
    this.positions = geometryP.vertices;
    this.colors = geometryP.colors;

    for(var i = 0; i < this.particleSum; i++){
        this.positions[i] = new THREE.Vector3(0, 0, 0);
        this.colors[i] = new THREE.Color(0, 0, 0);
    }
    geometryP.computeBoundingSphere();
    var materialP = new THREE.ParticleSystemMaterial( {
        size: this.initSize,
        vertexColors: true,
        map: THREE.ImageUtils.loadTexture(
            this.material
        ),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.1
    } );
    var particleSystem = new THREE.ParticleSystem(geometryP, materialP);
    particleSystem.sortParticles = true;
    this.particleGeometry = particleSystem.geometry;
    this.particleMaterial = particleSystem.material;
    return particleSystem;
};
