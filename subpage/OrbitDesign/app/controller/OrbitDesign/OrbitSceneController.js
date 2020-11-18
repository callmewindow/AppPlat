/**
 * Created by Administrator on 2014/8/22.
 */
Ext.define('OrbitDesignApp.controller.OrbitDesign.OrbitSceneController', {
    extend: 'Ext.app.Controller',
    models: [
    ],
    stores: [
        'SolutionTreeStore'
    ],
    views: [
        'SolutionTree',
        'OrbitDesignApp.view.OrbitDesign.VisibilityWindow'
    ],
    refs: [
        {
            ref: 'solutionTree',
            selector: 'solutiontree'
        },
        {
            ref: 'orbitFileGridPanel',
            selector: 'orbitfilegridpanel'
        },
        {
            ref: 'orbitScenePanel',
            selector: 'orbitscenepanel'
        },
        {
            ref: 'orbitOperationToolbar',
            selector: 'orbitoperationtoolbar'
        }
    ],
    orbitFileWindow: null,
    visibilityWindow: null,
    init: function (application) {
        var me = this;
        this.control({
            //保存轨道文件按钮
            '#btnSaveOrbitFile': {
                click: this.btnSaveOrbitFileClick
            },
            //打开轨道文件按钮
            '#btnOpenOrbitFile': {
                click: this.btnOpenOrbitFileClick
            },
            //打开文件列表中文件
            'orbitfilegridpanel': {
                itemdblclick: this.openOrbitTask
            },
            //导出场景文件
            '#btnExportOrbitFile': {
                click: this.exportOrbitFileClick
            },
//            '#btnVisibility':{
//                click:this.openVisibilityWindow
//            },
            '#VisibileCtrlButton': {
                click: this.openVisibilityWindow
            },
            //设置可见性的响应函数
            "orbitoperationtoolbar checkboxgroup[itemId=visibilityCheckboxGroup]": {
                change: this.onVisbilityChg
            }
//            //设置可见性的响应函数
//            "visibilitywindow checkboxgroup[itemId=visibilityCheckboxGroup]":{
//                change: this.onVisbilityChg
//            }
        });
    },

    //保存轨道文件
    btnSaveOrbitFileClick: function () {
        var me = this;
        var listTree = me.getSolutionTree();
        var rootNode = listTree.getRootNode();
        me.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
        if (rootNode == null) {
            Ext.MessageBox.alert('操作提示', '您还未添加或打开任务', function (btn) {
            });
            return;
        }
//        var fileName = me.getApplication().getController('TreeController').fileName;
        var fileName = rootNode.internalId;
        if (fileName != null) {
            ORBIT.saveManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, fileName);
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                var sateId = rootNode.childNodes[i].data.id;
                var sateName = rootNode.childNodes[i].data.name;
                ORBIT.saveManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, sateId, sateName);
            }
            ORBIT.saveManage.mergeTaskToDB(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, fileName, true);
            me.getApplication().getController('TreeController').isFileSaved = true;
        }
    },
    //导出场景文件
    exportOrbitFileClick: function () {
        if (ORBIT.fileName != null) {
            this.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
            var aLink = document.createElement('a');
            var data = ORBIT.saveManage.exportSceneData();
            var blob = new Blob([data]);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            aLink.download = ORBIT.fileName + '.txt';
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
        }
        else {
            Ext.MessageBox.alert('操作提示', '您还未添加或打开任务', function (btn) {
            });
        }
    },
    //打开轨道文件按钮响应
    btnOpenOrbitFileClick: function () {
        this.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();

        if (this.orbitFileWindow == null) {
            this.orbitFileWindow = Ext.create('OrbitDesignApp.view.OrbitDesign.OrbitFileWindow');
        }
        this.orbitFileWindow.queryById('orbitFileGridPanel').store.proxy.extraParams = {
            userId: sessionStorage.getItem("userId")
        };
        this.orbitFileWindow.queryById('orbitFileGridPanel').store.reload();
        this.orbitFileWindow.show();
    },
    //打开此任务
    openOrbitTask: function (grid, rowindex, e) {
        var record = grid.getSelectionModel().getSelection();
        var me = this;
        if (me.getSolutionTree().getRootNode() != null) {
            Ext.MessageBox.confirm('提示', '未保存的工作将会丢失，是否继续？', function (btn) {
                if (btn == 'yes') {
                    //修改视角
                    if (ORBIT.tracedTargetTpye == "Sate") {
                        HoverText.changeAngle();
                    }
                    me.openOrbitTaskRequest(record[0].data.perTaskId);
                }
            });
        }
        else {
            me.openOrbitTaskRequest(record[0].data.perTaskId);
        }
        this.orbitFileWindow.close();
        this.getSolutionTree().expand();
    },
    /***
     * 打开轨道设计任务，
     * @param record
     */
    openOrbitTaskRequest: function (perTaskId) {//打开，读取节点信息
        var me = this;
        if (perTaskId != 'undefined') {
            Ext.Ajax.request({
                url: APC.APPPLAT_SERVICE_URL_PREFIX + "TaskManage/getPersonalTaskRootNode.json",
                method: 'GET',
                params: {
                    perTaskId: perTaskId
                },
                success: function (response) {
                    if (response.responseText != null) {
                            var callbackJson = Ext.JSON.decode(response.responseText);
                            me.getSolutionTree().getStore('SolutionTreeStore').setRootNode({
                                id: callbackJson.id,
                                name: callbackJson.name,
                                leaf: callbackJson.leaf,
                                nodeType: callbackJson.nodeType,
                                parentId: callbackJson.parentId,
                                rootId: callbackJson.rootId,
                                isRoot: callbackJson.isRoot,
                                nodeOrder: callbackJson.nodeOrder,
                                dataId: callbackJson.dataId,
                                nodeFilePath: callbackJson.nodeFilePath,
                                iconCls: APC.NODETYPE_TASK
                            });

                        me.getApplication().getController('TreeController').fileName = callbackJson.name;
                        me.getApplication().getController('TreeController').isFileSaved = true;
                        var listTree = me.getSolutionTree();
                        var rootNode = listTree.getRootNode();
                        ORBIT.saveManage.sceneRead(sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + rootNode.internalId +
                            "/", rootNode.internalId);
                        ORBIT.fileName = name;
                    }
                    else {
                    }
                }
            });
        }
    },
//    openVisibilityWindow:function (component, e){
//       if(this.visibilityWindow == null){
//           this.visibilityWindow = Ext.create('OrbitDesignApp.view.OrbitDesign.VisibilityWindow');
//       }
//       if(ORBIT.planetaryTrackVisibility == true && ORBIT.planetaryCoordinatesVisibility == true){
//           this.visibilityWindow.queryById('visibilityCheckboxGroup').setValue({
//               planet: ['track', 'coordinates']
//           });
//       }
//       else if(ORBIT.planetaryTrackVisibility == true && ORBIT.planetaryCoordinatesVisibility == false){
//           this.visibilityWindow.queryById('visibilityCheckboxGroup').setValue({
//               planet: ['track']
//           });
//       }
//       else if(ORBIT.planetaryTrackVisibility == false && ORBIT.planetaryCoordinatesVisibility == true){
//           this.visibilityWindow.queryById('visibilityCheckboxGroup').setValue({
//               planet: [ 'coordinates']
//           });
//       }
//       this.visibilityWindow.show();
//    },
    openVisibilityWindow: function (component, e) {
        var visibility = [];
        if (ORBIT.planetaryTrackVisibility) {
            visibility[visibility.length] = 'track';
        }
        if (ORBIT.planetaryCoordinatesVisibility) {
            visibility[visibility.length] = 'coordinates';
        }
        if (ORBIT.earthTraceVisibility) {
            visibility[visibility.length] = 'trace';
        }
        if(ORBIT.sunWindVisibility){
            visibility[visibility.length] = 'wind';
        }
        this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').setValue({
            planet: visibility
        });
    },
    //设置行星轨迹及其坐标系可见性的响应函数
    onVisbilityChg: function (checkboxgroup, newValue, oldValue, eOpts) {
        var visiblity = {
            'track': false,
            'coordinates': false,
            'trace': false,
            'wind': false
        };
        if (newValue['planet'] != undefined) {
            if (newValue['planet'] == "track") {
                visiblity['track'] = true;
            }
            else if (newValue['planet'] == "coordinates") {
                visiblity['coordinates'] = true;
            }
            else if (newValue['planet'] == "trace") {
                visiblity['trace'] = true;
            }
            else if(newValue['planet'] == "wind"){
                visiblity['wind'] = true;
            }
            else {
                for (var i in newValue['planet']) {
                    if (newValue['planet'][i] == 'track') {
                        visiblity['track'] = true;
                    }
                    else if (newValue['planet'][i] == "coordinates") {
                        visiblity['coordinates'] = true;
                    }
                    else if (newValue['planet'][i] == "trace") {
                        visiblity['trace'] = true;
                    }
                    else if(newValue['planet'][i] == "wind"){
                        visiblity['wind'] = true;
                    }
                }
            }
        }
        if (visiblity['track']) {
            //添加行星轨迹
            this.addPlanetOrbit();
        }
        else {
            //隐藏行星轨迹
            ORBIT.planetaryTrackVisibility = false;
            removePlanetOrbit();
            HoverText.hideHoverText();
        }
        if (visiblity['coordinates']) {
            //添加坐标系
            ORBIT.planetaryCoordinatesVisibility = true;
            addPlanetAxes();
        }
        else {
            //隐藏坐标系
            ORBIT.planetaryCoordinatesVisibility = false;
            removePlanetAxes();
        }
        if (visiblity['trace'] || visiblity['wind']) {
            //如果当前视角不是地球
            if(ORBIT.tracedObject.id != "earth"){
                //切换到地球视角
                this.getOrbitOperationToolbar().queryById('planetCombo').setValue('angelEarth');
                //如果行星轨道为勾选状态，则显示轨道
                if(visiblity['track'] && !visiblity['wind']){
                    //添加行星轨迹
                    this.addPlanetOrbit();
                }
                //切换到磁场坐标系
                this.getOrbitOperationToolbar().queryById('earthAxesCombo').setValue('magnetic');
                ORBIT.zoom *= 20;
                if(visiblity['wind']){
                    ORBIT.zoom *= 2.5;
                }
            }
            else{
                //如果不是磁场坐标系
                if(ORBIT.states_View != "magnetic"){
                    //切换到磁场坐标系
                    this.getOrbitOperationToolbar().queryById('earthAxesCombo').setValue('magnetic');
                }
            }
            //添加地球磁场
            ORBIT.earthTraceVisibility = true;
            addTrace();
            if(visiblity['wind']){
                //取消行星轨迹和坐标系选中
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').setValue({
                    planet: ['trace', 'wind']
                });
                //将行星轨迹复选框disable
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryTrack').disable();
                //将坐标系复选框disable
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryCoordinates').disable();
                //将地球磁场复选框disable
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('earthTrace').disable();
                //隐藏真太阳
                ORBIT.scene.remove(ORBIT.planet["sun"].object);

                //添加太阳风
                ORBIT.sunWindVisibility = true;
                showParticleSunWind(ORBIT.planet["earth"].sunWind);
            }
            else{
                //将行星轨迹复选框enabl
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryTrack').enable();
                //将坐标系复选框enable
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryCoordinates').enable();
                //将地球磁场复选框enable
                this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('earthTrace').enable();
                //添加真太阳
                ORBIT.scene.add(ORBIT.planet["sun"].object);
                //隐藏太阳风
                ORBIT.sunWindVisibility = false;
                hideParticleSunWind(ORBIT.planet["earth"].sunWind);
            }
        }
        else {
            //隐藏地球磁场
            ORBIT.earthTraceVisibility = false;
            removeTrace();

            //将行星轨迹复选框enabl
            this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryTrack').enable();
            //将坐标系复选框enable
            this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('planetaryCoordinates').enable();
            //将地球磁场复选框enable
            this.getOrbitOperationToolbar().queryById('visibilityCheckboxGroup').queryById('earthTrace').enable();
            //添加真太阳
            ORBIT.scene.add(ORBIT.planet["sun"].object);
            //隐藏太阳风
            ORBIT.sunWindVisibility = false;
            hideParticleSunWind(ORBIT.planet["earth"].sunWind);
        }
        refreshCamera();
    },
    addPlanetOrbit: function(){
        //添加行星轨迹
        ORBIT.planetaryTrackVisibility = true;
        addPlanetOrbit();
        HoverText.showHoverText();
        if(ORBIT.tracedObject.id != "earth" && ORBIT.tracedObject.id != "moon"){
            HoverText.hideHoverTextById("moon");
        }
    }
});