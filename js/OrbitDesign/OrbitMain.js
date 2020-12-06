
/**
 * Created by Taivas on 5/12/14.
 */
var initFileName = function(name){
    ORBIT.fileName = name;
};
var initSimuTime = function(t_start, t_stop, step, t_simu, speedscalar, count){
    //set t_1970
    ORBIT.t_1970.setFullYear(1970);
    ORBIT.t_1970.setMonth(1);
    ORBIT.t_1970.setDate(1);
    ORBIT.t_1970.setHours(0);
    ORBIT.t_1970.setMinutes(0);
    ORBIT.t_1970.setSeconds(0);

    ORBIT.states_Simu = false;

    //set t_start
    if(t_start == null){
        ORBIT.t_start.setFullYear(2012);//2012
        ORBIT.t_start.setMonth(6);//2
        ORBIT.t_start.setDate(15);//20
        ORBIT.t_start.setHours(4);//5
        ORBIT.t_start.setMinutes(0);//12
        ORBIT.t_start.setSeconds(0);//52
    }
    else
        ORBIT.t_start.setTime(Date.parse(t_start.toString()));
//    //set t_stop
    if(t_stop == null){
        ORBIT.t_stop.setFullYear(2022);
        ORBIT.t_stop.setMonth(6);
        ORBIT.t_stop.setDate(15);
        ORBIT.t_stop.setHours(4);
        ORBIT.t_stop.setMinutes(0);
        ORBIT.t_stop.setSeconds(0);
    }
    else
        ORBIT.t_stop.setTime(Date.parse(t_stop.toString()));
    if(step != null)
        ORBIT.step = step;
    //set t_simu.
    if(t_simu == null)
        resetSimuTime();
    else{
        ORBIT.t_simu.setTime(Date.parse(t_simu.toString()));
        ORBIT.t_preSimu.setTime(Date.parse(t_simu.toString()));
    }
    if(speedscalar == null)
        ORBIT.speedscalar = 1;
    else
        ORBIT.speedscalar = speedscalar;
    if(count == null)
        ORBIT.count = 0;
    else
        ORBIT.count = count;
};
var initRender = function(width, height,panel) {
    //替代方案，给结构设计场景设一个高度和宽度的默认值
    var widthOfScene = width;
    var heightOfScene = height;
    ORBIT.widthOfScene = width;
    ORBIT.heightOfScene = height;
//    var widthOfScene = APC.ORBITSCENE_WIDTH;
//    var heightOfScene = APC.ORBITSCENE_HEIGHT;
    ORBIT.renderer = new THREE.WebGLRenderer({antialias: true});
    ORBIT.renderer.setSize(widthOfScene, heightOfScene);
    ORBIT.renderer.setClearColor(0x000000, 1.0);
    ORBIT.canvas = panel.body.dom.childNodes[0].childNodes[0].childNodes[0];
    ORBIT.canvas.appendChild(ORBIT.renderer.domElement);
    ORBIT.canvas.height = heightOfScene;
    ORBIT.canvas.width = widthOfScene;

};
var initScene = function() {
    ORBIT.scene = new THREE.Scene();
};

var getSceneSize = function(width,height){
    ORBIT.widthOfScene = width;
    ORBIT.heightOfScene = height;
}

var addParticleSystem =  function(){
    loadShaders();
};
//加载着色器
var loadShaders = function ()
{
    SHADER_LOADER.load(onShadersLoaded);
};
var onShadersLoaded = function (shaders)
{
    ORBIT.shaders = shaders;
    addStats();
};
var addStats = function(){
    // Stats tracker used for metrics like FPS
    if (!Detector.webgl)
    {
        Detector.addGetWebGLMessage();
    }

    // Init scene
    ORBIT.scene = ORBIT.scene || new THREE.Scene();

    if (!ORBIT.camera)
    {
        ORBIT.camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000.0);
        ORBIT.camera.position.z = (500.0 );
    }

    if (!ORBIT.renderer)
    {
        ORBIT.renderer = new THREE.WebGLRenderer();
        ORBIT.renderer.setSize(ORBIT.widthOfScene, ORBIT.heightOfScene);
        ORBIT.renderer.setClearColor(0x000000, 1);
        ORBIT.canvas = document.getElementById('orbitdesigndiv');
        ORBIT.canvas.appendChild(ORBIT.renderer.domElement);
    }

    if (!ORBIT.stats)
    {
        ORBIT.stats = new Stats();
        ORBIT.stats.domElement.style.position = "absolute";
        ORBIT.stats.domElement.style.top = "0px";
        ORBIT.canvas.appendChild(ORBIT.stats.domElement);
    }

    if (!ORBIT.clock)
    {
        ORBIT.clock = new THREE.Clock();
        ORBIT.clock.start();
    }
    if (!ORBIT.starfield)
    {
        ORBIT.starfield = STARFIELD.create(
            ORBIT.scene,
            ORBIT.widthOfScene,
            ORBIT.heightOfScene,
            1000.0,
            ORBIT.shaders.particles.vertex,
            ORBIT.shaders.particles.fragment
        );
    }
    addEventListener("resize", onResize, false);
    animate();
};
var onResize = function ()
{
    ORBIT.widthOfScene =  ORBIT.widthOfScene;
    ORBIT.heightOfScene = ORBIT.heightOfScene;

    ORBIT.camera.aspect = getAspectRatio();
    ORBIT.camera.updateProjectionMatrix();

    ORBIT.renderer.setSize(ORBIT.widthOfScene,  ORBIT.heightOfScene);

    ORBIT.starfield.resize(ORBIT.widthOfScene, ORBIT.heightOfScene);
}
var getAspectRatio = function ()
{
    return (ORBIT.heightOfScene == 0) ? 0.0 : ORBIT.widthOfScene / ORBIT.heightOfScene;
}

var animate = function ()
{
    requestAnimationFrame(animate);

    tick();

    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
};
var tick = function ()
{
    var delta = ORBIT.clock.getDelta();//Get the seconds passed since the last call to this method.
//
    ORBIT.starfield.tick(delta);

    ORBIT.stats.update();
};
//var addStats = function(width,height){
//
//};


var initLight = function() {
    var light_Ambient = new THREE.AmbientLight(0x101010, 0.002);

    light_Ambient.position.set( 0, 0, ORBIT.dist_cam_f).normalize();
    //var light_Directional = new THREE.DirectionalLight(0xFFFFFF);
    //light_Directional.position.set(ORBIT.dist_cam_f, 0, 0);
    var light_Point = new THREE.PointLight(0xFFFFFF, 1);
    light_Point.position.set(0, 0, 0);
    ORBIT.scene.add(light_Point);
    var light_PointA = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointA.position.set(300000, 0, 0);
    ORBIT.scene.add(light_PointA);
    var light_PointB = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointB.position.set(-300000, 0, 0);
    ORBIT.scene.add(light_PointB);
    var light_PointC = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointC.position.set(0, 300000, 0);
    ORBIT.scene.add(light_PointC);
    var light_PointD = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointD.position.set(0, -300000, 0);
    ORBIT.scene.add(light_PointD);
    var light_PointE = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointE.position.set(0, 0, 300000);
    ORBIT.scene.add(light_PointE);
    var light_PointF = new THREE.PointLight(0xFFFFFF, 7, 400000);
    light_PointF.position.set(0, 0, -300000);
    ORBIT.scene.add(light_PointF);
    //ORBIT.scene.add(light_Directional);
    ORBIT.scene.add(light_Ambient);

};

var initOrbitPara = function() {
    ORBIT.orbitpara = {				  //pi, 	pa(km*10),  pe, 	pOmega(deg/Cy), pomega(deg/Cy), ptheta(deg/Cy)
        //轨道倾角  半长轴       离心率   升交点赤经      近心点幅角     真近心点
//        'sun':		new ORBIT.OrbitPara(0.0,	0.0,		0.0,	0.0,			0.0,	        0,  "sun"),
//        'mercury': 	new ORBIT.OrbitPara(7.005,	5790.917,	0.206,	-446.30/60,		573.57/60,		-40, "sun"),
//        'venus': 	new ORBIT.OrbitPara(3.395,	10820.893,	0.007,	-996.89/60,		-108.80/60,		-20, "sun"),
//        'earth': 	new ORBIT.OrbitPara(0.000,	14959.789,	0.08,	-18228.25/60,	1198.28/60,		20, "sun"),
//        'mars': 	new ORBIT.OrbitPara(1.850,	22793.664,	0.093,	-1020.19/60,	1560.78/60,		-190, "sun"),
//        'jupiter': 	new ORBIT.OrbitPara(1.303,	77841.202,	0.048,	1217.17/60,		839.93/60,		-5, "sun"),
//        'saturn': 	new ORBIT.OrbitPara(2.489,	142672.540,	0.055,	-1591.05/60,	-1948.89/60,	65, "sun"),
//        'uranus': 	new ORBIT.OrbitPara(0.773,	287097.220,	0.0461,	1681.40/60,		1312.56/60,		-45, "sun"),
//        'neptune': 	new ORBIT.OrbitPara(1.770,	449825.290,	0.0097,	-151.25/60,		-844.43/60,		-190, "sun"),
//        'moon': 	new ORBIT.OrbitPara(5.145,	38.4400*50,	0.0549,	125.08,			318.15,			-150, "earth")
//        'sate':     new ORBIT.OrbitPara(0, 20000, 0, 0, 0, 0, "earth"),
//        'sate1':    new ORBIT.OrbitPara(90, 30000, 0, 0, 0, 0, "earth"),
//        'sate2':    new ORBIT.OrbitPara(45, 10000, 0, 0, 0, 0, "moon")

    };
};
var unSelect = function(div){
    div.unselectable  = "on";
    div.onselectstart = function(){
        return false;
    }
};
var initPlanet = function() {
    ORBIT.planet = {               //objname,rad(km*100),cent, dist(km*10000),t_revolution, t_rotation, equa_dip,revo_init,rota_init
        'sun': 		new ORBIT.Planet('sun',     6955/100,	'sun',	0,			1000000,		25.38,		7.25,	0,		0),
        'mercury': 	new ORBIT.Planet('mercury', 24.39,      'sun',	579.0917,	87.97, 			58.646,		0.0,	-40,	0),
        'venus': 	new ORBIT.Planet('venus', 	60.51,	    'sun', 	1082.0893,	224.7,			243,		177.4,	-20,	0),
        'earth': 	new ORBIT.Planet('earth', 	63.78,      'sun', 	1495.9789,	365, 			0.99727,	23.26,  20,		0),
        'mars': 	new ORBIT.Planet('mars', 	33.97,      'sun', 	2279.3664, 	686.93, 		1.0260,	 	25.19,	-5,		0),
        'jupiter': 	new ORBIT.Planet('jupiter', 714.92/10,	'sun', 	7784.1202,  11.5856*365,	0.41354, 	3.08, 	65,		0),
        'saturn': 	new ORBIT.Planet('saturn',  602.68/10,	'sun', 	14267.2540, 29.448*365,	    0.44401, 	26.7, 	-45,	0),
        'uranus': 	new ORBIT.Planet('uranus',  255.59/5,	'sun', 	28709.7220, 164.79*365,	    0.781,	 	97.9, 	-190,	0),
        'neptune': 	new ORBIT.Planet('neptune', 247.64/5,	'sun', 	44982.5290, 247.92*365, 	0.67125,	27.8,   -150,	0),
        'moon': 	new ORBIT.Planet('moon',    17.37,	    'earth',38.4400*10, 29.53, 			29.53,		6.688, 	-190,	0)
    };
};
var initTail = function(){
    ORBIT.tail = {
        'mercury': 	new TailStack('mercury', 20, 1, 0.2, '#153F54', 60000),//水星
        'venus': 	new TailStack('venus', 18, 2, 0.2, '#9A5B16', 100000),//金星
        'earth': 	new TailStack('earth', 20, 3, 0.3, '#B1A184', 100000),//地球
        'mars': 	new TailStack('mars', 30, 4, 0.4, '#C75050', 100000),//火星
        'jupiter': 	new TailStack('jupiter', 25, 50, 0.4, '#B2642F', 600000),//木星
        'saturn': 	new TailStack('saturn', 30, 80, 0.55, '#F8CA88', 600000),//土星
        'uranus': 	new TailStack('uranus', 50, 200, 0.75, '#A0C0CB', 600000),//天王星
        'neptune': 	new TailStack('neptune', 60, 270, 0.9, '#5577D0', 600000)//海王星
//        'moon': 	new TailStack('mooon', 10, 0.4, '#C4A184', 500)//月球
    }
};
var initOrbit = function(basePosition) {
    ORBIT.orbit = {	                //orbitpara, kind, centerid
//        'sun':		new ORBIT.Orbit(ORBIT.orbitpara['sun'], 'sun', 'Planet', 'sun'),
//        'mercury': 	new ORBIT.Orbit(ORBIT.orbitpara['mercury'], 'mercury', 'Planet', 'sun'),
//        'venus': 	new ORBIT.Orbit(ORBIT.orbitpara['venus'], 'venus', 'Planet', 'sun'),
//        'earth': 	new ORBIT.Orbit(ORBIT.orbitpara['earth'], 'earth', 'Planet', 'sun'),
//        'mars': 	new ORBIT.Orbit(ORBIT.orbitpara['mars'], 'mars', 'Planet', 'sun'),
//        'jupiter': 	new ORBIT.Orbit(ORBIT.orbitpara['jupiter'], 'jupiter', 'Planet', 'sun'),
//        'saturn': 	new ORBIT.Orbit(ORBIT.orbitpara['saturn'], 'saturn', 'Planet', 'sun'),
//        'uranus': 	new ORBIT.Orbit(ORBIT.orbitpara['uranus'], 'uranus', 'Planet', 'sun'),
//        'neptune': 	new ORBIT.Orbit(ORBIT.orbitpara['neptune'], 'neptune', 'Planet', 'sun'),
//        'moon': 	new ORBIT.Orbit(ORBIT.orbitpara['moon'], 'moon', 'Planet', 'earth')
//        'sate':     new ORBIT.Orbit(ORBIT.orbitpara['sate'], 'sate', 'Satellite', 'earth'),
//        'sate1':    new ORBIT.Orbit(ORBIT.orbitpara['sate1'], 'sate1', 'Satellite', 'earth'),
//        'sate2':    new ORBIT.Orbit(ORBIT.orbitpara['sate2'], 'sate2', 'Satellite', 'moon')
    };
    ORBIT.orbit1 = {
        'mercury': 	new ORBIT.Orbit1('mercury', 'Planet', 'sun','#153F54'),//水星
        'venus': 	new ORBIT.Orbit1('venus', 'Planet', 'sun','#9A5B16'),//金星
        'earth': 	new ORBIT.Orbit1('earth', 'Planet', 'sun','#B1A184'),//地球
        'mars': 	new ORBIT.Orbit1('mars', 'Planet', 'sun','#C75050'),//火星
        'jupiter': 	new ORBIT.Orbit1('jupiter', 'Planet', 'sun','#B2642F'),//木星
        'saturn': 	new ORBIT.Orbit1('saturn', 'Planet', 'sun','#F8CA88'),//土星
        'uranus': 	new ORBIT.Orbit1('uranus', 'Planet', 'sun','#A0C0CB'),//天王星
        'neptune': 	new ORBIT.Orbit1('neptune', 'Planet', 'sun','#5577D0'),//海王星
        'moon': 	new ORBIT.Orbit1('moon', 'Planet', 'earth','#C4A184')//月球
    }
};
//初始化由于修改轨道段起止时间的特征轴
var initOrbitSectionAxis = function(){
    ORBIT.characterAxis = {
        "sTime": new CharacterAxis(),
        "eTime": new CharacterAxis()
    };
};
//初始化星空
var initSkyBox = function() {
    var imagePrefix = "../../resources/images/skybox/";
    var directions  = ["left", "right", "up", "bottom", "front", "back"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.CubeGeometry( ORBIT.dist_cam_f/2, ORBIT.dist_cam_f/2, ORBIT.dist_cam_f/2 );
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    ORBIT.scene.add( skyBox );
    ORBIT.renderer.clear();
    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
};
var initSatellite = function() {
    ORBIT.satellite = {
        //                          orbitpara,               pid,         pcentid
//        'sate':  new ORBIT.Satellite(ORBIT.orbitpara['sate'], 'sate', 'earth', 5, 0.08, 23.5, 0),
//        'sate1': new ORBIT.Satellite(ORBIT.orbitpara['sate1'], 'sate1', 'earth', 5, 0.08, 23.5, 0),
//        'sate2': new ORBIT.Satellite(ORBIT.orbitpara['sate2'], 'sate2', 'moon', 5, 0.08, 23.5, 0)
    };
};
var initSateOrbit = function(){
    removeSatelliteOrbit();
    removeSatellite();
    //移除姿态坐标系 Add centered fixed coordinate frame
    for (var i in ORBIT.aAxis_pName) {
        var obj = ORBIT.planet[ORBIT.aAxis_pName[i]] || ORBIT.satellite[ORBIT.aAxis_pName[i]];
        if (obj != null)
            ORBIT.scene.remove(obj.axis_attitude.object);
    }
    ORBIT.orbitpara = {};
    ORBIT.orbit = {};
    ORBIT.satellite = {};
    ORBIT.aAxis_pName = [];
};
var deleteSateOrbit = function(sid){
    //从场景中移除轨道、卫星和坐标系
    removeSatelliteOrbit(sid);
    removeSatellite(sid);
    removeAxes(sid);
    //从内存中移除轨道、卫星和坐标系
    delete ORBIT.orbitpara[sid];
    delete ORBIT.orbit[sid];
    delete ORBIT.satellite[sid];
    var aAxis_pName = new Array();
    for(var i in ORBIT.aAxis_pName){
        if(ORBIT.aAxis_pName[i] != sid){
            aAxis_pName[aAxis_pName.length] = ORBIT.aAxis_pName[i];
        }
    }
    ORBIT.aAxis_pName = aAxis_pName;

    if(sid == ORBIT.Satellite.getSelectedSatId() || sid == ORBIT.selectOrbit){
        ORBIT.isSelectSat = false;
        ORBIT.selectOrbit = null;
        HoverText.hideSatellitePara();
    }
    refreshObject();
    refreshCamera();
};
var renameSateOrbit  = function(oldsid, newsid, type){
    if(oldsid != newsid){
        if(type == APC.NODETYPE_SATELLITE){
            ORBIT.orbitpara[newsid] = ORBIT.orbitpara[oldsid];
            ORBIT.orbit[newsid] = ORBIT.orbit[oldsid];
            ORBIT.satellite[newsid] = ORBIT.satellite[oldsid];
            ORBIT.orbit[newsid].sid = newsid;
            ORBIT.orbit[newsid].id = newsid + "Orbit";
            ORBIT.orbit[newsid].name = newsid + "Orbit";
            for(var i in ORBIT.orbit[newsid].childlen){
                ORBIT.orbit[newsid].childlen[i].id = newsid;
            }
            if(ORBIT.selectOrbit && ORBIT.selectOrbit == oldsid){
                ORBIT.selectOrbit = newsid;
            }
            if(ORBIT.selectOrbitId && ORBIT.selectOrbitId == oldsid){
                ORBIT.selectOrbitId = newsid;
            }
            if(ORBIT.satelliteName && ORBIT.satelliteName == oldsid){
                ORBIT.satelliteName = newsid;
            }
            ORBIT.satellite[newsid].object.id = newsid;
            ORBIT.satellite[newsid].object.name = newsid;
            delete ORBIT.orbitpara[oldsid];
            delete ORBIT.orbit[oldsid];
            delete ORBIT.satellite[oldsid];
        }
        else if(type == APC.NODETYPE_TASK || type == APC.NODETYPE_SOLUTION){
            if(oldsid == ORBIT.fileName){
                ORBIT.fileName = newsid;
            }
        }
    }
};
//添加方案时设置场景的默认值
var initOrbitScene = function(){
    initSateOrbit();
    var startTime = new Date();
    startTime.setFullYear(2012);
    startTime.setMonth(6);
    startTime.setDate(15);
    startTime.setHours(4);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    var stopTime = new Date();
    stopTime.setFullYear(2022);
    stopTime.setMonth(6);
    stopTime.setDate(15);
    stopTime.setHours(4);
    stopTime.setMinutes(0);
    stopTime.setSeconds(0);
    var step = 3600;
    initSimuTime(startTime, stopTime, step);
    resetScene();
};
//添加卫星时设置默认的卫星
var initSatelliteOrbit = function(sid){
    var cid;
    //在太阳视角下为地球添加卫星，在其它视角下为对应的星体添加卫星
    if(ORBIT.tracedObject.id == 'sun'){
        cid = 'earth';
    }
    else{
        if(ORBIT.tracedTargetTpye == "Planet"){
            cid = ORBIT.tracedObject.id;
        }
        else{
            var sat = ORBIT.orbit[ORBIT.tracedObject.id];
            var id = sat.detectCurrentSection();
            cid = sat.getCenter(id);
        }
    }
//    var sid = me.satelliteName;
    var rad = 5;
    var t_rota = 0.08;
    var tilt = 23.5;
    var initRota = 0;
    var i = 45;
    var a = 20000;
    var e = 0.1;
    var Om = 0;
    var om = 45;
    var theta = 20;
    var t_start = new Date("7 15,2012 04:00:00");
    var t_stop = new Date("7 15,2014 04:00:00");
    var epochTime = new Date("7 15,2012 04:00:00");
    var axis = 'iAxes';
    var attitudeType ='3axes';
    var driftAzimuthal;
    var rollElevation;
    var pitchSpinSpeed;
    if(attitudeType == "3axes"){
        driftAzimuthal = 0;
        rollElevation = 0;
        pitchSpinSpeed = 0;
    }

    var orbitPara = new ORBIT.OrbitPara(i, a, e, Om, om, theta, cid);
    var orbit = new ORBIT.Orbit(orbitPara, sid, 'Satellite', cid);
    var satellite = new ORBIT.Satellite(orbitPara, sid, cid, rad, t_rota, tilt, initRota, t_start, t_stop, epochTime, axis, attitudeType, driftAzimuthal, rollElevation, pitchSpinSpeed);
    addSateOrbit(orbitPara, orbit, satellite);
};
var addSateOrbit = function(orbitPara, orbit, satellite){
    var sid = satellite.object.id;
    ORBIT.orbitpara[sid] = orbitPara;
    ORBIT.orbit[sid] = orbit;
    ORBIT.satellite[sid] = satellite;
    //将新增的卫星极其轨道添加到场景
    if(compareTime(satellite.epochTime, ORBIT.t_simu) >= 0){
        ORBIT.scene.add(ORBIT.orbit[sid].object);
        ORBIT.scene.add(ORBIT.satellite[sid].object);
        if(ORBIT.isSelectSat  && ORBIT.selectOrbit == satellite.object.id){
//            satellite.a *= 1.0;
//            satellite.e *= 1.0;
//            var pi = 180 / Math.PI;
//            var i = satellite.i * pi;
//            var Om = satellite.Om * pi, om = satellite.om * pi, theta = satellite.theta * pi;
//            HoverText.initOrRefreshHoverTextDiv((satellite.a).toFixed(2),(satellite.e).toFixed(2),(i).toFixed(2),(Om).toFixed(2),(om).toFixed(2),(theta).toFixed(2),ORBIT.basePosition);
            ORBIT.orbit[sid].showOrbitPara();
        }
        satellite.isExit = true;
    }
    //为新增的卫星添加姿态坐标系
    ORBIT.aAxis_pName[ORBIT.aAxis_pName.length] = sid;
//    ORBIT.scene.add(ORBIT.satellite[sid].axis_attitude.object);
//    ORBIT.orbit[sid].addOrbitTransfer(new Date("7 17,2012 04:00:00"),"earth", "venus");
};
//场景渲染

////////////////////////////////////////
var addPlanet = function() {
    for(var i in ORBIT.planet) {
        ORBIT.scene.add(ORBIT.planet[i].object);
        if (i  == "sun"){
            ORBIT.planet[i].object.scale.x = ORBIT.sunScale;
            ORBIT.planet[i].object.scale.y = ORBIT.sunScale;
            ORBIT.planet[i].object.scale.z = ORBIT.sunScale;
        }
    }
};

var addTail = function(){
  for(var i in ORBIT.tail){
      ORBIT.scene.add(ORBIT.tail[i].object);
  }
};
//添加轨道段特征点到场景
var addOrbitSectionAxis = function(){
    for(var i in ORBIT.characterAxis){
        ORBIT.characterAxis[i].show();
    }
};
//显示轨道段特征轴
var showOrbitSectionAxis = function(){
    for(var i in ORBIT.characterAxis){
        ORBIT.characterAxis[i].setScale(2000);
    }
};
var addOrbit = function() {
//    for(var i in ORBIT.orbit) {
//        ORBIT.scene.add(ORBIT.orbit[i].object);
//    }
    for(var i in ORBIT.orbit) {
        if(ORBIT.orbit[i].type == "Satellite"){
            var orbit = ORBIT.orbit[i];
            orbit.showOrbit();
            orbit.showAllSection();
        }
    }
//    ORBIT.scene.add(ORBIT.orbit['sate'].object);
    for(var j in ORBIT.orbit1){
        ORBIT.scene.add(ORBIT.orbit1[j].object);
    }
    //TODO test of real data1
//    for(var i in ORBIT.orbit1) {
//        ORBIT.scene.add(ORBIT.orbit1[i].object);
//    }
};
//添加行星轨道
var addPlanetOrbit = function(){
    for(var j in ORBIT.orbit1){
        ORBIT.scene.add(ORBIT.orbit1[j].object);
    }
};
var addSatellite = function() {
    for(var i in ORBIT.satellite) {
        ORBIT.scene.add(ORBIT.satellite[i].object);//console.log(ORBIT.satellite[i].object.id);
    }
};

var addAxes = function() {
    //添加黄道坐标系 Add Ecliptic coordinate frame
    for(var i in ORBIT.eAxis_pName) {
        var obj = ORBIT.planet[ORBIT.eAxis_pName[i]] || ORBIT.satellite[ORBIT.eAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_ecliptic.object);
    }
    //添加惯性坐标系 add inertial coordinate frame
    for(var i in ORBIT.iAxis_pName) {
        var obj = ORBIT.planet[ORBIT.iAxis_pName[i]] || ORBIT.satellite[ORBIT.iAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_inertial.object);
    }
    //添加固连坐标系 Add centered fixed coordinate frame
    for(var i in ORBIT.fAxis_pName) {
        var obj = ORBIT.planet[ORBIT.fAxis_pName[i]] || ORBIT.satellite[ORBIT.fAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_fixed.object);
    }
    //添加姿态坐标系 Add centered fixed coordinate frame
    for(var i in ORBIT.aAxis_pName) {
        var obj = ORBIT.planet[ORBIT.aAxis_pName[i]] || ORBIT.satellite[ORBIT.aAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_attitude.object);
    }
};
//添加磁力线
var addTrace = function(){
    for(var i in ORBIT.traceLine){
        var obj = ORBIT.planet[ORBIT.traceLine[i]];
        if(obj != null){
            ORBIT.scene.add(obj.traceObject);

            ORBIT.scene.add(obj.sunWind);
        }
    }
};
//添加行星坐标系
var addPlanetAxes= function(){
    //添加黄道坐标系 Add Ecliptic coordinate frame
    for(var i in ORBIT.eAxis_pName) {
        var obj = ORBIT.planet[ORBIT.eAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_ecliptic.object);
    }
    //添加惯性坐标系 add inertial coordinate frame
    for(var i in ORBIT.iAxis_pName) {
        var obj = ORBIT.planet[ORBIT.iAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_inertial.object);
    }
    //添加固连坐标系 Add centered fixed coordinate frame
    for(var i in ORBIT.fAxis_pName) {
        var obj = ORBIT.planet[ORBIT.fAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.add(obj.axis_fixed.object);
    }
    //添加卫星轨道坐标系
    for(var i in ORBIT.satellite){
        var obj = ORBIT.satellite[i];
        if(obj != null && obj.axis_orbit.object != null && obj.isVisable && obj.isExit){
            ORBIT.scene.add(obj.axis_orbit.object);
        }
    }
}
var removeTail = function(){
    for(var i in ORBIT.tail){
        ORBIT.scene.remove(ORBIT.tail[i].object);
    }
};
//移除行星轨道
var removePlanetOrbit = function(){
    for(var j in ORBIT.orbit1){
        ORBIT.scene.remove(ORBIT.orbit1[j].object);
    }
};
//移除卫星轨道
var removeSatelliteOrbit = function(sid) {
    if(sid == undefined){
        for(var i in ORBIT.orbit) {
            if(ORBIT.orbit[i].type == "Satellite"){
                var orbit = ORBIT.orbit[i];
                //隐藏轨道
                orbit.hideOrbit();
                //隐藏该卫星所有轨道段
                orbit.hideSection();
            }
        }
    }
    else{
        var orbit = ORBIT.orbit[sid];
        //隐藏轨道
        orbit.hideOrbit();
        //隐藏该卫星所有轨道段
        orbit.hideSection();
        ORBIT.satellite[sid].showHoverDiv();
        //隐藏二维文字
        ORBIT.satellite[sid].hideHoverDiv();
    }
};

//移除轨道段特征轴
var removeOrbitSectionAxis = function(){
    for(var i in ORBIT.characterAxis){
        ORBIT.characterAxis[i].hide();
    }
};
var removeSatellite = function(sid) {
    if(sid == undefined) {
        for (var i in ORBIT.satellite) {
            ORBIT.scene.remove(ORBIT.satellite[i].object);//console.log(ORBIT.satellite[i].object.id);
            if(ORBIT.satellite[i].axis_orbit != null && ORBIT.satellite[i].axis_orbit != undefined)
                ORBIT.scene.remove(ORBIT.satellite[i].axis_orbit.object);
        }
    }
    else{
        ORBIT.scene.remove(ORBIT.satellite[sid].object);
    }
};
//移除坐标系
var removeAxes = function(sid) {
    if(sid == undefined) {
        //移除黄道坐标系 Add Ecliptic coordinate frame
        for (var i in ORBIT.eAxis_pName) {
            var obj = ORBIT.planet[ORBIT.eAxis_pName[i]] || ORBIT.satellite[ORBIT.eAxis_pName[i]];
            if (obj != null)
                ORBIT.scene.remove(obj.axis_ecliptic.object);
        }
        //移除惯性坐标系 add inertial coordinate frame
        for (var i in ORBIT.iAxis_pName) {
            var obj = ORBIT.planet[ORBIT.iAxis_pName[i]] || ORBIT.satellite[ORBIT.iAxis_pName[i]];
            if (obj != null)
                ORBIT.scene.remove(obj.axis_inertial.object);
        }
        //移除固连坐标系 Add centered fixed coordinate frame
        for (var i in ORBIT.fAxis_pName) {
            var obj = ORBIT.planet[ORBIT.fAxis_pName[i]] || ORBIT.satellite[ORBIT.fAxis_pName[i]];
            if (obj != null)
                ORBIT.scene.remove(obj.axis_fixed.object);
        }
        //移除姿态坐标系 Add centered fixed coordinate frame
        for (var i in ORBIT.aAxis_pName) {
            var obj = ORBIT.planet[ORBIT.aAxis_pName[i]] || ORBIT.satellite[ORBIT.aAxis_pName[i]];
            if (obj != null)
                ORBIT.scene.remove(obj.axis_attitude.object);
        }
    }
    else{
        var obj = ORBIT.satellite[sid].axis_ecliptic.object;
        if(obj != null && obj != undefined){
            ORBIT.scene.remove(obj);
        }
        obj = ORBIT.satellite[sid].axis_inertial.object
        if(obj != null && obj != undefined){
            ORBIT.scene.remove(obj);
        }
        obj = ORBIT.satellite[sid].axis_fixed.object
        if(obj != null && obj != undefined){
            ORBIT.scene.remove(obj);
        }
        obj = ORBIT.satellite[sid].axis_attitude.object
        if(obj != null && obj != undefined){
            ORBIT.scene.remove(obj);
        }
        obj = ORBIT.satellite[sid].axis_orbit.object;
        if(obj != null && obj != undefined){
            ORBIT.scene.remove(obj);
        }
    }
};
//移除磁力线
var removeTrace = function(){
    for(var i in ORBIT.traceLine){
        var obj = ORBIT.planet[ORBIT.traceLine[i]];
        if(obj != null){
            ORBIT.scene.remove(obj.traceObject);
        }
    }
};
//移除行星坐标系
var removePlanetAxes= function(){
    //移除黄道坐标系 Add Ecliptic coordinate frame
    for(var i in ORBIT.eAxis_pName) {
        var obj = ORBIT.planet[ORBIT.eAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.remove(obj.axis_ecliptic.object);
    }
    //移除惯性坐标系 add inertial coordinate frame
    for(var i in ORBIT.iAxis_pName) {
        var obj = ORBIT.planet[ORBIT.iAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.remove(obj.axis_inertial.object);
    }
    //移除固连坐标系 Add centered fixed coordinate frame
    for(var i in ORBIT.fAxis_pName) {
        var obj = ORBIT.planet[ORBIT.fAxis_pName[i]];
        if(obj != null)
            ORBIT.scene.remove(obj.axis_fixed.object);
    }
    //移除卫星轨道坐标系
    for(var i in ORBIT.satellite){
        var obj = ORBIT.satellite[i];
        if(obj != null && obj.axis_orbit.object != null){
            ORBIT.scene.remove(obj.axis_orbit.object);
        }
    }
};
var initObject = function(width,height) {
    initOrbitPara();
    initPlanet();
    initTail();
    OrbitTail.initTail();
    initOrbit();
//    initOrbitSectionAxis();
    initSatellite();
    addPlanet();
    addOrbit();
    addSatellite();
//    addAxes();
//    addTrace();
    //refreshObject();
};
function makeOortCloud(){
    //	distance to oort cloud
    //		about 50,000 AU
    //	1 Astronomical Unit = 1.58128588 × 10^-5 light years
    //		50,0000 AU ~= 0.790642941 LY

    /*
     var dist = 0.790642941;
     var distrib = 0.1;
     var particlesGeo = new THREE.Geometry();
     for( var i=0; i<10000; i++ ){
     var x = random(-1,1);
     var y = random(-1,1);
     var z = random(-1,1);
     var vec = new THREE.Vector3(x,y,z);
     vec.setLength( dist );

     var multDistr = distrib;
     if( Math.random() > 0.98 )
     multDistr = Math.pow( multDistr, 1 + Math.random() * 6)

     vec.x += random(-multDistr,multDistr);
     vec.y += random(-multDistr,multDistr);
     vec.z += random(-multDistr,multDistr);
     particlesGeo.vertices.push( vec );
     }

     var material = new THREE.ParticleBasicMaterial({color:0x333333, size: 0.1});
     var particles = new THREE.ParticleSystem( particlesGeo, material );
     */

    var count = 10000;
    var dist = 0.790642941;
    var distrib = 0.1;

    var particlesGeo = new THREE.BufferGeometry();
    particlesGeo.attributes = {
        position: {
            itemSize: 3,
            array: new Float32Array( count * 3 ),
            numItems: count * 3
        }
    };

    var vector = new THREE.Vector3();
    var positions = particlesGeo.attributes.position.array;

    for( var i=0; i<positions.length; i+=3 ){
        vector.x = random(-1,1);
        vector.y = random(-1,1);
        vector.z = random(-1,1);
        vector.setLength( dist );

        var multDistr = distrib;
        if( Math.random() > 0.98 )
            multDistr = Math.pow( multDistr, 1 + Math.random() * 6)

        vector.x += random(-multDistr,multDistr);
        vector.y += random(-multDistr,multDistr);
        vector.z += random(-multDistr,multDistr);
        positions[i] = vector.x;
        positions[i+1] = vector.y;
        positions[i+2] = vector.z;
    }

    particlesGeo.computeBoundingSphere();

    var material = new THREE.ParticleBasicMaterial({color:0x333333, size: 0.1});
    var particles = new THREE.ParticleSystem( particlesGeo, material );

    var oortInfo = new THREE.Gyroscope();
    oortInfo.name = "Oort Cloud";
    oortInfo.position.set( dist, -dist , 0 );
    oortInfo.scale.setLength( 0.1 );
//    attachLegacyMarker( "Oort Cloud", oortInfo, 1.0, {min:40.0, max: 500.0}  );

    particles.add( oortInfo );

    return particles;
}
function random(low, high) {
    if (low >= high) return low;
    var diff = high - low;
    return (Math.random() * diff) + low;
}

var numberSecond = function(h, m, s) {
    return (h * 3600 + m * 60 + s)/86400;
};
//调用前台获取八大行星位置
var getPlanetPosition = function(){
    var t_simuDays = julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear());
    for(var i in ORBIT.planet){
        switch(i){
            case "mercury":ORBIT.planet[i].position = mercury(t_simuDays);break;
            case "venus":ORBIT.planet[i].position = venus(t_simuDays);break;
            case "earth":ORBIT.planet[i].position = earth(t_simuDays);break;
            case "mars":ORBIT.planet[i].position = mars(t_simuDays);break;
            case "jupiter":ORBIT.planet[i].position = jupiter(t_simuDays);break;
            case "saturn":ORBIT.planet[i].position = saturn(t_simuDays);break;
            case "uranus":ORBIT.planet[i].position = uranus(t_simuDays);break;
            case "neptune":ORBIT.planet[i].position = neptune(t_simuDays);break;
            case "moon":ORBIT.planet[i].position = moon(t_simuDays);break;
        }
    }
};
//调用后台获取八大行星位置及姿态
var getPlanetPositionMatrix = function (){
    //只获取当前跟踪星体的位置和转换矩阵
    if(ORBIT.states_View == "sunlanetAxes"){
        for(var i in ORBIT.planet){
            if(ORBIT.planet[i].rotaLock)
                continue;
            ORBIT.planet[i].rotaLock = true;
            ORBIT.getPlanet.getPlanetPosition(ORBIT.t_simu, ORBIT.planet[i].object.name);
        }
    }
    else{
        var pid = null;
        if(ORBIT.tracedTargetTpye == 'Planet') {
            pid = ORBIT.tracedObject.id;
        }
        else{
//            var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
//            var id = orbit.detectCurrentSection();
//            pid = orbit.getCenter(id);
            pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        }
        if(pid == "moon"){
            ORBIT.getPlanet.getPlanetPosition(ORBIT.t_simu, "earth");
        }
        ORBIT.getPlanet.getPlanetPosition(ORBIT.t_simu, pid);
        if(pid == "earth"){
            ORBIT.getPlanet.getPlanetPosition(ORBIT.t_simu, "moon");
        }
    }
};
//更新行星姿态及位置 Refresh ORBIT.planet's bearing & position
var refreshPlanet = function() {
    var pid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        pid = ORBIT.tracedObject.id;
    }
    else{
        var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
        var id = orbit.detectCurrentSection();
        pid = orbit.getCenter(id);
//        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    var planets;
    //根据当前跟踪的星球，设置要更新的行星位置
    switch(pid){
        case "sun":planets = ORBIT.planet;break;
        case "earth":
        case "moon":planets = {"earth" : ORBIT.planet["earth"], "moon" : ORBIT.planet["moon"]};break;
        case "mercury":planets = {"mercury" : ORBIT.planet[pid]};break;
        case "venus":planets = {"venus" : ORBIT.planet[pid]};break;
        case "mars":planets = {"mars" : ORBIT.planet[pid]};break;
        case "jupiter":planets = {"jupiter" : ORBIT.planet[pid]};break;
        case "saturn":planets = {"saturn" : ORBIT.planet[pid]};break;
        case "uranus":planets = {"uranus" : ORBIT.planet[pid]};break;
        case "neptune":planets = {"neptune" : ORBIT.planet[pid]};break;
    }
    for(var i in planets) {
        //更新行星
        var planet = planets[i];
        var cid = planet.centerid;
        if (!planet.isInitIAxis) {
            var xPIHalf = Matrix.axisXRotationMatrix(Math.PI / 2);//绕x轴旋转九十度的矩阵
            planet.object.applyMatrix(xPIHalf);
        }
        else {
            if (i == "moon") {
                planet.object.applyMatrix(planets[cid].j2000MatrixNI);
            }
            planet.object.applyMatrix(planet.j2000MatrixNI);
            planet.object.applyMatrix(planet.fixedNI);
            if(i == "earth"){
                if(ORBIT.states_View == "magnetic" && !ORBIT.firstInMagnetic || ORBIT.firstOutMagnetic){//磁场坐标系但不是刚由其它坐标系切过来时，或者刚由磁场坐标系切到其它坐标系时
                    planet.object.applyMatrix(planet.GSMNI);
                    ORBIT.firstOutMagnetic = false;
                }
                if(ORBIT.firstInMagnetic){
                    ORBIT.firstInMagnetic = false;
                }
            }
        }
        if(i == "earth" && ORBIT.states_View == "magnetic"){
            planet.object.applyMatrix(planet.GSM);
        }
        planet.object.applyMatrix(planet.fixed);
        planet.object.applyMatrix(planet.j2000Matrix);
        if (i == "moon") {
            planet.object.applyMatrix(planets[cid].j2000Matrix);
        }
        planet.object.updateMatrix();
        var coe = ORBIT.orbitCoe;
        planet.object.position.set(planet.position[0] / coe, planet.position[1] / coe, planet.position[2] / coe);

        if (i == "moon") {
            var obj_center = ORBIT.scene.getObjectById(cid, true);
            planet.object.position.add(obj_center.position);
        }
        //ORBIT.lighttail.update(ORBIT.planet["earth"].object.position);
    }




//    for(var i in ORBIT.planet){//if(ORBIT.planet[i].object.id == "earth")console.log(ORBIT.count);
//        var theta_revol = ORBIT.count/ORBIT.planet[i].t_revol;
//        var theta_rota = 2 * Math.PI * ORBIT.count/ORBIT.planet[i].t_rota;
//        var obj_center = ORBIT.scene.getObjectById(ORBIT.planet[i].centerid, true);
//        //set planet's position
////        var m4 = new THREE.Matrix4();
////        m4 = getPlaTransMatrix4(theta_revol, ORBIT.orbitpara[i], 'Planet');
////        var v4 = new THREE.Vector4();
////        v4.applyMatrix4(m4);
//
//        var coe =10e3;
//        var position;
//        if(ORBIT.planet[i].object.name != "moon" && ORBIT.planet[i].object.name != "sun"){
//            switch(ORBIT.planet[i].object.name){
//                case "mercury":position = mercury(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "venus":position = venus(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "earth":position = earth(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));/*console.log(position);*/break;
//                case "mars":position = mars(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "jupiter":position = jupiter(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "saturn":position = saturn(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "uranus":position = uranus(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//                case "neptune":position = neptune(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));break;
//            }
//            ORBIT.planet[i].object.position.set(-position[1]/coe, -position[2]/coe, -position[0]/coe);
//        }
//        else if(ORBIT.planet[i].object.name == "moon"){
//            var coe = 200;
//            var rmoon = moon(julian(ORBIT.t_simu.getMonth()+1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds()));
//            ORBIT.planet[i].object.position.set(-rmoon[1]/coe, -rmoon[2]/coe, -rmoon[0]/coe);
//            ORBIT.planet[i].object.position.add(obj_center.position);
////            ORBIT.planet[i].object.position.set(v4.x, v4.y, v4.z);
////            ORBIT.planet[i].object.position.add(obj_center.position);
//        }
//        //set planet's pivot-rotation
//        ORBIT.planet[i].object.rotation.set(0 , theta_rota + ORBIT.planet[i].rota_init , -ORBIT.planet[i].tilt, 'ZXY');
//
//
//
//
//
////        var geometry = new THREE.Geometry();
////        geometry.dynamic = true;
////        var material = new THREE.LineBasicMaterial({color: 0x00ffff, opacity: 1});
////        material.transparent = true;
////        var vector3 = new THREE.Vector3(ORBIT.planet["sun"].object.position.x, ORBIT.planet["sun"].object.position.y, ORBIT.planet["sun"].object.position.z);
////        geometry.vertices.push(vector3);
////        vector3 = new THREE.Vector3(ORBIT.planet["earth"].object.position.x, ORBIT.planet["earth"].object.position.y, ORBIT.planet["earth"].object.position.z);
////        geometry.vertices.push(vector3);
////        var line = new THREE.Line( geometry, material, THREE.LineStrip );
////        ORBIT.scene.add(line);
//    }
};
//刷新行星的显示比例
var refreshPlanetScale = function(){
    for(var i in ORBIT.planet){
        if(i == "sun"){
            var sunScale = ORBIT.planetScale * ORBIT.sunScale;
            if(sunScale > 2000){
                sunScale = 2000;
            }
            ORBIT.planet[i].object.scale.set(sunScale, sunScale, sunScale);
        }
        else{
            ORBIT.planet[i].object.scale.set(ORBIT.planetScale, ORBIT.planetScale, ORBIT.planetScale);
        }
    }
};
//刷新卫星的显示比例
var refreshSatelliteScale = function(){
    for(var i in ORBIT.satellite){
        ORBIT.satellite[i].object.scale.set(ORBIT.planetScale, ORBIT.planetScale, ORBIT.planetScale);
    }
    for(var i in ORBIT.orbit){
        ORBIT.orbit[i].object.scale.set(ORBIT.planetScale, ORBIT.planetScale, ORBIT.planetScale);
    }
};
var refreshTail = function(){
    for(var i in ORBIT.tail){
        var overDay = julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) - julian(ORBIT.t_preSimu.getMonth() + 1, ORBIT.t_preSimu.getDate(), ORBIT.t_preSimu.getFullYear());
        if(ORBIT.tail[i].isPushStack(overDay)){
            var position = [];
            var planet = ORBIT.planet[i].object.position;
            position[0] = planet.x;
            position[1] = planet.y;
            position[2] = planet.z;
            ORBIT.tail[i].pushStack(position);
            ORBIT.tail[i].moveTail();
        }
    }
};
//当卫星轨道参数改变时，移除重建该卫星轨道
var refreshSatelliteOrbit = function(sid, centerid, start, stop, epoch, a, e, i, Om, om, theta){
    ORBIT.satellite[sid].epochTime.setTime(Date.parse(epoch.toString()));
    ORBIT.satellite[sid].t_start.setTime(Date.parse(start.toString()));
    ORBIT.satellite[sid].t_stop.setTime(Date.parse(stop.toString()));
    ORBIT.orbit[sid].centerid = centerid;
    ORBIT.satellite[sid].centerid = centerid;
    ORBIT.orbitpara[sid].a = a;
    ORBIT.orbitpara[sid].e = e;
    ORBIT.orbitpara[sid].i = i;
    ORBIT.orbitpara[sid].Om = Om;
    ORBIT.orbitpara[sid].om = om;
    ORBIT.orbitpara[sid].theta = theta;
    ORBIT.orbitpara[sid].T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(ORBIT.orbitpara[sid].a, 3) / ORBIT.GravitationalConstant[ORBIT.satellite[sid].centerid]);
    ORBIT.scene.remove(ORBIT.orbit[sid].object);
    ORBIT.orbit[sid].object = ORBIT.orbit[sid].makeOrbit(ORBIT.orbitpara[sid], "Satellite", ORBIT.satellite[sid].centerid, sid);
    ORBIT.scene.add(ORBIT.orbit[sid].object);
    ORBIT.satellite[sid].isExit = true;
    hideCharacter();
    var selectedId = ORBIT.Satellite.getSelectedSatId();
    if(selectedId){
        ORBIT.orbit[selectedId].showCharacter();
    }
    if(sid == ORBIT.selectOrbit){
//        var satellite = ORBIT.orbitpara[sid];
//        satellite.a *= 1.0;
//        satellite.e *= 1.0;
//        var pi = 180 / Math.PI;
//        var i = satellite.i * pi;
//        var Om = satellite.Om * pi, om = satellite.om * pi, theta = satellite.theta * pi;
//        HoverText.initOrRefreshHoverTextDiv((satellite.a).toFixed(2),(satellite.e).toFixed(2),(i).toFixed(2),(Om).toFixed(2),(om).toFixed(2),(theta).toFixed(2),ORBIT.basePosition);
        ORBIT.orbit[sid].showOrbitPara();
        refreshSatParaWindow(sid);
    }
    refreshSatellite(sid);
    refreshOrbit(sid);
    refreshoAxes(sid);
    refreshSatellite();
    refreshCamera();
};
var refreshOrbit = function(sid) {
    if(sid == undefined || sid == null){
        var pid = null;
        if(ORBIT.tracedTargetTpye == 'Planet') {
            pid = ORBIT.tracedObject.id;
        }
        else{
            pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        }
        if(pid == "sun" || pid == "earth" || pid == "moon"){
            ORBIT.orbit1['moon'].object.position = ORBIT.planet['earth'].object.position;
        }
        for(var i in ORBIT.satellite){
//            if(pid == "sun" || ORBIT.satellite[i].centerid == pid || pid == "earth" && ORBIT.satellite[i].centerid == "moon" || pid == "moon" && ORBIT.satellite[i].centerid == "earth") {
//                ORBIT.orbit[ORBIT.satellite[i].object.id].object.position = ORBIT.planet[ORBIT.satellite[i].centerid].object.position;
                ORBIT.orbit[ORBIT.satellite[i].object.id].refresh();
//            }
        }
    }
    else{
        ORBIT.orbit[sid].refresh();
    }



//    for(var i in ORBIT.orbit){
//        //set planet's orbit
//        var obj_center = ORBIT.scene.getObjectById(ORBIT.orbit[i].centerid, true);
//        ORBIT.orbit[i].object.position = obj_center.position;
//    }

    //TODO test of real data2
//    for(var i in ORBIT.orbit1) {
//        //set planet's orbit
//        var obj_center = ORBIT.scene.getObjectById(ORBIT.orbit1[i].centerid, true);
//        ORBIT.orbit1[i].object.position = obj_center.position;
//    }
};
//隐藏特征点
var hideCharacter = function(sid){
    var orbit;
    if(sid == undefined || sid == null){
        for(var i in ORBIT.orbit){
            orbit = ORBIT.orbit[i];
            orbit.hideCharacter();
        }
    }
    else{
        orbit = ORBIT.orbit[sid];
        orbit.hideCharacter();
    }
};
//显示特征点
var showCharacter = function(sid){
    var sat = ORBIT.orbit[sid].object;
    var a = ORBIT.orbitpara[sid].a;
    for(var i in sat.children){
        sat.children[i].scale.set(a / 100000, a / 100000, a / 100000);
    }
};
//刷新磁力线
var refreshTrace = function(){
    var tracePid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        tracePid = ORBIT.tracedObject.id;
    }
    else{
        tracePid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(tracePid == "earth" || tracePid == "moon" || tracePid == "sun") {
        for(var i in ORBIT.traceLine) {
            var pid = ORBIT.traceLine[i];
            var obj = ORBIT.planet[pid];
            if (obj != null && obj != undefined) {
                var cid = obj.centerid;
                if (obj.isInitIAxis) {
                    obj.traceObject.applyMatrix(obj.j2000MatrixNI);
                    obj.traceObject.applyMatrix(obj.fixedNI);
                    obj.traceObject.applyMatrix(obj.GSMNI);
                }
                obj.traceObject.applyMatrix(obj.GSM);
                obj.traceObject.applyMatrix(obj.fixed);
                obj.traceObject.applyMatrix(obj.j2000Matrix);
                obj.traceObject.updateMatrix();
                obj.traceObject.position.x = obj.object.position.x;
                obj.traceObject.position.y = obj.object.position.y;
                obj.traceObject.position.z = obj.object.position.z;
            }
        }
    }
};
//刷新太阳风
var refreshSunWind = function(){
    var tracePid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        tracePid = ORBIT.tracedObject.id;
    }
    else{
        tracePid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(tracePid == "earth" || tracePid == "moon" || tracePid == "sun") {
        for(var i in ORBIT.traceLine) {
            var pid = ORBIT.traceLine[i];
            var obj = ORBIT.planet[pid];
            if (obj != null && obj != undefined) {
                var cid = obj.centerid;
                if (obj.isInitIAxis) {
                    obj.sunWind.applyMatrix(obj.j2000MatrixNI);
                    obj.sunWind.applyMatrix(obj.fixedNI);
                    obj.sunWind.applyMatrix(obj.GSMNI);
                }
                obj.sunWind.applyMatrix(obj.GSM);
                obj.sunWind.applyMatrix(obj.fixed);
                obj.sunWind.applyMatrix(obj.j2000Matrix);
                obj.sunWind.updateMatrix();
                obj.sunWind.position.x = obj.object.position.x;
                obj.sunWind.position.y = obj.object.position.y;
                obj.sunWind.position.z = obj.object.position.z;
                //刷新太阳风的位置
                ORBIT.Planet.refreshSunWind(ORBIT.planetScale);
            }
        }
    }
};
var refreshSatellite = function(sid) {
    if(sid == undefined || sid == null) {
        var pid = null;
        if(ORBIT.tracedTargetTpye == 'Planet') {
            pid = ORBIT.tracedObject.id;
        }
        else{
            pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        }
        for (var i in ORBIT.satellite) {
//        var theta_revol = ORBIT.count/ORBIT.planet[i].t_revol;
//        var theta_rota = ORBIT.count/ORBIT.planet[i].t_rota;
            //TODO
//        var theta_revol = 0;
//        var obj_center = ORBIT.scene.getObjectById(ORBIT.satellite[i].centerid, true);
//        //set Sate's position
//        var m4 = new THREE.Matrix4();
//        //TODO Sate's revol
//        m4 = getPlaTransMatrix4(theta_revol, ORBIT.orbitpara[ORBIT.satellite[i].object.id], 'Satellite');
//        var v4 = new THREE.Vector4();
//        v4.applyMatrix4(m4);
//        ORBIT.satellite[i].object.position.set(v4.x/100, v4.y/100, v4.z/100);
//        ORBIT.satellite[i].object.position.add(obj_center.position);
            //TODO set Sate's rotation
            var satellite = ORBIT.satellite[i];
            var orbit = ORBIT.orbit[i];
//            if (pid == "sun" || satellite.centerid == pid || pid == "earth" && satellite.centerid == "moon" || pid == "moon" && satellite.centerid == "earth") {
//            var theta_rota = 2 * Math.PI * ORBIT.count / satellite.t_rota;
            if (compareTime(satellite.epochTime, ORBIT.t_simu) >= 0 && compareTime(satellite.t_start, ORBIT.t_simu) >= 0 && compareTime(ORBIT.t_simu, orbit.getEndTime(orbit.orbitSection.length - 1)) >= 0) {
                if (!satellite.isExit && satellite.isVisable) {
                    ORBIT.scene.add(satellite.object);
//                        ORBIT.scene.add(ORBIT.orbit[satellite.object.id].object);
                    if (satellite.axis_orbit != null && satellite.axis_orbit != undefined && ORBIT.planetaryCoordinatesVisibility)
                        ORBIT.scene.add(satellite.axis_orbit.object);
                    satellite.isExit = true;
                }
                //如果该卫星被选中则显示轨道参数
                if(ORBIT.isSelectSat  && ORBIT.selectOrbit == satellite.object.id){
                    orbit.showOrbitPara();
                }
                //刷新卫星的位置和速度
                satellite.refresh();
//                    var overSeconds = (julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds())
//                        - (julian(satellite.epochTime.getMonth() + 1, satellite.epochTime.getDate(), satellite.epochTime.getFullYear()) + numberSecond(satellite.epochTime.getHours(), satellite.epochTime.getMinutes(), satellite.epochTime.getSeconds())))
//                        * 86400;
//                    var obj_center = ORBIT.scene.getObjectById(satellite.centerid, true);
//                    var finalPosition = getPlanetTransMatrix4(overSeconds, ORBIT.orbitpara[i], 'Satellite', satellite.centerid);
//                    satellite.object.position.set(finalPosition[0].x, finalPosition[0].y, finalPosition[0].z);
//                    satellite.object.position.add(obj_center.position);
////            satellite.object.rotation.set(0, theta_rota + satellite.rota_init, -satellite.tilt, 'ZXY');
//                    satellite.velocity = finalPosition[1];
            }
            else {
                if (satellite.isExit) {
                    ORBIT.scene.remove(satellite.object);
//                        ORBIT.scene.remove(ORBIT.orbit[satellite.object.id].object);
                    if(ORBIT.isSelectSat  && ORBIT.selectOrbit == satellite.object.id){
                        HoverText.hideSatellitePara();
                    }
                    if (satellite.axis_orbit != null && satellite.axis_orbit != undefined)
                        ORBIT.scene.remove(satellite.axis_orbit.object);
                    satellite.isExit = false;
                }
            }
//            }
            //set Sate's position
//        var m4 = new THREE.Matrix4();
//        //TODO Sate's revol
//        m4 = getPlanetTransMatrix4(overSeconds, ORBIT.orbitpara[ORBIT.satellite[i].object.id], 'Satellite', ORBIT.satellite[i].centerid);
//        var v4 = new THREE.Vector4();
//        v4.applyMatrix4(m4);
//        ORBIT.satellite[i].object.position.set(v4.x, v4.y, v4.z);
//        ORBIT.satellite[i].object.position.add(obj_center.position);
        }
    }
    else{
        var satellite = ORBIT.satellite[sid];
        var orbit = ORBIT.orbit[sid];
        if (compareTime(satellite.epochTime, ORBIT.t_simu) >= 0 && compareTime(satellite.t_start, ORBIT.t_simu) >= 0 && compareTime(ORBIT.t_simu, orbit.getEndTime(orbit.orbitSection.length - 1)) >= 0) {
            if (!satellite.isExit && satellite.isVisable) {
                ORBIT.scene.add(satellite.object);
//                ORBIT.scene.add(ORBIT.orbit[satellite.object.id].object);
                if (satellite.axis_orbit != null && satellite.axis_orbit != undefined && ORBIT.planetaryCoordinatesVisibility)
                    ORBIT.scene.add(satellite.axis_orbit.object);
                satellite.isExit = true;
            }
            if(ORBIT.isSelectSat  && ORBIT.selectOrbit == satellite.object.id){
                orbit.showOrbitPara();
            }
            satellite.refresh();
//            var overSeconds = (julian(ORBIT.t_simu.getMonth() + 1, ORBIT.t_simu.getDate(), ORBIT.t_simu.getFullYear()) + numberSecond(ORBIT.t_simu.getHours(), ORBIT.t_simu.getMinutes(), ORBIT.t_simu.getSeconds())
//                - (julian(satellite.epochTime.getMonth() + 1, satellite.epochTime.getDate(), satellite.epochTime.getFullYear()) + numberSecond(satellite.epochTime.getHours(), satellite.epochTime.getMinutes(), satellite.epochTime.getSeconds())))
//                * 86400;
//            var obj_center = ORBIT.scene.getObjectById(satellite.centerid, true);
//            var finalPosition = getPlanetTransMatrix4(overSeconds, ORBIT.orbitpara[sid], 'Satellite', satellite.centerid);
//            satellite.object.position.set(finalPosition[0].x, finalPosition[0].y, finalPosition[0].z);
//            satellite.object.position.add(obj_center.position);
////            satellite.object.rotation.set(0, theta_rota + satellite.rota_init, -satellite.tilt, 'ZXY');
//            satellite.velocity = finalPosition[1];
        }
        else {
            if (satellite.isExit) {
                ORBIT.scene.remove(satellite.object);
//                ORBIT.scene.remove(ORBIT.orbit[satellite.object.id].object);
                if(ORBIT.isSelectSat  && ORBIT.selectOrbit == satellite.object.id){
                    HoverText.hideSatellitePara();
                }
                if (satellite.axis_orbit != null && satellite.axis_orbit != undefined)
                    ORBIT.scene.remove(satellite.axis_orbit.object);
                satellite.isExit = false;
            }
        }
    }
};
//更新黄道坐标系姿态及位置 Refresh Ecliptic coordinate frame's bearing & position
var refresheAxes = function() {
    var pid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        pid = ORBIT.tracedObject.id;
    }
    else{
        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    if(pid == "sun") {
        for (var i in ORBIT.eAxis_pName) {
            var obj = ORBIT.planet[ORBIT.eAxis_pName[i]] || ORBIT.satellite[ORBIT.eAxis_pName[i]];
            if (obj != null && obj!= undefined)
                obj.axis_ecliptic.object.position = obj.object.position;
        }
    }
};
//更新惯性坐标系姿态及位置 Refresh inertial coordinate frame's bearing & position
var refreshiAxes = function() {
    var tracePid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        tracePid = ORBIT.tracedObject.id;
    }
    else{
        tracePid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    var iAxis_pName;
    //根据当前跟踪的星球，设置要更新的坐标系位置及姿态
    switch(tracePid){
        case "sun":iAxis_pName = ['sun', 'mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','moon'];break;
        case "earth":
        case "moon":iAxis_pName = ["earth", "moon"];break;
        case "mercury":iAxis_pName = ["mercury"];break;
        case "venus":iAxis_pName = ["venus"];break;
        case "mars":iAxis_pName = ["mars"];break;
        case "jupiter":iAxis_pName = ["jupiter"];break;
        case "saturn":iAxis_pName = ["saturn"];break;
        case "uranus":iAxis_pName = ["uranus"];break;
        case "neptune":iAxis_pName = ["neptune"];break;
    }
    for(var i in iAxis_pName) {
        //第一次刷新惯性坐标系的位置时，才进行旋转惯性坐标系
        var pid = iAxis_pName[i];
        var obj = ORBIT.planet[pid] || ORBIT.satellite[pid];
        if (obj != null && obj != undefined) {
            if (!obj.isInitIAxis) {
                obj.axis_inertial.applyMatrix(obj.j2000Matrix);
                if (pid == "moon") {
                    var cid = obj.centerid;
                    obj.axis_inertial.applyMatrix(ORBIT.planet[cid].j2000Matrix);
                }
                obj.axis_inertial.updateMatrix();
            }
            obj.axis_inertial.object.position = obj.object.position;
        }
    }


//    for(var i in ORBIT.iAxis_pName){
//        var obj = ORBIT.planet[ORBIT.iAxis_pName[i]] || ORBIT.satellite[ORBIT.iAxis_pName[i]];
//        if(obj != null)
//            obj.axis_inertial.object.position = obj.object.position;
//    }
};
//更新固连坐标系姿态及位置 Refresh centered fixed coordinate frame's bearing & position
var refreshfAxes = function() {
    var tracePid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        tracePid = ORBIT.tracedObject.id;
    }
    else{
        tracePid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    var fAxis_pName;
    //根据当前跟踪的星球，设置要更新的坐标系位置及姿态
    switch(tracePid){
        case "sun":fAxis_pName = ['sun', 'mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','moon'];break;
        case "earth":
        case "moon":fAxis_pName = ["earth", "moon"];break;
        case "mercury":fAxis_pName = ["mercury"];break;
        case "venus":fAxis_pName = ["venus"];break;
        case "mars":fAxis_pName = ["mars"];break;
        case "jupiter":fAxis_pName = ["jupiter"];break;
        case "saturn":fAxis_pName = ["saturn"];break;
        case "uranus":fAxis_pName = ["uranus"];break;
        case "neptune":fAxis_pName = ["neptune"];break;
    }
    for(var i in fAxis_pName) {
        var pid = fAxis_pName[i];
        var obj = ORBIT.planet[pid] || ORBIT.satellite[pid];
        if (obj != null && obj != undefined) {
            var cid = obj.centerid;
            if (obj.isInitIAxis) {
                if (pid == "moon") {
                    obj.axis_fixed.applyMatrix(ORBIT.planet[cid].j2000MatrixNI);
                }
                obj.axis_fixed.applyMatrix(obj.j2000MatrixNI);
                obj.axis_fixed.applyMatrix(obj.fixedNI);
                obj.j2000MatrixNI = obj.j2000NINow;
                obj.fixedNI = obj.fixedNINow;
                if(pid == "earth"){
                    obj.GSMNI = obj.GSMNINow;
                }
            }
            obj.axis_fixed.applyMatrix(obj.fixed);
            obj.axis_fixed.applyMatrix(obj.j2000Matrix);
            if (pid == "moon") {
                obj.axis_fixed.applyMatrix(ORBIT.planet[cid].j2000Matrix);
            }
            obj.axis_fixed.updateMatrix();
            var coe = ORBIT.orbitCoe;
            obj.object.position.set(obj.position[0] / coe, obj.position[1] / coe, obj.position[2] / coe);
            if (pid== "moon") {
                var obj_center = ORBIT.scene.getObjectById(cid, true);
                obj.object.position.add(obj_center.position);
            }
            obj.axis_fixed.object.position = obj.object.position;
            obj.isInitIAxis = true;
        }
    }

//    var theta_rota;
//    for(var i in ORBIT.fAxis_pName){
//        var obj = ORBIT.planet[ORBIT.fAxis_pName[i]] || ORBIT.satellite[ORBIT.fAxis_pName[i]];
//        if(obj != null){
////            theta_rota = 2 * Math.PI * ORBIT.count/obj.t_rota;
////            obj.axis_fixed.object.rotation.set(0, theta_rota + obj.rota_init, -obj.tilt, 'ZXY');
//            obj.axis_fixed.object.position = obj.object.position;
//        }
//    }
};
//更新轨道坐标系姿态及位置
var refreshoAxes = function(sid) {
    if(sid == undefined || sid == null) {
        var pid = null;
        if(ORBIT.tracedTargetTpye == 'Planet') {
            pid = ORBIT.tracedObject.id;
        }
        else{
            pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
        }
        var theta_rota;
        for (var i in ORBIT.aAxis_pName) {
            var obj = ORBIT.planet[ORBIT.aAxis_pName[i]] || ORBIT.satellite[ORBIT.aAxis_pName[i]];
            if (obj != null && obj != undefined && obj.isExit && obj.isVisable) {
//                if (pid == "sun" || obj.centerid == pid || pid == "earth" && obj.centerid == "moon" || pid == "moon" && obj.centerid == "earth") {
                    if (obj.axis_orbit != null && obj.axis_orbit != undefined) {
                        ORBIT.scene.remove(obj.axis_orbit.object);
                        delete obj["axis_orbit"];
                    }
                    obj.axis_orbit = new ORBIT.CoorAxes(obj, 'o');
                    if(ORBIT.planetaryCoordinatesVisibility) {
                        ORBIT.scene.add(obj.axis_orbit.object);
                    }
                    else{
                        ORBIT.scene.remove(obj.axis_orbit.object);
                    }
//                }
            }
        }
    }
    else{
        var obj = ORBIT.satellite[sid];
        if (obj != null && obj != undefined && obj.isVisable) {
            if (obj.axis_orbit != null && obj.axis_orbit != undefined) {
                ORBIT.scene.remove(obj.axis_orbit.object);
                delete obj["axis_orbit"];
            }
            obj.axis_orbit = new ORBIT.CoorAxes(obj, 'o');
            if(ORBIT.planetaryCoordinatesVisibility) {
                ORBIT.scene.add(obj.axis_orbit.object);
            }
            else{
                ORBIT.scene.remove(obj.axis_orbit.object);
            }
        }
    }
};
//更新姿态坐标系姿态及位置 Refresh centered fixed coordinate frame's bearing & position
var refreshaAxes = function() {
    var pid = null;
    if(ORBIT.tracedTargetTpye == 'Planet') {
        pid = ORBIT.tracedObject.id;
    }
    else{
        pid = ORBIT.satellite[ORBIT.tracedObject.id].centerid;
    }
    var theta_rota;
    for(var i in ORBIT.aAxis_pName){
        var obj = ORBIT.planet[ORBIT.aAxis_pName[i]] || ORBIT.satellite[ORBIT.aAxis_pName[i]];
        if(obj != null && obj != undefined) {
            if(pid == "sun" || obj.centerid == pid || pid == "earth" && obj.centerid == "moon" || pid == "moon" && obj.centerid == "earth") {
                theta_rota = 2 * Math.PI * ORBIT.count / obj.t_rota;
                //todo rotation need to be revise
                obj.axis_attitude.object.rotation.set(0, theta_rota + obj.rota_init, -obj.tilt, 'ZXY');
                obj.axis_attitude.object.position = obj.object.position;
            }
        }
    }
};

var onSateOrbitChange = function(pid, para, newValue){
    ORBIT.orbitpara[pid][para] = newValue;
    if('a' == para || 'e' == para){
        ORBIT.orbitpara[pid].c = ORBIT.orbitpara[pid].a * ORBIT.orbitpara[pid].e;
        ORBIT.orbitpara[pid].b = Math.sqrt(ORBIT.orbitpara[pid].a * ORBIT.orbitpara[pid].a - ORBIT.orbitpara[pid].c * ORBIT.orbitpara[pid].c);
        ORBIT.orbit[pid].resetShape(ORBIT.orbitpara[pid], 'Satellite');
    }
    else {
        ORBIT.orbit[pid].refreshAttiAndPosition(ORBIT.orbitpara[pid], 'Satellite');
    }
    refreshSatellite();
    refreshCamera();
    ORBIT.renderer.clear();
    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
};
var refreshObject = function() {
    if(ORBIT.planet['sun'].isInitIAxis && ORBIT.states_View == "sunlanetAxes"){// && ORBIT.states_View == "sunlanetAxes"
        getPlanetPosition();
    }
    else{
        getPlanetPositionMatrix();
    }
    //更新行星姿态及位置 Refresh planet's bearing & position
    refreshPlanet();
//    for(var i in ORBIT.planet){
//        console.log(i);
//        console.log(ORBIT.planet[i].j2000Matrix);
//    }
    //更新轨道姿态及位置 Refresh orbit's bearing & position
    refreshOrbit();
    //更新卫星及轨道位置及卫星姿态
    refreshSatellite();
    //更新行星尾巴
    if(ORBIT.states_Simu && ORBIT.states_View == "sunlanetAxes"){
//        refreshTail();
        OrbitTail.refreshTail();
    }
    //刷新行星的显示比例
    refreshPlanetScale();
    //更新磁力线
    refreshTrace();
    //更新太阳风
    refreshSunWind();
    //更新黄道坐标系姿态及位置 Refresh Ecliptic coordinate frame's bearing & position
    refresheAxes();
    //更新惯性坐标系姿态及位置 Refresh inertial coordinate frame's bearing & position
    refreshiAxes();
    //更新固连坐标系姿态及位置 Refresh centered fixed coordinate frame's bearing & position
    refreshfAxes();
    //更新轨道坐标系姿态及位置 Refresh centered fixed coordinate frame's bearing & position
    refreshoAxes();
    //更新姿态坐标系姿态及位置 Refresh centered fixed coordinate frame's bearing & position
//    refreshaAxes();
};
//////////////////////////////////////

var initCamera = function(width, height) {
//    var widthOfScene = panel.body.getWidth();
//    var heightOfScene = panel.body.getHeight();
    //替代方案，给结构设计场景设一个高度和宽度的默认值
    var widthOfScene = width;
    var heightOfScene = height;
    //张角   长宽比   最近距离   最远距离
    ORBIT.camera = new THREE.PerspectiveCamera( 25, widthOfScene/heightOfScene, ORBIT.dist_cam_n, ORBIT.dist_cam_f);
    ORBIT.camera.name = "camera";

//    ORBIT.camera.up.set(0, 0, 1);//设置摄像头的方向，哪个轴为1 摄像机就朝哪个轴的正方向拍；
    ORBIT.trace = true;
    ORBIT.zoom = ORBIT.v_maxzoom / 10;
    ORBIT.camera.up.set(0, 0, 1);//设置摄像头的方向，哪个轴为1 摄像机就朝哪个轴的正方向拍；
    ORBIT.alphaMove_sun = Math.PI / 2 - 0.001;
    ORBIT.tracedObject = ORBIT.planet['sun'].object;
    ORBIT.tracedTarget= ORBIT.planet['sun'];
    ORBIT.tracedTargetTpye = 'Planet';
};
var refreshCamera = function() {
    var posi_basic = new THREE.Vector3(0, 0, 0);
    var theta_rota_traced = 0;//ORBIT.count/ORBIT.tracedTarget.t_rota;
    var radius = 50;
    if(true == ORBIT.trace) {
        if ('Planet' == ORBIT.tracedTargetTpye) {
            ORBIT.tracedObject.geometry.computeBoundingSphere();
            radius = ORBIT.tracedObject.geometry.boundingSphere.radius;
            if(ORBIT.tracedObject.id == "sun"){
                radius *= 100;
            }
        }
        else {
            radius = 20;
        }
    }else {
        ORBIT.tracedObject.geometry.computeBoundingSphere();
        radius = ORBIT.tracedObject.geometry.boundingSphere.radius;
    }
    //todo
//    radius *= ORBIT.planetScale;
    //地球惯性坐标系 Earth inertial coordinate frame
    if(ORBIT.trace){
        if(!ORBIT.freedomAngle){
            if(ORBIT.planet['sun'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_sun) * Math.cos(ORBIT.thetaMove_sun);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_sun) * Math.sin(-ORBIT.thetaMove_sun);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_sun);
            }else if(ORBIT.planet['mercury'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_mercury) * Math.cos(ORBIT.thetaMove_mercury);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_mercury) * Math.sin(-ORBIT.thetaMove_mercury);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_mercury);
            }else if(ORBIT.planet['venus'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_venus) * Math.cos(ORBIT.thetaMove_venus);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_venus) * Math.sin(-ORBIT.thetaMove_venus);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_venus);
            }else if(ORBIT.planet['earth'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_earth) * Math.cos(ORBIT.thetaMove_earth);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_earth) * Math.sin(-ORBIT.thetaMove_earth);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_earth);
            }else if(ORBIT.planet['mars'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_mars) * Math.cos(ORBIT.thetaMove_mars);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_mars) * Math.sin(-ORBIT.thetaMove_mars);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_mars);
            }else if(ORBIT.planet['jupiter'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_jupiter) * Math.cos(ORBIT.thetaMove_jupiter);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_jupiter) * Math.sin(-ORBIT.thetaMove_jupiter);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_jupiter);
            }else if(ORBIT.planet['saturn'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_saturn) * Math.cos(ORBIT.thetaMove_saturn);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_saturn) * Math.sin(-ORBIT.thetaMove_saturn);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_saturn);
            }else if(ORBIT.planet['uranus'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_uranus) * Math.cos(ORBIT.thetaMove_uranus);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_uranus) * Math.sin(-ORBIT.thetaMove_uranus);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_uranus);
            }else if(ORBIT.planet['neptune'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_neptune) * Math.cos(ORBIT.thetaMove_neptune);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_neptune) * Math.sin(-ORBIT.thetaMove_neptune);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_neptune);
            }else if(ORBIT.planet['moon'] == ORBIT.tracedTarget) {
                posi_basic.y = radius * Math.cos(ORBIT.alphaMove_moon) * Math.cos(ORBIT.thetaMove_moon);
                posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_moon) * Math.sin(-ORBIT.thetaMove_moon);
                posi_basic.z = radius * Math.sin(ORBIT.alphaMove_moon);
            }
            else{
                for(var i in ORBIT.satellite){
                    if(ORBIT.satellite[i] == ORBIT.tracedTarget) {
                        posi_basic.y = radius * Math.cos(ORBIT.alphaMove_satellite) * Math.cos(ORBIT.thetaMove_satellite);
                        posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_satellite) * Math.sin(-ORBIT.thetaMove_satellite);
                        posi_basic.z = radius * Math.sin(ORBIT.alphaMove_satellite);
                    }
                }
            }
        }
        else{
            posi_basic.y = radius * Math.cos(ORBIT.alphaMove_freedom) * Math.cos(ORBIT.thetaMove_freedom);
            posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_freedom) * Math.sin(-ORBIT.thetaMove_freedom);
            posi_basic.z = radius * Math.sin(ORBIT.alphaMove_freedom);
        }
    }
    else{
        //todo
//        posi_basic.y = radius * Math.cos(ORBIT.alphaMove_sun) * Math.cos(ORBIT.thetaMove_sun);
//        posi_basic.x = -radius * Math.cos(ORBIT.alphaMove_sun) * Math.sin(-ORBIT.thetaMove_sun);
//        posi_basic.z = radius * Math.sin(ORBIT.alphaMove_sun);
        posi_basic.y = radius * Math.cos(Math.PI/2 + ORBIT.alphaMove_sun) * Math.cos(ORBIT.thetaMove_sun);
        posi_basic.x = -radius * Math.cos(Math.PI/2 + ORBIT.alphaMove_sun) * Math.sin(-ORBIT.thetaMove_sun);
        posi_basic.z = radius * Math.sin(Math.PI/2 + ORBIT.alphaMove_sun);
    }
    if(!ORBIT.freedomAngle){
        ORBIT.camera.position.set(ORBIT.tracedObject.position.x + posi_basic.x * ORBIT.zoom, ORBIT.tracedObject.position.y + posi_basic.y * ORBIT.zoom, ORBIT.tracedObject.position.z + posi_basic.z * ORBIT.zoom);
        ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
    }
    else{
        ORBIT.camera.position.set(ORBIT.cameraCenter.x + posi_basic.x * ORBIT.zoom, ORBIT.cameraCenter.y + posi_basic.y * ORBIT.zoom, ORBIT.cameraCenter.z + posi_basic.z * ORBIT.zoom);
        ORBIT.camera.lookAt({x: ORBIT.cameraCenter.x, y: ORBIT.cameraCenter.y, z: ORBIT.cameraCenter.z});
    }
    //如果不是日心黄道坐标系的视角，则要对摄像机做相应的矩阵变换，使其与相应坐标系一起转
    if('sunlanetAxes' != ORBIT.states_View){
        if(ORBIT.tracedTargetTpye == 'Planet'){
            var pid = ORBIT.tracedObject.id;
            var planet = ORBIT.planet[pid];
            var cid = planet.centerid;
            var cameraUpset = new THREE.Vector3(0, 0, 1);
            if(ORBIT.tracedObject.id == "earth" && ORBIT.states_View == "magnetic"){
                cameraUpset.applyMatrix4(planet.GSM);
                cameraUpset.applyMatrix4(planet.fixed);
            }
            else if(ORBIT.states_View == "fixed"){
                cameraUpset.applyMatrix4(planet.fixed);
            }
            cameraUpset.applyMatrix4(planet.j2000Matrix);
            if(pid == "moon"){
                cameraUpset.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
            }
            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);

            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
            traceObject.position = ORBIT.tracedObject.position;
            camera.position = ORBIT.camera.position;
            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
            if(ORBIT.tracedObject.id == "earth" && ORBIT.states_View == "magnetic"){
                cameraTrace.applyMatrix4(planet.GSM);
                cameraTrace.applyMatrix4(planet.fixed);
            }
            else if(ORBIT.states_View == "fixed"){
                cameraTrace.applyMatrix4(planet.fixed);
            }
            cameraTrace.applyMatrix4(planet.j2000Matrix);
            if(pid == "moon"){
                cameraTrace.applyMatrix4(ORBIT.planet[cid].j2000Matrix);
            }
            if(!ORBIT.freedomAngle){
                ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
                ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
            }
            else{
                ORBIT.camera.position.set(ORBIT.cameraCenter.x + cameraTrace.x, ORBIT.cameraCenter.y + cameraTrace.y, ORBIT.cameraCenter.z + cameraTrace.z);
                ORBIT.camera.lookAt({x: ORBIT.cameraCenter.x, y: ORBIT.cameraCenter.y, z: ORBIT.cameraCenter.z});
            }
        }
        else{//卫星视角
            var sid = ORBIT.tracedObject.id;
            var planet = ORBIT.planet[ORBIT.satellite[sid].centerid];
            var pid = planet.object.id;
            var cameraUpset = new THREE.Vector3(0, 0, 1);
            cameraUpset.applyMatrix4(planet.j2000Matrix);
            if(pid == "moon"){
                cameraUpset.applyMatrix4(ORBIT.planet['earth'].j2000Matrix);
            }
            ORBIT.camera.up.set(cameraUpset.x, cameraUpset.y, cameraUpset.z);

            var traceObject = new THREE.Object3D(), camera = new THREE.Object3D();
            traceObject.position = ORBIT.tracedObject.position;
            camera.position = ORBIT.camera.position;
            var cameraTrace = new THREE.Vector3(camera.position.x - traceObject.position.x, camera.position.y - traceObject.position.y, camera.position.z - traceObject.position.z);
            cameraTrace.applyMatrix4(planet.j2000Matrix);
            if(pid == "moon"){
                cameraTrace.applyMatrix4(ORBIT.planet[pid].j2000Matrix);
            }
            if(!ORBIT.freedomAngle){
                ORBIT.camera.position.set(ORBIT.tracedObject.position.x + cameraTrace.x, ORBIT.tracedObject.position.y + cameraTrace.y, ORBIT.tracedObject.position.z + cameraTrace.z);
                ORBIT.camera.lookAt({x: ORBIT.tracedObject.position.x, y: ORBIT.tracedObject.position.y, z: ORBIT.tracedObject.position.z});
            }
            else{
                ORBIT.camera.position.set(ORBIT.cameraCenter.x + cameraTrace.x, ORBIT.cameraCenter.y + cameraTrace.y, ORBIT.cameraCenter.z + cameraTrace.z);
                ORBIT.camera.lookAt({x: ORBIT.cameraCenter.x, y: ORBIT.cameraCenter.y, z: ORBIT.cameraCenter.z});
            }
        }
    }
    ORBIT.renderer.clear();
    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
};

//屏幕坐标与canvas-frame坐标转换
var corTransform = function(x, y) {
    var x = (( x - ORBIT.canvas.getBoundingClientRect().left)/ ORBIT.canvas.clientWidth ) * 2 - 1;
    var y = -(( y - ORBIT.canvas.getBoundingClientRect().top)/ ORBIT.canvas.clientHeight ) * 2 + 1;
    return new THREE.Vector2(x, y);
};


//编写鼠标滚轮事件。
var onMouseWheel = function(ev) {
    var delta = 0;
    //ev = ev || ORBIT.renderer.domElement.event;
    if(-1 != navigator.userAgent.indexOf('Firefox')){
//        delta = -(ev.detail || 0) / 3;
        delta = -ev.detail / 15
    }
//    else if(-1 != navigator.userAgent.indexOf('Safari'))
//        delta = ev.wheelDelta / 360;
//    else
//        delta = ev.wheelDelta / 120;
    else{
        delta = ev.wheelDelta / 360;
    }
    var v_minzoom = ORBIT.v_minzoom;
    if(ORBIT.tracedObject.id == "moon"){
        v_minzoom *= 2;
    }
    if(ORBIT.zoom - delta * ORBIT.zoom <= ORBIT.v_maxzoom && ORBIT.zoom - delta * ORBIT.zoom > v_minzoom){
        ORBIT.zoom -= delta * ORBIT.zoom;
    }
    else{
        if(ORBIT.zoom - delta * ORBIT.zoom > ORBIT.v_maxzoom){
            ORBIT.zoom = ORBIT.v_maxzoom;
        }
    }
    //禁止默认鼠标事件
    if(-1 != navigator.userAgent.indexOf('Firefox')) {
        // Firefox
        ev.preventDefault();
        ev.stopPropagation();
    } else {
        // IE
        ev.cancelBubble=true;
        ev.returnValue = false;
    }
    refreshCamera();
    if (Math.sqrt(ORBIT.camera.position.x * ORBIT.camera.position.x +
        ORBIT.camera.position.y * ORBIT.camera.position.y + ORBIT.camera.position.z * ORBIT.camera.position.z) > 1000000
            && ORBIT.states_View == "sunlanetAxes")
            ORBIT.sunDiv.style.display = "block";
    else
        ORBIT.sunDiv.style.display = "none";
    var length = 139171964 - Math.sqrt(ORBIT.camera.position.x * ORBIT.camera.position.x +
        ORBIT.camera.position.y * ORBIT.camera.position.y + ORBIT.camera.position.z * ORBIT.camera.position.z);
    length /= (139171964 - 115097);
    if (length > 0 && length < 1) {
        ORBIT.textX = 60 + 120 * length;
        ORBIT.textY = 12 + 48 * length;
//        ORBIT.textZ = 10 + 40 * length;
//        ORBIT.textZ = 20 * length;

    }
    if(ORBIT.zoom < 4 * ORBIT.v_minzoom){
        HoverText.hideHoverTextById(ORBIT.tracedObject.id);
    }
    else{
        if(ORBIT.planetaryTrackVisibility){
            HoverText.showHoverTextById(ORBIT.tracedObject.id);
        }
    }
    HoverText.refreshBigSun();
    HoverText.refreshHovertextForPlanet();
    ORBIT.Satellite.refreshAllHoverDiv();
    if (Math.sqrt(ORBIT.camera.position.x * ORBIT.camera.position.x +
        ORBIT.camera.position.y * ORBIT.camera.position.y + ORBIT.camera.position.z * ORBIT.camera.position.z) > 100000000){
        ORBIT.sunText.style.display = "none";
        ORBIT.sunCircle.style.display = "none";
        ORBIT.mercuryText.style.display = "none";
        ORBIT.mercuryCircle.style.display = "none";
        ORBIT.venusText.style.display = "none";
        ORBIT.venusCircle.style.display = "none";
        ORBIT.earthText.style.display = "none";
        ORBIT.earthCircle.style.display = "none";
        ORBIT.marsText.style.display = "none";
        ORBIT.marsCircle.style.display = "none";
    }else{
        ORBIT.sunText.style.display = "block";
        ORBIT.sunCircle.style.display = "block";
        ORBIT.mercuryText.style.display = "block";
        ORBIT.mercuryCircle.style.display = "block";
        ORBIT.venusText.style.display = "block";
        ORBIT.venusCircle.style.display = "block";
        ORBIT.earthText.style.display = "block";
        ORBIT.earthCircle.style.display = "block";
        ORBIT.marsText.style.display = "block";
        ORBIT.marsCircle.style.display = "block";
    }

    if (Math.sqrt(ORBIT.camera.position.x * ORBIT.camera.position.x +
        ORBIT.camera.position.y * ORBIT.camera.position.y + ORBIT.camera.position.z * ORBIT.camera.position.z) > 600000000){
        ORBIT.jupiterText.style.display = "none";
        ORBIT.jupiterCircle.style.display = "none";
        ORBIT.saturnText.style.display = "none";
        ORBIT.saturnCircle.style.display = "none";
        ORBIT.uranusText.style.display = "none";
        ORBIT.uranusCircle.style.display = "none";
        ORBIT.neptuneText.style.display = "none";
        ORBIT.neptuneCircle.style.display = "none";
        ORBIT.moonText.style.display = "none";
        ORBIT.moonCircle.style.display = "none";
    }else{
        ORBIT.jupiterText.style.display = "block";
        ORBIT.jupiterCircle.style.display = "block";
        ORBIT.saturnText.style.display = "block";
        ORBIT.saturnCircle.style.display = "block";
        ORBIT.uranusText.style.display = "block";
        ORBIT.uranusCircle.style.display = "block";
        ORBIT.neptuneText.style.display = "block";
        ORBIT.neptuneCircle.style.display = "block";
        ORBIT.moonText.style.display = "block";
        ORBIT.moonCircle.style.display = "block";
    }
    return false;
};

var initMouseWheel = function() {
    var mousewheel = -1 == navigator.userAgent.indexOf('Firefox') ? 'mousewheel' : 'DOMMouseScroll';
    ORBIT.renderer.domElement.addEventListener(mousewheel, onMouseWheel, false);
};

var onMouseDown = function(ev) {
    ORBIT.downMove = false;
    if(1 == ev.which){
        ORBIT.down = true;
        var v2_corTrans = corTransform(ev.clientX, ev.clientY);
        ORBIT.lastMouseposi.set(v2_corTrans.x, v2_corTrans.y);
        if(ORBIT.selectOrbitId != null) {
            ORBIT.startMouseposi.set(v2_corTrans.x, v2_corTrans.y);
            if(ORBIT.freedomAngle){
                Matrix.changeVector2ToTrace(ORBIT.startMouseposi);
            }
            var pPosition, orbit = ORBIT.orbit[ORBIT.selectOrbitId], orbitPara, centerid;
            if(ORBIT.selectOrbitSection == -1){
                orbitPara = ORBIT.orbitpara[ORBIT.selectOrbitId];
            }
            else if(ORBIT.selectOrbitSection >= 0){
                orbitPara = orbit.orbitSection[ORBIT.selectOrbitSection].orbitPara;
            }
            ORBIT.startIncline = orbitPara.i;
            centerid = orbit.getCenterIdByAngle();
            pPosition = orbit.getCenterPositionByAngle();
            var startVector3 = new THREE.Vector3(ORBIT.camera.position.x - pPosition.x, ORBIT.camera.position.y - pPosition.y, ORBIT.camera.position.z - pPosition.z);
            if(ORBIT.freedomAngle){
                startVector3.set(ORBIT.camera.position.x - ORBIT.cameraCenter.x, ORBIT.camera.position.y - ORBIT.cameraCenter.y, ORBIT.camera.position.z - ORBIT.cameraCenter.z);
            }
            var endVecor3 = ORBIT.satellite[ORBIT.selectOrbitId].axis_orbitZ;
            ORBIT.startAngle = Matrix.angleVector3(startVector3, endVecor3);

            var startOmPosition = getPlanetTransMatrix4(0, orbitPara, 'Satellite', centerid, "Om")[0];//记录鼠标按下时升交点赤经特征点的位置
            endVecor3 = new THREE.Vector3(startOmPosition.x, startOmPosition.y, startOmPosition.z);
            ORBIT.startOmAngle = Matrix.angleVector3(startVector3, endVecor3);
        }
    }
    //右键按下
//    else if(3 == ev.which){
//        if(ORBIT.freedomAngle){
//            ORBIT.rightDown = true;
//            var v2_corTrans = corTransform(ev.clientX, ev.clientY);
//            ORBIT.lastMouseRightposi.set(v2_corTrans.x, v2_corTrans.y);
//        }
//    }
};


var onMouseMove = function(ev) {
    var v2_corTrans = corTransform(ev.clientX, ev.clientY);
//    console.log(ORBIT.canvas.getBoundingClientRect().top + ',' + ORBIT.canvas.getBoundingClientRect().left + ',' + ORBIT.canvas.getBoundingClientRect().bottom + ',' + ORBIT.canvas.getBoundingClientRect().right);
//    console.log(ev.clientX + ',' + ev.clientY);
    if(ORBIT.down){
        ORBIT.downMove = true;
        var deltaX = v2_corTrans.x - ORBIT.lastMouseposi.x;
        var deltaY = v2_corTrans.y - ORBIT.lastMouseposi.y;
        var directionVector1 = new THREE.Vector2(ORBIT.lastMouseposi.x, ORBIT.lastMouseposi.y);
        var directionVector2 = new THREE.Vector2(v2_corTrans.x, v2_corTrans.y);
        //当未选中特征点时，拖动鼠标
        if((ORBIT.selectOrbitId == null && ORBIT.selectOrbitName == null) || !ORBIT.satellite[ORBIT.selectOrbitId].isSelected) {
            if(!ORBIT.selectOrbitSectionAxis){
                if (ORBIT.trace) {
                    if(!ORBIT.freedomAngle){
                        if (ORBIT.planet['sun'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_sun += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_sun = ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_sun : ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['mercury'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_mercury += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_mercury = ORBIT.alphaMove_mercury - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_mercury - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_mercury : ORBIT.alphaMove_mercury - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['venus'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_venus += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_venus = ORBIT.alphaMove_venus - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_venus - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_venus : ORBIT.alphaMove_venus - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['earth'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_earth += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_earth = ORBIT.alphaMove_earth - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_earth - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_earth : ORBIT.alphaMove_earth - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['mars'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_mars += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_mars = ORBIT.alphaMove_mars - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_mars - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_mars : ORBIT.alphaMove_mars - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['jupiter'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_jupiter += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_jupiter = ORBIT.alphaMove_jupiter - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_jupiter - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_jupiter : ORBIT.alphaMove_jupiter - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['saturn'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_saturn += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_saturn = ORBIT.alphaMove_saturn - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_saturn - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_saturn : ORBIT.alphaMove_saturn - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['uranus'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_uranus += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_uranus = ORBIT.alphaMove_uranus - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_uranus - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_uranus : ORBIT.alphaMove_uranus - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['neptune'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_neptune += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_neptune = ORBIT.alphaMove_neptune - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_neptune - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_neptune : ORBIT.alphaMove_neptune - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.planet['moon'] == ORBIT.tracedTarget) {
                            ORBIT.thetaMove_moon += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_moon = ORBIT.alphaMove_moon - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_moon - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_moon : ORBIT.alphaMove_moon - (directionVector2.y - directionVector1.y);
                        } else if (ORBIT.tracedTargetTpye == 'Sate') {
                            ORBIT.thetaMove_satellite += (directionVector2.x - directionVector1.x);
                            ORBIT.alphaMove_satellite = ORBIT.alphaMove_satellite - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_satellite - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_satellite : ORBIT.alphaMove_satellite - (directionVector2.y - directionVector1.y);
                        }
                    }
                    else{
                        ORBIT.thetaMove_freedom += (directionVector2.x - directionVector1.x);
                        ORBIT.alphaMove_freedom = ORBIT.alphaMove_freedom - (directionVector2.y - directionVector1.y) > Math.PI / 2 || ORBIT.alphaMove_freedom - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_freedom : ORBIT.alphaMove_freedom - (directionVector2.y - directionVector1.y);
                    }

                }        //TODO OOD revise
                else {
                    ORBIT.thetaMove_sun += (directionVector2.x - directionVector1.x);
                    ORBIT.alphaMove_sun = Math.PI / 2 + ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y) > Math.PI / 2 || Math.PI / 2 + ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y) < -Math.PI / 2 ? ORBIT.alphaMove_sun : ORBIT.alphaMove_sun - (directionVector2.y - directionVector1.y);
                }
                refreshCamera();
            }
            //选中了轨道段的特征点（修改起止时间）
            else{
                var startVector2 = new THREE.Vector2(directionVector1.x, directionVector1.y);
                var endVector2 = new THREE.Vector2(directionVector2.x, directionVector2.y);
                var angle = Matrix.angleVector2ThetaAom(startVector2, endVector2);
                var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                var len = orbit.orbitSection.length;
                //最后一段的开始时间
                var startTime = new Date(orbit.orbitSection[len - 2].startTime.toString());
                //最后一段的起始星体
                var startPlanet = orbit.getPreCenter(len - 1);
                //最后一段的目标星体
                var endPlanet = orbit.getLastCenter();
                switch(ORBIT.selectOrbitSectionAxis){
                    case "sTime":
                        //计算鼠标拖动后的时间
                        var afterSTime = calculateEndTime(startTime, -angle * res[startPlanet] * 24 * 3600 / (2 * Math.PI));
                        //获取倒数第二段的结束时间
                        var lastEndTime = orbit.getLastETime();
                        if(afterSTime.getTime() < lastEndTime.getTime()){
                            return;
                        }
                        else{
                            orbit.deleteSection();
                            orbit.addOrbitTransfer(afterSTime, startPlanet, endPlanet);
                            if(orbit.orbitSection.length >= 4){
                                orbit.orbitSection[orbit.orbitSection.length - 3].endTime =
                                    new Date(afterSTime.toString());
                            }
                            orbit.showAllSection();
                            //刷新轨道段特征轴
                            ORBIT.Orbit.refreshOrbitSectionAxis();
                            refreshCamera();
                            Ext.getCmp('orbitSectionWindow').refreshOrbitSection();
                        }
//                    if(ORBIT.valueW != null){
//                        ORBIT.valueW.innerHTML = (orbitPara.om * 180/Math.PI).toFixed(2);
//                    }
                        break;
                    case "eTime":
                        //最后一段的结束时间
                        var endTime = new Date(orbit.orbitSection[len - 2].endTime.toString());
                        //计算鼠标拖动后的时间
                        var afterETime = calculateEndTime(endTime, -angle * res[endPlanet] * 24 * 3600 / (2 * Math.PI));
                        if(!orbit.isTransfer(startTime, startPlanet, endPlanet, afterETime)){
                            return;
                        }
                        else{
                            orbit.deleteSection();
                            orbit.addOrbitTransfer(startTime, startPlanet, endPlanet, afterETime);
                            orbit.showAllSection();
                            //刷新轨道段特征轴
                            ORBIT.Orbit.refreshOrbitSectionAxis();
                            refreshCamera();
                            Ext.getCmp('orbitSectionWindow').refreshOrbitSection();
                        }
//                    if(ORBIT.valueW != null){
//                        ORBIT.valueW.innerHTML = (orbitPara.om * 180/Math.PI).toFixed(2);
//                    }
                        break;
                }
            }

        }
        //当选中特征点时，拖动鼠标
        else{
            if(ORBIT.selectOrbitName == "sTime" || ORBIT.selectOrbitName == "eTime"){
                var orbit = ORBIT.orbit[ORBIT.selectOrbitId];
                //获取轨道窗口
                var orbitSectionWindow = Ext.getCmp('orbitSectionWindow');
//                if(orbitSectionWindow != undefined && ORBIT.selectOrbitSectionId != null){
//                    if(!orbit.isSectionValid()){//如果该轨道不合法则不能对其进行拖拽
//                        return;
//                    }
//                }
                var id = ORBIT.selectOrbitSection;
                var startVector2 = new THREE.Vector2(directionVector1.x, directionVector1.y);
                var endVector2 = new THREE.Vector2(directionVector2.x, directionVector2.y);
                var angle = Matrix.angleVector2ThetaAom(startVector2, endVector2);
                var len = orbit.orbitSection.length;
                //修改段的开始时间
                var startTime = new Date(orbit.getStartTime(id).toString());
                //修改段的起始星体
                var startPlanet = orbit.getStartCenter(id);
                //修改段的目标星体
                var endPlanet = orbit.getEndCenter(id);
                switch(ORBIT.selectOrbitName){
                    case "sTime":
                        //计算鼠标拖动后的时间
                        var afterSTime = calculateEndTime(startTime, angle * res[startPlanet] * 24 * 3600 / (2 * Math.PI));
                        //获取前一段的开始时间
                        var lastStartTime = orbit.getStartTime(id - 1);
                        if(afterSTime.getTime() < lastStartTime.getTime()){
                            return;
                        }
                        if(id < len - 1){
                            //获取下一段的结束时间
                            var nextEndTime = orbit.getEndTime(id + 1);
                            var afterETime = ORBIT.Orbit.calculateEndTime(afterSTime, startPlanet, endPlanet);
                            if(afterETime.getTime() > nextEndTime.getTime()){
                                return;
                            }
                        }
                        orbit.updateSection(id, afterSTime, startPlanet, endPlanet);
                        if(!orbit.getIsTransfer(id - 1)){
                            orbit.updateEndTime(id - 1, afterSTime);
                        }
                        if(id < len - 1){
                            if(!orbit.getIsTransfer(id + 1)){
                                orbit.updateStartTime(id + 1, orbit.getEndTime(id));
                            }
                        }
                        orbit.showAllSection();
                        refreshCamera();
                        if(orbitSectionWindow != undefined && ORBIT.selectOrbitSectionId != null){
                            orbitSectionWindow.refreshOrbitSection();
                        }
                        break;
                    case "eTime":
                        //修改段的结束时间
                        var endTime = new Date(orbit.getEndTime(id).toString());
                        //计算鼠标拖动后的时间
                        var afterETime = calculateEndTime(endTime, angle * res[endPlanet] * 24 * 3600 / (2 * Math.PI));
                        //获取后一段的结束时间
                        if(id < len - 1){
                            var nextEndTime = orbit.getEndTime(id + 1);
                            if(afterETime.getTime() > nextEndTime.getTime()){
                                return;
                            }
                        }
                        if(!orbit.isTransfer(id, startTime, startPlanet, endPlanet, afterETime)){
                            return;
                        }
                        orbit.updateSection(id, startTime, startPlanet, endPlanet, afterETime);
                        if(id < len - 1){
                            if(!orbit.getIsTransfer(id + 1)){
                                orbit.updateStartTime(id + 1, afterETime);
                            }
                        }
                        orbit.showAllSection();
                        refreshCamera();
                        if(orbitSectionWindow != undefined && ORBIT.selectOrbitSectionId != null){
                            orbitSectionWindow.refreshOrbitSection();
                        }
                        break;
                }
            }
            else{
                //标致正在通过鼠标拖拽修改卫星轨道参数
                ORBIT.dragSat = true;
                var centerid, orbit, orbitPara;
                if(ORBIT.selectOrbitSection == -1){
                    centerid = ORBIT.orbit[ORBIT.selectOrbitId].centerid;
                    orbit = ORBIT.orbit[ORBIT.selectOrbitId];
                    orbitPara = ORBIT.orbitpara[ORBIT.selectOrbitId];
                }
                else if(ORBIT.selectOrbitSection >= 0){
                    centerid = ORBIT.orbit[ORBIT.selectOrbitId].orbitSection[ORBIT.selectOrbitSection].centerid;
                    orbit = ORBIT.orbit[ORBIT.selectOrbitId].orbitSection[ORBIT.selectOrbitSection];
                    orbitPara = ORBIT.orbit[ORBIT.selectOrbitId].orbitSection[ORBIT.selectOrbitSection].orbitPara;
                }
                var flag = false;
                var startVector2 = new THREE.Vector2(directionVector1.x, directionVector1.y);
                var endVector2 = new THREE.Vector2(directionVector2.x, directionVector2.y);
                switch(ORBIT.selectOrbitName){
                    case "middle"://拖动鼠标改变轨道倾角
                        var angle = Matrix.angleVector2Incline(startVector2, endVector2);
                        orbitPara.i += angle;
                        if(orbitPara.i > ORBIT.max["i"] * Math.PI / 180){
                            orbitPara.i -= ORBIT.max["i"] * Math.PI / 180;
                        }
                        else if(orbitPara.i < ORBIT.min["i"] * Math.PI / 180){
                            orbitPara.i += ORBIT.max["i"] * Math.PI / 180;
                        }
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueI != null){
                            ORBIT.valueI.innerHTML = (orbitPara.i * 180/Math.PI).toFixed(2);
                        }
                        break;
                    case "sat"://拖动鼠标改变真近心点
                        var angle = Matrix.angleVector2ThetaAom(startVector2, endVector2);
                        orbitPara.theta += angle;
                        if(orbitPara.theta > ORBIT.max["theta"] * Math.PI / 180){
                            orbitPara.theta -= ORBIT.max["theta"] * Math.PI / 180;
                        }
                        else if(orbitPara.theta < ORBIT.min["theta"] * Math.PI / 180){
                            orbitPara.theta += ORBIT.max["theta"] * Math.PI / 180;
                        }
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueT != null){
                            ORBIT.valueT.innerHTML = (orbitPara.theta * 180/Math.PI).toFixed(2);
                        }
                        break;
                    case "om"://拖动鼠标改近心点幅角
                        var angle = Matrix.angleVector2ThetaAom(startVector2, endVector2);
                        orbitPara.om += angle;
                        if(orbitPara.om > ORBIT.max["om"] * Math.PI / 180){
                            orbitPara.om -= ORBIT.max["om"] * Math.PI / 180;
                        }
                        else if(orbitPara.om < ORBIT.min["om"] * Math.PI / 180){
                            orbitPara.om += ORBIT.max["om"] * Math.PI / 180;
                        }
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueW != null){
                            ORBIT.valueW.innerHTML = (orbitPara.om * 180/Math.PI).toFixed(2);
                        }
                        break;
                    case "Om"://拖动鼠标改升交点赤经
                        var angle = Matrix.angleVector2Om(startVector2, endVector2);
                        orbitPara.Om += angle;
                        if(orbitPara.Om > ORBIT.max["Om"] * Math.PI / 180){
                            orbitPara.Om -= ORBIT.max["Om"] * Math.PI / 180;
                        }
                        else if(orbitPara.Om < ORBIT.min["Om"] * Math.PI / 180){
                            orbitPara.Om += ORBIT.max["Om"] * Math.PI / 180;
                        }
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueO != null){
                            ORBIT.valueO.innerHTML = (orbitPara.Om * 180/Math.PI).toFixed(2);
                        }
                        break;
                    case "near"://拖动鼠标改变近地点
//                    var centerPosition = ORBIT.orbit[ORBIT.selectOrbitId].getCenterPosition();
                        var centerPosition = ORBIT.orbit[ORBIT.selectOrbitId].getCenterPositionByAngle();
                        var distance = Matrix.distanceVector2(startVector2, endVector2, centerPosition);
                        var c = orbitPara.a * orbitPara.e;
                        if(c - distance/2 <= 0){
                            ORBIT.selectOrbitName = "far";
                            for(var i in orbit.object.children){
                                if(orbit.object.children[i].name == "near"){
                                    orbit.object.children[i].name = "far";
                                    continue;
                                }
                                if(orbit.object.children[i].name == "far"){
                                    orbit.object.children[i].name = "near";
                                    continue;
                                }
                            }
                            if(orbitPara.om > Math.PI){
                                orbitPara.om -= Math.PI;
                            }
                            else{
                                orbitPara.om += Math.PI;
                            }
                            return ;
                        }
                        orbitPara.a += distance/2;
                        if(orbitPara.a > ORBIT.max['a']){
                            orbitPara.a = ORBIT.max['a'];
                        }
                        else if(orbitPara.a < ORBIT.min['a']){
                            orbitPara.a = ORBIT.min['a'];
                        }
                        orbitPara.e = (c - distance/2)/orbitPara.a;
                        if(orbitPara.e > ORBIT.max['e']){
                            orbitPara.e = ORBIT.max['e'];
                        }
                        else if(orbitPara.e < ORBIT.min['e']){
                            orbitPara.e = ORBIT.min['e'];
                        }
                        orbitPara.T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(orbitPara.a, 3) / ORBIT.GravitationalConstant[centerid]);
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueA != null){
                            ORBIT.valueA.innerHTML = (orbitPara.a).toFixed(2);
                            ORBIT.valueE.innerHTML = (orbitPara.e).toFixed(2);
                            ORBIT.valueW.innerHTML = (orbitPara.om * 180 / Math.PI).toFixed(2);
                        }
                        break;
                    case "far"://拖动鼠标改变远地点
//                    var centerPosition = ORBIT.orbit[ORBIT.selectOrbitId].getCenterPosition();
                        var centerPosition = ORBIT.orbit[ORBIT.selectOrbitId].getCenterPositionByAngle();
                        var distance = Matrix.distanceVector2(startVector2, endVector2, centerPosition);
                        distance = -distance;
                        var c = orbitPara.a * orbitPara.e;
                        if(c - distance/2 <= 0){
                            ORBIT.selectOrbitName = "near";
                            for(var i in orbit.object.children){
                                if(orbit.object.children[i].name == "near"){
                                    orbit.object.children[i].name = "far";
                                    continue;
                                }
                                if(orbit.object.children[i].name == "far"){
                                    orbit.object.children[i].name = "near";
                                    continue;
                                }
                            }
                            if(orbitPara.om > Math.PI){
                                orbitPara.om -= Math.PI;
                            }
                            else{
                                orbitPara.om += Math.PI;
                            }
                            return ;
                        }
                        orbitPara.a -= distance/2;
                        if(orbitPara.a > ORBIT.max['a']){
                            orbitPara.a = ORBIT.max['a'];
                        }
                        else if(orbitPara.a < ORBIT.min['a']){
                            orbitPara.a = ORBIT.min['a'];
                        }
                        orbitPara.e = (c - distance/2)/orbitPara.a;
                        if(orbitPara.e > ORBIT.max['e']){
                            orbitPara.e = ORBIT.max['e'];
                        }
                        else if(orbitPara.e < ORBIT.min['e']){
                            orbitPara.e = ORBIT.min['e'];
                        }
                        orbitPara.T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(orbitPara.a, 3) / ORBIT.GravitationalConstant[centerid]);
                        if(ORBIT.satelliteName == ORBIT.selectOrbitId){
                            Ext.getCmp('satelliteParaWindow').refreshSatParaField();
                        }
                        if(ORBIT.valueA != null){
                            ORBIT.valueA.innerHTML = (orbitPara.a).toFixed(2);
                            ORBIT.valueE.innerHTML = (orbitPara.e).toFixed(2);
                            ORBIT.valueW.innerHTML = (orbitPara.om * 180 / Math.PI).toFixed(2);
                        }
                        break;
                }
                ORBIT.scene.remove(orbit.object);
                orbit.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitId, flag);
                ORBIT.scene.add(orbit.object);
                if(ORBIT.selectOrbitSectionId != null){
                    //获取轨道窗口
                    var sectionWindow = Ext.getCmp('orbitSectionWindow');
                    //刷新轨道段设计窗口中的卫星参数
                    if(sectionWindow != undefined){
                        ORBIT.isSectionWindowSatPara = false;
                        sectionWindow.refreshSectionPara();
                        ORBIT.isSectionWindowSatPara = true;
                    }
                }
                ORBIT.satellite[ORBIT.selectOrbitId].isExit = true;
                refreshObject();
                refreshCamera();
            }
        }
        ORBIT.lastMouseposi.set(v2_corTrans.x, v2_corTrans.y);
    }
    //右键按下拖拽
//    else if(ORBIT.rightDown){
//        onRightMouseDrag(ev);
//    }
    else {
        if(ORBIT.selectOrbitSectionId){
            //先重置轨道段特征点的颜色
            for(var j in ORBIT.characterAxis){
                ORBIT.characterAxis[j].setColor("#ff7e00");
                refreshCamera();
                ORBIT.selectOrbitSectionAxis = null;
            }
            var intersects = rayIntersects(v2_corTrans.x, v2_corTrans.y);
            if (intersects.length) {
                for(var i = 0; i < intersects.length; i++){
                    //识取轨道段特征点(用于修改起止时间)
                    for(var j in ORBIT.characterAxis){
                        if(intersects[i].object == ORBIT.characterAxis[j].object){
                            ORBIT.characterAxis[j].setColor("#ffff00");
                            ORBIT.selectOrbitSectionAxis = j;
                            refreshCamera();
                            return 0;
                        }
                    }
                }
            }
        }
        if(ORBIT.isSelectSat){
            //当鼠标没按下时拖动，若扫描到特征点的轴，则将其变成黄色
            if(ORBIT.singleAxis != null && ORBIT.singleAxis != undefined){
                ORBIT.singleAxis.resetAxisColor();
            }
            var intersects = rayIntersects(v2_corTrans.x, v2_corTrans.y);
            if (intersects.length) {
                for(var i = 0; i < intersects.length; i++){
                    //识取轨道特征点
                    for(var j in ORBIT.orbit){
                        var orbit = ORBIT.orbit[j];
                        for(var k in orbit.object.children){
                            if(intersects[i].object == orbit.object.children[k]){
                                ORBIT.selectOrbitId = j;
                                ORBIT.selectOrbitName = orbit.object.children[k].name;
                                ORBIT.selectOrbitSection = -1;
                                orbit.object.children[k].material.needsUpdate = true;
                                orbit.object.children[k].children[0].material.color.setStyle("#ffff00");
                                refreshCamera();
                                return 0;
                            }
                        }
                        for(var l = 0; l < orbit.orbitSection.length; l++){
                            for(var k in orbit.orbitSection[l].object.children){
                                if(intersects[i].object == orbit.orbitSection[l].object.children[k]){
                                    ORBIT.selectOrbitId = j;
                                    ORBIT.selectOrbitName = orbit.orbitSection[l].object.children[k].name;
                                    ORBIT.selectOrbitSection = l;
                                    orbit.orbitSection[l].object.children[k].material.needsUpdate = true;
                                    orbit.orbitSection[l].object.children[k].children[0].material.color.setStyle("#ffff00");
                                    refreshCamera();
                                    return 0;
                                }
                            }
                        }
                    }

                    //识取卫星
                    for(var j in ORBIT.satellite){
                        //检测是否识取到卫星本身
                        if(ORBIT.satellite[j].object != null && ORBIT.selectOrbit != null && ORBIT.selectOrbit == j){
                            if(intersects[i].object == ORBIT.satellite[j].object){
                                var id = ORBIT.orbit[j].detectCurrentSection();
                                if(ORBIT.orbit[j].getIsTransfer(id)){
                                    ORBIT.selectOrbitId = null;
                                    ORBIT.selectOrbitName = null;
                                    ORBIT.selectOrbitSection = null;
                                    refreshCamera();
                                    return 0;
                                }
                                ORBIT.selectOrbitId = j;
                                ORBIT.selectOrbitName = "sat";
                                ORBIT.selectOrbitSection = id;
                                refreshCamera();
                                return 0;
                            }
                        }
                    }
                }
            }
        }
    }
    HoverText.refreshHovertextForPlanet();
    ORBIT.Satellite.refreshAllHoverDiv();
    HoverText.refreshBigSun();
};

var onMouseUp = function(ev) {
    ORBIT.rightDown = false;
    if(ORBIT.down && 1 == ev.which){
        ORBIT.down = false;
        if(!ORBIT.downMove){
            //发射线拾取卫星
            if(1 == ev.which) {
                var v2_corTrans = corTransform(ev.clientX, ev.clientY);
                var intersects = rayIntersects(v2_corTrans.x, v2_corTrans.y);
                var sid = detectSat(intersects);
                if(sid){
                    selectSat(sid);
                }
                else{
                    //取消选中卫星（包括其轨道颜色，隐藏其特征点以及右下角显示卫星参数）
                    cancleSelectSat();
                }
            }
        }
        else{
            if(ORBIT.dragSat){
                ORBIT.dragSat = false;
                ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbitId);
            }
        }
    }
    //右键弹起
//    else if(ORBIT.rightDown && 3 == ev.which){
//        ORBIT.rightDown = false;
//    }
};
//右键拖拽场景响应事件
var onRightMouseDrag = function(ev){
    var v2_corTrans = corTransform(ev.clientX, ev.clientY);
    var startMatrix, endMatrix = new Array(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    //理论求值
    var startVector2 = new THREE.Vector3(ORBIT.camera.position.x - ORBIT.cameraCenter.x, ORBIT.camera.position.y - ORBIT.cameraCenter.y, ORBIT.camera.position.z - ORBIT.cameraCenter.z);
    startVector2.normalize();
    var endVector1 = new THREE.Vector3(1, 0, 0);
    var endVector2 = new THREE.Vector3(0, 1, 0);
    var endVector3 = new THREE.Vector3(0, 0, 1);
//    endVector2.applyMatrix4(ORBIT.planet['earth'].j2000Matrix);
    //求startVector2到endVector2的转换矩阵
    var changeMatrix = Matrix.vectorRotation(endVector2, startVector2);
    endVector1.applyMatrix4(changeMatrix);
    endVector3.applyMatrix4(changeMatrix);
    startMatrix = new Array(endVector1, startVector2, endVector3);
    var transferMatrix = Matrix.changeAxis(endMatrix, startMatrix);
//    var j2000Matrix = Matrix.vectorRotation(endVector2, new THREE.Vector3(0, 1, 0));
    var p1 = new THREE.Vector2(ORBIT.lastMouseRightposi.x, ORBIT.lastMouseRightposi.y);//鼠标按下时，屏幕坐标的位置
    var p2 = new THREE.Vector2(v2_corTrans.x, v2_corTrans.y);//鼠标拖动过程中，屏幕坐标的位置
    //拖动鼠标的过程中，相机中心点的三维坐标的相对位置
    var radius = ORBIT.planet[ORBIT.tracedObject.id].radius;
    if(ORBIT.tracedObject.id == 'sun'){
        radius *= 100;
    }
    var endPointRelative = new THREE.Vector3((p2.x - p1.x) * ORBIT.zoom * radius / 3, 0, (p1.y - p2.y) * ORBIT.zoom * radius / 5);
//    var endPointRelative = new THREE.Vector3((p2.x - p1.x) * ORBIT.zoom * radius * Math.cos(ORBIT.thetaMove_freedom) / 3 + (p2.y - p1.y) * ORBIT.zoom * radius * Math.sin(ORBIT.thetaMove_freedom) / 3, 0, (p1.y - p2.y) * ORBIT.zoom  * radius * Math.cos(ORBIT.thetaMove_freedom) / 5 + (p1.x - p2.x) * ORBIT.zoom  * radius * Math.sin(ORBIT.thetaMove_freedom) / 5);
    var endPointAbsolute = endPointRelative.applyMatrix4(transferMatrix);
//    endPointAbsolute.applyMatrix4(j2000Matrix);
    var p0 = new THREE.Vector3(ORBIT.cameraCenter.x, ORBIT.cameraCenter.y ,ORBIT.cameraCenter.z);
    ORBIT.cameraCenter.x += endPointAbsolute.x;
    ORBIT.cameraCenter.y += endPointAbsolute.y;
    ORBIT.cameraCenter.z += endPointAbsolute.z;
    ORBIT.lastMouseRightposi.set(p2.x, p2.y);
    refreshCamera();
};
//发射线获取拾取到的所有物体
var rayIntersects = function(x, y){
    var directionVector = new THREE.Vector3();
    var projector = new THREE.Projector();
    var raycaster = new THREE.Raycaster();
    directionVector.set(x, y, -1);
    projector.unprojectVector(directionVector, ORBIT.camera);
    directionVector.sub(ORBIT.camera.position);
    directionVector.normalize();
    raycaster.set(ORBIT.camera.position, directionVector);
    var intersects = raycaster.intersectObjects(ORBIT.scene.children, true);
    return intersects;
};
//检测拾取到了那颗卫星
var detectSat = function(intersects){
    if(intersects != null && intersects!= undefined){
        for(var i = 0; i < intersects.length; i++){
            for(var j in ORBIT.satellite){
                if(ORBIT.satellite[j].object != null && intersects[i].object == ORBIT.satellite[j].object){
                    return j;
                }
            }
        }
    }
    return null;
};
//选中卫星（包括设置其轨道颜色，显示其特征点以及右下角显示卫星参数）
var selectSat = function(sid){
    if(sid == ORBIT.Satellite.getSelectedSatId()){
        return;
    }
    var orbit = ORBIT.orbit[sid];
    ORBIT.isSelectSat = true;
    ORBIT.selectOrbit = sid;
    ORBIT.Orbit.hideAllCharacter();
    ORBIT.Orbit.resetOrbitColor();
    ORBIT.Satellite.unlockSelect();
    if(!ORBIT.satellite[sid].isLocked){
        ORBIT.satellite[sid].select();
        ORBIT.cooperation.sendInfo("LockControl", sid, true);
        orbit.showCharacter();
    }
    //刷新卫星属性窗口中的值
    refreshSatParaWindow(sid);
    //显示轨道颜色
    orbit.setOrbitColor('#ff7e00');
    var orbitPara = orbit.getOrbitPara();
    var pi = 180 / Math.PI;
    var i = orbitPara.i * pi;
    var Om = orbitPara.Om * pi, om = orbitPara.om * pi, theta = orbitPara.theta * pi;
//显示卫星参数面板
    HoverText.initOrRefreshHoverTextDiv((orbitPara.a).toFixed(2),(orbitPara.e).toFixed(2),(i).toFixed(2),(Om).toFixed(2),(om).toFixed(2),(theta).toFixed(2),ORBIT.basePosition);
//    ORBIT.planetaryTrackVisibility = false;
//    removePlanetOrbit();//隐藏行星轨迹
//    HoverText.hideHoverText();//隐藏行星文字
//    ORBIT.sunDiv.style.display = "none";//隐藏太阳图标div

    //如果当前视角不在该卫星或其中心星体的视角下,将视角切换到其中心星体的视角下
//    var cid = ORBIT.orbit[sid].getCenterId();
//    if(ORBIT.tracedObject.id != cid && ORBIT.tracedObject != ORBIT.satellite[sid].object){
//        var a = ORBIT.orbitpara[sid].a;
//        ORBIT.trace = true;
//        ORBIT.zoom = ORBIT.v_minzoom * 2 * (a/10000) * (60/ORBIT.planet[cid].radius);
//        ORBIT.tracedObject = ORBIT.planet[cid].object;
//        ORBIT.tracedTarget = ORBIT.planet[cid];
//        ORBIT.tracedTargetTpye = 'Planet';
//        if(ORBIT.states_View == "magnetic"){
//            ORBIT.firstOutMagnetic = true;
//        }
//        if(cid == "sun"){
//            ORBIT.states_View = "sunlanetAxes"
//        }
//        else {
//            ORBIT.states_View = "inertial";
//        }
//    }
    refreshObject();
    refreshCamera();
};
//取消选中卫星（包括其轨道颜色，隐藏其特征点以及右下角显示卫星参数）
var cancleSelectSat = function(){
    ORBIT.Satellite.unlockSelect();
    ORBIT.isSelectSat = false;
    ORBIT.selectOrbit = null;
    ORBIT.selectOrbitId = null;
    ORBIT.selectOrbitName = null;
    ORBIT.selectOrbitSection = null;
    hideCharacter();
    ORBIT.Orbit.resetOrbitColor();
    HoverText.hideSatellitePara();
    refreshCamera();
};
//初始化卫星参数显示面板的位置
var initSatParaBasePosition  =  function(position, width, height){
    ORBIT.basePosition = position;
    ORBIT.basePosition[0] += width;
    ORBIT.basePosition[1] += height;
};
//刷新卫星属性窗口中的值
var refreshSatParaWindow = function(sid){
    if(Ext.getCmp('satelliteParaWindow') != null && Ext.getCmp('satelliteParaWindow') != undefined && ORBIT.satelliteName != null){
        ORBIT.satelliteName = sid;
        Ext.getCmp('satelliteParaWindow').refreshSatParaField();
        if(ORBIT.satellite[sid].isLocked){
            Ext.getCmp('satelliteParaWindow').disableSatParaField();
        }
        else{
            Ext.getCmp('satelliteParaWindow').enableSatParaField();
        }
    }
};
var decimalRoundedOff =  function(number,scale){
    var tmpNumber = Math.floor(number*1.0/scale);
    var leftNumber = number*1.0/scale - tmpNumber;
    if(leftNumber >= 0.5){
        tmpNumber += 1;
    }
    return tmpNumber*scale;
};
var onMouseOut = function(ev){
    if(ORBIT.down && ORBIT.downMove){
        ORBIT.down = false;
        ORBIT.downMove = false;
        ORBIT.isMouseOutDown = true;
    }
    return false;
};
var initDrag = function() {
    ORBIT.renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    ORBIT.renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    ORBIT.renderer.domElement.addEventListener('mouseup', onMouseUp, false);
//    ORBIT.renderer.domElement.addEventListener('mouseout', onMouseOut, false);
};
//初始化右键拖拽事件
var initRithtMouse = function(){
    ORBIT.orbitControl = new THREE.OrbitControlsByNdh( ORBIT.camera, ORBIT.canvas);
    ORBIT.orbitControl.addEventListener( 'change', function(event){
        ORBIT.cameraCenter = new THREE.Vector3(ORBIT.orbitControl.center.x, ORBIT.orbitControl.center.y,ORBIT.orbitControl.center.z);
        ORBIT.renderer.clear();
        ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
    });
    ORBIT.mouseRightFlag = false;
};
////todo
//var resetPerspect = function() {
//    ORBIT.zoom = ORBIT.v_maxzoom;
//    ORBIT.thetaMove_global = 0;
//    ORBIT.alphaMove_global = 0;
//    ORBIT.trace = false;
//    ORBIT.tracedObject = ORBIT.planet["sun"].object;
//    ORBIT.camera.up.set(0, 0, -1);
//    ORBIT.tracedTarget = ORBIT.planet[ORBIT.tracedObject.name];
//    refreshCamera();
//};

var speedUp = function() {
    if(ORBIT.states_Simu)
        ORBIT.speedscalar *=2;
};

var speedDown = function() {
    if(ORBIT.states_Simu)
        ORBIT.speedscalar /=2;
};

var resetSpeed = function() {
    ORBIT.speedscalar = ORBIT.v_initspeed;
};

//This function initializes XHR
var initXHR = function() {
    //创建异步对象
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        ORBIT.xmlhttp=new XMLHttpRequest();
    }else {// code for IE6, IE5
        ORBIT.xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }
};

var RequestWebService = function() {
    var URL = ORBIT.host_demon + '/RestDllLoader/loadDll/DllLoader/sayHello/Taivas';
    ORBIT.xmlhttp.open('GET', URL, false);
    ORBIT.xmlhttp.onreadystatechange = function() {
        if (ORBIT.xmlhttp.readyState==4 && ORBIT.xmlhttp.status==200){
            alert('"' + ORBIT.xmlhttp.responseText+ '"' + '   ' + ORBIT.xmlhttp.status + '   ' + ORBIT.xmlhttp.statusText);
        }
    }
    ORBIT.xmlhttp.send(null);

    URL = ORBIT.host_demon + "/RestDllLoader/loadDll/DllLoader/getTransMatrix/2014/3/22/16/11/54";
    ORBIT.xmlhttp.open("GET", URL, false);
    ORBIT.xmlhttp.onreadystatechange = function() {
        if (ORBIT.xmlhttp.readyState==4 && ORBIT.xmlhttp.status==200){
            alert('"' + ORBIT.xmlhttp.responseText+ '"' + '   ' + ORBIT.xmlhttp.status + '   ' + ORBIT.xmlhttp.statusText);
        }

    }
    ORBIT.xmlhttp.send(null);
    var json = JSON.parse(ORBIT.xmlhttp.responseText);
};

var setSimuTimeField = function(date){
    var a1 = new Array();
    a1[0] = date.getFullYear().toString();
    a1[1] = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1).toString();
    a1[2] = (date.getDate() < 10 ? '0' : '') + date.getDate().toString();
    var a2 = new Array();
    a2[0] = (date.getHours() < 10 ? '0' : '') + date.getHours().toString();
    a2[1] = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString();
    a2[2] = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds().toString();
    var s1 = a1.join('-');
    var s2 = a2.join(':');
    var s3 = s1 + ' ' +  s2;
    ORBIT.simuTime_Field.setValue(s3);
};
//日期格式化
var formatDate = function(date){
    var a1 = new Array();
    a1[0] = date.getFullYear().toString();
    a1[1] = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1).toString();
    a1[2] = (date.getDate() < 10 ? '0' : '') + date.getDate().toString();
    var a2 = new Array();
    a2[0] = (date.getHours() < 10 ? '0' : '') + date.getHours().toString();
    a2[1] = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString();
    a2[2] = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds().toString();
    var s1 = a1.join('-');
    var s2 = a2.join(':');
    var s3 = s1 + ' ' +  s2;
    return s3;
};
var refreshCount = function() {
    ORBIT.count = (Date.parse(ORBIT.t_simu.toString()) - Date.parse(ORBIT.t_start.toString()))/1000/60/60/24;
};

var resetSpeedScalar = function() {
    ORBIT.speedscalar = 1;
};
var resetZoom = function(){
    ORBIT.zoom = ORBIT.v_maxzoom / 10;
};
//重置尾巴的位置
var resetTail = function(basePosition) {
    for(var i in ORBIT.tail){
        ORBIT.tail[i].initTail(i);
        ORBIT.tail[i].moveTail();
    }
};
var resetScene = function(basePosition) {
    setSimuTimeField(ORBIT.t_simu);
//    for(var sid in ORBIT.satellite){
//        if(sid == "卫星1"){
//            ORBIT.Orbit.satOrbitTransfer(sid, "venus");
//        }
//    }
    resetTail();
    refreshCount();
    refreshObject();
    refreshCamera();
};


//var initStats = function(){
//    ORBIT.stats = new Stats();
//    ORBIT.stats.domElement.style.position = 'absolute';
//    ORBIT.stats.domElement.style.top = '0px';
//    ORBIT.canvas.parentNode.appendChild( ORBIT.stats.domElement );
//};
//
//var animate = function () {
//    requestAnimationFrame(animate);
//    render();
//    ORBIT.stats.update();
//};
//
//var render = function() {
//    ORBIT.camera.position.y = ORBIT.camera.position.y += 10000000 * 0.05;
//    ORBIT.renderer.render( ORBIT.scene, ORBIT.camera);
//};


var resetSimuTime = function(){
    ORBIT.t_simu.setTime(Date.parse(ORBIT.t_start.toString()));
    ORBIT.t_preSimu.setTime(Date.parse(ORBIT.t_start.toString()));
};
var compareTime = function(start, stop){
    var t_start = julian(start.getMonth() + 1, start.getDate(), start.getFullYear()) + numberSecond(start.getHours(), start.getMinutes(), start.getSeconds());
    var t_stop = julian(stop.getMonth() + 1, stop.getDate(), stop.getFullYear()) + numberSecond(stop.getHours(), stop.getMinutes(), stop.getSeconds());
    if(t_start < t_stop){
        return 1;
    }
    else if(t_stop == t_start){
        return 0;
    }
    else{
        return -1;
    }
};
var startOrbitSimu = function() {
    if(!ORBIT.states_Simu) {
//        removeTail();
        OrbitTail.removeTail();
        ORBIT.renderer.clear();
        ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
        if(compareTime(ORBIT.t_simu, ORBIT.t_stop) <= 0){
//            Ext.MessageBox.show({title: '仿真消息', msg: '仿真结束'});
        }
        return 0;
    }
    var t_simu = new Date();
    if(ORBIT.states_View == "sunlanetAxes" && !ORBIT.fileName){
        t_simu.setTime(Date.parse(ORBIT.t_simu.toString()) + ORBIT.sunStep * 1000 * ORBIT.speedscalar);
    }
    else{
        t_simu.setTime(Date.parse(ORBIT.t_simu.toString()) + ORBIT.step * 1000 * ORBIT.speedscalar);
    }
    if(compareTime(t_simu, ORBIT.t_stop) <= 0){
        ORBIT.t_simu.setTime(Date.parse(ORBIT.t_stop.toString()));
        resetScene();
        ORBIT.states_Simu = false;
        ORBIT.simuPLBtn.setIconCls('start');
        ORBIT.simuPLBtn.setTooltip('开始');
        ORBIT.simuPLBtn.setText('开始');
    }
    else{
        if(ORBIT.states_View == "sunlanetAxes"){
            //addTail();
            OrbitTail.addTail();
        }
        ORBIT.t_preSimu.setTime(Date.parse(ORBIT.t_simu.toString()));
        ORBIT.t_simu.setTime(Date.parse(t_simu.toString()));
        resetScene();
    }
    HoverText.refreshHovertextForPlanet();//更新界面文字
    window.requestAnimationFrame(startOrbitSimu);
};
//重置摄像机的位置
var resetCamera = function(){
    ORBIT.sunDiv.style.display = "none";
    var orbitOperation = Ext.getCmp('orbitOperationToolbar');
    orbitOperation.queryById('planetCombo').setValue("angelSun");

    ORBIT.sunDiv.style.display = "block";
    ORBIT.camera.position.set(0, 139171, 139171894);
    ORBIT.camera.lookAt({x: 0, y: 0, z: 0});
    ORBIT.trace = true;
    ORBIT.zoom = ORBIT.v_maxzoom / 10;
    ORBIT.camera.up.set(0, 0, 1);//设置摄像头的方向，哪个轴为1 摄像机就朝哪个轴的正方向拍；
    ORBIT.alphaMove_sun = Math.PI / 2 - 0.001;
    ORBIT.camera.rotation.z = Math.PI;
    ORBIT.tracedObject = ORBIT.planet['sun'].object;
    ORBIT.tracedTarget= ORBIT.planet['sun'];
    ORBIT.tracedTargetTpye = 'Planet';
    ORBIT.tracedObject.geometry.computeBoundingSphere();
    ORBIT.renderer.clear();
    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
};
//重置场景仿真时间
var resetSimuTimeAndScene = function(){//将修改仿真参数的控件enable
    var simuParawindow = Ext.getCmp('simuParaWindow');
    if(simuParawindow != null && simuParawindow != undefined){
        simuParawindow.queryById('startSimuTime').enable();
        simuParawindow.queryById('stopSimuTime').enable();
        simuParawindow.queryById('stepLength').enable();
    }
    ORBIT.states_Simu = false;
    Ext.getCmp('simuPLBtn').setIconCls('start');
    Ext.getCmp('simuPLBtn').setTooltip('开始');
    Ext.getCmp('simuPLBtn').setText('开始');
    resetSimuTime();
    resetScene();
    resetSpeedScalar();
};
//function threeStart() {
//    // var hashH = document.documentElement.scrollHeight; //获取自身高度
//    // var urlC = host_cloud + "/SolarSystem/proxy.html"; //设置iframeA的src
//    // document.getElementById("if_temp").src=urlC+"#"+hashH; //将高度作为参数传递
//    // initXHR();
//    // RequestWebService();
//    initRender(this.getOrbitscenepanel());
//    initScene();
//    initLight();
//    initObject();
//    initCamera(this.getOrbitscenepanel);
//    refreshCamera();
//    initMouseWheel();
//    initDrag();
//    startOrbitSimu();
