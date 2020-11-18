Ext.define('AppPlat.controller.StructDesign.StructureController', {

    extend: 'Ext.app.Controller',

    models: [
    ],
    stores: [
    ],
    views:[
        'StructDesign.AdvancedControlWindow'
    ],
    refs: [
        {
            ref:'buttongrouppanel',
            selector:'buttongrouppanel'
        },
        {
            ref:'AdvancedControlWindow',
            selector:'AdvancedControlWindow'
        },
        {
            ref:'structureScenePanelC',
            selector:'structureScenePanelC'
        },
        {
            ref: 'modulepanel',
            selector: 'modulepanel'
        }
    ],

    //屏幕扩展重绘函数
    resizePanel: function(com, width, height){
        if (Struct.renderer != null && Struct.renderer != undefined){
            Struct.container.height = height;
            Struct.container.width = width;
            Struct.renderer.setSize(width, height);
            Struct.camera.aspect = width / height;
            Struct.camera.updateProjectionMatrix();
            Struct.structManage.refresh();
            Struct.render();
        }
    },

    init: function(application) {
        var me = this;
        this.control({
            //屏幕重绘响应
            'structurescenepanelc': {
                resize:this.resizePanel
            },

            //列表板按钮
            '#btnList': {
                click: this.btnListClick
            },
            //属性版按钮
            '#btnAdvancedPanel':{
                click: this.btnAdvancedPanelClick
            },

            //平移按钮
            '#btnTranslate':{
                click: this.btnTranslateClick
            },
            //旋转按钮
            '#btnRotate':{
                click: this.btnRotateClick
            },
            //缩放按钮
            '#btnScale':{
                click: this.btnScaleClick
            },

            //组合按钮
            '#btnCombine':{
                click: this.btnCombineClick
            },
            //分离按钮
            '#btnSeparate':{
                click: this.btnSeparateClick
            },
            //吸附按钮
            '#btnAssembly':{
                click: this.btnAssemblyClick
            },

            //按X方向对齐
            '#btnAlignmentX':{
                click: this.btnAlignmentXClick
            },
            //按Y方向对齐
            '#btnAlignmentY':{
                click: this.btnAlignmentYClick
            },
            //按Z方向对齐
            '#btnAlignmentZ':{
                click: this.btnAlignmentZClick
            },

            //选择框按钮
            '#btnSelectBox':{
                click: this.btnSelectBoxClick
            },
            //复制按钮
            '#btnCopy':{
                click: this.btnCopyClick
            },
            //删除按钮
            '#btnDelete':{
                click: this.btnDeleteClick
            },
            //***************************
            //以下为属性面板控件
            '#structName':{
                change: this.structNameChange
            },
            '#structQuality':{
                change: this.structQualityChange
            },
            '#powerConsumption':{
                change: this.powerConsumptionChange
            },
            '#structPositionX':{
                change: this.positionChange
            },
            '#structPositionY':{
                change: this.positionChange
            },
            '#structPositionZ':{
                change: this.positionChange
            },
            '#structRotationX':{
                change: this.rotationChange
            },
            '#structRotationY':{
                change: this.rotationChange
            },
            '#structRotationZ':{
                change: this.rotationChange
            },
            '#structSizeX':{
                change: this.sizeChange
            },
            '#structSizeY':{
                change: this.sizeChange
            },
            '#structSizeZ':{
                change: this.sizeChange
            }
        });
    },
    //************************************
    //以下为按钮响应事件
    //“列表板”按钮
    btnListClick:function(){
        var basePosition = this.getModulepanel().getPosition();
        Struct.windowManage.openListWindow(basePosition[0],basePosition[1]);
    },
    //“属性板”按钮
    btnAdvancedPanelClick: function(){
        var basePosition = this.getModulepanel().getPosition();
        Struct.windowManage.openControlWindow(basePosition[0],basePosition[1]);
    },

    //“位移”按钮
    btnTranslateClick: function(){
        Struct.structManage.translateControl();
    },
    //“旋转”按钮
    btnRotateClick: function(){
        Struct.structManage.rotateControl();
    },
    //“缩放”按钮
    btnScaleClick: function(){
        Struct.structManage.scaleControl();
    },

    //“组合”按钮
    btnCombineClick:function(){
        Struct.structManage.combinaOperate();
    },
    //“分离”按钮
    btnSeparateClick:function(){
        Struct.structManage.breakOperate();
    },
    //“装配”按钮
    btnAssemblyClick:function(){
        Struct.structManage.assemblyReady();
    },

    //“X轴对齐”按钮
    btnAlignmentXClick: function(){
        this.getButtongrouppanel().queryById('StructAlign').menu.hide();
        Struct.structManage.alignmentX();
    },
    //“Y轴对齐”按钮
    btnAlignmentYClick: function(){
        this.getButtongrouppanel().queryById('StructAlign').menu.hide();
        Struct.structManage.alignmentY();
    },
    //“Z轴对齐”按钮
    btnAlignmentZClick: function(){
        this.getButtongrouppanel().queryById('StructAlign').menu.hide();
        Struct.structManage.alignmentZ();
    },

    //"选择框"按钮
    btnSelectBoxClick: function(){
        Struct.structManage.allUnselect();
        Struct.sceneManage.boxFlag = 0;
    },
    //“复制”按钮
    btnCopyClick:function(){
        Struct.structManage.structCopy();
    },
    //“删除”按钮
    btnDeleteClick:function(){
        Struct.structManage.selectDelete();
    },
    // -----------------------------------
    // 高级控制面板控件关联
    // -----------------------------------
    //组件名字改变
    structNameChange:function(){
        Struct.windowManage.structNameChange();
    },
    //组件质量改变
    structQualityChange:function(){
        Struct.windowManage.structQualityChange();
    },
    //组件功耗改变
    powerConsumptionChange:function(){
        Struct.windowManage.powerConsumptionChange();
    },
    //修正场景中物体位置
    positionChange: function(){
        Struct.windowManage.positionChange();
    },
    //修正场景中物体转向
    rotationChange: function(){
        Struct.windowManage.rotationChange();
    },
    //修正场景中物体缩放
    sizeChange: function(){
        Struct.windowManage.sizeChange();
    },
    // ---------------------------------------------------------------------------------------------------------
    //A template method like init, but called after the viewport is created. This is called after the launch method of Application is executed.
    onLaunch: function() {
//        //场景初始化
//        Struct.init(APC.STRUCTSCENE_HEIGHT, APC.STRUCTSCENE_WIDTH);
//
//        Struct.work('AppPlat.view.StructDesign');
//
//        //判断是否有预加载场景
//        var tname = sessionStorage.getItem(APC.PER_STRUCT_TEMPORARY_TASK_NAME);
//        if (tname != null) {
//            Struct.storageManage.initByJson(sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + tname +
//                "/" + tname + ".json");
//            sessionStorage.removeItem(APC.PER_STRUCT_TEMPORARY_TASK_NAME);
//            this.getStructurescenepanel().queryById('fileNameLbl').setText(tname);
//        }
//
//        //场景刷新
//        Struct.render();
    }
});