/**
 * Created by dell on 2015/3/15.
 */
//行星尾巴操作类
var OrbitTail = function(){

};
OrbitTail.initTail = function(){
    ORBIT.orbitTail = {//            行星id，粒子总数,粒子半径, 间隔，min, max,粒子比例常数
        'mercury': 	new TailParticle('mercury', 1000, 150000, 1 / 50, 200, 2000, 1900, '../../resources/images/particle/mercury.png'),//水星
        'venus': 	new TailParticle('venus', 2000, 150000, 1 / 60, 300, 4000, 2400, '../../resources/images/particle/venus.png'),//金星
        'earth': 	new TailParticle('earth', 4000, 150000, 1 / 80, 500, 4850, 2400,  '../../resources/images/particle/earth.png'),//地球
        'mars': 	new TailParticle('mars', 5000, 150000, 1 / 60, 600, 5050, 2600, '../../resources/images/particle/mars.png'),//火星
        'jupiter': 	new TailParticle('jupiter', 5000, 150000, 1 / 10, 500, 6050, 2000, '../../resources/images/particle/jupiter.png'),//木星
        'saturn': 	new TailParticle('saturn', 5000, 150000, 1 / 5, 500, 7050, 1800, '../../resources/images/particle/saturn.png'),//土星
        'uranus': 	new TailParticle('uranus', 5000, 150000, 1, 500, 18050, 1600, '../../resources/images/particle/uranus.png'),//天王星
        'neptune': 	new TailParticle('neptune', 5000, 150000, 2, 500, 30000, 1500, '../../resources/images/particle/neptune.png')//海王星
    }
};
//将行星轨迹添加到场景
OrbitTail.addTail = function(){
    for(var id in ORBIT.orbitTail){
        ORBIT.scene.add(ORBIT.orbitTail[id].object);
    }
};
//将行星轨迹移除场景
OrbitTail.removeTail = function(){
    for(var id in ORBIT.orbitTail){
        ORBIT.scene.remove(ORBIT.orbitTail[id].object);
    }
};
//刷新行星轨迹
OrbitTail.refreshTail = function(){
    for(var id in ORBIT.orbitTail){
        var rulieri = julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) +
            numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds());
        var position;
        var tail = ORBIT.orbitTail[id];
        for(var i = 0, ii = rulieri, jj = 1; i < tail.particleSum; i++, ii -= tail.timeSpan, jj -= 1 / (tail.particleSum + 500)){
            position = ORBIT.Orbit1.getPlanetPosition(tail.pid, ii);
            tail.positions[i].x = position[0] / ORBIT.orbitCoe;
            tail.positions[i].y = position[1] / ORBIT.orbitCoe;
            tail.positions[i].z = position[2] / ORBIT.orbitCoe;
            tail.colors[i].r = jj;
            tail.colors[i].g = jj;
            tail.colors[i].b = jj;
        }
        if(ORBIT.zoom > tail.minZoom && ORBIT.zoom < tail.maxZoom){
            tail.particleMaterial.size = tail.initSize * ORBIT.zoom / tail.sizeScale;
        }
        else if(ORBIT.zoom >= tail.maxZoom){
            tail.particleMaterial.size = tail.initSize * tail.maxZoom / tail.sizeScale;
        }
        else{
            tail.particleMaterial.size = tail.initSize * tail.minZoom / tail.sizeScale;
        }
        tail.particleGeometry.verticesNeedUpdate = true;
    }
};