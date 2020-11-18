/******************************************
 * 类名：组件类
 * 类型：实体类
 * 作用：卫星组件
 * 创建者：杜鹏宇
 * 最后一次修改者：杜鹏宇
 * 最后一次修改时间：20141127
 *****************************************/

var Structure = function(){
    //结构编号，用随机的16位码来标识
    this.id = Math.floor(Math.random() * 8999999999999999 + 1000000000000000);
    //id列表，供组合体保存子结构的id
    this.idList = new Array();
    //结构三维本体
    this.object = new THREE.Object3D();
    //结构OBJ文件路径，基础结构则为名字，组合体则为数组
    this.pathobj = null;
    //结构mtl文件路径，基础结构则为名字，组合体则为数组
    this.pathmtl = null;
    //包络盒，组合体则为数组
    this.boxHelper = null;
    //选择标记
    this.selectFlag = false;
    //子结点选择标记
    this.childSelectFlag = false;
    //锁定标记
    this.lockFlag = false;
    //组合体标记
    this.combinaFlag = false;
    //基础模型标记，组合体则为数组
    this.basicFlag = false;
//    //附属注释框
//    this.remark = document.createElement("div");
    //设置该组件是否可见
    this.visibleFlag = true;
    //附属数据
    this.data = {
        name:null,//名字
        nameList:new Array(),//供组合体使用
        quality:0,//质量
        qualityList:new Array(),//供组合体使用
        consumption:0,//功耗
        consumptionList:new Array(),//供组合体使用
        initSize:0,//初始尺寸
        initSizeList:new Array()//供组合体使用
    };
}
Structure.prototype ={
    //使用协同数据进行初始化
    initBySynchronous : function(id, position, rotation, scale, data, callback){
        this.id = id;
        this.data = data.data;
        if (data.basicFlag)
            this.initBasicModel(data.pathobj, position, rotation, scale, callback);
        else
            this.initByOBJMTL(Struct.structures.length - 1, data.pathobj, data.pathmtl, position, rotation, scale, callback);
    },

    //用基础模型进行初始化
    initBasicModel : function(type, position, rotation, scale, callback){
        var material = new THREE.MeshLambertMaterial({color: 0x99CCFF});
        switch (type) {
            //立方体
            case "Cube":
                this.object.add(new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), material));
                this.pathobj = 'Cube';
                this.pathmtl = 'Cube';
                break;
            //圆柱
            case "Cylinder":
                this.object.add(new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 50, 50), material));
                this.pathobj = 'Cylinder';
                this.pathmtl = 'Cylinder';
                break;
            //球
            case "Sphere":
                this.object.add(new THREE.Mesh(new THREE.SphereGeometry(32, 32, 32), material));
                this.pathobj = 'Sphere';
                this.pathmtl = 'Sphere';
                break;
            //面板
            case "Panel":
                this.object.add(new THREE.Mesh(new THREE.CubeGeometry(100, 100, 5), material));
                this.pathobj = 'Panel';
                this.pathmtl = 'Panel';
                break;
            default :
                break;
        }
        this.refresh(position, rotation, scale);
        Struct.scene.add( this.object );
        this.boxHelper = new THREE.BoxHelper(this.object.children[0]);
        this.basicFlag = true;
//        //设置注释框
//        this.remark.style.zIndex = 3;
//        this.remark.style.position = "fixed";
//        this.remark.style.display = "none";
//        this.remark.onmousedown = function(){return false;}
//        this.remark.onmousemove = function(){return false;}
//        Struct.container.parentNode.appendChild(this.remark);
        //添加附属数据
        var vertices = this.boxHelper.vertices;
        this.data.initSize = {
                x : vertices[0].x - vertices[1].x,
                y : vertices[0].y - vertices[3].y,
                z : vertices[0].z - vertices[4].z
            }
        if (callback != null) callback();
    },

    //用OBJ-MTL文件进行初始化
    initByOBJMTL : function(no, pathobj, pathmtl, position, rotation, scale, callBackFun){
        //导入模型并add到object,使用不友好的structures[no]来代替无法使用的this
        this.pathobj = pathobj;
        this.pathmtl = pathmtl;
        (new THREE.OBJMTLLoader()).load( pathobj, pathmtl, function ( object ) {
            Struct.structures[no].object.add(object);
            Struct.structures[no].boxHelper = new THREE.BoxHelper(object.children[object.children.length - 1]);
            var vertices = Struct.structures[no].boxHelper.vertices;
            Struct.structures[no].data.initSize = {
                x : vertices[0].x - vertices[1].x,
                y : vertices[0].y - vertices[3].y,
                z : vertices[0].z - vertices[4].z
            };
            Struct.render();
            if (callBackFun != null) callBackFun();
        } );
        this.refresh(position, rotation, scale);
        Struct.scene.add( this.object );
//        //设置注释框
//        this.remark.style.zIndex = 3;
//        this.remark.style.position = "fixed";
//        this.remark.style.display = "none";
//        this.remark.onmousedown = function(){return false;}
//        this.remark.onmousemove = function(){return false;}
//        Struct.container.parentNode.appendChild(this.remark);
    },

    //组合体进行初始化
    initByCombina : function(idList){
        var point =  new THREE.Vector3(0, 0, 0);
        this.pathobj = new Array();
        this.pathmtl = new Array();
        this.boxHelper = new Array();
        this.basicFlag = new Array();
        for (var i = 0; i < idList.length; i++){
            var no = Struct.structManage.searchByID(idList[i]);
            this.idList[i] = Struct.structures[no].id;
            this.pathobj[i] = Struct.structures[no].pathobj;
            this.pathmtl[i] = Struct.structures[no].pathmtl;
            this.basicFlag[i] = Struct.structures[no].basicFlag;
            this.data.nameList[i] = Struct.structures[no].data.name;
            this.data.quality += Struct.structures[no].data.quality;
            this.data.qualityList[i] = Struct.structures[no].data.quality;
            this.data.consumption += Struct.structures[no].data.consumption;
            this.data.consumptionList[i] = Struct.structures[no].data.consumption;
            this.data.initSizeList[i] = Struct.structures[no].data.initSize;
            //基础结构与非基础结构的boxer区别对待
            if (Struct.structures[no].basicFlag)
                this.boxHelper[i] = new THREE.BoxHelper(
                    Struct.structures[no].object.children[0]);
            else
                this.boxHelper[i] = new THREE.BoxHelper(
                    Struct.structures[no].object.children[0].children[Struct.structures[no].object.children[0].children.length - 1]);
            this.object.add(Struct.structures[no].object);
            point.add(Struct.structures[no].object.position);
        }
        this.combinaFlag = true;
        this.object.position.set(point.x / idList.length, point.y / idList.length, point.z / idList.length);
        Struct.scene.add( this.object );
        //设置被组合组件的新位置
        for (var i = 0; i < idList.length; i++) {
            var no = Struct.structManage.searchByID(idList[i]);
            Struct.structures[no].object.position.sub(this.object.position);
        }
//        //设置注释框
//        this.remark.style.zIndex = 3;
//        this.remark.style.position = "fixed";
//        this.remark.style.display = "none";
//        this.remark.onmousedown = function(){return false;}
//        this.remark.onmousemove = function(){return false;}
//        Struct.container.parentNode.appendChild(this.remark);
        //随机一个组合体名称
        this.data.name = "Combine" + (Math.floor(Math.random() * 8999 + 1000)).toString();
    },

    //结构转为选中状态
    select : function(){
        if (this.selectFlag) return;
        this.selectFlag = true;
        //控制按钮的观察者模式
        Struct.structManage.selectTotal++;
        Struct.structManage.observerPattern();
        //附着控制轴
        Struct.structManage.transformControl.attach(this.object);
        if (Struct.structManage.selectTotal != 1)
            Struct.structManage.transformControl.detach(this.object);
        Struct.render();
        //高亮包络盒
        if (!this.combinaFlag)
            Struct.scene.add(this.boxHelper);
        else
            for (var i = 0; i < this.boxHelper.length; i++){
                Struct.scene.add(this.boxHelper[i]);
                Struct.render();
            }
        //关联属性板
        Struct.windowManage.updateCW(true, this.id, this.data, this.object.position, this.object.rotation,
            {x:this.object.scale.x * this.data.initSize.x, y:this.object.scale.y * this.data.initSize.y, z:this.object.scale.z * this.data.initSize.z});
    },

    //结构转为未选中状态
    unselect : function(){
        if (!this.selectFlag) return;
        this.selectFlag = false;
        //控制按钮的观察者模式
        Struct.structManage.selectTotal--;
        Struct.structManage.observerPattern();
        //附着控制轴
        Struct.structManage.transformControl.detach(this.object);
        //高亮包络盒
        if (!this.combinaFlag)
            Struct.scene.remove(this.boxHelper);
        else
            for (var i = 0; i < this.boxHelper.length; i++){
                Struct.scene.remove(this.boxHelper[i]);
            }
        //关联属性板
        Struct.windowManage.updateCW(false, this.id, this.data, this.object.position, this.object.rotation,
            {x:this.object.scale.x * this.data.initSize.x, y:this.object.scale.y * this.data.initSize.y, z:this.object.scale.z * this.data.initSize.z});
    },

    //将结构锁定
    lock : function(){
        if (this.lockFlag) return;
        this.lockFlag = true;
        if (this.selectFlag) this.unselect();
//        //设置锁定图标
//        var screenpos = Struct.sceneManage.getObjectScreenPosition(this.object.position);
//        this.remark.style.left = screenpos.x + "px";
//        this.remark.style.top = screenpos.y + "px";
//        this.remark.style.display = "block";
//        this.remark.innerHTML = '<img src="../../resources/icons/lock.png">';

        var draw = function (object, basicFlag, no){
            for (var i = 0; i < object.children.length; i++){
                if ((no == null && basicFlag) || (no != null && basicFlag[no])) {
                    object.children[i].material.opacity = 0.5;
                    object.children[i].material.transparent = true;
                }else{
                    var t = object.children[i];
                    for (var j = 0; j < t.children.length; j++){
                        t.children[j].material.opacity = 0.5;
                        t.children[j].material.transparent = true;
                    }
                }
            }
        }
        if (!this.combinaFlag) {
            draw(this.object, this.basicFlag);
        }else{
            for (var i = 0; i < this.object.children.length; i++)
                draw(this.object.children[i], this.basicFlag, i);
        }
        Struct.render();
    },

    //将结构解锁
    unlock : function(){
        if (!this.lockFlag) return;
        this.lockFlag = false;
//        this.remark.style.display = "none";

        var draw = function (object, basicFlag, no){
            for (var i = 0; i < object.children.length; i++){
                if ((no == null && basicFlag) || (no != null && basicFlag[no])) {
                    object.children[i].material.opacity = 1;
                    object.children[i].material.transparent = false;
                }else{
                    var t = object.children[i];
                    for (var j = 0; j < t.children.length; j++){
                        t.children[j].material.opacity = 1;
                        t.children[j].material.transparent = false;
                    }
                }
            }
        }
        if (!this.combinaFlag) {
            draw(this.object, this.basicFlag);
        }else{
            for (var i = 0; i < this.object.children.length; i++)
                draw(this.object.children[i], this.basicFlag, i);
        }
        Struct.render();
    },

    //更新结构三维数据
    refresh : function(position, rotation, scale){
        if (position != null) {
            this.object.position.x = position.x;
            this.object.position.y = position.y;
            this.object.position.z = position.z;
        }
        if (rotation != null) {
            this.object.rotation.x = rotation.x;
            this.object.rotation.y = rotation.y;
            this.object.rotation.z = rotation.z;
        }
        if (scale != null) {
            this.object.scale.x = scale.x;
            this.object.scale.y = scale.y;
            this.object.scale.z = scale.z;
        }
//        //更新备注框位置
//        if (this.lockFlag) {
//            var screenpos = Struct.sceneManage.getObjectScreenPosition(this.object.position);
//            this.remark.style.left = screenpos.x + "px";
//            this.remark.style.top = screenpos.y + "px";
//        }
        //更新控制轴
        if (this.selectFlag)
            Struct.structManage.transformControl.update();
    },

    //移除结构
    delete : function(){
        this.unselect();
        this.boxHelper = null;
        Struct.scene.remove(this.object);
        this.object = null;
//        this.remark.parentNode.removeChild(this.remark);
//        this.remark = null;
    },

    //结构切换成可见状态
    visible : function(){
        if (this.visibleFlag) return;
        this.visibleFlag = true;
        Struct.scene.add(this.object);
        if (!this.selectFlag) return;
        //对于选中的组件还要恢复控制轴和盒子
        Struct.structManage.transformControl.attach(this.object);
        if (Struct.structManage.selectTotal != 1)
            Struct.structManage.transformControl.detach(this.object);
        if (!this.combinaFlag)
            Struct.scene.add(this.boxHelper);
        else
            for (var i = 0; i < this.boxHelper.length; i++){
                Struct.scene.add(this.boxHelper[i]);
            }
    },

    //结构切换成隐藏状态
    hidden : function(){
        if (!this.visibleFlag) return;
        this.visibleFlag = false;
        if (!this.selectFlag){
            Struct.scene.remove(this.object);
            return;
        }
        //对于选中的组件还要隐藏控制轴和盒子
        Struct.structManage.transformControl.detach(this.object);
        if (!this.combinaFlag)
            Struct.scene.remove(this.boxHelper);
        else
            for (var i = 0; i < this.boxHelper.length; i++){
                Struct.scene.remove(this.boxHelper[i]);
            }
        Struct.scene.remove(this.object);
    },

    //获得包络尺寸
    getBoxSize : function(){
        var size = {
            x : this.data.initSize.x * this.object.scale.x,
            y : this.data.initSize.y * this.object.scale.y,
            z : this.data.initSize.z * this.object.scale.z
        }
        return size;
    },

    //设置中文名称
    setChineseName : function(english){
//        switch (english){
//            case "Cube":this.data.name = "立方体";break;
//            case "Cylinder":this.data.name = "圆柱体";break;
//            case "Sphere":this.data.name = "球体";break;
//            case "Panel":this.data.name = "面板";break;
//            case "Probe":this.data.name = "探测器";break;
//            case "Returncapsule":this.data.name = "返回舱";break;
//            case "Spinstabilized":this.data.name = "自旋稳定";break;
//            case "Threeaxisstabilizedsatellite":this.data.name = "三轴稳定卫星";break;
//            case "BatteryPack":this.data.name = "电池组";break;
//            case "Distributionbox":this.data.name = "配电箱";break;
//            case "Magneticassemblylinebox":this.data.name = "磁组件线路盒";break;
//            case "MomentumWheel":this.data.name = "动量轮";break;
//            case "StarComputerServices":this.data.name = "星务计算机";break;
//            case "Coarsesunsensor":this.data.name = "粗太阳敏感器";break;
//            case "Datatransmissiontransmitter":this.data.name = "数传发射机";break;
//            case "GPSantenna":this.data.name = "GPS天线";break;
//            case "Omnidirectionalantenna":this.data.name = "全向天线";break;
//            case "Opticalcamera":this.data.name = "光学相机";break;
//            case "Solarpanels":this.data.name = "太阳能帆板";break;
//            case "SpreadSpectrumTransceiver":this.data.name = "扩频收发机";break;
//            case "Startracker":this.data.name = "星敏感器";break;
//            default:this.data.name = "未命名的组件";break;
//        }
        this.data.name = english;
    }
}