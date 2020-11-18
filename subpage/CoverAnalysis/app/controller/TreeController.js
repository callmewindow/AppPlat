Ext.define('CoverAnalysisApp.controller.TreeController', {
    extend: 'Ext.app.Controller',
    views: [
        'SolutionTree',
        'ButtonGroupPanel',
        'ContextMenu',
        'Window.CoverAnalysisFileInfoWindow',
        'Window.SatelliteInfoWindow',
        'Window.AntennaInfoWindow',
        'Window.CoverAnalysisTaskWindow',
        'Window.CoverAnalysisTskGridPanel',
        'Window.GroundStationInfoWindow',
        'Window.SelectGroundStationInfoWindow',
        'Window.SkyPointWindow',
        'Window.SkyRegionWindow',
        'Window.SensorWindow'
    ],
    id:'TreeController',
    models: ['SolutionTreeModel'],
    stores: ['SolutionTreeStore'],
    refs: [
        {
            ref: 'schedulerView',
            selector: 'schedulerview'
        },
        {
            ref: 'solutionTree',
            selector: 'solutiontree'
        },
        {
            ref: 'outerCenterPanel',
            selector: 'outercenterpanel'
        },
        {
            ref: 'buttonGroupPanel',
            selector: 'buttongrouppanel'
        },
        {
            ref: 'dataTransAnalysisPanel',
            selector: 'datatransanalysispanel'
        },
        {
            ref: 'contextMenu',
            selector: 'contextmenu',
            xtype: 'contextmenu',
            autoCreate: true
        }
    ],
    newNodeName: null,
    isFileSaved: false,//标识值，标识当前打开的轨道文件是否被保存
    coverAnalysisFileInfoWindow: null,
    satelliteInfoWindow: null,
    antennaInfoWindow: null,
    groundStationInfoWindow: null,
    selectGroundStationInfoWindow: null,
    skyPointWindow: null,
    skyRegionWindow: null,
    sensorWindow: null,
    concreteSubject: null,
    dataTransAnalysisPanel: null,
    taskNumber: 1,
    satelliteNumber: 1,
    groundstationNumber: 1,
    headerTableName: null,
    taskNameArray: new Array(),
    rclick_obj:null,
    isInit:true,
    div_meng: null,
    font_meng: null,
    stree_availiable:true,//true:方案树可以使用；false:不可以使用
    init: function (application) {
        var me = this;
        this.control({
            '#btnBackNavigation': {
                click: me.btnBackNavigationClick
            },
            '#btnMax': {
                click: me.OnPostCommandMax
            },
            '#btnRestore': {
                click: me.OnPostCommandRestore
            },
            '#btnNewCovAnaFile': {
                click: me.handleNewCovAnaFileClick
            },
            '#btnSaveCovAnaFile':{
                click:me.handleSaveCovAnaFile
            },
            '#btnAddSatellite': {
                click: me.handleAddSatelliteClick
            },
            '#btnAddGroundStation': {
                click: me.handleAddGroundStationClick
            },
            '#btnPointCoverage':{
                click: me.handleAddGroundStationClick
            },
            '#btnCoverAnalysis': {
                click: me.handleSureSelect
                //click: me.handleOverStationAnalysis
            },
            '#btnDelSatellite': {
                click: me.handleDeleteClick
            },
            //为下拉按钮定义事件
            '#addDataTransAnalysisFileItem': {
                click: me.handleNewCovAnaFileClick
            },
            '#addSatelliteItem': {
                click: me.handleAddSatelliteClick
            },
            '#addSkyReginItem': {
                click: me.handleAddSkyReginItemClick
            },
            '#addSkyPointItem': {
                click: me.handleAddSkyPointItemClick
            },
            '#addGroundStationItem': {
                click: me.handleAddGroundStationClick
            },
            '#addSensorItem': {
                click: me.handleAddSensorClick
            },
            '#fixAttr': {
                click: me.handleFixAttr
            },
            '#fixDelete': {
                click: me.handleDeleteClick
            },
            '#fixRename': {
                click: me.handleRenameClick
            },
            'solutiontree': {
                edit: me.updateList,
                validateedit:me.validateEdit,
                itemcontextmenu: me.handleIemRightClicked,
                containercontextmenu: me.handleContainerRightClicked,
//                beforeitemexpand: me.expandNode,
                select: me.handleItemSelected,
                containerclick: me.handleContainerClick,
                beforecelldblclick: me.cancelCelldblclick
            },
            'coveranalysisfileinfowindow button[itemId=btnSureNewCovAnaFile]': {
                click: me.handleSureNewCovAnaFileClick
            },
            'satelliteinfowindow button[itemId=btnSureAddSatellite]': {
                click: me.handleSureAddSatelliteClick
            },
            'groundstationinfowindow button[itemId=btnSureNewGroundStation]': {
                click: me.handleSureAddGroundStationClick
            },
            'skypointwindow button[itemId=btnSureFixSkyPoint]' :{
                click: me.handleSureFixSkyPointClick
            },
            'skyregionwindow button[itemId=btnSureFixSkyRegion]' :{
                click: me.handleSureFixSkyRegionClick
            },
            'sensorwindow button[itemId=btnSureFixSensor]' :{
                click: me.handlebtnSureFixSensorClick
            },
            'selectgroundstationinfowindow button[itemId=btnSureSelect]': {
                click: me.handleOverStationAnalysis
            },
            'selectgroundstationinfowindow combobox[itemId=param_sg]': {
                change: me.handleSelectChanged
            },
            "#attitudeType": {
                change: me.onAttitudeTypeChg
            },
            '#btnOpenCovAnaFile': {//打开任务面板
                click: me.openCoverAnalysisTaskList
            },
            'coveranalysistaskgridpanel': {//打开某个任务
                itemdblclick: me.openCoverAnalysisTask
            },
            '#btnPartAreas':{
                click:me.handleAddSkyPointItemClick
            },
            '#btnAllAreas':{
                click:me.handleAddSkyReginItemClick
            },
            '#btnAddSensor':{
                click: me.handleAddSensorClick
            }
        });
    },
    onLaunch: function (application) {
        this.concreteSubjectButton = new ConcreteSubject();
        this.registereButtonListeners();
        this.registereMenuButtonListeners();
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CoverAnalysisManage/getTaskNameByUserId.json",
            method: 'GET',
            params: {
                userId: sessionStorage.getItem("userId")
            },
            callback: function (options, success, response) {
                var jsonResult;
                if (response.responseText != null && response.responseText != "") {
                    jsonResult = Ext.JSON.decode(response.responseText);
                } else {
                    jsonResult = response.responseText;
                }
                for (i = 0; i < jsonResult.length; i++) {
                    me.taskNameArray.push(jsonResult[i].perTaskName);
                }

                if(sessionStorage.getItem( APC.SELECTED_TASK_ID) != 'null'){
                    me.openTask(sessionStorage.getItem( APC.SELECTED_TASK_ID));
                }else{
                    me.showPanel();
                }
            }
        });
    },
    openTask: function(perTaskId){
        var me = this;
        Ext.Ajax.request({
              url: APC.APPPLAT_SERVICE_URL_PREFIX + "CoverAnalysisManage/getTaskTree.json",
              method: 'GET',
              params: {
                    perTaskId:perTaskId
              },
              success: function (response) {
                    me.fillData(response.responseText);
                    me.showDataOnRightPanelAfterFillPanle(me);
                    me.getSolutionTree().expandAll();
              }
        });
        sessionStorage.removeItem(APC.SELECTED_TASK_ID);
    },
    addButtonObserversToSubject: function (buttonAndTypeArray) {
        for (i = 0; i < buttonAndTypeArray.length; i++) {
            var concreateObserver = new ButtonObserver();
            concreateObserver.visibleTypeList = buttonAndTypeArray[i].typeList;
            concreateObserver.button = buttonAndTypeArray[i].button;
            concreateObserver.concreteSubject = this.concreteSubjectButton;
            this.concreteSubjectButton.addObserver(concreateObserver);
        }
    },
    addMenuButtonObserversToSubject: function (buttonAndTypeArray) {
        for (i = 0; i < buttonAndTypeArray.length; i++) {
            var concreateObserver = new MenuObserver();
            concreateObserver.visibleTypeList = buttonAndTypeArray[i].typeList;
            concreateObserver.menuButton = buttonAndTypeArray[i].button;
            concreateObserver.concreteSubject = this.concreteSubjectButton;
            this.concreteSubjectButton.addObserver(concreateObserver);
        }
    },
    registereButtonListeners: function () {
        var me = this;
        var i = 0;
        var buttonAndTypeArray = new Array();
        var btnAddSatellite = me.getButtonGroupPanel().queryById('btnAddSatellite');
        buttonAndTypeArray[i++] = new BtnAndType(btnAddSatellite, [APC.NODETYPE_TASK]);
        var btnPointCoverage = me.getButtonGroupPanel().queryById('btnPointCoverage');
        buttonAndTypeArray[i++] = new BtnAndType(btnPointCoverage, [APC.NODETYPE_TASK]);
        var btnPartAreas = me.getButtonGroupPanel().queryById('btnPartAreas');
        buttonAndTypeArray[i++] = new BtnAndType(btnPartAreas, [APC.NODETYPE_TASK]);
        var btnAllAreas = me.getButtonGroupPanel().queryById('btnAllAreas');
        buttonAndTypeArray[i++] = new BtnAndType(btnAllAreas, [APC.NODETYPE_TASK]);
        me.addButtonObserversToSubject(buttonAndTypeArray);

        var nbuttonAndTypeArray = new Array();
        i = 0;
        var btnAddSensor = me.getButtonGroupPanel().queryById('btnAddSensor');
        nbuttonAndTypeArray[i++] = new BtnAndType(btnAddSensor, [APC.NODETYPE_SATELLITE]);
        me.addButtonObserversToSubject(nbuttonAndTypeArray);

    },
    registereMenuButtonListeners: function () {
        var me = this;
        var i = 0;
        var buttonAndTypeArray = new Array();
        var addDataTransAnalysisFileItem = me.getContextMenu().queryById('addDataTransAnalysisFileItem');
        buttonAndTypeArray[i++] = new BtnAndType(addDataTransAnalysisFileItem, [APC.NODETYPE_NO_ROOT]);
        var addSatelliteItem = me.getContextMenu().queryById('addSatelliteItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSatelliteItem, [APC.NODETYPE_TASK]);
        var addGroundStationItem = me.getContextMenu().queryById('addGroundStationItem');
        buttonAndTypeArray[i++] = new BtnAndType(addGroundStationItem, [APC.NODETYPE_TASK]);
        var addSkyPointItem = me.getContextMenu().queryById('addSkyPointItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyPointItem, [APC.NODETYPE_TASK]);
        var addSkyReginItem = me.getContextMenu().queryById('addSkyReginItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyReginItem, [APC.NODETYPE_TASK]);
        var addSensorItem = me.getContextMenu().queryById('addSensorItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSensorItem, [APC.NODETYPE_SATELLITE]);
        var fixAttr = me.getContextMenu().queryById('fixAttr');
        buttonAndTypeArray[i++] = new BtnAndType(fixAttr, [APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE, APC.NODETYPE_SKY_COVER_REGIN, APC.NODETYPE_SKY_COVER_POINT, APC.NODETYPE_SENSOR]);
        var fixRename = me.getContextMenu().queryById('fixRename');
        buttonAndTypeArray[i++] = new BtnAndType(fixRename, [APC.NODETYPE_TASK,APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE, APC.NODETYPE_SKY_COVER_REGIN, APC.NODETYPE_SKY_COVER_POINT, APC.NODETYPE_SENSOR]);
        var fixDelete = me.getContextMenu().queryById('fixDelete');
        buttonAndTypeArray[i++] = new BtnAndType(fixDelete, [APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE, APC.NODETYPE_SKY_COVER_REGIN, APC.NODETYPE_SKY_COVER_POINT, APC.NODETYPE_SENSOR]);
        me.addMenuButtonObserversToSubject(buttonAndTypeArray);
    },
    btnBackNavigationClick: function () {
//        this.getButtonGroupPanel().queryById('OrbitMenu').menu.hide();
        window.location.href = "../../subpage/Navigation/Navigation.html";
    },
    OnPostCommandMax: function () {
        this.getButtonGroupPanel().queryById('OrbitObservation').menu.hide();
        if (window.parent != window) {
            var data = {
                "command": "max"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
        }
    },
    OnPostCommandRestore: function () {
        this.getButtonGroupPanel().queryById('OrbitObservation').menu.hide();
        if (window.parent != window) {
            var data = {
                "command": "restore"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
        }
    },
    /**
     * 处理树状视图右击事件
     */
    handleContainerRightClicked: function (component, e, eOpts) {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
        this.concreteSubjectButton.nodeType = APC.NODETYPE_NO_ROOT;
        this.concreteSubjectButton.notify();
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    /**
     * 处理树状结构节点右击节点
     */
    handleIemRightClicked: function (view, list, node, rowIndex, e, contextMenu) {
        if(this.rclick_obj == null){
            this.rclick_obj = new Object();
        }
        this.rclick_obj.rcitem = list;
        if(rowIndex == 0){
            this.rclick_obj.index = 0;
            this.rclick_obj.type = "task";
        }
        else{
            for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
                if(AnalysisManagement.gsData[i].name == list.data.name){
                    this.rclick_obj.index = i;
                    this.rclick_obj.type = AnalysisManagement.gsData[i].type;
                    break;
                }
            }
        }

        this.getContextMenu().setList(list);
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    handleFixAttr:function(component, e){
        if(this.stree_availiable){
            if(this.rclick_obj.type == "task"){
                //修改任务面板
                if(this.coverAnalysisFileInfoWindow == null){
                    this.coverAnalysisFileInfoWindow = Ext.create('CoverAnalysisApp.view.Window.CoverAnalysisFileInfoWindow');
                }
                this.coverAnalysisFileInfoWindow.show();
                this.coverAnalysisFileInfoWindow.autoDestroy = false;
                this.coverAnalysisFileInfoWindow.queryById("covAnaFileName").setText(AnalysisManagement.gsData[0].task);
                this.coverAnalysisFileInfoWindow.queryById("startSimuTime").setValue(AnalysisParameter.t_start);
                this.coverAnalysisFileInfoWindow.queryById("stopSimuTime").setValue( AnalysisParameter.t_stop);
                this.coverAnalysisFileInfoWindow.queryById("stepLength").setValue( AnalysisManagement.gsData[0].hb);
            }
            else if(this.rclick_obj.type == "satellite"){
                if(this.satelliteInfoWindow == null){
                    this.satelliteInfoWindow = Ext.create('CoverAnalysisApp.view.Window.SatelliteInfoWindow');
                }
                this.satelliteInfoWindow.show();
                var obj = AnalysisManagement.gsData[this.rclick_obj.index];
                this.satelliteInfoWindow.queryById("satelliteFileName").setText(obj.name);
                this.satelliteInfoWindow.queryById("starcombo").setValue(obj.starcombo);
                this.satelliteInfoWindow.queryById("StartSimuTime").setValue(obj.StartSimuTime);
                this.satelliteInfoWindow.queryById("StopSimuTime").setValue(obj.StopSimuTime);
                this.satelliteInfoWindow.queryById("epochTime").setValue(obj.epochTime);
                this.satelliteInfoWindow.queryById("halfR").setValue(obj.a);
                this.satelliteInfoWindow.queryById("pE").setValue(obj.e);
                this.satelliteInfoWindow.queryById("gdqJ").setValue(obj.i);
                this.satelliteInfoWindow.queryById("sjdcjO").setValue(obj.Om);
                this.satelliteInfoWindow.queryById("jxdfJ").setValue(obj.om);
                this.satelliteInfoWindow.queryById("zjdjQ").setValue(obj.theta);
//            this.satelliteInfoWindow.queryById("driftAnglenX").setValue(obj.driftAnglenX);
//            this.satelliteInfoWindow.queryById("driftAnglenY").setValue(obj.driftAnglenY);
//            this.satelliteInfoWindow.queryById("driftAnglenZ").setValue(obj.driftAnglenZ);
                //修改卫星面板
            }
            else if(this.rclick_obj.type == "groundstation"){
                //修改地面站面板
                if(this.groundStationInfoWindow == null){
                    this.groundStationInfoWindow = Ext.create('CoverAnalysisApp.view.Window.GroundStationInfoWindow');
                }
                this.groundStationInfoWindow.show();
                var obj = AnalysisManagement.gsData[this.rclick_obj.index];
                this.groundStationInfoWindow.queryById("groundStationName").setText(obj.name);
                this.groundStationInfoWindow.queryById("longitude").setValue(obj.longitude);
                this.groundStationInfoWindow.queryById("latitude").setValue(obj.latitude);
                this.groundStationInfoWindow.queryById("height").setValue(obj.height);
                this.groundStationInfoWindow.queryById("minAngle").setValue(obj.minAngle);
                this.groundStationInfoWindow.queryById("groundGT").setValue( obj.groundGT);
            }
            else if(this.rclick_obj.type == "skypoint"){
                if(this.skyPointWindow == null){
                    this.skyPointWindow = Ext.create('CoverAnalysisApp.view.Window.SkyPointWindow');
                }
                this.skyPointWindow.show();
                var obj = AnalysisManagement.gsData[this.rclick_obj.index];
                this.skyPointWindow.queryById("skyPointName").setText(obj.name);
                this.skyPointWindow.queryById("ascension").setValue(obj.ascension);
                this.skyPointWindow.queryById("declination").setValue(obj.declination);
            }
            else if(this.rclick_obj.type == "skyregion"){
                if(this.skyRegionWindow == null){
                    this.skyRegionWindow = Ext.create('CoverAnalysisApp.view.Window.SkyRegionWindow');
                }
                this.skyRegionWindow.show();
                var obj = AnalysisManagement.gsData[this.rclick_obj.index];
                this.skyRegionWindow.queryById("skyRegionName").setText(obj.name);
                this.skyRegionWindow.queryById("ascensionr").setValue(obj.ascension);
                this.skyRegionWindow.queryById("declinationr").setValue(obj.declination);
                this.skyRegionWindow.queryById("regionr").setValue(obj.R);
            }
            else if(this.rclick_obj.type == "sensor"){
                if(this.sensorWindow == null){
                    this.sensorWindow = Ext.create('CoverAnalysisApp.view.Window.SensorWindow');
                }
                this.sensorWindow.show();
                var obj = AnalysisManagement.gsData[this.rclick_obj.index];
                this.sensorWindow.queryById("sensorName").setText(obj.name);
                this.sensorWindow.queryById("sensorStartTime").setValue(obj.startTime);
                this.sensorWindow.queryById("sensorEndTime").setValue(obj.endTime);
                this.sensorWindow.queryById("sensorAzimuth").setValue(obj.azimuth);
                this.sensorWindow.queryById("sensorElevation").setValue(obj.elevation);
                this.sensorWindow.queryById("sensorOpenAngle").setValue(obj.openangle);
                this.sensorWindow.queryById("sensorBH").setValue(obj.bh);
            }
        }
    },
    handleItemSelected: function (view, record, index, eOpts) {
        var nodes = this.getSolutionTree().getRootNode().childNodes;
        for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
            if(AnalysisManagement.gsData[i].id == record.data.id){
                if(this.rclick_obj == null){
                    this.rclick_obj = new Object();
                }
                this.rclick_obj.index = i;
                this.rclick_obj.type = AnalysisManagement.gsData[i].type;
                for(var j = 0 ; j < nodes.length; j++){
                    if(nodes[j].data.id == record.data.id){
                        this.rclick_obj.rcitem = nodes[j];
                        break;
                    }
                }
                break;
            }
        }
        this.concreteSubjectButton.nodeType = record.get('nodeType');
        this.concreteSubjectButton.notify();
    },
    handleContainerClick: function (listTree, e, eOpts) {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
    },
    menuShow: function (itemArray) {
        if (itemArray != null) {
            var i;
            for (i = 0; i < itemArray.length; i++) {
                itemArray[i].show();
            }
        }

    },
    menuHide: function (itemArray) {
        if (itemArray != null) {
            var i;
            for (i = 0; i < itemArray.length; i++) {
                itemArray[i].hide();
            }
        }
    },
    handleNewCovAnaFileClick: function (component, e) {
        var me = this;
        if(me.stree_availiable){
            me.getButtonGroupPanel().queryById('CovAnaMenu').menu.hide();
            var text = '任务' + me.taskNumber;
            var isRepeat = me.repeatabilityVerification(text, me.taskNameArray);
            while (isRepeat) {
                me.taskNumber++;
                text = '任务' + me.taskNumber;
                isRepeat = me.repeatabilityVerification(text, me.taskNameArray);
            }
            //初始化数传分析任务的数据
            AnalysisManagement.prototype.initTaskData(text);
            if(me.dataTransAnalysisPanel!=null){
                me.satelliteNumber = 1;
                me.groundstationNumber = 1;
                me.chainAnalysisNumber = 1;
                me.getApplication().getController("CoverAnalysisApp.controller.CoverController").handelClearTabel();
            }
            me.addList(APC.NODETYPE_TASK, text);
        }
    },
    handleSaveCovAnaFile: function (component, e){
        Ext.MessageBox.show({
            title: '任务保存',
            msg: '保存成功',
            buttons: Ext.Msg.OK
        });
    },
    handleSureNewCovAnaFileClick: function (component, e) {
        if(this.coverAnalysisFileInfoWindow.queryById("stepLength").value != null &&
            this.coverAnalysisFileInfoWindow.queryById("stepLength").value != AnalysisManagement.gsData[0].hb){
            AnalysisManagement.gsData[0].hb = this.coverAnalysisFileInfoWindow.queryById("stepLength").value;
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();
        }
        else
            return;
        console.log("update data");
        this.coverAnalysisFileInfoWindow.hide();
        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid,  AnalysisManagement.gsData[0].taskid + '.json', AnalysisManagement.prototype.getSimuData());

    },
    //重复性验证
    repeatabilityVerification: function (text, jsonResult) {
        var i;
        for (i = 0; i < jsonResult.length; i++) {
            if (jsonResult[i] == text) {
                return true;
            }
        }
        return false;
    },

    addNode: function (window, text, type, parentId) {
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CoverAnalysisManage/getNameByParentId.json",
            method: 'GET',
            params: {
                nodeId: parentId
            },
            callback: function (options, success, response) {
                var jsonResult;
                if (response.responseText != null && response.responseText != "") {
                    jsonResult = Ext.JSON.decode(response.responseText);
                } else {
                    jsonResult = response.responseText;
                }
                var isRepeat = me.repeatabilityVerification(text, jsonResult);
                if (isRepeat) {
                    Ext.MessageBox.show({
                        title: '创建失败',
                        msg: '名称已存在，请重新创建',
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                } else if (text == null || text == '') {
                    Ext.MessageBox.show({
                        title: '创建失败',
                        msg: '名称不能为空，请重新创建',
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
                else {
                    me.nodeName = text;
                    me.addList(type);
                    window.removeAll(true);
                    window.close();
                }
            }
        });
    },
    handleAddSatelliteClick: function (component, e) {
        var me = this;
        if(me.stree_availiable){
            var text = '卫星' + me.satelliteNumber;
            var listTree = me.getSolutionTree();
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "satellite"){
                    if(AnalysisManagement.gsData[i].name == text){
                        me.satelliteNumber++;
                        text = '卫星' + me.satelliteNumber;
                        i = 0;
                    }
                }
            }
            me.satelliteNumber++;
            AnalysisManagement.prototype.addSatelliteData(text);
            me.addList(APC.NODETYPE_SATELLITE, text);
        }
    },

    handleAddSkyReginItemClick: function(component, e){
        var me = this;
        if(me.stree_availiable){
            var counter = 1;
            var text = '天区域目标' + counter;
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "skyregion"){
                    if(AnalysisManagement.gsData[i].name == text){
                        counter++;
                        text = '天区域目标' + counter;
                        i = 1;
                    }
                }
            }
            AnalysisManagement.prototype.addSkyRegionData(text);
            me.addList(APC.NODETYPE_SKY_COVER_REGIN, text);
        }
    },
    handleAddSkyPointItemClick: function(component, e){
        var me = this;
        if(me.stree_availiable){
            var counter = 1;
            var text = '天区点目标' + counter;
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "skypoint"){
                    if(AnalysisManagement.gsData[i].name == text){
                        counter++;
                        text = '天区点目标' + counter;
                        i = 1;
                    }
                }
            }
            AnalysisManagement.prototype.addSkyPointData(text);
            me.addList(APC.NODETYPE_SKY_COVER_POINT, text);
        }
    },
    handleAddSensorClick: function (component, e) {
        var me = this;
        if(me.stree_availiable){
            var counter = 1;
            var text = '传感器' + counter;
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "sensor"){
                    if(AnalysisManagement.gsData[i].name == text){
                        counter++;
                        text = '传感器' + counter;
                        i = 1;
                    }
                }
            }
            AnalysisManagement.prototype.addSensorData(text, AnalysisManagement.gsData[this.rclick_obj.index].id);
            me.addList(APC.NODETYPE_SENSOR, text);
        }
    },
    //添加地面站
    handleAddGroundStationClick: function (component, e) {
        var me = this;
        if(me.stree_availiable){
            var text = '地面点目标' + me.groundstationNumber;
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "groundstation"){
                    if(AnalysisManagement.gsData[i].name == text){
                        me.groundstationNumber++;
                        text = '地面点目标' + me.groundstationNumber;
                        i = 1;
                    }
                }
            }
            me.groundstationNumber++;
            AnalysisManagement.prototype.addGroundStationData(text);
            me.addList(APC.NODETYPE_GROUNDSTATION, text);
        }
    },
    //确认修改地面站
    handleSureAddGroundStationClick: function (component, e) {
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        //obj.name = this.groundStationInfoWindow.queryById("groundStationName").value;
        obj.longitude = this.groundStationInfoWindow.queryById("longitude").value;
        obj.latitude = this.groundStationInfoWindow.queryById("latitude").value;
        obj.height = this.groundStationInfoWindow.queryById("height").value;
        obj.minAngle = this.groundStationInfoWindow.queryById("minAngle").value;
        obj.groundGT = this.groundStationInfoWindow.queryById("groundGT").value;
        this.groundStationInfoWindow.hide();
        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();
        }

        console.log("update data");
    },
    handleSureFixSkyPointClick: function (component, e) {
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        //obj.name = this.groundStationInfoWindow.queryById("groundStationName").value;
        obj.ascension = this.skyPointWindow.queryById("ascension").value;
        obj.declination = this.skyPointWindow.queryById("declination").value;
        this.skyPointWindow.hide();
        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleSky();
        }
        console.log("update data");
    },
    handleSureFixSkyRegionClick: function (component, e) {
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        //obj.name = this.groundStationInfoWindow.queryById("groundStationName").value;
        obj.ascension = this.skyRegionWindow.queryById("ascensionr").value;
        obj.declination = this.skyRegionWindow.queryById("declinationr").value;
        obj.R = this.skyRegionWindow.queryById("regionr").value;
        this.skyRegionWindow.hide();
        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleSky();
        }
        console.log("update data");
    },
    handlebtnSureFixSensorClick: function (component, e){
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        //obj.name = this.groundStationInfoWindow.queryById("groundStationName").value;
        var startTime = this.sensorWindow.queryById("sensorStartTime").value;
        var endTime = this.sensorWindow.queryById("sensorEndTime").value;
        obj.azimuth = this.sensorWindow.queryById("sensorAzimuth").value;
        obj.elevation = this.sensorWindow.queryById("sensorElevation").value;
        obj.openangle = this.sensorWindow.queryById("sensorOpenAngle").value;

        for(var j = 0 ; j < AnalysisManagement.gsData.length; j++){
            if(AnalysisManagement.gsData[j].type == "satellite" && AnalysisManagement.gsData[j].id == obj.parentID){
                if(startTime.getTime() < AnalysisManagement.gsData[j].StartSimuTime.getTime()){
                    this.sensorWindow.queryById("sensorStartTime").setValue(AnalysisManagement.gsData[j].StartSimuTime);
                    return;
                }
                break;
            }
        }

        if(endTime.getTime() > startTime.getTime() + 86400000 * 30){
            console.log("步长自动修改为3600s");
            obj.bh = 3600;
        }
        else if(endTime.getTime() > startTime.getTime() + 86400000 * 5){
//            StopSimuTime.setTime(StartSimuTime.getTime() + 2592000000);
//            obj.StopSimuTime = StopSimuTime;
//            this.satelliteInfoWindow.queryById("StopSimuTime").setValue( obj.StopSimuTime);
//            return;
            console.log("步长自动修改为360s");
            obj.bh = 360;
        }
        else if(endTime.getTime() <= startTime.getTime()){
            return;
        }
        obj.startTime = startTime;
        obj.endTime = endTime;
        this.sensorWindow.hide();
        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleSky();
        }
        console.log("update data");
    },
    handleOverStationAnalysis: function (component, e) {
        var checkbox_list = this.selectGroundStationInfoWindow.queryById('checkbox_list');
        for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
            AnalysisManagement.gsData[j].checktype = null;
        }
        var ischeked = false;
        for(var i = 0 ; i < checkbox_list.items.items.length; i++){
            if(checkbox_list.items.items[i].checked){
                for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
                    if(AnalysisManagement.gsData[j].name == checkbox_list.items.items[i].inputValue){
                        AnalysisManagement.gsData[j].checktype = "affiliated-param";
                        ischeked = true;
                        break;
                    }
                }
            }
        }
        if(!ischeked){
            return false;
        }

        if(this.div_meng == null){//初始化蒙皮
            var divs = document.getElementsByClassName("x-panel x-border-item x-box-item x-panel-default");
            for(var i = 0 ; i < divs.length; i++){
                if(divs[i].id!=null && divs[i].id.indexOf("outercenterpanel")>-1){
                    var meng = document.createElement("div");
                    meng.style.position = "fixed";
                    meng.style.width = divs[i].offsetWidth + "px";
                    meng.style.height = divs[i].offsetHeight + "px";
                    meng.style.opacity = 0.3;
                    meng.style.background = "black";
                    meng.style.left = divs[i].offsetLeft + "px";
                    meng.style.top = divs[i].offsetTop + "px";
                    meng.style.zIndex = 100000;
                    this.div_meng = meng;
                    divs[i].appendChild(meng);
                    var mengfont = document.createElement("div");
                    mengfont.style.position = "fixed";
                    mengfont.style.width = "200px";
                    mengfont.style.height = "40px";
                    mengfont.style.color = "white";
                    mengfont.style.fontSize = 20;
                    mengfont.style.left = divs[i].offsetLeft + divs[i].offsetWidth/7*3 + "px";
                    mengfont.style.top = divs[i].offsetTop + divs[i].offsetHeight/3 +  "px";
                    mengfont.style.zIndex = 110000;
                    mengfont.innerText = "正在计算，请稍后...";
                    this.font_meng = mengfont;
                    divs[i].appendChild(mengfont);
                    break;
                }
            }
        }

        var c_type = null;
        var value = this.selectGroundStationInfoWindow.queryById('param_sg').rawValue;
        for(var j = 0 ; j < AnalysisManagement.gsData.length ; j++){
            if(AnalysisManagement.gsData[j].name == value){
                AnalysisManagement.gsData[j].checktype = "main-param";
                c_type = AnalysisManagement.gsData[j].type;
                break;
            }
        }

        if (this.dataTransAnalysisPanel == null) {
            this.dataTransAnalysisPanel = Ext.create('CoverAnalysisApp.view.DataTransAnalysisPanel');
            this.getOuterCenterPanel().add(this.dataTransAnalysisPanel);
        }

        this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleClearPassTimeTable();
        if(c_type == "satellite" || c_type == "groundstation"){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();//计算过站分析数据
        }
        else if(c_type == "sensor" || c_type == "skypoint" || c_type == "skyregion"){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleSky();//计算过站分析数据
        }
        //this.getApplication().getController("CoverAnalysisApp.controller.CoverController").loadDataForAnaysisTable();
        this.dataTransAnalysisPanel.show();
        this.selectGroundStationInfoWindow.removeAll(true);
        this.selectGroundStationInfoWindow.close();

        var items = document.getElementsByClassName("x-column-header-text");
        for(var i = 0 ; i < items.length; i++){
            if(items[i].textContent == AnalysisManagement.prototype.NO_DATA){
                items[i].addattr = true;
            }
            if(items[i].addattr!=null && items[i].addattr){
                items[i].textContent = value;
                this.headerTableName = items[i];
                break;
            }
        }
    },
    handleSelectChanged: function (_this, newValue, oldValue, eOpts) {
        var checkbox_list = this.selectGroundStationInfoWindow.queryById('checkbox_list');
        checkbox_list.removeAll(true);
        var counter = 0;
        if (newValue.indexOf("satellite") > -1) {
            for (var i = 1; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type == "groundstation") {
                    if(counter == 0)
                        checkbox_list.add({checked:true, width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    else
                        checkbox_list.add({width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    counter++;
                }
            }
        }
        else if (newValue.indexOf("groundstation") > -1) {
            for (var i = 1; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type == "satellite") {
                    if(counter == 0)
                        checkbox_list.add({checked:true, width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    else
                        checkbox_list.add({width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    counter++;
                }
            }
        }
        else  if (newValue.indexOf("sky") > -1) {
            for (var i = 1; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type == "sensor") {
                    if(counter == 0)
                        checkbox_list.add({checked:true, width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    else
                        checkbox_list.add({width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    counter++;
                }
            }
        }
        else  if (newValue.indexOf("sensor") > -1) {
            for (var i = 1; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type.indexOf('sky')> - 1) {
                    if(counter == 0)
                        checkbox_list.add({checked:true, width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    else
                        checkbox_list.add({width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    counter++;
                }
            }
        }
    },
    handleSureSelect: function (component, e) {
        var me = this;
        if(me.getSolutionTree().getRootNode() == null){
                Ext.MessageBox.show({title: '提示', msg: '请首先创建任务', buttons: Ext.Msg.OK});
        }
        else{
            if(this.stree_availiable){
                if ((this.selectGroundStationInfoWindow == null || !this.selectGroundStationInfoWindow.isVisible())
                    && AnalysisManagement.gsData != null && (AnalysisManagement.gsData[0].satellite && AnalysisManagement.gsData[0].groundstation ||
                    AnalysisManagement.gsData[0].sky && AnalysisManagement.gsData[0].sensor)) {
                    this.selectGroundStationInfoWindow = Ext.create('CoverAnalysisApp.view.Window.SelectGroundStationInfoWindow');

                    var dropdown_list = this.selectGroundStationInfoWindow.queryById('param_sg');
                    var data = new Array();
                    for (var i = 1; i < AnalysisManagement.gsData.length; i++) {
                        var item = null;
                        item = new Array(AnalysisManagement.gsData[i].name, AnalysisManagement.gsData[i].type + i);
                        data.push(item);
                    }
                    dropdown_list.store = new Ext.data.ArrayStore({
                        fields: ['name', 'value'],
                        data: data  //声明一个数组，提供数据
                    });
                    dropdown_list.setValue(data[0][1]);
                    this.selectGroundStationInfoWindow.show();
                }
                else{
                    if(!AnalysisManagement.gsData[0].satellite && !AnalysisManagement.gsData[0].groundstation){
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "请添加卫星和地面点目标！",
                            modal: true,
                            buttons: Ext.Msg.YES
                        });
                    }
                    else if(!AnalysisManagement.gsData[0].satellite){
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "请添加卫星！",
                            modal: true,
                            buttons: Ext.Msg.YES
                        });
                    }
                    else if(!AnalysisManagement.gsData[0].groundstation){
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "请添加地面点目标！",
                            modal: true,
                            buttons: Ext.Msg.YES
                        });
                    }
                }
            }

        }
    },
    handleRenameClick: function (component, e) {
        if(this.stree_availiable){
            var listTree = this.getSolutionTree(),
                cellEditingPlugin = listTree.cellEditingPlugin,
                selectionModel = listTree.getSelectionModel(),
                selectedList = selectionModel.getSelection()[0];
            cellEditingPlugin.startEdit(selectedList, 0);
        }
    },
//    expandNode: function (node, eOpts) {
//        //这里使用getSolutionTreeStoreStore是个大隐患
//        var listTree = this.getSolutionTree();
//        Ext.apply(
//            this.getSolutionTreeStoreStore().model.proxy.extraParams, {
//                targetNodeType: APC.NODETYPE_SATELLITE,
//                id: node.data.id
//            })
//    },
    setEditDisable: function (panel, eOpts) {
        var listTree = this.getSolutionTree();
        listTree.removeListener('itemdblclick');
    },
    //使双击的时候重命名节点功能失效
    cancelCelldblclick: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        return false;
    },
    onAttitudeTypeChg: function (combobox, newValue, oldValue, eOpts) {
        if (newValue == "3axes") {
            this.satelliteInfoWindow.queryById('driftAnglenfield').show();
            this.satelliteInfoWindow.queryById('rollAnglenfield').show();
            this.satelliteInfoWindow.queryById('pitchAnglenfield').show();
            this.satelliteInfoWindow.queryById('azimuthalAnglenfield').hide();
            this.satelliteInfoWindow.queryById('elevationAnglenfield').hide();
            this.satelliteInfoWindow.queryById('spinSpeednfield').hide();
        }
        else {
            this.satelliteInfoWindow.queryById('azimuthalAnglenfield').show();
            this.satelliteInfoWindow.queryById('elevationAnglenfield').show();
            this.satelliteInfoWindow.queryById('spinSpeednfield').show();
            this.satelliteInfoWindow.queryById('driftAnglenfield').hide();
            this.satelliteInfoWindow.queryById('rollAnglenfield').hide();
            this.satelliteInfoWindow.queryById('pitchAnglenfield').hide();
        }
    },
    addList: function (type, text) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //electionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        var rootNodeList = me.getSolutionTree().getRootNode();
        var solutionTreeStore = listTree.getStore('SolutionTreeStore');
        var parentList = null;
        var newList = null;
        var iconCls = null;
        var isLeaf = null;
        if (type == APC.NODETYPE_TASK) {
            solutionTreeStore.setRootNode({
                nodeType: type,
                leaf: false,
                name: text,
                isRoot: true,
                iconCls: APC.NODETYPE_TASK
            });
            me.getSolutionTree().getRootNode().phantom = true;//说明这是新添加的节点调用代理的create方法
            Ext.apply(
                me.getSolutionTreeStoreStore().model.proxy.extraParams, {
                    userId: sessionStorage.getItem('userId')
                });
            solutionTreeStore.sync({
                    success: function (batch, operation) {
                        var callbackJson = Ext.JSON.decode(batch.operations[0].response.responseText);
                        if (callbackJson.id != null) {
                            AnalysisManagement.gsData[0].taskid = callbackJson.id;
                            AnalysisManagement.gsData[0].parentId = callbackJson.parentId;
                            AnalysisManagement.gsData[0].rootId = callbackJson.rootId;
                            AnalysisManagement.gsData[0].dataId = callbackJson.dataId;
                            me.getSolutionTree().getRootNode().setId(callbackJson.id);
                            console.log(callbackJson.id);
                            me.getSolutionTree().getRootNode().set("parentId", callbackJson.parentId);
                            me.getSolutionTree().getRootNode().set('rootId', callbackJson.rootId);
                            me.getSolutionTree().getRootNode().set('dataId', callbackJson.dataId);
                            //将当前任务名称添加到taskNameArray中
                            me.taskNameArray.push(text);
                            //AnalysisManagement.prototype.initSimuData();//初始化仿真开始时间，仿真结束时间，步长信息
                            //将这些信息保存在文件中
                            AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + callbackJson.id, callbackJson.id + '.json', JSON.stringify(AnalysisManagement.gsData[0]));
                        }
                        me.isFileSaved = false;
                    },
                    failure: function (batch, options) {
                        var error = batch.exceptions[0].getError(),
                            msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                        Ext.MessageBox.show({
                            title: '添加节点失败',
                            msg: msg,
                            icon: Ext.Msg.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            );//调用create API
            newList = me.getSolutionTree().getRootNode();
            parentList = newList;
        }
        else {
            parentList = rootNodeList;
            isLeaf = false;
            switch (type) {
                case APC.NODETYPE_GROUNDSTATION:
                    iconCls = 'GroundStation';
                    isLeaf = true;
                    break;
                case APC.NODETYPE_SATELLITE:
                    iconCls = 'Satellite';
                    isLeaf = false;
                    break;
                case APC.NODETYPE_SKY_COVER_REGIN:
                    iconCls = 'SkyCoverRegin';
                    isLeaf = true;
                    AnalysisManagement.gsData[0].sky = true;
                    break;
                case APC.NODETYPE_SKY_COVER_POINT:
                    iconCls = 'SkyCoverPoint';
                    isLeaf = true;
                    AnalysisManagement.gsData[0].sky = true;
                    break;
                case APC.NODETYPE_SENSOR:
                    iconCls = 'Sensor';
                    isLeaf = true;
                    AnalysisManagement.gsData[0].sensor = true;
                    listTree.expandNode(selectedList);
                    break;
            }
            //新建树节点
            if(type != APC.NODETYPE_SENSOR){
                newList = Ext.create('CoverAnalysisApp.model.SolutionTreeModel', {
                    name: text,
                    leaf: isLeaf,
                    nodeType: type,
                    parentId: parentList.get('id'),
                    isRoot: false,
                    rootId: rootNodeList.getData().id,
                    iconCls: iconCls
                });
                newList.phantom = true;//说明这是新添加的节点调用代理的create方法
                parentList.appendChild(newList);
            }
            else{
                newList = Ext.create('CoverAnalysisApp.model.SolutionTreeModel', {
                    name: text,
                    leaf: isLeaf,
                    nodeType: type,
                    parentId: me.rclick_obj.rcitem.get('id'),
                    isRoot: false,
                    rootId: me.rclick_obj.rcitem.getData().id,
                    iconCls: iconCls
                });

                newList.phantom = true;//说明这是新添加的节点调用代理的create方法

                me.rclick_obj.rcitem.appendChild(newList);
            }

            Ext.apply(
                me.getSolutionTreeStoreStore().model.proxy.extraParams, {
                    userId: sessionStorage.getItem('userId')
                });
            solutionTreeStore.sync({
                    success: function (batch, operation) {
                        var callbackJson = Ext.JSON.decode(batch.operations[0].response.responseText);
                        if (callbackJson.id != null) {
                            newList.setId(callbackJson.id);
                            newList.set("nodeOrder", callbackJson.nodeOrder);
                            var p_id = parentList.get("id");

                            AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].id = callbackJson.id;
                            AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].nodeOrder = callbackJson.nodeOrder;
                            AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + p_id + "/"+ callbackJson.id, callbackJson.id + '.json',JSON.stringify(AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1]));
                        }
                    },
                    failure: function (batch, options) {
                        parentList.removeChild(newList);
                        var error = batch.exceptions[0].getError(),
                            msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                        Ext.MessageBox.show({
                            title: '添加节点失败',
                            msg: msg,
                            icon: Ext.Msg.ERROR,
                            buttons: Ext.Msg.OK
                        });

                    }
                }
            );//调用create API

        }
        expandAndEdit = function () {
            if (parentList.isExpanded()) {
                selectionModel.select(newList);
            } else {
                listTree.on('afteritemexpand', function startEdit(list) {
                    if (list === parentList) {
                        selectionModel.select(newList);
                    }
                });
                parentList.expand();
            }
        };
        if (listTree.getView().isVisible(true)) {
            expandAndEdit();
        } else {
            listTree.on('expand', function onExpand() {
                expandAndEdit();
                listTree.un('expand', onExpand);
            });
            listTree.expand();
        }
    },
//    initSatelliteParameters: function(text){
//        var item = new Object();
//        item.satelliteFileName = text;
//        item.StartSimuTime = '2012-12-12 00:00:00';
//        item.StopSimuTime = '2014-12-12 00:00:00';
//        item.epochTime = '2012-12-12 00:00:00';
//        item.halfR = 20000;
//        item.pE = 0.1;
//        item.gdqJ = 45.0;
//        item.sjdcjO = 0;
//        item.jxdfJ = 45.0;
//        item.zjdjQ = 20;
//        item.type = "satellite";
//        AnalysisManagement.gsData[0].satellite = true;
//        AnalysisManagement.gsData.push(item);
//    },

    handleSureAddSatelliteClick: function (component, e) {
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        obj.starcombo = this.satelliteInfoWindow.queryById("starcombo").value;
        var StartSimuTime = this.satelliteInfoWindow.queryById("StartSimuTime").value;
        var StopSimuTime = this.satelliteInfoWindow.queryById("StopSimuTime").value;
        var epochTime = this.satelliteInfoWindow.queryById("epochTime").value;
        obj.a = this.satelliteInfoWindow.queryById("halfR").value;
        obj.e = this.satelliteInfoWindow.queryById("pE").value;
        obj.i = this.satelliteInfoWindow.queryById("gdqJ").value;
        obj.Om = this.satelliteInfoWindow.queryById("sjdcjO").value;
        obj.om = this.satelliteInfoWindow.queryById("jxdfJ").value;
        obj.theta = this.satelliteInfoWindow.queryById("zjdjQ").value;
        if(epochTime.getTime() <= StartSimuTime.getTime() && StartSimuTime.getTime() <= StopSimuTime.getTime()){
            obj.epochTime = epochTime;
            obj.StartSimuTime = StartSimuTime;
            obj.StopSimuTime = StopSimuTime;
        }
        else{
            this.satelliteInfoWindow.queryById("StartSimuTime").setValue( obj.StartSimuTime);
            this.satelliteInfoWindow.queryById("StopSimuTime").setValue( obj.StopSimuTime);
            this.satelliteInfoWindow.queryById("epochTime").setValue( obj.epochTime);
            return;
        }
        if(StopSimuTime.getTime() > StartSimuTime.getTime() + 86400000 * 30){
            console.log("步长自动修改为3600s");
            this.satelliteInfoWindow.queryById("hb").setValue(3600);
            obj.hb = 3600;
        }
        else if(StopSimuTime.getTime() > StartSimuTime.getTime() + 86400000 * 5){
//            StopSimuTime.setTime(StartSimuTime.getTime() + 2592000000);
//            obj.StopSimuTime = StopSimuTime;
//            this.satelliteInfoWindow.queryById("StopSimuTime").setValue( obj.StopSimuTime);
//            return;
            console.log("步长自动修改为360s");
            this.satelliteInfoWindow.queryById("hb").setValue(360);
            obj.hb = 360;
        }

        this.satelliteInfoWindow.hide();

        AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();
        }

        console.log("update data");
    },

    /**
     * Handles the list list's "edit" event.
     * Updates the list on the server whenever a list record is updated using the tree editor.
     * @param {Ext.grid.plugin.CellEditing} editor
     * @param {Object} e                                an edit event object
     */
    updateList: function (editor, e) {
        var me = this,
            list = e.record;
        //调用update API
        list.save({
            success: function (list, operation) {
            },
            failure: function (list, operation) {
                var error = operation.getError(),
                    msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                Ext.MessageBox.show({
                    title: '更新节点失败',
                    msg: msg,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });

    },
    validateEdit:function( editor, context, eOpts ){//重命名以后
        var me = this;
        var oldValue = context.originalValue;
        var newValue =  context.value;

        if( this.headerTableName!=null && this.rclick_obj!=null){
            if(AnalysisManagement.gsData[this.rclick_obj.index].checktype == "main-param")
                this.headerTableName.textContent = newValue;
            else if(AnalysisManagement.gsData[this.rclick_obj.index].checktype == "affiliated-param"){
                var arr = this.getSchedulerView().resourceStore.data.items;
                for(var i = 0 ; i < arr.length ; i++){
                    if(arr[i].data.Name == AnalysisManagement.gsData[this.rclick_obj.index].name){
                        var items = document.getElementsByClassName("x-grid-cell-inner");
                        for(var j = 0 ; j < items.length ; j++){
                            if(items[j].innerText == arr[i].data.Name){
                                items[j].innerText = newValue;
                            }
                        }
                        arr[i].data.Name = newValue;
                        break;
                    }
                }
            }
        }
        if(this.rclick_obj.type == "groundstation" || this.rclick_obj.type == "satellite" || this.rclick_obj.type == "skypoint"
            || this.rclick_obj.type == "skyregion" || this.rclick_obj.type == "sensor"){
            AnalysisManagement.gsData[this.rclick_obj.index].name = newValue;
            AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+  AnalysisManagement.gsData[this.rclick_obj.index].id,  AnalysisManagement.gsData[this.rclick_obj.index].id + '.json',JSON.stringify( AnalysisManagement.gsData[this.rclick_obj.index]));
            console.log("data update");
        }
        else{
            AnalysisManagement.gsData[this.rclick_obj.index].task = newValue;
            AnalysisManagement.prototype.saveFileByPathCover(sessionStorage.getItem("userId") + "/" + APC.COVER_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid, AnalysisManagement.gsData[0].taskid + '.json', JSON.stringify(AnalysisManagement.gsData[0]));
        }
        return true;
    },
    handleCompleteEdit: function (editor, e) {
        delete this.addedNode;
    },
    /**
     * 处理删除命令
     * @param {Ext.Component} component
     * @param {Ext.EventObject} e
     */
    handleDeleteClick: function (component, e) {
        if(this.stree_availiable){
            var refresh_table = false;
            if(this.rclick_obj!=null){
                if(this.rclick_obj.type == "task"){//删除任务结点
                    AnalysisManagement.gsData.length = 0;
                    var listTree = this.getSolutionTree();
                    listTree.getStore().removeAll();
                    this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handelClearTabel();
                    var selectedNode = this.getSolutionTree().getSelectionModel().getSelection()[0];

                    //从此处开始添加删除代码
                    return;
                }
                else if(this.rclick_obj.type == "satellite"){
                    if(AnalysisManagement.gsData[this.rclick_obj.index].checktype != null){
                        refresh_table = true;
                    }
                    for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++) {
                        if (AnalysisManagement.gsData[j].type == "sensor") {
                            if (AnalysisManagement.gsData[j].parentID == AnalysisManagement.gsData[this.rclick_obj.index].id) {
                                var lobj = AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1];
                                AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1] = AnalysisManagement.gsData[j];
                                AnalysisManagement.gsData[j] = lobj;
                                AnalysisManagement.gsData.pop();
                                j--;
                            }
                        }
                    }
                    var lobj = AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1];
                    AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1] = AnalysisManagement.gsData[this.rclick_obj.index];
                    AnalysisManagement.gsData[this.rclick_obj.index] = lobj;
                    AnalysisManagement.gsData.pop();
                }
                else{
                    if(AnalysisManagement.gsData[this.rclick_obj.index].checktype != null){
                        refresh_table = true;
                    }
                    var lobj = AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1];
                    AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1] = AnalysisManagement.gsData[this.rclick_obj.index];
                    AnalysisManagement.gsData[this.rclick_obj.index] = lobj;
                    AnalysisManagement.gsData.pop();
                }
                this.rclick_obj = null;
            }
            this.deleteList(this.getSolutionTree().getSelectionModel().getSelection()[0]);
            if(refresh_table){
                AnalysisManagement.gsData[0].satellite = false;
                AnalysisManagement.gsData[0].groundstation = false;
                AnalysisManagement.gsData[0].sensor = false;
                AnalysisManagement.gsData[0].sky = false;
                for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
                    if(AnalysisManagement.gsData[i].type == "satellite"){
                        AnalysisManagement.gsData[0].satellite = true;
                    }
                    else if(AnalysisManagement.gsData[i].type == "groundstation"){
                        AnalysisManagement.gsData[0].groundstation = true;
                    }
                    else if(AnalysisManagement.gsData[i].type == "sensor"){
                        AnalysisManagement.gsData[0].sensor = true;
                    }
                    else {
                        AnalysisManagement.gsData[0].sky = true;
                    }
                }
                var clear_result = this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handelClearTabel();
                if(clear_result!=null && (clear_result == "satellite" || clear_result == "groundstation")){
                    this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();
                }
                else if(clear_result!=null){
                    this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleSky();
                }
                console.log("update table");
            }
            else if(AnalysisManagement.gsData.length == 0){
                console.log("clean table");
                this.getApplication().getController("CoverAnalysisApp.controller.CoverController").handelClearTabel();
            }
        }
    },
    deleteList: function (list) {
        var me = this;
        var listTree = me.getSolutionTree();
        var listName = list.get('name');
        var selModel = listTree.getSelectionModel();
        var listParent = list.parentNode;
        list.parentNode.removeChild(list, true); //此时已经访问了后台服务器，删除了对应的节点
    },
    showPanel: function(){
        var me = this;
            //创建根节点
            if (me.dataTransAnalysisPanel == null) {
                me.dataTransAnalysisPanel = Ext.create('CoverAnalysisApp.view.DataTransAnalysisPanel');
                me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
            }
            me.dataTransAnalysisPanel.show();
    },
    fillData: function(response_jsonstr){
        var me = this;
        AnalysisManagement.gsData = new Array();

        if(me.dataTransAnalysisPanel!=null)
            me.dataTransAnalysisPanel.hide();
        else{
            me.dataTransAnalysisPanel = Ext.create('CoverAnalysisApp.view.DataTransAnalysisPanel');
            me.dataTransAnalysisPanel.hide();
            me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
        }

        if(me.antennaInfoWindow!=null)
            me.antennaInfoWindow.hide();
        me.taskNumber = 1;
        me.satelliteNumber = 1;
        me.groundstationNumber = 1;
        var response_json = response_jsonstr;
        if(response_json!=null){
            var obj = JSON.parse(response_json);
            var listTree = me.getSolutionTree();
            var solutionTreeStore = listTree.getStore('SolutionTreeStore');
            for(var i = 0 ; i < obj.length ; i++){
                if( i == 0){
                    AnalysisManagement.gsData.push(obj[i]);
                    solutionTreeStore.setRootNode({
                        nodeType: APC.NODETYPE_TASK,
                        leaf: false,
                        name: obj[i].task,
                        isRoot: true,
                        iconCls: APC.NODETYPE_TASK
                    });
                    me.getSolutionTree().getRootNode().phantom = true;
                    me.getSolutionTree().getRootNode().setId(obj[i].taskid);
                    me.getSolutionTree().getRootNode().set("parentId", obj[i].parentId);
                    me.getSolutionTree().getRootNode().set('rootId', obj[i].rootId);
                    me.getSolutionTree().getRootNode().set('dataId', obj[i].dataId);
                    if(me.taskNameArray==null){
                        me.taskNameArray = new Array();
                    }
                    me.taskNameArray.push(obj[i].task);
                }
                else if(obj[i].type != "sensor"){
                    AnalysisManagement.gsData.push(obj[i]);
                    var type = APC.NODETYPE_SATELLITE;
                    var iconCls = "Satellite";
                    var isleaf = false;
                    if(obj[i].type == "groundstation"){
                        type = APC.NODETYPE_GROUNDSTATION;
                        iconCls = 'GroundStation';
                        isleaf = true;
                        AnalysisManagement.gsData[0].groundstation = true;
                    }
                    else if(obj[i].type == "skyregion"){
                        type = APC.NODETYPE_SKY_COVER_REGIN;
                        iconCls = 'SkyCoverRegin';
                        isleaf = true;
                        AnalysisManagement.gsData[0].sky = true;
                    }
                    else if(obj[i].type == "skypoint") {
                        type = APC.NODETYPE_SKY_COVER_POINT;
                        iconCls = 'SkyCoverPoint';
                        isleaf = true;
                        AnalysisManagement.gsData[0].sky = true;
                    }
                    else if(obj[i].type == "skypoint") {
                        type = APC.NODETYPE_SKY_COVER_POINT;
                        iconCls = 'SkyCoverPoint';
                        isleaf = true;
                        AnalysisManagement.gsData[0].sky = true;
                    }
                    else if(obj[i].type == APC.NODETYPE_CHAIN_ANALYSIS) {
                        type = APC.NODETYPE_CHAIN_ANALYSIS;
                        iconCls = APC.NODETYPE_CHAIN_ANALYSIS;
                        isleaf = true;
                    }
                    else{
                        AnalysisManagement.gsData[0].satellite = true;
                        obj[i].StartSimuTime = me.getDate(obj[i].StartSimuTime);
                        obj[i].StopSimuTime = me.getDate(obj[i].StopSimuTime);
                        obj[i].epochTime = me.getDate(obj[i].epochTime);
                    }
                    var newList = Ext.create('CoverAnalysisApp.model.SolutionTreeModel', {
                        name: obj[i].name,
                        leaf: isleaf,
                        nodeType: type,
                        parentId: AnalysisManagement.gsData[0].taskid,
                        isRoot: false,
                        rootId:  AnalysisManagement.gsData[0].rootId,
                        iconCls: iconCls
                    });
                    newList.phantom = true;//说明这是新添加的节点调用代理的create方法
                    me.getSolutionTree().getRootNode().appendChild(newList);
                    newList.setId(obj[i].id);
                    newList.set("nodeOrder", obj[i].nodeOrder);
                }
            }
            for(var i = 1 ; i < obj.length ; i++){
                if(obj[i].type == "sensor"){
                    AnalysisManagement.gsData[0].sensor = true;
                    AnalysisManagement.gsData.push(obj[i]);
                    obj[i].startTime = me.getDate(obj[i].startTime);
                    obj[i].endTime = me.getDate(obj[i].endTime);
                    var itemlist = null;
                    for(var j = 0 ; j < me.getSolutionTree().getRootNode().childNodes.length ; j++){
                        if(me.getSolutionTree().getRootNode().childNodes[j].data.id == obj[i].parentID){
                            itemlist = me.getSolutionTree().getRootNode().childNodes[j];
                            break;
                        }
                    }
                    var type = APC.NODETYPE_SENSOR;
                    var iconCls = "Sensor";
                    var isleaf = true;

                    var newList = Ext.create('CoverAnalysisApp.model.SolutionTreeModel', {
                        name: obj[i].name,
                        leaf: isleaf,
                        nodeType: type,
                        parentId: itemlist.id,
                        isRoot: false,
                        rootId:  itemlist.id,
                        iconCls: iconCls
                    });
                    newList.phantom = true;//说明这是新添加的节点调用代理的create方法
                    itemlist.appendChild(newList);
                    newList.setId(obj[i].id);
                    newList.set("nodeOrder", obj[i].nodeOrder);
                }
            }
        }
        else{
            console.log("bad task");
        }
    },
    showDataOnRightPanelAfterFillPanle : function(me){
        var hasSatellite = false, hasGroundstation = false, value;
        if(AnalysisManagement.gsData!=null){
            for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
                AnalysisManagement.gsData[j].checktype = null;
            }
            for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
                if(AnalysisManagement.gsData[i].type == "satellite" && !hasSatellite){
                    AnalysisManagement.gsData[i].checktype = "main-param";
                    value = AnalysisManagement.gsData[i].name;
                    hasSatellite = !hasSatellite;
                }
                else if(AnalysisManagement.gsData[i].type == "groundstation" && !hasGroundstation){
                    AnalysisManagement.gsData[i].checktype = "affiliated-param";
                    hasGroundstation = !hasGroundstation;
                }
            }
            if (me.dataTransAnalysisPanel == null) {
                me.dataTransAnalysisPanel = Ext.create('CoverAnalysisApp.view.DataTransAnalysisPanel');
                me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
            }
            me.dataTransAnalysisPanel.show();
            if(hasSatellite && hasGroundstation){
                me.getApplication().getController("CoverAnalysisApp.controller.CoverController").handleInit();//计算过站分析数据
                //this.getApplication().getController("CoverAnalysisApp.controller.CoverController").loadDataForAnaysisTable();
                var items = document.getElementsByClassName("x-column-header-text");
                if(items!=null)
                    for(var i = 0 ; i < items.length; i++){
                        if(items[i].textContent == AnalysisManagement.prototype.NO_DATA){
                            items[i].addattr = true;
                        }
                        if(items[i].addattr!=null && items[i].addattr){
                            items[i].textContent = value;
                            me.headerTableName = items[i];
                            break;
                        }
                    }
            }
        }
    },
    openCoverAnalysisTaskList : function(component, e){
        var me = this;
        if(me.antennaInfoWindow == null){
            me.antennaInfoWindow = Ext.create('CoverAnalysisApp.view.Window.CoverAnalysisTaskWindow');
        }
        me.antennaInfoWindow.queryById('coverAnalysisTaskGridPanel').store.proxy.extraParams = {
            userId: sessionStorage.getItem("userId")
        };
        me.antennaInfoWindow.queryById('coverAnalysisTaskGridPanel').store.reload();
        me.antennaInfoWindow.show();
    },
    openCoverAnalysisTask : function(grid, rowindex, e){
        var record = grid.getSelectionModel().getSelection();
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CoverAnalysisManage/getTaskTree.json",
            method: 'GET',
            params: {
                perTaskId: record[0].data.perTaskId
            },
            success: function (response) {
                me.fillData(response.responseText);
                me.showDataOnRightPanelAfterFillPanle(me);
                me.getSolutionTree().expandAll();
            }
        });
    },
    getDate: function(date){
        if(date!=undefined && date!=null){
            var ymd = date.split("T")[0];
            var hms = date.split("T")[1].split(".")[0];
            var d = new Date(ymd.replace(/-/g,   "/"));
            d.setHours(parseInt(hms.split(":")[0]));
            d.setMinutes(parseInt(hms.split(":")[1]));
            d.setSeconds(parseInt(hms.split(":")[2]));
            return d;
        }
        return null;
    }
});
