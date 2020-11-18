/**
 * Created by Taivas on 5/6/14.
 */
Ext.define('OrbitDesignApp.controller.OrbitDesign.OrbitController', {
    extend: 'Ext.app.Controller',
    views:[
        'OrbitDesign.SimuParaWindow',
        'OrbitDesign.AngleWindow',
        'OrbitDesign.VisibilityWindow',
        'OrbitDesign.OrbitScenePanel'
    ],
    refs: [
        {
            ref: 'orbitScenePanel',
            selector: 'orbitscenepanel'
        },
        {
            ref: 'orbitOperationToolbar',
            selector: 'orbitoperationtoolbar'
        },
        {
            ref:'propertyWindow',
            selector:'propertywindow'
        },
        {
            ref:'orbitparaWindow',
            selector:'orbitparawindow'
        },
        {
            ref:'angleWindow',
            selector:'anglewindow'
        },
        {
            ref: 'solutionTree',
            selector: 'solutiontree'
        },
        {
            ref:'visibilityWindow',
            selector:'visibilitywindow'
        }
    ],
    simuParawindow: null,    //TODO can be removed
    angleWindow:null,
    init: function(application) {
        this.control({
            //Todo id need to be revise
            'orbitscenepanel': {
                resize: this.resizePanel
            },
            'orbitoperationtoolbar':{
//                move: this.mouseMove,
//                click: this.mouseClick,
//                focus: this.mouseMove
            },
            "#orbRespect": {
                click: this.onOrbRespChg
            },
            'anglewindow button[itemId=btnSureAngle]': {
                click: this.handleSureAngleClick
            },
            '#planetAxesCombo':{
                change:this.planetAxesChange
            },
            '#planetCombo':{
                change:this.planetChange
            },
            '#earthAxesCombo':{
                change:this.earthAxesChange
            },
            '#otherAxesCombo':{
                change:this.otherAxesChange
            },
            "#btnSureAngle":{
                click: this.onSureAngle
            },
            //场景的仿真开始时间改变的响应函数
            "simuparawindow datetimefield[itemId=startSimuTime]":{
                change: this.onSceneStartChg
            },
            //场景的仿真结束时间改变的响应函数
            "simuparawindow datetimefield[itemId=stopSimuTime]":{
                change: this.onSceneStopChg
            },
            //场景中步长改变的响应函数
            "simuparawindow numberfield[itemId=stepLength]":{
                change: this.onStepChg
            },
            //设置仿真参数
            "#simuparaBtn": {
                click: this.onSimuParaClick
            },
            '#simuparaItem':{
                click:this.onSimuParaClick
            },

            "#simuPLBtn": {
                click: this.onSimuPLClick
            },
            "#simuRWBtn": {
                click: this.onSimuRWClick
            },
            "#simuSTBtn": {
                click: this.onSimuSTClick
            },
            "#simuFFBtn": {
                click: this.onSimuFFClick
            },
            "#orbitScenePanel": {
                activate: this.onSceneActivate
            },
            "#startSimuTime": {
                change: this.onStartSimuTimeChg
            },
//            "#attitudeType":{
//                change:this.onAttitudeTypeChg
//            }
            '#btnNewOrbitFile': {
                click: this.initAngel
            },
            //修改行星显示比例
            '#planetScaleSlider': {
                change: this.changePlanetScale
            }
        });
    },
    onLaunch: function(application) {
        var me = this;
//        getSceneSize(this.getOrbitScenePanel().body.getWidth(), this.getOrbitScenePanel().body.getHeight());
//        addParticleSystem();

        ORBIT.simuTime_Field = this.getOrbitOperationToolbar().queryById('simutime');
        initSimuTime();
        initRender(this.getOrbitScenePanel().body.getWidth(), this.getOrbitScenePanel().body.getHeight(),this.getOrbitScenePanel());
        initScene();
        initLight();
        initObject();
        initCamera(this.getOrbitScenePanel().body.getWidth(), this.getOrbitScenePanel().body.getHeight());
//        initSkyBox();
        initMouseWheel();
        initDrag();
        initRithtMouse();
        resetScene();
        HoverText.createHovertextForPlanet();
        HoverText.hideHoverTextById("moon");
        HoverText.initBigSunDiv();

        if(sessionStorage.getItem( APC.SELECTED_TASK_ID) != 'null'){
            me.openOrbitTaskByName(sessionStorage.getItem( APC.SELECTED_TASK_ID));
        }
    },

    //根据其他界面传过来的APC.SELECTED_TASK_ID的值打开一个任务
    //打开此任务
    openOrbitTaskByName: function (perTaskId) {
        this.getController('OrbitDesignApp.controller.OrbitDesign.OrbitSceneController').openOrbitTaskRequest(perTaskId);
        this.getSolutionTree().expand();
        sessionStorage.removeItem( APC.SELECTED_TASK_ID);
    },
    //屏幕重绘函数
    resizePanel: function(com, width, height){
        var me = this;
//        if (ORBIT.sunDiv != null) {
//            if (ORBIT.sunDiv.style.left == 503 + "px")
//                ORBIT.sunDiv.style.left = 539 + "px";
//            else
//                ORBIT.sunDiv.style.left = 503 + "px";
//        }
        if (ORBIT.renderer != null && ORBIT.renderer != undefined){
            ORBIT.renderer.setSize(width, height);
            ORBIT.canvas.height = height;
            ORBIT.canvas.width = width;
            ORBIT.camera.aspect =  ORBIT.canvas.width / ORBIT.canvas.height;
            ORBIT.camera.updateProjectionMatrix();
//            HoverText.refreshHovertextForPlanet();
            ORBIT.render();
        }
        if(ORBIT.sunDiv != null){
            HoverText.refreshHovertextForPlanet();
            HoverText.refreshBigSun();
        }
        //初始化显示卫星参数面板的位置
        initSatParaBasePosition(me.getOrbitScenePanel().getPosition(), me.getOrbitScenePanel().getWidth(), me.getOrbitScenePanel().getHeight());
    },
    mouseMove: function(panel, x, y, eOpts){
//        if(ORBIT.down && ORBIT.downMove){
//            ORBIT.down = false;
//            ORBIT.downMove = false;
//            ORBTI.isMouseOutDown = true;
//        }
//        return false;
    },
    onOrbRespChg: function(button, e, eOpts){
        if(this.anglewindow == null||this.anglewindow == undefined){
            this.angleWindow = Ext.create('OrbitDesignApp.view.OrbitDesign.AngleWindow');
        }
        this.angleWindow.queryById('angleRadio').setValue({planet:ORBIT.tracedObject.id});
        if(ORBIT.tracedObject.id == 'sun'){
            this.angleWindow.queryById('earthAxesCombo').hide();
            this.angleWindow.queryById('otherAxesCombo').hide();
            this.angleWindow.queryById('sunAxesCombo').show();
        }else if(ORBIT.tracedObject.id == 'earth'){
            this.angleWindow.queryById('sunAxesCombo').hide();
            this.angleWindow.queryById('otherAxesCombo').hide();
            if(ORBIT.states_View == "inertial")
                this.angleWindow.queryById('earthAxesCombo').setValue("earthInertial");
            else if(ORBIT.states_View == "fixed")
                this.angleWindow.queryById('earthAxesCombo').setValue("earthFixed");
            else
                this.angleWindow.queryById('earthAxesCombo').setValue("earthMagnetic");
            this.angleWindow.queryById('earthAxesCombo').show();
        }else{
            this.angleWindow.queryById('sunAxesCombo').hide();
            this.angleWindow.queryById('earthAxesCombo').hide();
            if(ORBIT.states_View == "inertial")
                this.angleWindow.queryById('otherAxesCombo').setValue("otherInertial");
            else
                this.angleWindow.queryById('otherAxesCombo').setValue("otherFixed");
            this.angleWindow.queryById('otherAxesCombo').show();
        }
        this.angleWindow.show();
    },
    handleSureAngleClick:function(component, e){
        var tracePlanet = this.angleWindow.queryById('angleRadio').getValue()["planet"];

        var axes;
        if(tracePlanet == 'sun'){
            axes = this.angleWindow.queryById('sunAxesCombo').getValue();
            ORBIT.planetaryTrackVisibility = true;
            addPlanetOrbit();
            HoverText.showHoverText();
            HoverText.hideHoverTextById("moon");
        }else if(tracePlanet == 'earth'){
            axes = this.angleWindow.queryById('earthAxesCombo').getValue();
            ORBIT.planetaryTrackVisibility = false;
            removePlanetOrbit();
            HoverText.hideHoverText();
//            removeTail();
            OrbitTail.removeTail();
        }else{
            axes = this.angleWindow.queryById('otherAxesCombo').getValue();
            ORBIT.planetaryTrackVisibility = false;
            removePlanetOrbit();
            HoverText.hideHoverText();
//            removeTail();
            OrbitTail.removeTail();
        }
        if(tracePlanet != undefined){
            switch(tracePlanet){
                case "mercury":ORBIT.thetaMove_mercury = 0;ORBIT.alphaMove_mercury = 0;break;
                case "venus":ORBIT.thetaMove_venus = 0;ORBIT.alphaMove_venus = 0;break;
                case "earth":ORBIT.thetaMove_earth = 0;ORBIT.alphaMove_earth = 0;break;
                case "mars":ORBIT.thetaMove_mars = 0;ORBIT.alphaMove_mars = 0;break;
                case "jupiter":ORBIT.thetaMove_jupiter = 0;ORBIT.alphaMove_jupiter = 0;break;
                case "saturn":ORBIT.thetaMove_saturn = 0;ORBIT.alphaMove_saturn = 0;break;
                case "uranus":ORBIT.thetaMove_uranus = 0;ORBIT.alphaMove_uranus = 0;break;
                case "neptune":ORBIT.thetaMove_neptune = 0;ORBIT.alphaMove_neptune = 0;break;
                case "moon":ORBIT.thetaMove_moon = 0;ORBIT.alphaMove_moon = 0;break;
                case "sun":ORBIT.thetaMove_sun = 0;ORBIT.alphaMove_sun = 0;ORBIT.camera.up.set(0, 0, 1);break;
            }
            ORBIT.trace = true;
            ORBIT.zoom = ORBIT.v_minzoom * 2;
//            ORBIT.camera.up.set(0, 0, 1);//设置摄像头的方向，哪个轴为1 摄像机就朝哪个轴的正方向拍；
            ORBIT.tracedObject = ORBIT.planet[tracePlanet].object;
            ORBIT.tracedTarget = ORBIT.planet[tracePlanet];
            ORBIT.tracedTargetTpye = 'Planet';
            if(axes != undefined){
                if(tracePlanet == "sun"){
                    ORBIT.states_View = "sunlanetAxes"
                }
                else if(tracePlanet == "earth"){
                    if(axes == "earthInertial"){
                        ORBIT.states_View = "inertial";
                    }
                    else if(axes == "earthFixed"){
                        ORBIT.states_View = "fixed";
                    }
                    else{
                        ORBIT.states_View = "magnetic";
                    }
                }
                else{
                    if(axes == "otherInertial"){
                        ORBIT.states_View = "inertial";
                    }
                    else{
                        ORBIT.states_View = "fixed";
                    }
                }
            }
            refreshObject();
            refreshCamera();
        }
    },
    changeAngleByPlanet: function(planet){
        if(planet == 'sun'){
            ORBIT.planetaryTrackVisibility = true;
            addPlanetOrbit();
            HoverText.showHoverText();
            HoverText.hideHoverTextById("moon");
        }else {
            ORBIT.planetaryTrackVisibility = false;
            removePlanetOrbit();
            HoverText.hideHoverText();
//            removeTail();
            OrbitTail.removeTail();
        }
        switch(planet){
            case "mercury":ORBIT.thetaMove_mercury = 0;ORBIT.alphaMove_mercury = 0;break;
            case "venus":ORBIT.thetaMove_venus = 0;ORBIT.alphaMove_venus = 0;break;
            case "earth":ORBIT.thetaMove_earth = 0;ORBIT.alphaMove_earth = 0;break;
            case "mars":ORBIT.thetaMove_mars = 0;ORBIT.alphaMove_mars = 0;break;
            case "jupiter":ORBIT.thetaMove_jupiter = 0;ORBIT.alphaMove_jupiter = 0;break;
            case "saturn":ORBIT.thetaMove_saturn = 0;ORBIT.alphaMove_saturn = 0;break;
            case "uranus":ORBIT.thetaMove_uranus = 0;ORBIT.alphaMove_uranus = 0;break;
            case "neptune":ORBIT.thetaMove_neptune = 0;ORBIT.alphaMove_neptune = 0;break;
            case "moon":ORBIT.thetaMove_moon = 0;ORBIT.alphaMove_moon = 0;break;
            case "sun":ORBIT.thetaMove_sun = 0;ORBIT.alphaMove_sun = Math.PI / 2 - 0.001;ORBIT.camera.up.set(0, 0, 1);break;
        }
        ORBIT.trace = true;
        ORBIT.zoom = ORBIT.v_minzoom * 2;
//            ORBIT.camera.up.set(0, 0, 1);//设置摄像头的方向，哪个轴为1 摄像机就朝哪个轴的正方向拍；
        ORBIT.tracedObject = ORBIT.planet[planet].object;
        ORBIT.tracedTarget = ORBIT.planet[planet];
        ORBIT.tracedTargetTpye = 'Planet';
        if(ORBIT.states_View == "magnetic"){
            ORBIT.firstOutMagnetic = true;
        }
        if(planet == "sun"){
            ORBIT.states_View = "sunlanetAxes";
        }
        else {
            ORBIT.states_View = "inertial";
        }
        refreshObject();
        refreshCamera();
    },
    initAngel : function(){
        this.changeSunAngel();
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
    },
    hideAndShowCombo:function(planet){
        var planetAxesCombo = this.getOrbitOperationToolbar().queryById('planetAxesCombo');
        var earthAxesCombo = this.getOrbitOperationToolbar().queryById('earthAxesCombo');
        var otherAxesCombo = this.getOrbitOperationToolbar().queryById('otherAxesCombo');
        switch (planet){
            case 'sun':planetAxesCombo.setVisible(true);planetAxesCombo.setValue('sunlanetAxes');earthAxesCombo.setVisible(false);otherAxesCombo.setVisible(false);break;
            case 'earth':planetAxesCombo.setVisible(false);earthAxesCombo.setVisible(true);earthAxesCombo.setValue('inertial');otherAxesCombo.setVisible(false);break;
            case 'other':planetAxesCombo.setVisible(false);earthAxesCombo.setVisible(false);otherAxesCombo.setVisible(true);otherAxesCombo.setValue('inertial');break;
        }
    },

    changeSunAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('sun');
        this.changeAngleByPlanet('sun');
//        this.changedSelectedPlanet('sun');
    },
    changeMercuryAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('mercury');
//        this.changedSelectedPlanet('mercury');
    },
    changeVenusAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('venus');
//        this.changedSelectedPlanet('venus');
    },
    changeEarthAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('earth');
        this.changeAngleByPlanet('earth');
//        this.changedSelectedPlanet('earth');
    },
    changeMarsAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('mars');
//        this.changedSelectedPlanet('mars');
    },
    changeJupiterAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('jupiter');
//        this.changedSelectedPlanet('jupiter');
    },
    changeSaturnAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('saturn');
//        this.changedSelectedPlanet('saturn');
    },
    changeUranusAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('uranus');
//        this.changedSelectedPlanet('uranus');
    },
    changeNeptuneAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('neptune');
//        this.changedSelectedPlanet('neptune');
    },
    changeMoonAngel: function(button,e,eOpts){
        ORBIT.sunDiv.style.display = "none";
        this.hideAndShowCombo('other');
        this.changeAngleByPlanet('moon');
//        this.changedSelectedPlanet('moon');

    },
    changedSelectedPlanet:function(planetName){
        this.getOrbitOperationToolbar().queryById('angelMercury').setIconCls('mercury');
        this.getOrbitOperationToolbar().queryById('angelEarth').setIconCls('earth');
        this.getOrbitOperationToolbar().queryById('angelJupiter').setIconCls('jupiter');
        this.getOrbitOperationToolbar().queryById('angelMoon').setIconCls('moon');
        this.getOrbitOperationToolbar().queryById('angelNeptune').setIconCls('neptune');
        this.getOrbitOperationToolbar().queryById('angelSaturn').setIconCls('saturn');
        this.getOrbitOperationToolbar().queryById('angelSun').setIconCls('sun');
        this.getOrbitOperationToolbar().queryById('angelUranus').setIconCls('uranus');
        this.getOrbitOperationToolbar().queryById('angelVenus').setIconCls('venus');
        this.getOrbitOperationToolbar().queryById('angelMars').setIconCls('mars');
        switch(planetName){
            case 'mercury':this.getOrbitOperationToolbar().queryById('angelMercury').setIconCls('selectedmercury');break;
            case 'earth':  this.getOrbitOperationToolbar().queryById('angelEarth').setIconCls('selectedearth');break;
            case 'mars':   this.getOrbitOperationToolbar().queryById('angelMars').setIconCls('selectedmars');break;
            case 'moon':   this.getOrbitOperationToolbar().queryById('angelMoon').setIconCls('selectedmoon');break;
            case 'neptune':this.getOrbitOperationToolbar().queryById('angelNeptune').setIconCls('selectedneptune');break;
            case 'saturn': this.getOrbitOperationToolbar().queryById('angelSaturn').setIconCls('selectedsaturn');break;
            case 'sun':    this.getOrbitOperationToolbar().queryById('angelSun').setIconCls('selectedsun');break;
            case 'uranus': this.getOrbitOperationToolbar().queryById('angelUranus').setIconCls('selecteduranus');break;
            case 'venus':  this.getOrbitOperationToolbar().queryById('angelVenus').setIconCls('selectedvenus');break;
            case 'jupiter':  this.getOrbitOperationToolbar().queryById('angelJupiter').setIconCls('selectedjupiter');break;
        }

    },
    planetAxesChange:function(combo, newValue, oldValue, eOpts ){
        if(newValue == 'inertial'){
            ORBIT.states_View = "inertial";
        }else if(newValue == 'fixed'){
            ORBIT.states_View = "fixed";
        }else if(newValue == 'magnetic'){
            ORBIT.states_View = "magnetic";
            ORBIT.firstInMagnetic = true;
        }
        if(oldValue == "magnetic"){
            ORBIT.firstOutMagnetic = true;
        }
        else if(newValue == 'sunlanetAxes'){
            ORBIT.states_View = "sunlanetAxes"
        }
        refreshObject();
        refreshCamera();
    },
    planetChange:function(combo, newValue, oldValue, eOpts){
        ORBIT.mouseRightFlag = false;
        ORBIT.freedomAngle = false;
        //如果不是地球视角和自由视角将太阳风和地球磁场隐藏
        if(newValue != 'angelEarth' && newValue != 'angelFreedom'){
            //隐藏地球磁场
            ORBIT.earthTraceVisibility = false;
            removeTrace();
            //添加真太阳
            ORBIT.scene.add(ORBIT.planet["sun"].object);
            //隐藏太阳风
            ORBIT.sunWindVisibility = false;
            hideParticleSunWind(ORBIT.planet["earth"].sunWind);
        }
        if(newValue == 'angelMercury'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('mercury');
            //设置中心位置
            var position = ORBIT.planet["mercury"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('mercury');
        }else if(newValue == 'angelEarth'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('earth');
            this.changeAngleByPlanet('earth');
            //设置中心位置
            var position = ORBIT.planet["earth"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('earth');
        }else if(newValue == 'angelJupiter'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('jupiter');
            //设置中心位置
            var position = ORBIT.planet["jupiter"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('jupiter');
        }
        else if(newValue == 'angelMoon'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('moon');
            //设置中心位置
            var position = ORBIT.planet["moon"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('moon');
        }
        else if(newValue == 'angelNeptune'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('neptune');
            //设置中心位置
            var position = ORBIT.planet["neptune"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('neptune');
        }
        else if(newValue == 'angelSaturn'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('saturn');
            //设置中心位置
            var position = ORBIT.planet["saturn"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('saturn');
        }
        else if(newValue == 'angelSun'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('sun');
            this.changeAngleByPlanet('sun');
            //设置中心位置
            var position = ORBIT.planet["sun"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
            resetCamera();
//            this.changedSelectedPlanet('sun');
        }
        else if(newValue == 'angelFreedom'){
            ORBIT.freedomAngle = true;
            ORBIT.cameraCenter = new THREE.Vector3(ORBIT.tracedObject.position.x, ORBIT.tracedObject.position.y, ORBIT.tracedObject.position.z);

            ORBIT.orbitControl.target = new THREE.Vector3(ORBIT.cameraCenter.x, ORBIT.cameraCenter.y, ORBIT.cameraCenter.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
            ORBIT.mouseRightFlag = true;

            //初始化摄像机的与中心点构成向量在旋转球坐标系中的角度
            this.initAlphaAndTheta();
        }
        else if(newValue == 'angelUranus'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('uranus');
            //设置中心位置
            var position = ORBIT.planet["uranus"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('uranus');
        }
        else if(newValue == 'angelVenus'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('venus');
            //设置中心位置
            var position = ORBIT.planet["venus"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('venus');
        }
        else if(newValue == 'angelMars'){
            ORBIT.sunDiv.style.display = "none";
            this.hideAndShowCombo('other');
            this.changeAngleByPlanet('mars');
            //设置中心位置
            var position = ORBIT.planet["mars"].object.position;
            ORBIT.orbitControl.target = new THREE.Vector3(position.x, position.y, position.z);
            ORBIT.orbitControl.center = ORBIT.orbitControl.target;
//            this.changedSelectedPlanet('mars');
        }
    },
    //初始化摄像机的与中心点构成向量在旋转球坐标系中的角度
    initAlphaAndTheta:function(){
        if(ORBIT.tracedTargetTpye == "Planet"){
            switch(ORBIT.tracedObject.id){
                case "sun":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_sun;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_sun;
                    break;
                case "mercury":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_mercury;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_mercury;
                    break;
                case "venus":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_venus;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_venus;
                    break;
                case "earth":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_earth;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_earth;
                    break;
                case "mars":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_mars;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_mars;
                    break;
                case "jupiter":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_jupiter;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_jupiter;
                    break;
                case "saturn":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_saturn;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_saturn;
                    break;
                case "uranus":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_uranus;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_uranus;
                    break;
                case "neptune":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_neptune;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_neptune;
                    break;
                case "moon":
                    ORBIT.alphaMove_freedom = ORBIT.alphaMove_moon;
                    ORBIT.thetaMove_freedom = ORBIT.thetaMove_moon;
                    break;
            }
        }
        else if(ORBIT.tracedTargetTpye == "Sate"){
            ORBIT.alphaMove_freedom = ORBIT.alphaMove_satellite;
            ORBIT.thetaMove_freedom = ORBIT.thetaMove_satellite;
        }
    },
    otherAxesChange:function(combo, newValue, oldValue, eOpts ) {
        if (newValue == 'inertial') {
            ORBIT.states_View = "inertial";
        } else if (newValue == 'fixed') {
            ORBIT.states_View = "fixed";
        } else if (newValue == 'magnetic') {
            ORBIT.states_View = "magnetic";
            ORBIT.firstInMagnetic = true;
        }
        if (oldValue == "magnetic") {
            ORBIT.firstOutMagnetic = true;
        }
        else if (newValue == 'sunlanetAxes') {
            ORBIT.states_View = "sunlanetAxes"
        }
        refreshObject();
        refreshCamera();
    },
    earthAxesChange:function(combo, newValue, oldValue, eOpts ){
        if(newValue == 'inertial'){
            ORBIT.states_View = "inertial";
        }else if(newValue == 'fixed'){
            ORBIT.states_View = "fixed";
        }else if(newValue == 'magnetic'){
            ORBIT.states_View = "magnetic";
            ORBIT.firstInMagnetic = true;
        }
        if(oldValue == "magnetic"){
            ORBIT.firstOutMagnetic = true;
        }
        else if(newValue == 'sunlanetAxes'){
            ORBIT.states_View = "sunlanetAxes"
        }
        refreshObject();
        refreshCamera();
    },
    onSureAngle: function(button,e,eOpts){
        this.angleWindow.close();
    },

    //场景的仿真开始时间改变的响应函数
    onSceneStartChg: function(datetimefield, newValue, oldValue, eOpts){
        if(compareTime(newValue, ORBIT.t_stop) >= 0){
            ORBIT.t_start = newValue;
            ORBIT.t_simu = new Date(newValue.toString());
            resetScene();
        }
        else{
            this.simuParawindow.queryById('startSimuTime').setValue(oldValue);
        }
    },
    //场景的仿真结束时间改变的响应函数
    onSceneStopChg: function(datetimefield, newValue, oldValue, eOpts){
        if(compareTime(newValue, ORBIT.t_start) <= 0){
            ORBIT.t_stop = newValue;
            if(compareTime(newValue, ORBIT.t_simu) > 0){
                ORBIT.t_simu = newValue;
                resetScene();
            }
            else{
                refreshSatellite();
                refreshoAxes();
                refreshCamera();
            }
        }
        else{
            this.simuParawindow.queryById('stopSimuTime').setValue(oldValue);
        }
    },
    //场景中步长改变的响应函数
    onStepChg: function(numberfield, newValue, oldValue, eOpts){
        if(newValue != null && this.simuParawindow.queryById('stepLength').isValid()) {
            var flag = ORBIT.formatDetection.detectionOrbitPara(newValue, ORBIT.min['step'], ORBIT.max['step']);
            if (flag) {
                if(ORBIT.states_View == "sunlanetAxes" && !ORBIT.fileName){
                    ORBIT.sunStep = newValue;
                }
                else{
                    ORBIT.step = newValue;
                }
            }
            else {
                this.simuParawindow.queryById("stepLength").setValue(oldValue);
            }
        }
        else{
//            this.simuParawindow.queryById("stepLength").setValue(oldValue);
        }
    },
    //设置仿真参数
    onSimuParaClick: function(button, e, eOpts) {
        this.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
        if(this.simuParawindow == null){
            this.simuParawindow = Ext.create('OrbitDesignApp.view.OrbitDesign.SimuParaWindow');
        }
        if(formatDate(ORBIT.t_simu) > formatDate(ORBIT.t_start)){
            this.simuParawindow.queryById('startSimuTime').disable();
            this.simuParawindow.queryById('stopSimuTime').disable();
            this.simuParawindow.queryById('stepLength').disable();
        }
        else{
            this.simuParawindow.queryById('startSimuTime').enable();
            this.simuParawindow.queryById('stopSimuTime').enable();
            this.simuParawindow.queryById('stepLength').enable();
        }
        this.simuParawindow.queryById('startSimuTime').setValue(ORBIT.t_start);
        this.simuParawindow.queryById('stopSimuTime').setValue(ORBIT.t_stop);
        if(ORBIT.states_View == "sunlanetAxes" && !ORBIT.fileName) {
            this.simuParawindow.queryById('stepLength').setValue(ORBIT.sunStep);
        }
        else{
            this.simuParawindow.queryById('stepLength').setValue(ORBIT.step);
        }
        var basePosition = this.getOrbitScenePanel().getPosition();
        this.simuParawindow.setPosition(basePosition[0],basePosition[1],true);
        this.simuParawindow.show();
    },
    onSimuPLClick: function(button, e, eOpts){
        //将修改仿真参数控件disable掉
        if(this.simuParawindow != null && this.simuParawindow != undefined){
            this.simuParawindow.queryById('startSimuTime').disable();
            this.simuParawindow.queryById('stopSimuTime').disable();
            this.simuParawindow.queryById('stepLength').disable();
        }

        ORBIT.states_Simu = !ORBIT.states_Simu;
        if(ORBIT.states_Simu){
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setIconCls('stop');
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setTooltip('暂停');
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setText('暂停');
            ORBIT.simuPLBtn = this.getOrbitOperationToolbar().queryById('simuPLBtn');
            startOrbitSimu();
        }
        else{
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setIconCls('start');
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setTooltip('开始');
            this.getOrbitOperationToolbar().queryById('simuPLBtn').setText('开始');
        }
    },
    onSimuRWClick: function(button, e, eOpts){
        speedDown();
    },
    onSimuSTClick: function(button, e, eOpts){
        //将修改仿真参数的控件enable
        if(this.simuParawindow != null && this.simuParawindow != undefined){
            this.simuParawindow.queryById('startSimuTime').enable();
            this.simuParawindow.queryById('stopSimuTime').enable();
            this.simuParawindow.queryById('stepLength').enable();
        }
        ORBIT.states_Simu = false;
        Ext.getCmp('simuPLBtn').setIconCls('start');
        Ext.getCmp('simuPLBtn').setTooltip('开始');
        Ext.getCmp('simuPLBtn').setText('开始');
        resetSimuTime();
        resetScene();
        resetSpeedScalar();
        HoverText.refreshHovertextForPlanet();
    },
    onSimuFFClick: function(button, e, eOpts){
        speedUp();
    },
    onSceneActivate: function(panel, eOpts){
    },
    onStartSimuTimeChg: function(picker, date, eOpts){
    },
    //修改行星显示比例
    changePlanetScale: function(slider, newValue, thumb, eOpts ){
        ORBIT.planetScale = newValue;
        refreshPlanetScale();
        ORBIT.Planet.refreshTraceScale(ORBIT.planetScale);
        ORBIT.Planet.refreshSunWIndScale(ORBIT.planetScale);
        ORBIT.Planet.refreshSunWind(ORBIT.planetScale);
        ORBIT.renderer.clear();
        ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
    }
});