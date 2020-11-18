/**
 * Created by winter on 2014/8/26.
 */
Ext.define('AppPlat.controller.SceneInitController', {
    extend: 'Ext.app.Controller',
    views: [
    ],
    models: ['SolutionTreeModel'],
    stores: ['SolutionTreeStore',
        'StructDesign.StorageStoreP'],
    refs: [
        {
            ref: 'solutionTree',
            selector: 'solutiontree'
        },
        {
            ref: 'outerCenterPanel',
            selector: 'outercenterpanel'
        },
        {
            ref: 'structDesignPanel',
            selector: 'structdesignpanel'
        },
        {
            ref: 'orbitDesignPanel',
            selector: 'orbitdesignpanel'
        },
        {
            ref: 'buttonGroupPanel',
            selector: 'buttongrouppanel'
        },
        {
            ref: 'orbitScenePanel',
            selector: 'orbitscenepanel'
        },
        {
            ref: 'WorkTabPanel',
            selector: 'worktabpanel'
        },
        {
            ref: 'modulepanel',
            selector: 'modulepanel'
        }
    ],
    orbitDesignPanel: null,
    structDesignPanel: null,
    chainAnalysisPanel: null,
    dataTransAnalysisPanel: null,
    nodeViewArray: new Array(),
    scenePerspective: null,
    sceneJsonData: null,
    panelType:APC.PANEL_TYPE_ORBIT_DESIGN,
    init: function (application) {
        var me = this;
        this.control({
            'structdesignpanel': {
                afterrender: me.afterRenderStructureScenePanel,
                resize: me.resizePanel
            },
            'orbitscenepanel': {
                afterrender: me.afterRenderOrbitScenePanel
            },
            'solutiontree': {
                itemclick: me.changeScene,
                itemdblclick: me.handleItemDblClick
            }
        });
    },
    onLaunch: function (application) {
        var me = this;
        if (me.orbitDesignPanel == null) {
            me.orbitDesignPanel = Ext.create('AppPlat.view.OrbitDesign.OrbitDesignPanel');
            me.getOuterCenterPanel().add(me.orbitDesignPanel);
        }
    },
    afterRenderStructureScenePanel: function (panel, eOpts) {
        //场景初始化
        Struct.init(APC.STRUCTSCENE_HEIGHT, APC.STRUCTSCENE_WIDTH, 'structDesignC');
        Struct.work('AppPlat.view.StructDesign', this.getButtonGroupPanel());
        Struct.cooperationManage.startWebSocket();
        //场景刷新
        Struct.render();
        //设置面板位置
        Struct.sceneManage.sceneMap.changePosition(760, 630);
        Struct.windowManage.cwPoint.x = 590;
        Struct.windowManage.cwPoint.y = 85;
        Struct.windowManage.lwPoint.x = 160;
        Struct.windowManage.lwPoint.y = 85;
    },
    afterRenderOrbitScenePanel: function (panel, eOpts) {
        var me = this;
        ORBIT.simuTime_Field = this.getButtonGroupPanel().queryById('simutime');
        initSimuTime();
        initRender(panel.body.getWidth(), panel.body.getHeight(), panel);
        initScene();
        initLight();
        initObject();
        initCamera(panel.body.getWidth(), panel.body.getHeight());
//        initSkyBox();
        initMouseWheel();
        initDrag();
        initRithtMouse();
        resetScene();
        HoverText.createHovertextForPlanet();
        HoverText.hideHoverTextById("moon");
        HoverText.initBigSunDiv();
        //建立Websocket连接
        ORBIT.cooperation.startWebSocket();
    },
    resizePanel: function (panel, eOpts) {
        var x = this.getModulepanel().getPosition();
        var y = this.getModulepanel().getHeight();
        Struct.sceneManage.sceneMap.changePosition(x[0] - 103, x[1] + y - 103);
    },
    //选中卫星（显示其特征点）
    changeSelectSate: function (type, sid) {
        if (type == APC.NODETYPE_SATELLITE) {
//            ORBIT.isSelectSat = true;
//            ORBIT.selectOrbit = sid;
//            hideCharacter();
//            ORBIT.Orbit.resetOrbitColor();
//            showCharacter(sid);
//            ORBTI.orbit[sid].setOrbitColor('#ff7e00');
//            ORBIT.planetaryTrackVisibility = false;
//            removePlanetOrbit();//隐藏行星轨迹
//            HoverText.hideHoverText();//隐藏行星文字
//            ORBIT.sunDiv.style.display = "none";//隐藏太阳图标div
            //修改行星视角控件中的值
//            var cid = ORBIT.satellite[sid].centerid;
//            var pid = 'angel' + cid.charAt(0).toUpperCase() + cid.substring(1);
//            this.getButtonGroupPanel().queryById('planetCombo').setValue(null);
//            this.getButtonGroupPanel().queryById('planetCombo').setValue(pid);
            //选中卫星（包括设置其轨道颜色，显示其特征点以及右下角显示卫星参数）
            selectSat(sid);
        }
        else {
//            ORBIT.isSelectSat = false;
//            ORBIT.selectOrbit = null;
//            hideCharacter();
//            ORBIT.Orbit.resetOrbitColor();
//            HoverText.hideSatellitePara();
//            refreshCamera();
            cancleSelectSat();
        }
    },
    //将视角切换到选中卫星
    changeSatAngle: function(){
        ORBIT.sunDiv.style.display = "none";
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0];
        if(selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                var sid = selectedList.get('name');
                //切到卫星视角
                ORBIT.thetaMove_satellite = 0;
                ORBIT.alphaMove_satellite = 0;
                ORBIT.trace = true;
                ORBIT.zoom = ORBIT.v_minzoom * 2;
                ORBIT.tracedObject = ORBIT.satellite[sid].object;
                ORBIT.tracedTarget = ORBIT.satellite[sid];
                ORBIT.tracedTargetTpye = 'Sate';
                ORBIT.states_View = "inertial";
//                removeTail();
                OrbitTail.removeTail();
                refreshObject();
                refreshCamera();
                me.getButtonGroupPanel().queryById('planetCombo').setValue('noPlanet');
                me.getButtonGroupPanel().queryById('planetAxesCombo').setValue('noAxes');
                me.getButtonGroupPanel().queryById('earthAxesCombo').setValue('noAxes');
                me.getButtonGroupPanel().queryById('otherAxesCombo').setValue('noAxes');
            }
        }
    },
    //双击方案书中卫星节点事件
    handleItemDblClick: function( node, record, item, index, e, eOpts){
        if(record.get('nodeType') == APC.NODETYPE_SATELLITE){
            this.changeScene(node, record, item, index, e, eOpts);
            this.changeSatAngle();//将视角切换到该卫星视角
        }
        var listTree = this.getSolutionTree();
        var cellEditingPlugin = listTree.cellEditingPlugin;
        cellEditingPlugin.cancelEdit();//注销双击之后的编辑效果
    },
    changeScene: function (view, record, item, index, e, eOpts) {
        //释放组件锁
        if (Struct.structures != null) {
            for (var i = 0; i < Struct.structures.length; i++) {
                if (Struct.structures[i].selectFlag){
                    Struct.structures[i].unselect();
                    Struct.cooperationManage.sendInfo("LockControl", Struct.structures[i].id, false);
                }
            }
            if (this.scenePerspective != null) {
                this.scenePerspective.position.x = Struct.camera.position.x;
                this.scenePerspective.position.y = Struct.camera.position.y;
                this.scenePerspective.position.z = Struct.camera.position.z;
                this.scenePerspective.rotation.x = Struct.camera.rotation.x;
                this.scenePerspective.rotation.y = Struct.camera.rotation.y;
                this.scenePerspective.rotation.z = Struct.camera.rotation.z;
            }
        }
//        if (ORBIT.cooperation.solutionId != null){
//            this.scenePerspective.position.x = ORBIT.camera.position.x;
//            this.scenePerspective.position.y = ORBIT.camera.position.y;
//            this.scenePerspective.position.z = ORBIT.camera.position.z;
//            this.scenePerspective.rotation.x = ORBIT.camera.rotation.x;
//            this.scenePerspective.rotation.y = ORBIT.camera.rotation.y;
//            this.scenePerspective.rotation.z = ORBIT.camera.rotation.z;
//        }
        var me = this;
        var treeController = me.getController('AppPlat.controller.TreeController');
        var userId = sessionStorage.getItem('userId');
        var nodeId = record.get('id');
        if (record.get('nodeType') == APC.NODETYPE_SATELLITE||record.get('nodeType') == APC.NODETYPE_SOLUTION) {
            this.panelType = APC.PANEL_TYPE_ORBIT_DESIGN;
            if(record.get('nodeType') == APC.NODETYPE_SATELLITE){
                nodeId = record.parentNode.get('id');
            }
            if(nodeId != ORBIT.lastSelectNodeId){
                ORBIT.Satellite.unlockSelect();//离开轨道场景之前释放所有锁
                //离开场景时通ButtonGroupPanel中按钮改变
                treeController.concreteSubjectButton.nodeType = APC.PANEL_TYPE_ORBIT_DESIGN;
                treeController.concreteSubjectButton.notify();
                me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('sun');
            }
            me.changeToSatelliteScene(view, record, nodeId, userId);
        }
        else if (record.get('nodeType') == APC.NODETYPE_STRUCTURE) {
            this.panelType = APC.PANEL_TYPE_STRUCT_DESIGN;
            ORBIT.Satellite.unlockSelect();//离开轨道场景之前释放所有锁
            treeController.concreteSubjectButton.nodeType = APC.PANEL_TYPE_STRUCT_DESIGN;
            treeController.concreteSubjectButton.notify();
            me.changeToStructScene(view, record, nodeId, userId);
        }
        else if (record.get('nodeType') == APC.NODETYPE_COVER_ANALYSIS) {
            this.panelType = APC.PANEL_TYPE_COVER_ANALYSIS;
            ORBIT.Satellite.unlockSelect();//离开轨道场景之前释放所有锁
            treeController.concreteSubjectButton.nodeType = APC.PANEL_TYPE_COVER_ANALYSIS;
            treeController.concreteSubjectButton.notify();
            if (me.dataTransAnalysisPanel == null) {
                me.dataTransAnalysisPanel = Ext.create('AppPlat.view.DataTransAnalysis.DataTransAnalysisPanel');
                me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
            }
            me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(record.parentNode);
            me.hideOtherPanel();
            me.dataTransAnalysisPanel.show();
        }
        else if (record.get('nodeType') == APC.NODETYPE_DATATRANS_ANALYSIS) {
            this.panelType = APC.PANEL_TYPE_DATA_TRANS_ANALYSIS;
            ORBIT.Satellite.unlockSelect();//离开轨道场景之前释放所有锁
            treeController.concreteSubjectButton.nodeType = APC.PANEL_TYPE_DATA_TRANS_ANALYSIS;
            treeController.concreteSubjectButton.notify();
            if (me.chainAnalysisPanel == null) {
                me.chainAnalysisPanel = Ext.create('AppPlat.view.DataTransAnalysis.ChainAnalysisPanel');
                me.getOuterCenterPanel().add(me.chainAnalysisPanel);
            }
            me.getController('AppPlat.controller.DataTransAnalysis.DataTransController').handleOverStationAnalysisClick();
            me.hideOtherPanel();
            me.chainAnalysisPanel.show();
        }
        else if (record.get('nodeType') == APC.NODETYPE_CHAIN_ANALYSIS) {
            this.panelType = APC.PANEL_TYPE_DATA_TRANS_ANALYSIS;//
            ORBIT.Satellite.unlockSelect();//离开轨道场景之前释放所有锁
            treeController.concreteSubjectButton.nodeType = APC.PANEL_TYPE_DATA_TRANS_ANALYSIS;
            treeController.concreteSubjectButton.notify();
            if (me.chainAnalysisPanel == null) {
                me.chainAnalysisPanel = Ext.create('AppPlat.view.DataTransAnalysis.ChainAnalysisPanel');
                me.getOuterCenterPanel().add(me.chainAnalysisPanel);
            }
            me.hideOtherPanel();
            me.chainAnalysisPanel.show();
            var parentPath = record.get('nodeFilePath');
            var fileName = record.get('id')+'.json';
            me.getController('AppPlat.controller.DataTransAnalysis.DataTransController').getChainAnalysisData(parentPath,fileName);
        }
        ORBIT.lastSelectNodeId = nodeId;
    },

    changeToStructScene: function (view, record, nodeId, userId) {
        var me = this;
        me.orbitDesignPanel.hide();
        if (me.structDesignPanel == null) {
            me.structDesignPanel = Ext.create('AppPlat.view.StructDesign.StructDesignPanel');
            me.getOuterCenterPanel().add(me.structDesignPanel);
        }
        else {
            Struct.structManage.deleteAll(false);
            Struct.sceneManage.initView();
        }
        var taskId = record.get('rootId');
        nodeId = record.get('id');
        var solutionId = record.parentNode.parentNode.get('id');
        var nodeView = me.getNodeViewFromArray(taskId, solutionId, nodeId);
        var satellite = record.parentNode.get('id');
        Struct.cooperationManage.taskId = taskId;//记录当前场景taskId
        Struct.cooperationManage.solutionId = solutionId;//记录当前场景solutionId
        Struct.cooperationManage.satelliteId = satellite;
        Struct.cooperationManage.nodeId = nodeId;//记录当前场景nodeid
        //将场景数据保存在sceneJsonData全局变量中
        me.initStructSceneDataFromServer(userId, taskId, solutionId, nodeId, APC.TOOL_TYPE_STRUCT_DESIGN);
        if (nodeView != null) {//说明该节点已经被打开过，且在nodeViewArray数组中有记录
            //将场景的视角数据存在scenePerspectiveData变量中
            me.scenePerspective = nodeView.getScenePerspective();
            Struct.sceneManage.updateView(me.scenePerspective.position, me.scenePerspective.rotation);
        } else {//说明该节点在nodeViewArray数组中没有记录，插入记录，并且新建视角数据
            var nodeView = new NodeView();
            nodeView.setNodeId(nodeId);
            nodeView.setTaskId(taskId);
            nodeView.setSolutionId(solutionId);
            nodeView.setToolType(APC.STRUCT_DESIGN);
            nodeView.setScenePerspective(new StructScenePerspective());
            me.nodeViewArray.push(nodeView);
            me.scenePerspective = nodeView.getScenePerspective();
        }
        if (me.orbitDesignPanel != null) {
            me.orbitDesignPanel.hide();
        }
        me.structDesignPanel.show();
    },

    changeToSatelliteScene: function (view, record, nodeId, userId) {
        var me = this;
        if (me.orbitDesignPanel == null) {
            me.orbitDesignPanel = Ext.create('AppPlat.view.OrbitDesign.OrbitDesignPanel');
            me.getOuterCenterPanel().add(me.orbitDesignPanel);
        }
        var taskId = record.get('rootId');
        var solutionId = record.get('id');
        var type = record.get('nodeType');
        var sid = record.get('name');
        var solutionName = record.get('name');
        if (type == APC.NODETYPE_SATELLITE) {
            solutionId = record.parentNode.get('id');
            solutionName = record.parentNode.get('name');
        }
        var lastSolution = ORBIT.cooperation.solutionId;
        ORBIT.cooperation.taskId = taskId;//记录当前场景taskId
        ORBIT.cooperation.solutionId = solutionId;//记录当前场景solutionId
        ORBIT.cooperation.nodeId = nodeId;//记录当前场景nodeid
        if (nodeId == ORBIT.lastSelectNodeId) {
            if (type == APC.NODETYPE_SATELLITE){
                this.updateAngleCombo(sid, false);
            }
            this.changeSelectSate(type, sid);//设置选中卫星（显示其特征点，并将其轨道变色）
        }
        else {
            ORBIT.fileName = solutionName;
            me.initStructSceneDataFromServer(userId, taskId, solutionId, nodeId, APC.TOOL_TYPE_ORBIT_DESIGN, sid, type);
        }

//        if (lastSolution != ORBIT.cooperation.solutionId) {
//            var nodeView = me.getNodeViewFromArray(taskId, solutionId);
//            if (nodeView != null) {//说明该节点已经被打开过，且在nodeViewArray数组中有记录
//                //将场景的视角数据存在scenePerspectiveData变量中
//                me.scenePerspective = nodeView.getScenePerspective();
////                ORBIT.camera.position.set(me.scenePerspective.position.x, me.scenePerspective.position.y, me.scenePerspective.position.z);
////                ORBIT.camera.rotation.set(me.scenePerspective.rotation.x, me.scenePerspective.rotation.y, me.scenePerspective.rotation.z);
//                ORBIT.camera.position.set(0, 0, 0);
//                ORBIT.camera.rotation.set(0, 0, 0);
//                ORBIT.renderer.clear();
//                ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
//                console.log(ORBIT.camera.position);
//            } else {//说明该节点在nodeViewArray数组中没有记录，插入记录，并且新建视角数据
//                var nodeView = new NodeView();
//                nodeView.setTaskId(taskId);
//                nodeView.setSolutionId(solutionId);
//                nodeView.setToolType(APC.ORBIT_DESIGN);
//                nodeView.setScenePerspective(new OrbitScenePerspective());
//                me.nodeViewArray.push(nodeView);
//                me.scenePerspective = nodeView.getScenePerspective();
//            }
//        }
        me.hideOtherPanel();
        me.orbitDesignPanel.show();
    },

    hideOtherPanel: function () {
        if (this.structDesignPanel != null) {
            this.structDesignPanel.hide();
        }
        if (this.orbitDesignPanel != null) {
            this.orbitDesignPanel.hide();
        }
        if (this.chainAnalysisPanel != null) {
            this.chainAnalysisPanel.hide();
        }
        if (this.dataTransAnalysisPanel != null) {
            this.dataTransAnalysisPanel.hide();
        }
    },

    getNodeViewFromArray: function (taskId, solutionId, nodeId) {
        if (this.nodeViewArray == null || this.nodeViewArray.length == 0) {
            return null;
        } else {
            for (var i = 0; i < this.nodeViewArray.length; i++) {
                if (this.nodeViewArray[i].getTaskId() == taskId && this.nodeViewArray[i].getSolutionId() == solutionId
                    && (nodeId == null || this.nodeViewArray[i].getNodeId() == nodeId)) {
                    return this.nodeViewArray[i];
                }
            }
            return null;
        }
    },
    //修改视角下拉框
    updateAngleCombo: function(sid, flag){
        var cid, pid;
        if(flag){//切换场景的情况下需要先将视角下拉框设空
            this.getButtonGroupPanel().queryById('planetCombo').setValue(null);
        }
        if(sid != null){
            cid = ORBIT.satellite[sid].centerid;
        }
        else{//如果进入方案没有卫星，则切回太阳视角
            cid = "sun";
        }
        pid = 'angel' + cid.charAt(0).toUpperCase() + cid.substring(1);
        this.getButtonGroupPanel().queryById('planetCombo').setValue(pid);
        if(sid == null){//如果进入方案没有卫星，则将视角切换到初始视角
            resetZoom();
            refreshCamera();
            HoverText.initBigSunDiv();
        }
    },
    initStructSceneDataFromServer: function (userId, taskId, solutionId, nodeId, toolType, sid, nodeType) {
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CollaDesignManage/getCachedSceneData",
            method: 'GET',
            params: {
                userId: userId,
                taskId: taskId,
                solutionId: solutionId,
                nodeId: nodeId,
                toolType: toolType
            },
            async: false,
            success: function (response) {
                //var jsonResult = Ext.JSON.decode(response.responseText);
                var jsonResult = JSON.parse(response.responseText);

                if (toolType == APC.TOOL_TYPE_STRUCT_DESIGN) {
                    Struct.storageManage.reRenderSceneByData(jsonResult);
                    Ext.Ajax.request({
                        url: APC.APPPLAT_SERVICE_URL_PREFIX + "CollaDesignManage/getLockIdList",
                        method: 'GET',
                        async: false,
                        params: {
                            taskId: taskId,
                            solutionId: solutionId,
                            nodeId: nodeId
                        },
                        success: function (response) {
                            Struct.storageManage.initLockState(response.responseText);
                        },
                        failure: function () {
                        }
                    });
                }
                else if (toolType == APC.TOOL_TYPE_ORBIT_DESIGN) {
                    ORBIT.saveManage.refreshScene(jsonResult);
                    Ext.Ajax.request({
                        url: APC.APPPLAT_SERVICE_URL_PREFIX + "CollaDesignManage/getLockIdList",
                        method: 'GET',
                        async: false,
                        params: {
                            taskId: taskId,
                            solutionId: solutionId,
                            nodeId: nodeId
                        },
                        success: function (response) {
                            ORBIT.Satellite.initLockList(response.responseText);
                            if(nodeType == APC.NODETYPE_SATELLITE){
                                me.updateAngleCombo(sid, true);
                            }
                            else{
                                sid = null;
                                for(var i in ORBIT.satellite){
                                    sid = ORBIT.satellite[i].object.id;
                                    break;
                                }
                                me.updateAngleCombo(sid, true);
                            }
                            me.changeSelectSate(nodeType, sid);
                        },
                        failure: function () {
                        }
                    });
                }
            },
            failure: function () {
            }
        });
    }
});