Ext.define('DataTransAnalysisApp.controller.TreeController', {
    extend: 'Ext.app.Controller',
    views: [
        'SolutionTree',
        'ButtonGroupPanel',
        'ContextMenu',
        'Window.CoverAnalysisFileInfoWindow',
        'Window.SatelliteInfoWindow',
        'Window.AntennaInfoWindow',
        'Window.DataTransTaskGridPanel',
        'Window.DataTransTaskWindow',
        'Window.GroundStationInfoWindow',
        'Window.SelectGroundStationInfoWindow'
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
            ref: 'chainAnalysisPanel',
            selector: 'chainanalysispanel'
        },
        {
            ref: 'dataTransAnalysisPanel',
            selector: 'datatransanalysispanel'
        },
        {
            ref: 'dataTransTaskGridPanel',
            selector: 'datatranstaskgridpanel'
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
    concreteSubject: null,
    chainAnalysisPanel: null,
    dataTransAnalysisPanel: null,
    taskNumber: 1,
    satelliteNumber: 1,
    groundstationNumber: 1,
    isAnaysised: true,
    headerTableName: null,
    taskNameArray: new Array(),
    rclick_obj:null,
    div_meng: null,
    font_meng:null,
    stree_availiable:true,//true:方案树可以使用；false:不可以使用
    init: function (application) {
        var me = this;
        this.control({
            '#btnBackNavigation': {
                click: this.btnBackNavigationClick
            },
            '#btnMax': {
                click: this.OnPostCommandMax
            },
            '#btnRestore': {
                click: this.OnPostCommandRestore
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
            '#btnChainAnalysis': {
                click: me.handleChainAnalysisClick
            },
            '#btnOverStationAnalysis': {
                click: me.handleSureSelect
            },
            '#fixDelete': {
                click: me.handleDeleteClick
            },
            //为下拉按钮定义事件
            '#addDataTransAnalysisFileItem': {
                click: me.handleNewCovAnaFileClick
            },
            '#addSatelliteItem': {
                click: me.handleAddSatelliteClick
            },
            '#addGroundStationItem': {
                click: me.handleAddGroundStationClick
            },
            '#addAntennaItem': {
                click: me.handleAddAntennaClick
            },
            '#fixOpen': {
              click: me.handleFixOpen
            },
            '#fixAttr': {
                click: me.handleFixAttr
            },
            '#fixRename': {
                click: me.handleRenameClick
            },
            'solutiontree': {
                edit: me.updateList,
                validateedit:me.validateEdit,
                itemcontextmenu: me.handleIemRightClicked,
                containercontextmenu: me.handleContainerRightClicked,
                beforeitemexpand: me.expandNode,
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
                click: me.openDataTransTaskList
            },
            'datatranstaskgridpanel': {//打开某个任务
                itemdblclick: me.openDataTransTask
            }
        });
    },
    onLaunch: function (application) {
        this.concreteSubjectButton = new ConcreteSubject();
        this.registereButtonListeners();
        this.registereMenuButtonListeners();
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "DataTransAnalysisManage/getTaskNameByUserId.json",
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
                console.log(jsonResult);

                for (i = 0; i < jsonResult.length; i++) {
                    me.taskNameArray.push(jsonResult[i].perTaskName);
                }
            }
        });
        if(sessionStorage.getItem( APC.SELECTED_TASK_ID) != 'null'){
            me.openTask(sessionStorage.getItem( APC.SELECTED_TASK_ID));
        }else{
            me.showPanel();
        }
    },
    openTask: function(perTaskId){
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "DataTransAnalysisManage/getTaskTree.json",
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
        var btnAddGroundStation = me.getButtonGroupPanel().queryById('btnAddGroundStation');
        buttonAndTypeArray[i++] = new BtnAndType(btnAddGroundStation, [APC.NODETYPE_TASK]);
        me.addButtonObserversToSubject(buttonAndTypeArray);
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
        var fixAttr = me.getContextMenu().queryById('fixAttr');
        buttonAndTypeArray[i++] = new BtnAndType(fixAttr, [APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE]);
        var fixOpen = me.getContextMenu().queryById('fixOpen');
        buttonAndTypeArray[i++] = new BtnAndType(fixOpen, [APC.NODETYPE_CHAIN_ANALYSIS]);
        var fixRename = me.getContextMenu().queryById('fixRename');
        buttonAndTypeArray[i++] = new BtnAndType(fixRename, [APC.NODETYPE_TASK,APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE, APC.NODETYPE_CHAIN_ANALYSIS]);
        var fixDelete = me.getContextMenu().queryById('fixDelete');
        buttonAndTypeArray[i++] = new BtnAndType(fixDelete, [APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SATELLITE,APC.NODETYPE_CHAIN_ANALYSIS]);
        me.addMenuButtonObserversToSubject(buttonAndTypeArray);
    },
    btnBackNavigationClick: function () {
//        this.getButtonGroupPanel().queryById('OrbitMenu').menu.hide();
//        window.location.href = "../../subpage/Navigation/Navigation.html";
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
        if(rowIndex == 0){
            this.rclick_obj.index = 0;
            this.rclick_obj.type = "task";
        }
        else{
            var isCA = true;
            for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
                if(AnalysisManagement.gsData[i].name == list.data.name){
                    this.rclick_obj.index = i;
                    this.rclick_obj.type = AnalysisManagement.gsData[i].type;
                    isCA = false;
                    break;
                }
            }
            if(isCA){
                for(var i = 0 ; i < AnalysisManagement.taData.length ; i++){
                    if(AnalysisManagement.taData[i].name == list.data.name){
                        this.rclick_obj.index = i;
                        this.rclick_obj.type = "chainanaysis";
                        break;
                    }
                }
            }
        }

        this.getContextMenu().setList(list);
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    handleFixAttr:function(component, e){
        if(this.stree_availiable) {
            if(this.rclick_obj.type == "task"){
                //修改任务面板
                if(this.coverAnalysisFileInfoWindow == null){
                    this.coverAnalysisFileInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.CoverAnalysisFileInfoWindow');
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
                    this.satelliteInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.SatelliteInfoWindow');

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
                    this.groundStationInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.GroundStationInfoWindow');
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
        }
    },
    handleFixOpen: function(component, e){
        if(this.rclick_obj != undefined && this.rclick_obj.type == "chainanaysis"){
            //查看链路分析
            this.isAnaysised = false;
            this.chainAnalysisPanel.show();
            this.dataTransAnalysisPanel.hide();
            var item = AnalysisManagement.taData[AnalysisManagement.taData.length - 1];
            AnalysisManagement.taData[AnalysisManagement.taData.length - 1] = AnalysisManagement.taData[this.rclick_obj.index];
            AnalysisManagement.taData[this.rclick_obj.index] = item;
            this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").updateChainAnaysis(this.chainAnalysisPanel);
        }
    },
    handleItemSelected: function (view, record, index, eOpts) {
        this.rclick_obj = null;
        if(AnalysisManagement.taData!=null){
            for(var i = 0 ; i < AnalysisManagement.taData.length ; i++){
                if(AnalysisManagement.taData[i].name == record.data.name){
                    if(this.rclick_obj == null){
                        this.rclick_obj = new Object();
                    }
                    this.rclick_obj.index = i;
                    this.rclick_obj.type = "chainanaysis";
                    break;
                }
            }
        }
        this.handleFixOpen();
        this.concreteSubjectButton.nodeType = record.get('nodeType');
        this.concreteSubjectButton.notify();
    },
    handleContainerClick: function (listTree, e, eOpts) {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
        this.concreteSubjectButton.nodeType = APC.NODETYPE_NO_ROOT;
        this.concreteSubjectButton.notify();
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
            var isRepeat = me.repeatabilityVerification(text, me.taskNameArray);//console.log(me.taskNameArray);
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
                me.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handelClearTabel();
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
            this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();
        }
        else
            return;
        console.log("update data");
        this.coverAnalysisFileInfoWindow.hide();
        AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid,  AnalysisManagement.gsData[0].taskid + '.json', AnalysisManagement.prototype.getSimuData());

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
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "DataTransAnalysisManage/getNameByParentId.json",
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

    handleAddAntennaClick: function (component, e) {
//        if ((this.antennaInfoWindow == null || !this.antennaInfoWindow.isVisible())) {
//            this.antennaInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.AntennaInfoWindow');
//            this.antennaInfoWindow.show();
//        }
    },
    //添加地面站
    handleAddGroundStationClick: function (component, e) {
        var me = this;
        if(me.stree_availiable){
            var text = '地面站' + me.groundstationNumber;
            for(var i = 1 ; i < AnalysisManagement.gsData.length; i++){
                if(AnalysisManagement.gsData[i].type == "groundstation"){
                    if(AnalysisManagement.gsData[i].name == text){
                        me.groundstationNumber++;
                        text = '地面站' + me.groundstationNumber;
                        i = 0;
                    }
                }
            }
            me.groundstationNumber++;
            AnalysisManagement.prototype.addGroundStationData(text);
            me.addList(APC.NODETYPE_GROUNDSTATION, text);
        }
    },
    //确认添加地面站
    handleSureAddGroundStationClick: function (component, e) {
        var obj = AnalysisManagement.gsData[this.rclick_obj.index];
        //obj.name = this.groundStationInfoWindow.queryById("groundStationName").value;
        obj.longitude = this.groundStationInfoWindow.queryById("longitude").value;
        obj.latitude = this.groundStationInfoWindow.queryById("latitude").value;
        obj.height = this.groundStationInfoWindow.queryById("height").value;
        obj.minAngle = this.groundStationInfoWindow.queryById("minAngle").value;
        obj.groundGT = this.groundStationInfoWindow.queryById("groundGT").value;
        this.groundStationInfoWindow.hide();
        AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();
        }

        console.log("update data");
    },
    handleChainAnalysisClick: function (component, e) {
        if(this.stree_availiable){
            this.isAnaysised = false;
            if(this.div_meng!=null){
                this.div_meng.style.display = "none";
                this.font_meng.style.display = "none";
            }

            if (this.chainAnalysisPanel == null) {
                this.chainAnalysisPanel = Ext.create('DataTransAnalysisApp.view.ChainAnalysisPanel');
                this.getOuterCenterPanel().add(this.chainAnalysisPanel);
            }
            if (this.dataTransAnalysisPanel == null) {
                this.dataTransAnalysisPanel = Ext.create('DataTransAnalysisApp.view.DataTransAnalysisPanel');
                this.getOuterCenterPanel().add(this.dataTransAnalysisPanel);
            }
            this.dataTransAnalysisPanel.hide();
            this.chainAnalysisPanel.show();
            this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").initIsNewCA(this.chainAnalysisPanel);
        }
    },
    handleOverStationAnalysis: function (component, e) {
        var checkbox_list = this.selectGroundStationInfoWindow.queryById('checkbox_list');
        for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
            AnalysisManagement.gsData[j].checktype = null;
        }
        var ischeked = false;
        for(var i = 0 ; i < checkbox_list.items.items.length; i++){
            if(checkbox_list.items.items[i].checked){
                for(var j = 0 ; j < AnalysisManagement.gsData.length ; j++){
                    if(AnalysisManagement.gsData[j].name == checkbox_list.items.items[i].inputValue){
                        AnalysisManagement.gsData[j].checktype = "affiliated-param";//主参数
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

        var value = this.selectGroundStationInfoWindow.queryById('param_sg').rawValue;
        for(var j = 0 ; j < AnalysisManagement.gsData.length ; j++){
            if(AnalysisManagement.gsData[j].name == value){
                AnalysisManagement.gsData[j].checktype = "main-param";//辅助参数
                break;
            }
        }
        if (this.chainAnalysisPanel == null) {
            this.chainAnalysisPanel = Ext.create('DataTransAnalysisApp.view.ChainAnalysisPanel');
            this.getOuterCenterPanel().add(this.chainAnalysisPanel);
        }

        if (this.dataTransAnalysisPanel == null) {
            this.dataTransAnalysisPanel = Ext.create('DataTransAnalysisApp.view.DataTransAnalysisPanel');
            this.getOuterCenterPanel().add(this.dataTransAnalysisPanel);
        }

        this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleClearPassTimeTable();
        this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();//计算过站分析数据
        //this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").loadDataForAnaysisTable();
        this.chainAnalysisPanel.hide();
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
            for (var i = 0; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type == "groundstation") {
                    if(counter == 0)
                        checkbox_list.add({checked:true, width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    else
                        checkbox_list.add({width: "100%", boxLabel: AnalysisManagement.gsData[i].name, name: AnalysisManagement.gsData[i].name, inputValue: AnalysisManagement.gsData[i].name});
                    counter++;
                }
            }
        }
        else {
            for (var i = 0; i < AnalysisManagement.gsData.length; i++) {
                if (AnalysisManagement.gsData[i].type == "satellite") {
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
        if(me.getSolutionTree().getRootNode() ==null){
            if(me.dataTransAnalysisPanel.isHidden()){
                me.dataTransAnalysisPanel.show();
            }
            else{
                Ext.MessageBox.show({title: '提示', msg: '请首先创建任务', buttons: Ext.Msg.OK});
            }
        }
        else{
            if(this.stree_availiable){
                if(!this.isAnaysised){
                    this.chainAnalysisPanel.hide();
                    this.dataTransAnalysisPanel.show();
                    this.isAnaysised = true;
                }
                else{
                    if ((this.selectGroundStationInfoWindow == null || !this.selectGroundStationInfoWindow.isVisible())
                        && AnalysisManagement.gsData != null && AnalysisManagement.gsData[0].satellite && AnalysisManagement.gsData[0].groundstation) {
                        this.selectGroundStationInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.SelectGroundStationInfoWindow');

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
                                msg: "请添加卫星和地面覆盖点！",
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
                                msg: "请添加地面覆盖点！",
                                modal: true,
                                buttons: Ext.Msg.YES
                            });
                        }
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
    expandNode: function (node, eOpts) {
        //这里使用getSolutionTreeStoreStore是个大隐患
        var listTree = this.getSolutionTree();
        Ext.apply(
            this.getSolutionTreeStoreStore().model.proxy.extraParams, {
                targetNodeType: APC.NODETYPE_SATELLITE,
                id: node.data.id
            })
    },
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
                            AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + callbackJson.id, callbackJson.id + '.json', JSON.stringify(AnalysisManagement.gsData[0]));
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
                    isLeaf = true;
                    break;
                case APC.NODETYPE_CHAIN_ANALYSIS:
                    iconCls = 'ChainAnalysis';
                    isLeaf = true;
                    break;
            }
            //兴建树节点
            newList = Ext.create('DataTransAnalysisApp.model.SolutionTreeModel', {
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
                            if(type == APC.NODETYPE_CHAIN_ANALYSIS){
                                AnalysisManagement.taData[AnalysisManagement.taData.length - 1].id = callbackJson.id;
                                AnalysisManagement.taData[AnalysisManagement.taData.length - 1].nodeOrder = callbackJson.nodeOrder;
                                AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + p_id + "/"+ callbackJson.id, callbackJson.id + '.json',JSON.stringify(AnalysisManagement.taData[AnalysisManagement.taData.length - 1]));
                            }
                            else{
                                AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].id = callbackJson.id;
                                AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].nodeOrder = callbackJson.nodeOrder;
                                AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + p_id + "/"+ callbackJson.id, callbackJson.id + '.json',JSON.stringify(AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1]));
                            }
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
        obj.hb = this.satelliteInfoWindow.queryById("hb").value;
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
//        if(StopSimuTime.getTime() > StartSimuTime.getTime() + 86400000 * 365 * 2){
//            console.log("步长自动修改为36000s");
//            this.satelliteInfoWindow.queryById("hb").setValue(36000);
//            obj.hb = 36000;
//        }
//        else
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
//        obj.driftAnglenX = this.satelliteInfoWindow.queryById("driftAnglenX").value;
//        obj.driftAnglenY = this.satelliteInfoWindow.queryById("driftAnglenY").value;
//        obj.driftAnglenZ = this.satelliteInfoWindow.queryById("driftAnglenZ").value;

        this.satelliteInfoWindow.hide();

        AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+ obj.id, obj.id + '.json',JSON.stringify(AnalysisManagement.gsData[this.rclick_obj.index]));

        if(AnalysisManagement.gsData[this.rclick_obj.index].checktype !=null && AnalysisManagement.gsData[this.rclick_obj.index]!=undefined){
            this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();
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
        if(this.rclick_obj.type == "chainanaysis"){
            AnalysisManagement.taData[this.rclick_obj.index].name = newValue;
            AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+  AnalysisManagement.taData[this.rclick_obj.index].id,  AnalysisManagement.taData[this.rclick_obj.index].id + '.json',JSON.stringify( AnalysisManagement.taData[this.rclick_obj.index]));
        }
        else if(this.rclick_obj.type == "groundstation" || this.rclick_obj.type == "satellite"){
            AnalysisManagement.gsData[this.rclick_obj.index].name = newValue;
            AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+  AnalysisManagement.gsData[this.rclick_obj.index].id,  AnalysisManagement.gsData[this.rclick_obj.index].id + '.json',JSON.stringify( AnalysisManagement.gsData[this.rclick_obj.index]));
            console.log("data update");
        }
        else{
            AnalysisManagement.gsData[this.rclick_obj.index].task = newValue;
            AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid, AnalysisManagement.gsData[0].taskid + '.json', JSON.stringify(AnalysisManagement.gsData[0]));
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
                if(this.rclick_obj.type == "chainanaysis"){
                    if(this.rclick_obj.index == AnalysisManagement.taData.length - 1 && this.chainAnalysisPanel!=null
                        && this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").currentChainAnalysis!=null
                        && this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").currentChainAnalysis.save){
                        this.chainAnalysisPanel.hide();
                        if(this.dataTransAnalysisPanel!=null){
                            this.dataTransAnalysisPanel.show();
                        }
                    }
                    for(var i = this.rclick_obj.index; i < AnalysisManagement.taData.length - 1 ; i++){
                        AnalysisManagement.taData[i] = AnalysisManagement.taData[i+1];
                    }
                    AnalysisManagement.taData.pop();
                }
                else if(this.rclick_obj.type == "task"){//删除任务节点
                    AnalysisManagement.gsData.length = 0;
                    AnalysisManagement.taData.length = 0;
                    var listTree = this.getSolutionTree();
                    listTree.getStore().removeAll();
                    this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handelClearTabel();
                    //从此处开始添加删除代码
                    return;
                }
                else if(this.rclick_obj.type == "satellite" || this.rclick_obj.type == "groundstation"){
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
                for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
                    if(AnalysisManagement.gsData[i].type == "satellite"){
                        AnalysisManagement.gsData[0].satellite = true;
                    }
                    else if(AnalysisManagement.gsData[i].type == "groundstation"){
                        AnalysisManagement.gsData[0].groundstation = true;
                    }
                }
                if(this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handelClearTabel()){
                    this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();
                }
                console.log("update table");
            }
            else if(AnalysisManagement.gsData.length == 0){
                console.log("clean table");
                this.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handelClearTabel();
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
        if (me.dataTransAnalysisPanel == null) {
            me.dataTransAnalysisPanel = Ext.create('DataTransAnalysisApp.view.DataTransAnalysisPanel');
            me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
        }
        me.dataTransAnalysisPanel.show();
    },
    fillData: function(response_jsonstr){
        var me = this;
        AnalysisManagement.gsData = new Array();
        AnalysisManagement.taData = new Array();
        if(me.chainAnalysisPanel!=null)
            me.chainAnalysisPanel.hide();
        else{
            me.chainAnalysisPanel = Ext.create('DataTransAnalysisApp.view.ChainAnalysisPanel');
            me.chainAnalysisPanel.hide();
            me.getOuterCenterPanel().add(me.chainAnalysisPanel);
        }

        if(me.dataTransAnalysisPanel!=null)
            me.dataTransAnalysisPanel.hide();
        else{
            me.dataTransAnalysisPanel = Ext.create('DataTransAnalysisApp.view.DataTransAnalysisPanel');
            me.dataTransAnalysisPanel.hide();
            me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
        }

        if(me.antennaInfoWindow!=null)
            me.antennaInfoWindow.hide();
        me.isAnaysised = true;
//        me.isChainAnaysised = false;
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
                else{
                    if(obj[i].type != "chainanaysis") {
                        AnalysisManagement.gsData.push(obj[i]);
                    }
                    else{
                        AnalysisManagement.taData.push(obj[i]);
                    }
                    var type = APC.NODETYPE_SATELLITE;
                    var iconCls = "Satellite";
                    if(obj[i].type == "groundstation"){
                        type = APC.NODETYPE_GROUNDSTATION;
                        iconCls = 'GroundStation';
                        AnalysisManagement.gsData[0].groundstation = true;
                    }
                    else if(obj[i].type == "chainanaysis"){
                        type = APC.NODETYPE_CHAIN_ANALYSIS;
                        iconCls = APC.NODETYPE_CHAIN_ANALYSIS;
                    }
                    else{
                        AnalysisManagement.gsData[0].satellite = true;
                        obj[i].StartSimuTime = me.getDate(obj[i].StartSimuTime);
                        obj[i].StopSimuTime = me.getDate(obj[i].StopSimuTime);
                        obj[i].epochTime = me.getDate(obj[i].epochTime);
                    }
                    var newList = Ext.create('DataTransAnalysisApp.model.SolutionTreeModel', {
                        name: obj[i].name,
                        leaf: true,
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
                me.dataTransAnalysisPanel = Ext.create('DataTransAnalysisApp.view.DataTransAnalysisPanel');
                me.getOuterCenterPanel().add(me.dataTransAnalysisPanel);
            }
            me.dataTransAnalysisPanel.show();
            if(hasSatellite && hasGroundstation){
                me.getApplication().getController("DataTransAnalysisApp.controller.DataTransController").handleInit();//计算过站分析数据
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
    openDataTransTaskList : function(component, e){
        var me = this;
        if(me.antennaInfoWindow == null){
            me.antennaInfoWindow = Ext.create('DataTransAnalysisApp.view.Window.DataTransTaskWindow');
        }
        me.antennaInfoWindow.queryById('dataTransTaskGridPanel').store.proxy.extraParams = {
            userId: sessionStorage.getItem("userId")
        };
        me.antennaInfoWindow.queryById('dataTransTaskGridPanel').store.reload();
        me.antennaInfoWindow.show();
    },
    openDataTransTask : function(grid, rowindex, e){
        var record = grid.getSelectionModel().getSelection();
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "DataTransAnalysisManage/getTaskTree.json",
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
        var ymd = date.split("T")[0];
        var hms = date.split("T")[1].split(".")[0];
        var d = new Date(ymd.replace(/-/g,   "/"));
        d.setHours(parseInt(hms.split(":")[0]));
        d.setMinutes(parseInt(hms.split(":")[1]));
        d.setSeconds(parseInt(hms.split(":")[2]));
        return d;
    }
});
