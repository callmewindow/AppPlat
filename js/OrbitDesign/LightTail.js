var LightTail = function () {
    this.path = null; //跟踪轨迹
    this.group = null; //轨迹的分组
    this.sparksEmitter = null;
    this.emitterPos = null;
    this.lastPoint = new THREE.Vector3(); //上一个节点
    this.latestPoint = new THREE.Vector3(); //最近更新的节点
    this.pathMaterial = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 100
    });
};
LightTail.prototype = {
    start: function () {
        var setTargetParticle = function () {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(ORBIT.lighttail.latestPoint, ORBIT.lighttail.lastPoint);
            ORBIT.lighttail.path = new THREE.Line(geometry, ORBIT.lighttail.pathMaterial);
            ORBIT.lighttail.group.add(ORBIT.lighttail.path);
            return ORBIT.lighttail.path;
        };

//        var onParticleCreated = function (p) {
//            p.target.position.copy(p.position);   
//        };

        var onParticleDead = function (particle) {
            particle.target.visible = false;
            ORBIT.lighttail.group.remove(particle.target);
        };

        this.group = new THREE.Object3D();
        ORBIT.scene.add(this.group);

        this.sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(10000));
        this.emitterPos = new THREE.Vector3();

        this.sparksEmitter.addInitializer(new SPARKS.Position(new SPARKS.PointZone(this.emitterPos)));
        this.sparksEmitter.addInitializer(new SPARKS.Lifetime(0, 20));
        this.sparksEmitter.addInitializer(new SPARKS.Target(null, setTargetParticle));

        this.sparksEmitter.addAction(new SPARKS.Age());

//        this.sparksEmitter.addCallback("created", onParticleCreated);
        this.sparksEmitter.addCallback("dead", onParticleDead);
//        this.sparksEmitter.addCallback("updated", function (particle) {
//            particle.target.position.copy(particle.position);
//        });
        this.sparksEmitter.start();
    },

    update: function (point) {
        this.latestPoint.x = this.lastPoint.x;
        this.latestPoint.y = this.lastPoint.y;
        this.latestPoint.z = this.lastPoint.z;
        this.lastPoint.x = point.x;
        this.lastPoint.y = point.y;
        this.lastPoint.z = point.z;
        //console.log(ORBIT.lighttail.latestPoint, ORBIT.lighttail.lastPoint);
    }
}