/**
 * Created by Administrator on 2014/11/30.
 */
var TailStack = function(pid, length, days, radius, color, scale){
    this.pid = pid;
    this.head = -1;
    this.length = length;
    this.days = days;
    this.day = 0;
    this.radius = radius;
    this.color = color;
    this.scale = scale;
    this.stack = [];
    this.rate = -(this.radius - 0.1) / (this.length - 1);
    this.initTail(pid);
    this.object = this.drawTail();
};
TailStack.prototype = {
    pushStack: function(point){
        this.stack[(this.head + 1) % this.length] = point;
        this.head = (this.head + 1) % this.length;
    },
    getById: function(index){
        return this.stack[index];
    },
    initTail: function(pid) {
        var end = julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear());
        var startDate = calculateStartDate(ORBIT.t_simu, this.length * this.days);
        var start = julian(startDate.getMonth() + 1, startDate.getDate(), startDate.getFullYear());
        for (var i = start + this.days; i <= end; i += this.days) {
            var position;
            switch (pid) {
                case "mercury":
                    position = mercury(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "venus":
                    position = venus(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "earth":
                    position = earth(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "mars":
                    position = mars(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "jupiter":
                    position = jupiter(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "saturn":
                    position = saturn(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "uranus":
                    position = uranus(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
                case "neptune":
                    position = neptune(i);
                    position[0] /= ORBIT.orbitCoe;
                    position[1] /= ORBIT.orbitCoe;
                    position[2] /= ORBIT.orbitCoe;
                    break;
            }
            this.pushStack(position);
        }
    },
    drawTail: function(){
        var orbitTail = new THREE.Mesh();
        var h = this.head;
        for(var i = 0; i < this.length; i++){
            var geometry = new THREE.SphereGeometry(this.rate * i + this.radius, this.rate * i + this.radius, this.rate * i + this.radius);
            geometry.dynamic = true;
            var material = new THREE.MeshBasicMaterial( {opacity: 1.0, color: this.color} );
            var tailPoint = new THREE.Mesh(geometry, material);
            var position = this.getById(h);
            tailPoint.position.set(position[0], position[1], position[2]);
            h--;
            if(h < 0){
                h = this.length - 1;
            }
            tailPoint.scale.set(this.scale, this.scale, this.scale);
            orbitTail.add(tailPoint);
        }
        return orbitTail;
    },
    isPushStack: function(overDay){
        this.day += overDay;
        if(this.day >= this.days){
//            this.pushStack(position);
            this.day = this.day % this.days;
//            this.moveTail();
            return true;
        }
        else{
            return false;
        }
    },
    moveTail: function(){
        var h = this.head;
        for(var i in this.object.children){
            var position = this.getById(h);
            this.object.children[i].position.set(position[0], position[1], position[2]);
            h--;
            if(h < 0){
                h = this.length - 1;
            }
        }
    }
};


//利用粒子系统实现行星轨迹尾巴效果
var earthParticle, earthMaterial, earthPosition, earthColor;
var particleSum = 5000, particleSize = 150000, timeSpan = 1 / 80;
TailStack.initTail = function(){
    var geometryP = new THREE.Geometry();
    earthPosition = geometryP.vertices;
    earthColor = geometryP.colors;
    for(var i = 0; i < particleSum; i++){
        earthPosition[i] = new THREE.Vector3(0, 0, 0);
        earthColor[i] = new THREE.Color(0, 0, 0);
    }
    geometryP.computeBoundingSphere();
    var materialP = new THREE.ParticleSystemMaterial( {
        size: particleSize,
        vertexColors: true,
        map: THREE.ImageUtils.loadTexture(
            "../../resources/images/particle/earthBlue2.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity:0.1} );
    var particleSystem = new THREE.ParticleSystem(geometryP, materialP);
    particleSystem.sortParticles = true;
    earthParticle = particleSystem.geometry;
    earthMaterial = particleSystem.material;
    ORBIT.scene.add(particleSystem);
};
TailStack.refreshTail = function(){
    var rulieri = julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) +
        numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds());
    var position;
    for(var i = 0, ii = rulieri, jj = 1; i < particleSum; i++, ii -= timeSpan, jj -= 1 / (particleSum + 500)){
        position = earth(ii);
        earthPosition[i].x = position[0] / ORBIT.orbitCoe;
        earthPosition[i].y = position[1] / ORBIT.orbitCoe;
        earthPosition[i].z = position[2] / ORBIT.orbitCoe;
        earthColor[i].r = jj;
        earthColor[i].g = jj;
        earthColor[i].b = jj;
    }
    if(ORBIT.zoom > 500 && ORBIT.zoom < 4851){
        earthMaterial.size = particleSize * ORBIT.zoom / 2400;
    }
    earthParticle.verticesNeedUpdate = true;
};