Ext.define('AppPlat.controller.TreeController', {
    extend: 'Ext.app.Controller',

    views: [
        'SolutionTree',
        'ButtonGroupPanel',
        'ContextMenu',
        'PropertyWindow',
        'OrbitDesign.SatelliteParaWindow'
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
            ref: 'orbitScenePanel',
            selector: 'orbitscenepanel'
        },
        {
            ref: 'outerCenterPanel',
            selector: 'outercenterpanel'
        },
        {
            ref: 'treeToolbar',
            selector: 'treetoolbar'
        },
        {
            ref: 'buttonGroupPanel',
            selector: 'buttongrouppanel'
        },
        {
            ref: 'outerCenterPanel',
            selector: 'outercenterpanel'
        },
        {
            ref: 'satelliteParaWindow',
            selector: 'satelliteparawindow'
        },
        {
            ref: 'contextMenu',
            selector: 'contextmenu',
            xtype: 'contextmenu',
            autoCreate: true
        }
    ],
    solutionNumber: 2,
    satelliteNumber: 1,
    groundStationNumber: 1,
    skyPointNumber:1,
    skyReginNumber:1,
    sensorNumber:1,
    chainAnalysisNumber:1,
    isTaskCreator: null,
    satelliteParaWindow: null,
    dataTransAnalysisNode: null,//保存最近点击的数据传输分析节点，在保存链路分析数据的时候使用
    expandedNodeArray: new Array(),//记录当前树上展开的节点
    selectedNode: null,//存储当前选中的节点
    webSocket: null,
    taskId: null,
    concreteSubjectMenu:null,
    concreteSubjectButton:null,
    init: function (application) {
        var me = this,
            solutionTreeStore = me.getStore('SolutionTreeStore');
        ColArgu.init();
        this.control({
            '#btnMax': {
                click: this.OnPostCommandMax
            },
            '#btnRestore': {
                click: this.OnPostCommandRestore
            },
            //为弹出菜单定义事件
            '#newSolutionItem': {
                click: me.handleNewSolutionClick
            },
            '#newSatelliteItem': {
                click: me.handleNewSatelliteClick
            },
            '#newGroundStationItem': {
                click: me.handleNewGroundStationItemClick
            },
            '#addSensorItem':{
                click: me.handleAddSensorItemClick
            },
            '#addSkyPointItem':{
                click: me.handleAddSkyPointItemClick
            },
            '#addSkyReginItem':{
                click: me.handleAddSkyReginItemClick
            },
            '#deleteNodeItem': {
                click: me.handleDeleteClick
            },
            '#loadStruct': {
                click: me.handleLoadStructClick
            },
            '#renameNodeItem': {
                click: me.handleRenameClick
            },
            '#propertyItem': {
                click: me.openParaWindow
            },
            '#newCoverAnalysisItem': {
                click: me.handleNewCoverAnalysisClick
            },
            '#newDataTransAnalysisItem': {
                click: me.handleNewDataTransAnalyClick
            },
            '#newStructureItem': {
                click: me.handleNewStructureClick
            },
            '#newOverStaAnalyItem': {
                click: me.handleNewOSAClick
            },
            '#newChainAnalyItem': {
                click: me.handleNewCAClick
            },
            '#processSubmitButton': {
                click: me.handleProcessSubmit
            },

            //为下拉按钮定义事件
            '#newSolutionMenu': {
                click: me.handleNewSolutionClick
            },
            '#newSatelliteMenu': {
                click: me.handleNewSatelliteClick
            },
            '#newGroundStationMenu': {
                click: me.handleNewGroundStationItemClick
            },
            '#newCoverAnalyMenu': {
                click: me.handleNewCoverAnalysisClick
            },
            '#newDataTransAnalyMenu': {
                click: me.handleNewDataTransAnalyClick
            },
            '#newStructureMenu': {
                click: me.handleNewStructureClick
            },
            '#newOverStaAnalyMenu': {
                click: me.handleNewOSAClick
            },
            '#newChainAnalyMenu': {
                click: me.handleNewCAClick
            },
            '#addSensorMenu':{
                click: me.handleAddSensorItemClick
            },
            '#addSkyPointMenu':{
                click: me.handleAddSkyPointItemClick
            },
            '#SkyCoverRegin':{
                click: me.handleAddSkyReginItemClick
            },

            'solutiontree': {
                edit: me.updateList,
                validateedit: me.validateEdit,
                itemcontextmenu: me.handleIemRightClicked,
                containercontextmenu: me.handleContainerRightClicked,
                beforeitemexpand: me.expandNode,
                itemexpand: me.handleTreeItemExpand,
                select: me.handleItemSelected,
                containerclick: me.handleContainerClick,
                itemcollapse: me.handleItemCollapse
            },
            //当卫星轨道参数的的窗口关闭时的响应函数
            'satelliteparawindow': {
                close: me.satelliteParaWindowClose
            },
            "satelliteparawindow combobox[itemId=attitudeType]": {
                change: me.onParaAttitudeTypeChg
            },
            //修改卫星轨道时
            //中心星体改变的响应事件
            "satelliteparawindow combobox[itemId=starcombo]": {
                change:me.onParastarChg
            },
            //仿真开始时间改变的响应事件
            "satelliteparawindow datetimefield[itemId=startSimuTime]": {
                change:me.onParastartChg
            },
            //仿真结束时间改变的响应事件
            "satelliteparawindow datetimefield[itemId=stopSimuTime]": {
                change:me.onParastopChg
            },
            //历元时刻改变的响应事件
            "satelliteparawindow datetimefield[itemId=epochTime]": {
                change:me.onParaepochChg
            },
            //坐标系改变的响应事件
            "satelliteparawindow combobox[itemId=axescombo]": {
                change:me.onParacChg
            },
            //半长轴改变的响应事件
            "satelliteparawindow textfield[itemId=paraanfield]": {
                change:me.onParaaChg
            },
            //偏心率改变的响应事件
            "satelliteparawindow textfield[itemId=paraenfield]": {
                change:me.onParaeChg
            },
            //轨道倾角改变的响应事件
            "satelliteparawindow textfield[itemId=parainfield]": {
                change:me.onParaiChg
            },
            //升交点赤经改变的响应事件
            "satelliteparawindow textfield[itemId=paraOmnfield]": {
                change:me.onParaOmChg
            },
            //近心点幅角改变的响应事件
            "satelliteparawindow textfield[itemId=paraomnfield]": {
                change:me.onParaomChg
            },
            //真近点角改变的响应事件
            "satelliteparawindow textfield[itemId=parathetanfield]": {
                change:me.onParathetaChg
            },
            //偏航角改变的响应事件
            "satelliteparawindow textfield[itemId=driftAnglenfield]": {
                change:me.onParaDrifChg
            },
            //滚转角改变的响应事件
            "satelliteparawindow textfield[itemId=rollAnglenfield]": {
                change:me.onParaRollChg
            },
            //俯仰角改变的响应事件
            "satelliteparawindow textfield[itemId=pitchAnglenfield]": {
                change:me.onParaPitchChg
            },
            //方位角改变的响应事件
            "satelliteparawindow textfield[itemId=azimuthalAnglenfield]": {
                change:me.onParaAzimuthaChg
            },
            //仰角改变的响应事件
            "satelliteparawindow textfield[itemId=elevationAnglenfield]": {
                change:me.onParaElevationChg
            },
            //自旋速度改变的响应事件
            "satelliteparawindow textfield[itemId=spinSpeednfield]": {
                change:me.onParaSpinChg
            }
        });
    },
    onLaunch: function (application) {
        var me = this;
        me.startWebSocket();
        this.taskId = sessionStorage.getItem(APC.SELECTED_TASK_ID);
        sessionStorage.removeItem(APC.SELECTED_TASK_ID);
        this.concreteSubjectMenu = new ConcreteSubject();
        this.concreteSubjectButton = new ConcreteSubject2();
        this.registereButtonListeners();
        this.registereMenuButtonListeners();
        this.concreteSubjectButton.nodeType = APC.PANEL_TYPE_ORBIT_DESIGN;
        this.concreteSubjectButton.notify();
        me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('sun');
    },
    addMenuButtonObserversToSubject: function (buttonAndTypeArray) {
        for (i = 0; i < buttonAndTypeArray.length; i++) {
            var concreateObserver = new MenuObserver();
            concreateObserver.visibleTypeList = buttonAndTypeArray[i].typeList;
            concreateObserver.menuButton = buttonAndTypeArray[i].button;
            concreateObserver.concreteSubject = this.concreteSubjectMenu;
            this.concreteSubjectMenu.addObserver(concreateObserver);
        }
    },
    addButtonObserversToSubject: function (buttonAndTypeArray) {
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
        //添加点击结构节点需要显示的按钮组
        var newNodeGroup = me.getButtonGroupPanel().queryById('newNodeGroup');
        buttonAndTypeArray[i++] = new BtnAndType(newNodeGroup, [APC.PANEL_TYPE_ORBIT_DESIGN,APC.PANEL_TYPE_STRUCT_DESIGN]);
        var simuparaBtn = me.getButtonGroupPanel().queryById('simuparaBtn');
        buttonAndTypeArray[i++] = new BtnAndType(simuparaBtn, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var VisibileCtrlButton = me.getButtonGroupPanel().queryById('VisibileCtrlButton');
        buttonAndTypeArray[i++] = new BtnAndType(VisibileCtrlButton, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var simuPLBtn = me.getButtonGroupPanel().queryById('simuPLBtn');
        buttonAndTypeArray[i++] = new BtnAndType(simuPLBtn, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var simuRWBtn = me.getButtonGroupPanel().queryById('simuRWBtn');
        buttonAndTypeArray[i++] = new BtnAndType(simuRWBtn, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var simuSTBtn = me.getButtonGroupPanel().queryById('simuSTBtn');
        buttonAndTypeArray[i++] = new BtnAndType(simuSTBtn, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var simuFFBtn = me.getButtonGroupPanel().queryById('simuFFBtn');
        buttonAndTypeArray[i++] = new BtnAndType(simuFFBtn, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var planetCombo = me.getButtonGroupPanel().queryById('planetCombo');
        buttonAndTypeArray[i++] = new BtnAndType(planetCombo, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var simutime = me.getButtonGroupPanel().queryById('simutime');
        buttonAndTypeArray[i++] = new BtnAndType(simutime, [APC.PANEL_TYPE_ORBIT_DESIGN]);
        var planetScaleSlider = me.getButtonGroupPanel().queryById('planetScaleSlider');
        buttonAndTypeArray[i++] = new BtnAndType(planetScaleSlider, [APC.PANEL_TYPE_ORBIT_DESIGN]);

        var planetAxesCombo = me.getButtonGroupPanel().queryById('planetAxesCombo');
        buttonAndTypeArray[i++] = new BtnAndType(planetAxesCombo, [APC.PANEL_TYPE_NO_SHOW]);
        var earthAxesCombo = me.getButtonGroupPanel().queryById('earthAxesCombo');
        buttonAndTypeArray[i++] = new BtnAndType(earthAxesCombo, [APC.PANEL_TYPE_NO_SHOW]);
        var otherAxesCombo = me.getButtonGroupPanel().queryById('otherAxesCombo');
        buttonAndTypeArray[i++] = new BtnAndType(otherAxesCombo, [APC.PANEL_TYPE_NO_SHOW]);

        var btnAdvancedPanel = me.getButtonGroupPanel().queryById('btnAdvancedPanel');
        buttonAndTypeArray[i++] = new BtnAndType(btnAdvancedPanel, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnList = me.getButtonGroupPanel().queryById('btnList');
        buttonAndTypeArray[i++] = new BtnAndType(btnList, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnTranslate = me.getButtonGroupPanel().queryById('btnTranslate');
        buttonAndTypeArray[i++] = new BtnAndType(btnTranslate, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnRotate = me.getButtonGroupPanel().queryById('btnRotate');
        buttonAndTypeArray[i++] = new BtnAndType(btnRotate, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnScale = me.getButtonGroupPanel().queryById('btnScale');
        buttonAndTypeArray[i++] = new BtnAndType(btnScale, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnCombine = me.getButtonGroupPanel().queryById('btnCombine');
        buttonAndTypeArray[i++] = new BtnAndType(btnCombine, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnSeparate = me.getButtonGroupPanel().queryById('btnSeparate');
        buttonAndTypeArray[i++] = new BtnAndType(btnSeparate, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnAssembly = me.getButtonGroupPanel().queryById('btnAssembly');
        buttonAndTypeArray[i++] = new BtnAndType(btnAssembly, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var StructAlign = me.getButtonGroupPanel().queryById('StructAlign');
        buttonAndTypeArray[i++] = new BtnAndType(StructAlign, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnSelectBox = me.getButtonGroupPanel().queryById('btnSelectBox');
        buttonAndTypeArray[i++] = new BtnAndType(btnSelectBox, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnCopy = me.getButtonGroupPanel().queryById('btnCopy');
        buttonAndTypeArray[i++] = new BtnAndType(btnCopy, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnDelete = me.getButtonGroupPanel().queryById('btnDelete');
        buttonAndTypeArray[i++] = new BtnAndType(btnDelete, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var StructObservation = me.getButtonGroupPanel().queryById('StructObservation');
        buttonAndTypeArray[i++] = new BtnAndType(StructObservation, [APC.PANEL_TYPE_STRUCT_DESIGN]);
        var btnUpdate = me.getButtonGroupPanel().queryById('btnUpdate');
        buttonAndTypeArray[i++] = new BtnAndType(btnUpdate, [APC.PANEL_TYPE_STRUCT_DESIGN]);

//        var btnCoverAnalysis = me.getButtonGroupPanel().queryById('btnCoverAnalysis');
//        buttonAndTypeArray[i++] = new BtnAndType(btnCoverAnalysis, [APC.PANEL_TYPE_COVER_ANALYSIS]);
//        var btnOverStationAnalysis = me.getButtonGroupPanel().queryById('btnOverStationAnalysis');
//        buttonAndTypeArray[i++] = new BtnAndType(btnOverStationAnalysis, [APC.PANEL_TYPE_DATA_TRANS_ANALYSIS]);
//        var btnChainAnalysis = me.getButtonGroupPanel().queryById('btnChainAnalysis');
//        buttonAndTypeArray[i++] = new BtnAndType(btnChainAnalysis, [APC.PANEL_TYPE_DATA_TRANS_ANALYSIS]);

        me.addButtonObserversToSubject(buttonAndTypeArray);
    },
    registereMenuButtonListeners: function () {
        var me = this;
        var i = 0;
        var buttonAndTypeArray = new Array();

        var newBuildItem = me.getContextMenu().queryById('newBuildItem');
        buttonAndTypeArray[i++] = new BtnAndType(newBuildItem, [APC.NODETYPE_NO_ROOT, APC.NODETYPE_SOLUTION,APC.NODETYPE_SATELLITE,APC.NODETYPE_COVER_ANALYSIS]);
        var newSolutionItem = me.getContextMenu().queryById('newSolutionItem');
        buttonAndTypeArray[i++] = new BtnAndType(newSolutionItem, [APC.NODETYPE_NO_ROOT]);
        var newSatelliteItem = me.getContextMenu().queryById('newSatelliteItem');
        buttonAndTypeArray[i++] = new BtnAndType(newSatelliteItem, [APC.NODETYPE_SOLUTION]);
        var newGroundStationItem = me.getContextMenu().queryById('newGroundStationItem');
        buttonAndTypeArray[i++] = new BtnAndType(newGroundStationItem, [APC.NODETYPE_COVER_ANALYSIS]);
        var newCoverAnalysisItem = me.getContextMenu().queryById('newCoverAnalysisItem');
        buttonAndTypeArray[i++] = new BtnAndType(newCoverAnalysisItem, [APC.NODETYPE_SOLUTION]);
        var newDataTransAnalysisItem = me.getContextMenu().queryById('newDataTransAnalysisItem');
        buttonAndTypeArray[i++] = new BtnAndType(newDataTransAnalysisItem, [APC.NODETYPE_SOLUTION]);
        var newStructureItem = me.getContextMenu().queryById('newStructureItem');
        buttonAndTypeArray[i++] = new BtnAndType(newStructureItem, [APC.NODETYPE_SATELLITE]);
        var propertyItem = me.getContextMenu().queryById('propertyItem');
        buttonAndTypeArray[i++] = new BtnAndType(propertyItem, [APC.NODETYPE_SATELLITE,APC.NODETYPE_GROUNDSTATION,APC.NODETYPE_SKY_COVER_POINT,APC.NODETYPE_SKY_COVER_REGIN,APC.NODETYPE_SENSOR]);
        var loadStruct = me.getContextMenu().queryById('loadStruct');
        buttonAndTypeArray[i++] = new BtnAndType(loadStruct, [APC.NODETYPE_SATELLITE]);
        var renameNodeItem = me.getContextMenu().queryById('renameNodeItem');
        buttonAndTypeArray[i++] = new BtnAndType(renameNodeItem, [APC.NODETYPE_SOLUTION, APC.NODETYPE_SATELLITE, APC.NODETYPE_STRUCTURE, APC.NODETYPE_GROUNDSTATION, APC.NODETYPE_STRUCTURE, APC.NODETYPE_COVER_ANALYSIS, APC.NODETYPE_DATATRANS_ANALYSIS,APC.NODETYPE_SENSOR,APC.NODETYPE_SKY_COVER_REGIN,APC.NODETYPE_SKY_COVER_POINT]);
        var deleteNodeItem = me.getContextMenu().queryById('deleteNodeItem');
        buttonAndTypeArray[i++] = new BtnAndType(deleteNodeItem, [APC.NODETYPE_SOLUTION, APC.NODETYPE_SATELLITE, APC.NODETYPE_STRUCTURE, APC.NODETYPE_GROUNDSTATION, APC.NODETYPE_STRUCTURE, APC.NODETYPE_COVER_ANALYSIS, APC.NODETYPE_DATATRANS_ANALYSIS,APC.NODETYPE_CHAIN_ANALYSIS,APC.NODETYPE_SENSOR,APC.NODETYPE_SKY_COVER_REGIN,APC.NODETYPE_SKY_COVER_POINT]);

        var addSkyReginItem = me.getContextMenu().queryById('addSkyReginItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyReginItem, [APC.NODETYPE_COVER_ANALYSIS]);
        var addSkyPointItem = me.getContextMenu().queryById('addSkyPointItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyPointItem, [APC.NODETYPE_COVER_ANALYSIS]);

        var addSensorItem = me.getContextMenu().queryById('addSensorItem');
        buttonAndTypeArray[i++] = new BtnAndType(addSensorItem, [APC.NODETYPE_SATELLITE]);


        //添加在选择不同树节点的时候新建按钮需要显示的按钮
        var newSolutionMenu = me.getButtonGroupPanel().queryById('newSolutionMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newSolutionMenu, [APC.NODETYPE_NO_ROOT]);
        var newSatelliteMenu = me.getButtonGroupPanel().queryById('newSatelliteMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newSatelliteMenu, [APC.NODETYPE_SOLUTION]);
        var newGroundStationMenu = me.getButtonGroupPanel().queryById('newGroundStationMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newGroundStationMenu, [APC.NODETYPE_SOLUTION]);
        var newCoverAnalyMenu = me.getButtonGroupPanel().queryById('newCoverAnalyMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newCoverAnalyMenu, [APC.NODETYPE_SOLUTION]);
        var newDataTransAnalyMenu = me.getButtonGroupPanel().queryById('newDataTransAnalyMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newDataTransAnalyMenu, [APC.NODETYPE_SOLUTION]);
        var newStructureMenu = me.getButtonGroupPanel().queryById('newStructureMenu');
        buttonAndTypeArray[i++] = new BtnAndType(newStructureMenu, [APC.NODETYPE_SATELLITE]);
        var addSensorMenu = me.getButtonGroupPanel().queryById('addSensorMenu');
        buttonAndTypeArray[i++] = new BtnAndType(addSensorMenu, [APC.NODETYPE_SATELLITE]);
        var addSkyPointMenu = me.getButtonGroupPanel().queryById('addSkyPointMenu');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyPointMenu, [APC.NODETYPE_COVER_ANALYSIS]);
        var addSkyReginMenu = me.getButtonGroupPanel().queryById('addSkyReginMenu');
        buttonAndTypeArray[i++] = new BtnAndType(addSkyReginMenu, [APC.NODETYPE_COVER_ANALYSIS]);
        me.addMenuButtonObserversToSubject(buttonAndTypeArray);
    },
    OnPostCommandMax: function () {
        this.getOuterCenterPanel().remove('orbitDesignPanel');
        var structDesignPanel = Ext.create('AppPlat.view.StructDesign.StructDesignPanel');
        this.getOuterCenterPanel().add(structDesignPanel);
        if (window.parent != window) {
            var data = {
                "command": "max"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
        }
    },
    OnPostCommandRestore: function () {

        if (window.parent != window) {
            var data = {
                "command": "restore"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
        }
    },
    /*
     * 处理树状视图右击事件
     */
    handleContainerRightClicked: function (component, e, eOpts) {
        this.concreteSubjectMenu.nodeType = APC.NODETYPE_NO_ROOT;
        this.concreteSubjectMenu.notify();
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    handleIemRightClicked: function (view, list, node, rowIndex, e, contextMenu) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.select(list);
        this.getContextMenu().setList(list);
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    handleItemSelected: function (view, record, index, eOpts) {
        this.concreteSubjectMenu.nodeType = record.get('nodeType');
        this.concreteSubjectMenu.notify();
        //在选树节点的时候，如果选择的是数传分析节点，那么将数传分析节点保存在变量中
        if (record.get('nodeType') == APC.DATA_TRANS_ANALYSIS) {
            this.dataTransAnalysisNode = record;
        }
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
//            if (cid != ORBIT.tracedObject.id) {
//                var pid = 'angel' + cid.charAt(0).toUpperCase() + cid.substring(1);
//                this.getButtonGroupPanel().queryById('planetCombo').setValue(pid);
//            }
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
    handleContainerClick: function (listTree, e, eOpts) {
        this.concreteSubjectMenu.nodeType = APC.NODETYPE_NO_ROOT;
        this.concreteSubjectMenu.notify();
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
    },
    //重复性验证
    repeatabilityVerification: function (text, childrenNames) {
        var i;
        for (i = 0; i < childrenNames.length; i++) {
            if (childrenNames[i] == text) {
                return true;
            }
        }
        return false;
    },
    getRightClickedNode: function () {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //slectionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        return selectedList;
    },

    handleNewSolutionClick: function (component, e) {
        var me = this;
        var text = '方案' + me.solutionNumber;
        var rootNode = me.getSolutionTree().getRootNode();
        var childrenNames = new Array();
        var childrenNodes = rootNode.childNodes;
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.solutionNumber++;
            text = '方案' + me.solutionNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        };
        //初始化覆盖分析数据结构的数据
//        AnalysisManagement.prototype.emptyData();
        AnalysisManagement.prototype.initTaskData();
        me.addList(APC.NODETYPE_SOLUTION, text,me.getSolutionTree().getRootNode());
    },
    handleNewSatelliteClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addSatellite();
                }
                ,this);
        }
        else{
            me.addSatellite();
        }
    },
    addSatellite:function(){
        var me = this;
        var text = '卫星' + me.satelliteNumber;
        var childrenNodes = me.getRightClickedNode().childNodes;
        var childrenNames = new Array();
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.satelliteNumber++;
            text = '卫星' + me.satelliteNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        }
        me.addList(APC.NODETYPE_SATELLITE, text,me.getRightClickedNode());
    },
    handleNewGroundStationItemClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addGroundStation();
                }
                ,this);
        }
        else{
            me.addGroundStation();
        }
    },
    addGroundStation:function(){
        var me = this;
        var text = '地面站' + me.groundStationNumber;
        var childrenNodes = me.getRightClickedNode().childNodes;
        var childrenNames = new Array();
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.groundStationNumber++;
            text = '地面站' + me.groundStationNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        }
        me.addList(APC.NODETYPE_GROUNDSTATION, text,me.getRightClickedNode());
    },

    handleAddSensorItemClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addSensor();
                }
                ,this);
        }
        else{
            me.addSensor();
        }
    },
    addSensor:function(){
        var me = this;
        var text = '传感器' + me.sensorNumber;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "TreeManage/getAllSensorsBySolutionId.json",
            method: 'GET',
            params: {
                solutionId: me.getRightClickedNode().parentNode.get('id')
            },
            success: function (response) {
                var childrenNames = JSON.parse(response.responseText);
                var isRepeat = me.repeatabilityVerification(text, childrenNames);
                while (isRepeat) {
                    me.sensorNumber++;
                    text = '传感器' + me.sensorNumber;
                    isRepeat = me.repeatabilityVerification(text, childrenNames);
                }
                me.addList(APC.NODETYPE_SENSOR, text,me.getRightClickedNode());
            }
        });

    },
    handleAddSkyPointItemClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addSkyPoint();
                }
                ,this);
        }
        else{
            me.addSkyPoint();
        }
    },
    addSkyPoint:function(){
        var me = this;
        var text = '天区点目标' + me.skyPointNumber;
        var childrenNodes = me.getRightClickedNode().childNodes;
        var childrenNames = new Array();
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.skyPointNumber++;
            text = '天区点目标' + me.skyPointNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        }
        me.addList(APC.NODETYPE_SKY_COVER_POINT, text,me.getRightClickedNode());
    },

    handleAddSkyReginItemClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addSkyRegin();
                }
                ,this);
        }
        else{
            me.addSkyRegin();
        }
    },
    addSkyRegin:function(){
        var me = this;
        var text = '天区区域目标' + me.skyReginNumber;
        var childrenNodes = me.getRightClickedNode().childNodes;
        var childrenNames = new Array();
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.skyReginNumber++;
            text = '天区区域目标' + me.skyReginNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        }
        me.addList(APC.NODETYPE_SKY_COVER_REGIN, text,me.getRightClickedNode());
    },


    newChainAnalysisClick: function () {
        var me = this;
        if(!me.dataTransAnalysisNode.isExpanded()){
            me.dataTransAnalysisNode.expand(false,
                function(optional){
                    me.addChainAnalysis();
                }
                ,this);
        }
        else{
            me.addChainAnalysis();
        }

    },
    addChainAnalysis: function(){
        var me = this;
        var text = '链路分析' + me.chainAnalysisNumber;
        var childrenNodes = me.dataTransAnalysisNode.childNodes;
        var childrenNames = new Array();
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                childrenNames.push(childrenNodes[i].get('name'));
            }
        }
        var isRepeat = me.repeatabilityVerification(text, childrenNames);
        while (isRepeat) {
            me.chainAnalysisNumber++;
            text = '链路分析' + me.chainAnalysisNumber;
            isRepeat = me.repeatabilityVerification(text, childrenNames);
        }
        me.addList(APC.NODETYPE_CHAIN_ANALYSIS, text,me.dataTransAnalysisNode);
    },
    handleNewCoverAnalysisClick: function (component, e) {
        this.addList(APC.NODETYPE_COVER_ANALYSIS, ColArgu.addNodeManage.defaultName(APC.NODETYPE_COVER_ANALYSIS),this.getRightClickedNode());
    },
    handleNewDataTransAnalyClick: function (component, e) {
        this.addList(APC.NODETYPE_DATATRANS_ANALYSIS, ColArgu.addNodeManage.defaultName(APC.NODETYPE_DATATRANS_ANALYSIS),this.getRightClickedNode());
    },
    handleNewStructureClick: function (component, e) {
        var me = this;
        if(!me.getRightClickedNode().isExpanded()){
            me.getRightClickedNode().expand(false,
                function(optional){
                    me.addList(APC.NODETYPE_STRUCTURE, ColArgu.addNodeManage.defaultName(APC.NODETYPE_STRUCTURE),this.getRightClickedNode());
                }
                ,this);
        }
        else{
            me.addList(APC.NODETYPE_STRUCTURE, ColArgu.addNodeManage.defaultName(APC.NODETYPE_STRUCTURE),this.getRightClickedNode());
        }
    },
    handleNewOSAClick: function (component, e) {
        this.addList(APC.NODETYPE_OVERSTATION_ANALYSIS, ColArgu.addNodeManage.defaultName(APC.NODETYPE_OVERSTATION_ANALYSIS),this.getRightClickedNode());
    },
    handleNewCAClick: function (component, e) {
        this.addList(APC.NODETYPE_CHAIN_ANALYSIS, ColArgu.addNodeManage.defaultName(APC.NODETYPE_CHAIN_ANALYSIS),this.getRightClickedNode());
    },
    handleProcessSubmit: function (button, e, eOpts) {
        if (sessionStorage.getItem(APC.CURRENT_PROCESS) != null) {
            Ext.Ajax.request({
                url: APC.APPPLAT_SERVICE_URL_PREFIX + "TreeManage/processSubmit.json",
                method: 'GET',
                params: {
                    currentProcess: sessionStorage.getItem(APC.CURRENT_PROCESS)
                },
                success: function (response) {

                }
            });
        }
    },
    //判断是否是重命名当前卫星或方案
    isRenameCurrentSatOrSou: function(selectedList){
        var type = selectedList.get('nodeType');
        var solutionName = selectedList.get('name');
        if(type == APC.NODETYPE_SATELLITE || type == APC.NODETYPE_SOLUTION){
            if(type == APC.NODETYPE_SATELLITE){
                solutionName = selectedList.parentNode.get('name');
            }
            if(solutionName == ORBIT.fileName){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    },
    handleRenameClick: function (component, e) {
        var listTree = this.getSolutionTree(),
            cellEditingPlugin = listTree.cellEditingPlugin,
            selectionModel = listTree.getSelectionModel(),
            selectedList = selectionModel.getSelection()[0];
        if(this.isRenameCurrentSatOrSou(selectedList)){
            cellEditingPlugin.startEdit(selectedList, 0);
        }
        else{
            //提示不能重命名（因为重命名不在当前场景的卫星或方案，无法更新后台场景数组）
            Ext.MessageBox.show({title: '消息', msg: '您不在该方案中，不能重命名', buttons: Ext.Msg.OK});
        }
    },
    //刷新卫星属性的输入框中的值
    refreshSatParaField: function(){
        if(ORBIT.satelliteName != null && ORBIT.satelliteName != undefined){
            var sid = ORBIT.satelliteName;
            var satellite = ORBIT.satellite[sid];
            this.queryById('starcombo').setValue(satellite.centerid);
            this.queryById('startSimuTime').setValue(satellite.t_start);
            this.queryById('stopSimuTime').setValue(satellite.t_stop);
            this.queryById('epochTime').setValue(satellite.epochTime);
            this.queryById('axescombo').setValue(satellite.axis);
            this.queryById('paraanfield').setValue(ORBIT.orbitpara[sid].a);
            this.queryById('paraenfield').setValue(ORBIT.orbitpara[sid].e);
            var pi = 180 / Math.PI;
            var i = ORBIT.orbitpara[sid].i * pi;
            var Om = ORBIT.orbitpara[sid].Om * pi, om = ORBIT.orbitpara[sid].om * pi, theta = ORBIT.orbitpara[sid].theta * pi;
            this.queryById('parainfield').setValue(i);
            this.queryById('paraOmnfield').setValue(Om);
            this.queryById('paraomnfield').setValue(om);
            this.queryById('parathetanfield').setValue(theta);

            this.queryById('attitudeType').setValue(satellite.attitudeType);
            if (satellite.attitudeType == "3axes") {
                this.queryById('driftAnglenfield').setValue(satellite.driftAzimuthal * pi);
                this.queryById('rollAnglenfield').setValue(satellite.rollElevation * pi);
                this.queryById('pitchAnglenfield').setValue(satellite.pitchSpinSpeed * pi);
            }
            else {
                this.queryById('azimuthalAnglenfield').setValue(satellite.driftAzimuthal * pi);
                this.queryById('elevationAnglenfield').setValue(satellite.rollElevation * pi);
                this.queryById('spinSpeednfield').setValue(satellite.pitchSpinSpeed);
            }
        }
    },
    //将卫星属性的输入框enable掉
    enableSatParaField: function(){
        if(ORBIT.satelliteName != null && ORBIT.satelliteName != undefined){
            this.queryById('starcombo').enable();
            this.queryById('startSimuTime').enable();
            this.queryById('stopSimuTime').enable();
            this.queryById('epochTime').enable();
            this.queryById('axescombo').enable();
            this.queryById('paraanfield').enable();
            this.queryById('paraenfield').enable();
            this.queryById('parainfield').enable();
            this.queryById('paraOmnfield').enable();
            this.queryById('paraomnfield').enable();
            this.queryById('parathetanfield').enable();
            this.queryById('attitudeType').enable();
            this.queryById('driftAnglenfield').enable();
            this.queryById('rollAnglenfield').enable();
            this.queryById('pitchAnglenfield').enable();
            this.queryById('azimuthalAnglenfield').enable();
            this.queryById('elevationAnglenfield').enable();
            this.queryById('spinSpeednfield').enable();
        }
    },
    //将卫星属性的输入框disable掉
    disableSatParaField: function(){
        if(ORBIT.satelliteName != null && ORBIT.satelliteName != undefined){
            this.queryById('starcombo').disable();
            this.queryById('startSimuTime').disable();
            this.queryById('stopSimuTime').disable();
            this.queryById('epochTime').disable();
            this.queryById('axescombo').disable();
            this.queryById('paraanfield').disable();
            this.queryById('paraenfield').disable();
            this.queryById('parainfield').disable();
            this.queryById('paraOmnfield').disable();
            this.queryById('paraomnfield').disable();
            this.queryById('parathetanfield').disable();
            this.queryById('attitudeType').disable();
            this.queryById('driftAnglenfield').disable();
            this.queryById('rollAnglenfield').disable();
            this.queryById('pitchAnglenfield').disable();
            this.queryById('azimuthalAnglenfield').disable();
            this.queryById('elevationAnglenfield').disable();
            this.queryById('spinSpeednfield').disable();
        }
    },
    //打开卫星属性面板
    openParaWindow: function (view, record, item, index, e, eOpts) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //electionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        if (selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                if(selectedList.parentNode.get('name') == ORBIT.fileName){
                    if (this.satelliteParaWindow == null) {
                        this.satelliteParaWindow = Ext.create('AppPlat.view.OrbitDesign.SatelliteParaWindow');
                        this.satelliteParaWindow.refreshSatParaField = this.refreshSatParaField;
                        this.satelliteParaWindow.enableSatParaField = this.enableSatParaField;
                        this.satelliteParaWindow.disableSatParaField = this.disableSatParaField;
                    }
                    var basePosition = me.getOrbitScenePanel().getPosition();
                    basePosition[0] += me.getOrbitScenePanel().getWidth() - this.satelliteParaWindow.width;
                    this.satelliteParaWindow.setPosition(basePosition[0], basePosition[1], true);

                    ORBIT.satelliteName = selectedList.get('name');
                    this.satelliteParaWindow.refreshSatParaField();
                    //选中该卫星
                    this.updateAngleCombo(selectedList.get('name'));
                    this.changeSelectSate(selectedList.get('nodeType'), selectedList.get('name'));
                    this.satelliteParaWindow.show();
                }
                else{
                    Ext.MessageBox.show({title: '消息', msg: '您不在该方案中', buttons: Ext.Msg.OK});
                }
            }
            else if(selectedList.get('nodeType') == APC.NODETYPE_GROUNDSTATION){
                me.getController('AppPlat.controller.OrbitDesign.GroundStationController').getGsPropertyWindow(selectedList);
            }
            else if(selectedList.get('nodeType') == APC.NODETYPE_SKY_COVER_POINT){
                me.getController('AppPlat.controller.OrbitDesign.GroundStationController').getScPointPropertyWindow(selectedList);
            }
            else if(selectedList.get('nodeType') == APC.NODETYPE_SKY_COVER_REGIN){
                me.getController('AppPlat.controller.OrbitDesign.GroundStationController').getScReginPropertyWindow(selectedList);
            }
            else if(selectedList.get('nodeType') == APC.NODETYPE_SENSOR){
                me.getController('AppPlat.controller.OrbitDesign.GroundStationController').getSensorPropertyWindow(selectedList);
            }
        }
    },
    //当卫星轨道参数的的窗口关闭时的响应函数
    satelliteParaWindowClose: function(window, eOpts){
        ORBIT.satelliteName = null;
    },
    //判断当前选中的卫星与属性面板是否一样，若不一样，隐藏特征点
    hideChaBySatName: function(){
        var selectedId = ORBIT.Satellite.getSelectedSatId();
        if(selectedId){
            hideCharacter();
            showCharacter(selectedId);
        }
        else{
            hideCharacter();
        }
//        if(!ORBIT.isSelectSat){
//            ORBIT.Orbit.resetOrbitColor();
//        }
//        else{
//            if(ORBIT.satelliteName != ORBIT.selectOrbit){
//                ORBIT.Orbit.resetOrbitColor();
//            }
//        }
    },
    //修改卫星轨道时
    //中心星体改变的响应事件
    onParastarChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.satelliteName) {
            ORBIT.orbit[ORBIT.satelliteName].centerid = newValue;
            ORBIT.satellite[ORBIT.satelliteName].centerid = newValue;
            ORBIT.orbitpara[ORBIT.satelliteName].T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(ORBIT.orbitpara[ORBIT.satelliteName].a, 3) / ORBIT.GravitationalConstant[newValue]);
            ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
            ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", newValue);
            ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
            ORBIT.satellite[ORBIT.satelliteName].isExit = true;
            this.hideChaBySatName();
            refreshSatellite(ORBIT.satelliteName);
            refreshOrbit(ORBIT.satelliteName);
            refreshoAxes(ORBIT.satelliteName);
            refreshSatellite();
            refreshCamera();
        }
    },
    //仿真开始时间改变的响应事件
    onParastartChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.satelliteName) {
            if(compareTime(newValue, ORBIT.satellite[ORBIT.satelliteName].t_stop) >= 0){
                ORBIT.satellite[ORBIT.satelliteName].t_start = newValue;
                refreshSatellite();
                refreshoAxes();
                refreshCamera();
                this.satelliteParaWindow.queryById('errorLabel').setText('');
            }
            else {
                this.satelliteParaWindow.queryById('startSimuTime').setValue(oldValue);
                this.satelliteParaWindow.queryById('errorLabel').setText(APC.ERROR_START_TIME_LATE);
            }
        }
    },
    //仿真结束时间改变的响应事件
    onParastopChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.satelliteName) {
            if(compareTime(newValue, ORBIT.satellite[ORBIT.satelliteName].t_start) <= 0) {
                ORBIT.satellite[ORBIT.satelliteName].t_stop = newValue;
                refreshSatellite();
                refreshoAxes();
                refreshCamera();
                this.satelliteParaWindow.queryById('errorLabel').setText('');
            }
            else {
                this.satelliteParaWindow.queryById('stopSimuTime').setValue(oldValue);
                this.satelliteParaWindow.queryById('errorLabel').setText(APC.ERROR_END_TIME_EARLY);
            }
        }
    },
    //历元时刻改变的响应事件
    onParaepochChg: function(numberfield, newValue, oldValue, eOpts){
        ORBIT.satellite[ORBIT.satelliteName].epochTime = newValue;
        refreshSatellite();
        refreshoAxes();
        refreshCamera();
    },
    //坐标系改变的响应事件
    onParacChg: function(numberfield, newValue, oldValue, eOpts){
    },
    detectionUpdateSatelliteInfo: function(value, paraId, paraField){
        var flags = true;
        if(value == null){
            flags = true;
        }
        else if(!this.satelliteParaWindow.queryById(paraField).isValid()){
            flags = false;
        }
        else{
            var flag = ORBIT.formatDetection.detectionOrbitPara(value, ORBIT.min[paraId], ORBIT.max[paraId]);
            if(!flag){
                flags = false;
            }
        }
        return flags;
    },
    //半长轴改变的响应事件
    onParaaChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "a", "paraanfield");
        if(flag && newValue != null) {
            if (ORBIT.satelliteName) {
                ORBIT.orbitpara[ORBIT.satelliteName].a = newValue;
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.orbitpara[ORBIT.satelliteName].T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(newValue, 3) / ORBIT.GravitationalConstant[centerid]);
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueA != undefined) {
                    ORBIT.valueA.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            if(newValue > ORBIT.max['a']){
                this.satelliteParaWindow.queryById('paraanfield').setValue(oldValue);
            }
        }
    },

    //偏心率改变的响应事件
    onParaeChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "e", "paraenfield");
        if(flag) {
            if (ORBIT.satelliteName) {
                if(newValue != null) {
                    ORBIT.orbitpara[ORBIT.satelliteName].e = newValue;
                }
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueE != undefined) {
                    ORBIT.valueE.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            this.satelliteParaWindow.queryById('paraenfield').setValue(oldValue);
        }
    },
    //轨道倾角改变的响应事件
    onParaiChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "i", "parainfield");
        if(flag) {
            if(ORBIT.satelliteName) {
                if(newValue != null) {
                    ORBIT.orbitpara[ORBIT.satelliteName].i = newValue * Math.PI / 180;
                }
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueI != undefined) {
                    ORBIT.valueI.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            this.satelliteParaWindow.queryById('parainfield').setValue(oldValue);
        }
    },
    //升交点赤经改变的响应事件
    onParaOmChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "Om", "paraOmnfield");
        if(flag) {
            if(ORBIT.satelliteName) {
                if(newValue != null) {
                    ORBIT.orbitpara[ORBIT.satelliteName].Om = newValue * Math.PI / 180;
                }
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueO != undefined) {
                    ORBIT.valueO.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            this.satelliteParaWindow.queryById('paraOmnfield').setValue(oldValue);
        }
    },
    //近心点幅角改变的响应事件
    onParaomChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "om", "paraomnfield");
        if(flag) {
            if(ORBIT.satelliteName) {
                if(newValue != null) {
                    ORBIT.orbitpara[ORBIT.satelliteName].om = newValue * Math.PI / 180;
                }
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueW != undefined) {
                    ORBIT.valueW.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            this.satelliteParaWindow.queryById('paraomnfield').setValue(oldValue);
        }
    },
    //真近点角改变的响应事件
    onParathetaChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "theta", "parathetanfield");
        if(flag) {
            if (ORBIT.satelliteName) {
                if(newValue != null) {
                    ORBIT.orbitpara[ORBIT.satelliteName].theta = newValue * Math.PI / 180;
                }
                var centerid = ORBIT.orbit[ORBIT.satelliteName].centerid;
                ORBIT.scene.remove(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.orbit[ORBIT.satelliteName].object = ORBIT.orbit[ORBIT.satelliteName].makeOrbit(ORBIT.orbitpara[ORBIT.satelliteName], "Satellite", centerid, ORBIT.satelliteName);
                ORBIT.scene.add(ORBIT.orbit[ORBIT.satelliteName].object);
                ORBIT.satellite[ORBIT.satelliteName].isExit = true;
                this.hideChaBySatName();
                refreshObject();
                refreshCamera();
                if(ORBIT.valueT != undefined) {
                    ORBIT.valueT.innerHTML = newValue;
                }
                if(ORBIT.selectOrbit != null){
                    ORBIT.cooperation.sendInfo("Modify", ORBIT.selectOrbit);
                }
            }
        }
        else{
            this.satelliteParaWindow.queryById('parathetanfield').setValue(oldValue);
        }
    },
    //偏航角改变的响应事件
    onParaDrifChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "driftAnglenfield", "driftAnglenfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('driftAnglenfield').setValue(oldValue);
        }
    },
    //滚转角改变的响应事件
    onParaRollChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "rollAnglenfield", "rollAnglenfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('rollAnglenfield').setValue(oldValue);
        }
    },
    //俯仰角改变的响应事件
    onParaPitchChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "pitchAnglenfield", "pitchAnglenfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('pitchAnglenfield').setValue(oldValue);
        }
    },
    //方位角改变的响应事件
    onParaAzimuthaChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "azimuthalAnglenfield", "azimuthalAnglenfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('azimuthalAnglenfield').setValue(oldValue);
        }
    },
    //仰角改变的响应事件
    onParaElevationChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "elevationAnglenfield", "elevationAnglenfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('elevationAnglenfield').setValue(oldValue);
        }
    },
    //自旋速度改变的响应事件
    onParaSpinChg: function(numberfield, newValue, oldValue, eOpts){
        var flag = this.detectionUpdateSatelliteInfo(newValue, "spinSpeednfield", "spinSpeednfield");
        if(!flag) {
            this.satelliteParaWindow.queryById('spinSpeednfield').setValue(oldValue);
        }
    },
    handleTreeItemExpand: function (node, eOpts) {
        var me = this;
        var childNodes = node.childNodes;
        me.expandedNodeArray.push(node);
        var length = childNodes.length;
        for (i = 0; i < length; i++) {
            var node = childNodes[i];
            node.set('iconCls', node.get('nodeType'));
        }

        if(node.data.nodeType == APC.NODETYPE_SOLUTION){
            node.expand();
        }
    },
    handleItemCollapse: function (node, eOpts) {
        for (i = 0; i < this.expandedNodeArray.length; i++) {
            if (this.expandedNodeArray[i].get('id') == node.get('id')) {
                this.expandedNodeArray.splice(i, 1);
            }
        }
    },
//    afteritemcollapse:function(node,index,item,eOpts){
//        node.expand();
//        this.getSolutionTree().un({afteritemcollapse:this.afteritemcollapse,scope: this});
//    },
    expandNode: function (node, eOpts) {
        //这里使用getSolutionTreeStoreStore是个隐患
        var listTree = this.getSolutionTree();
        Ext.apply(
            this.getSolutionTreeStoreStore().model.proxy.extraParams, {
                id: node.data.id
            })
    },
    //修改卫星参数时，姿态类型改变的响应函数
    onParaAttitudeTypeChg: function (combobox, newValue, oldValue, eOpts) {
        if (newValue == "3axes") {
            this.satelliteParaWindow.queryById('driftAnglenfield').show();
            this.satelliteParaWindow.queryById('rollAnglenfield').show();
            this.satelliteParaWindow.queryById('pitchAnglenfield').show();
            this.satelliteParaWindow.queryById('azimuthalAnglenfield').hide();
            this.satelliteParaWindow.queryById('elevationAnglenfield').hide();
            this.satelliteParaWindow.queryById('spinSpeednfield').hide();
        }
        else {
            this.satelliteParaWindow.queryById('azimuthalAnglenfield').show();
            this.satelliteParaWindow.queryById('elevationAnglenfield').show();
            this.satelliteParaWindow.queryById('spinSpeednfield').show();
            this.satelliteParaWindow.queryById('driftAnglenfield').hide();
            this.satelliteParaWindow.queryById('rollAnglenfield').hide();
            this.satelliteParaWindow.queryById('pitchAnglenfield').hide();
        }
    },
    //显示轨道设计面板
    showOrbitDesignPanel: function(){
        var me = this;
        var scene = me.getController('AppPlat.controller.SceneInitController');
        if (scene.orbitDesignPanel == null) {
            scene.orbitDesignPanel = Ext.create('AppPlat.view.OrbitDesign.OrbitDesignPanel');
            scene.getOuterCenterPanel().add(scene.orbitDesignPanel);
        }
        scene.panelType = APC.PANEL_TYPE_ORBIT_DESIGN;
        me.concreteSubjectButton.nodeType = APC.PANEL_TYPE_ORBIT_DESIGN;
        me.concreteSubjectButton.notify();
        me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('sun');
        if(ORBIT.tracedObject.id == 'sun'){
            me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('sun');
        }else  if(ORBIT.tracedObject.id == 'earth'){
            me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('earth');
        }else{
            me.getController('AppPlat.controller.OrbitDesign.OrbitController').hideAndShowCombo('other');
        }
        scene.hideOtherPanel();
        scene.orbitDesignPanel.show();
    },
    addList: function (type,text,parentList) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var rootNodeList = this.getSolutionTree().getRootNode();
        //判断父节点中是否已经包含了所要添加的节点，如果这些节点需要唯一，那么就不可重复添加
        var isHas = ColArgu.addNodeManage.isHasXNode(type, parentList);
        if (isHas) {
            return;
        }
        var newList = Ext.create('AppPlat.model.SolutionTreeModel', {
            name: text,
            leaf: ColArgu.addNodeManage.isLeaf(type),
            nodeType: type,
            parentId: parentList.get("id"),
            isRoot: false,
            rootId: rootNodeList.get('id'),
            iconCls: type
            //dataId:
            //id,order,nodeFilePath的值需要后端传送过来
        });
        newList.phantom = true;//说明这是新添加的节点调用代理的create方法
        parentList.appendChild(newList);
        listTree.getStore('SolutionTreeStore').model.proxy.extraParams = {
            userId: sessionStorage.getItem('userId')
        };
        var solutionTreeStore = listTree.getStore('SolutionTreeStore');
        solutionTreeStore.sync({
                success: function (batch, operation) {
                    var callbackJson = Ext.JSON.decode(batch.operations[0].response.responseText);
                    if (callbackJson.id != null) {
                        newList.setId(callbackJson.id);
                        newList.set("nodeOrder", callbackJson.nodeOrder);
                        newList.set('nodeFilePath', callbackJson.nodeFilePath);
                        var type = newList.get('nodeType');
                        me.sendInfo(sessionStorage.getItem('userId'), 'refreshTree', me.taskId,parentList.get('id'));
                        //于后台指定位置保存新文件
                        if (type == APC.NODETYPE_STRUCTURE) {
                            var path = parentList.get('nodeFilePath') + "/" + newList.get('id') + "/";
                            Ext.Ajax.request({
                                url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
                                method: 'POST',
                                jsonData: {
                                    parentPath: path,
                                    fileName: newList.get('id') + ".json",
                                    data: "{\"Total\": 0}"
                                }
                            });
                        }
                        else if (type == APC.NODETYPE_SATELLITE) {
                            //显示轨道面板
                            me.showOrbitDesignPanel();
                            var userId = sessionStorage.getItem('userId');
                            var taskId = newList.get('rootId');
                            var solutionId = parentList.get('id');
                            var nodeId = solutionId;
                            var solutionName = parentList.get('name');

                            var path = parentList.get('nodeFilePath') + "/";
                            var fileName = newList.get('id');
                            var sateName = newList.get('name');
                            //添加一个卫星文件
                            ORBIT.saveManage.addSatelliteFile(userId, path + fileName, fileName);
                            //方案内新建卫星
                            if (nodeId == ORBIT.lastSelectNodeId) {
                                //场景中加卫星
                                initSatelliteOrbit(sateName);
                                //发送广播
                                ORBIT.cooperation.sendInfo("Addition", sateName);
                                //切视角
                                me.updateAngleCombo(sateName);
                                me.changeSelectSate(type, sateName);
                            }
                            //方案外新建卫星
                            else {
                                ORBIT.fileName = solutionName;
                                me.initStructSceneDataFromServer(userId, taskId, solutionId, nodeId, APC.TOOL_TYPE_ORBIT_DESIGN, sateName, type);
                                ORBIT.lastSelectNodeId = nodeId;
                            }
                        }
                        else if (type == APC.NODETYPE_SOLUTION) {
                            //显示轨道面板
                            me.showOrbitDesignPanel();
                            var userId = sessionStorage.getItem('userId');
                            var taskId = newList.get('rootId');
                            var solutionId = newList.get('id');
                            var nodeId = solutionId;
                            var solutionName = newList.get('name');

                            var path = newList.get('nodeFilePath');
                            var fileName = newList.get('id');
                            var sateName = newList.get('name');
                            //添加场景文件
                            ORBIT.saveManage.addSceneFile(userId, path, fileName);
                            //记录当前方案名
                            ORBIT.fileName = solutionName;
                            me.initStructSceneDataFromServer(userId, taskId, solutionId, nodeId, APC.TOOL_TYPE_ORBIT_DESIGN, sateName, type);
                            ORBIT.lastSelectNodeId = nodeId;
                        }
                        else if (type == APC.NODETYPE_CHAIN_ANALYSIS) {
                            me.getController('AppPlat.controller.DataTransAnalysis.DataTransController').saveChainAnalysisFileByPath(newList.get('nodeFilePath'), callbackJson.id + '.json');
                        }
                        else if (type == APC.NODETYPE_GROUNDSTATION) {
                            me.getController('AppPlat.controller.OrbitDesign.GroundStationController').initGroundStationFileByPath(newList.get('nodeFilePath'), callbackJson.id + '.json');
                        }
                        else if (type == APC.NODETYPE_SENSOR) {
                            me.getController('AppPlat.controller.OrbitDesign.GroundStationController').initSensorFileByPath(newList.get('nodeFilePath'), callbackJson.id + '.json', callbackJson.name, callbackJson.parentId);
                        }
                        else if (type == APC.NODETYPE_SKY_COVER_POINT) {
                            me.getController('AppPlat.controller.OrbitDesign.GroundStationController').initSkyCoverPointFileByPath(newList.get('nodeFilePath'), callbackJson.id + '.json', callbackJson.name);
                        }
                        else if (type == APC.NODETYPE_SKY_COVER_REGIN) {
                            me.getController('AppPlat.controller.OrbitDesign.GroundStationController').initSkyCoverReginFileByPath(newList.get('nodeFilePath'), callbackJson.id + '.json', callbackJson.name);
                        }
                    }
                    if(me.getController('AppPlat.controller.SceneInitController').panelType == APC.PANEL_TYPE_COVER_ANALYSIS){
                        if(type == APC.NODETYPE_SATELLITE){
                            me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(parentList);
                        }
                        else if(type == APC.NODETYPE_GROUNDSTATION||type == APC.NODETYPE_SENSOR||type == APC.NODETYPE_SKY_COVER_POINT||type == APC.NODETYPE_SKY_COVER_REGIN){
                            me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(parentList.parentNode);
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
        expandAndEdit = function () {
            if (parentList.isExpanded()) {
                selectionModel.select(newList);
                me.addedNode = newList;
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
        }
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
                var type = list.data.nodeType;
                //当重命名方案或卫星时，修改场景中相应的卫星或方案，并将数据进行广播
                if(type == APC.NODETYPE_SATELLITE || type == APC.NODETYPE_SOLUTION){
                    renameSateOrbit(editor.context.originalValue, editor.context.value, type);
                    var data = "{\"oldValue\":\"" + editor.context.originalValue +
                        "\",\"newValue\":\"" + editor.context.value +
                        "\",\"type\":\"" + type +
                        "\"}" ;
                    //发送重命名广播
                    ORBIT.cooperation.sendInfo("Rename", editor.context.originalValue, data);
                }

                if(me.getController('AppPlat.controller.SceneInitController').panelType == APC.PANEL_TYPE_COVER_ANALYSIS){
                    if(type == APC.NODETYPE_SATELLITE){
                        me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(list.parentNode);
                    }
                    else if(type == APC.NODETYPE_GROUNDSTATION||type == APC.NODETYPE_SENSOR||type == APC.NODETYPE_SKY_COVER_POINT||type == APC.NODETYPE_SKY_COVER_REGIN){
                        me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(list.parentNode.parentNode);
                    }
                }

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
    validateEdit: function (editor, context, eOpts) {
        var me = this;
        var oldValue = context.originalValue;
        var newValue = context.value;
        var list = context.record;
        var isRepeat;
        var childrenNames = new Array();
        var childrenNodes = list.parentNode.childNodes;
        if (childrenNodes.length > 0) {
            for (i = 0; i < childrenNodes.length; i++) {
                if (oldValue != childrenNodes[i].get('name')) {
                    childrenNames.push(childrenNodes[i].get('name'));
                }
            }
        }
        var isRepeat = me.repeatabilityVerification(newValue, childrenNames);
        if (!isRepeat) {
            me.sendInfo(sessionStorage.getItem('userId'), 'refreshTree', me.taskId,list.parentNode.get('id'));
            return true;
        }
        else {
            return false;
        }
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
        this.deleteList(this.getSolutionTree().getSelectionModel().getSelection()[0]);
    },

    //加载结构设计成果更新当前的卫星
    handleLoadStructClick: function () {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0];
        var taskId = selectedList.get('rootId');
        var solutionId = selectedList.parentNode.get('id');
        var nodeId = selectedList.get('id');
        var name = selectedList.get('name');
        var childId = selectedList.childNodes[0];
        if (childId == null) {
            Ext.MessageBox.show({title: '加载失败', msg: '无法找到数据，加载卫星失败', buttons: Ext.Msg.OK});
            return;
        }
        var structId = childId.get('id');
        var pathobj = taskId + "/" + solutionId + "/" + nodeId + "/" + structId + ".obj";
        var pathmtl = taskId + "/" + solutionId + "/" + nodeId + "/" + structId + ".mtl";
        var url =  APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json?path=";
        (new THREE.OBJMTLLoader()).load( url + pathobj, url + pathmtl, function ( object ) {
            ORBIT.satellite[name].object.remove(ORBIT.satellite[name].object.children[0]);
            object.rotation.set(0, Math.PI/2, 0);
            object.scale.set(0.01 * ORBIT.scaler_scene, 0.01 * ORBIT.scaler_scene, 0.01 * ORBIT.scaler_scene);
            var temp = new THREE.Object3D();
            temp.add(object);
            ORBIT.satellite[name].object.add(temp);
            ORBIT.renderer.clear();
            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
        } );
    },
    //删除方案
    deleteSolution: function(solutionName, length){
        //判断是否是当前方案
        if(ORBIT.fileName == solutionName){
            //该方案无子节点才能被删除
            if(length == 0){
                //删除方案，默认回到初始场景中
                //发送广播，删除后台
                return true;
            }
            else{
                Ext.MessageBox.show({title: '消息', msg: '该方案下有子节点', buttons: Ext.Msg.OK});
                return false;
            }
        }
        else{
            Ext.MessageBox.show({title: '消息', msg: '您不在该方案中', buttons: Ext.Msg.OK});
            return false;
        }
    },
    //删除卫星
    deleteSatellite: function(sid, solutionName, length){
        //判断是否是当前方案下的卫星
        if(ORBIT.fileName == solutionName){
            //如果该卫星未被锁才能被删除
            if(!ORBIT.satellite[sid].isLocked){
                //该卫星无结构节点才能被删除
                if(length == 0){
                    return true;
                }
                else{
                    Ext.MessageBox.show({title: '消息', msg: '该卫星下有结构节点', buttons: Ext.Msg.OK});
                    return false;
                }
            }
            else{
                Ext.MessageBox.show({title: '消息', msg: '该卫星被其它用户锁定', buttons: Ext.Msg.OK});
                return false;
            }
        }
        else{
            Ext.MessageBox.show({title: '消息', msg: '您不在该方案中', buttons: Ext.Msg.OK});
            return false;
        }
    },
    /**
     * 删除选中的节点，刷新视图
     * @param {SimpleTasks.model.List} list
     */
    deleteList: function (list) {
        var me = this;
        var listTree = me.getSolutionTree();
        var listName = list.get('name');
        var selModel = listTree.getSelectionModel();
        var listParent = list.parentNode;
        var nodeType = list.get('nodeType');
        var typeCH = ColArgu.colArguTreeUtil.typeE2C(list.get('nodeType'));
        if(nodeType == APC.NODETYPE_SATELLITE){
            if(!me.deleteSatellite(list.get('name'), listParent.get('name'), list.childNodes.length)){
                return ;
            }
        }
        else if(nodeType == APC.NODETYPE_SOLUTION){
            if(!me.deleteSolution(list.get('name'), list.childNodes.length)){
                return;
            }
        }
        Ext.Msg.show({
            title: '删除' + typeCH + '?',
            msg: '你是否要删除' + listName + '?',
            buttons: Ext.Msg.YESNO,
            fn: function (response) {
                if (response === 'yes') {
                    if(nodeType == APC.NODETYPE_SATELLITE){
                        if (ORBIT.tracedTargetTpye == "Sate" && ORBIT.tracedObject.id == list.get('name')) {
//                                HoverText.changeAngle();
                            var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
                            var id = orbit.detectCurrentSection();
                            var pid = orbit.getCenter(id);
                            pid = 'angel' + pid.charAt(0).toUpperCase() + pid.substring(1);
                            me.getButtonGroupPanel().queryById('planetCombo').setValue(pid);
                        }
                        // destroy the tree node on the server
                        deleteSateOrbit(list.get('name'));
                        //发送广播
                        ORBIT.cooperation.sendInfo("Delete", list.get('name'));
                    }
                    //此时已经访问了后台服务器，删除了对应的节点
                    list.parentNode.removeChild(list, true);
                    me.sendInfo(sessionStorage.getItem('userId'), 'refreshTree', me.taskId,listParent.get('id'));
                    //删除后更新覆盖分析面板里的下拉框
                    if(me.getController('AppPlat.controller.SceneInitController').panelType == APC.PANEL_TYPE_COVER_ANALYSIS){
                        if(nodeType == APC.NODETYPE_SATELLITE){
                            me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(listParent);
                        }
                        else if(nodeType == APC.NODETYPE_GROUNDSTATION||nodeType == APC.NODETYPE_SENSOR||nodeType == APC.NODETYPE_SKY_COVER_POINT||nodeType == APC.NODETYPE_SKY_COVER_REGIN){
                            me.getController('AppPlat.controller.CoverAnalysis.CoverConfigController').initOrRefreshCombobox(listParent.parentNode);
                        }
                    }

//                    if (!selModel.hasSelection() || !listsStore.getNodeById(selModel.getSelection()[0].getId())) {
//                        selModel.select(0);
//                    }
                }
            }
        });
    },
    //修改视角下拉框
    updateAngleCombo: function(sid){
        var cid = ORBIT.satellite[sid].centerid;
        if (cid != ORBIT.tracedObject.id) {
            var pid = 'angel' + cid.charAt(0).toUpperCase() + cid.substring(1);
            this.getButtonGroupPanel().queryById('planetCombo').setValue(pid);
        }
    },
    initStructSceneDataFromServer: function (userId, taskId, solutionId, nodeId, toolType, sid, nodeType) {
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CollaDesignManage/getCachedSceneData",
            method: 'GET',
            async: false,
            params: {
                userId: userId,
                taskId: taskId,
                solutionId: solutionId,
                nodeId: nodeId,
                toolType: toolType
            },
            success: function (response) {
                //var jsonResult = Ext.JSON.decode(response.responseText);
                var jsonResult = JSON.parse(response.responseText);

                if (toolType == APC.TOOL_TYPE_STRUCT_DESIGN) {
                    Struct.storageManage.reRenderSceneByData(jsonResult);
                }
                else if (toolType == APC.TOOL_TYPE_ORBIT_DESIGN) {
                    ORBIT.Satellite.unlockSelect();//离开场景之前释放所有锁
                    ORBIT.cooperation.initId(taskId, solutionId, nodeId);
                    ORBIT.saveManage.refreshScene(jsonResult);
                    if (nodeType == APC.NODETYPE_SOLUTION) {//如果是新建的方案就不需要初始化锁列表
                        //新建方案后需要场景初始化
                        var sceneController = me.getController('AppPlat.controller.SceneInitController');
                        sceneController.updateAngleCombo(null, true);
                        me.changeSelectSate(nodeType);
                        HoverText.refreshHovertextForPlanet();
                    }
                    else {//新建卫星需要初始化所列表
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
                                //初始化锁列表
                                ORBIT.Satellite.initLockList(response.responseText);
                                //判断场景中是否有该卫星
                                if(!ORBIT.Satellite.isExitSatellite(sid)){
                                    initSatelliteOrbit(sid);
                                }
                                //发送广播
                                ORBIT.cooperation.sendInfo("Addition", sid);
                                //将该卫星设置为选中
                                me.updateAngleCombo(sid);
                                me.changeSelectSate(nodeType, sid);
                            },
                            failure: function () {
                            }
                        });
                    }
                }
            },
            failure: function () {
            }
        });
    },
    refreshSolutionTree: function (taskId,parentNodeId) {
        var me = this;
        if (me.taskId != null && me.taskId == taskId) {
            if (me.expandedNodeArray!=null &&me.expandedNodeArray.length != 0) {
                for (i = 0; i < me.expandedNodeArray.length; i++) {
                    if (me.expandedNodeArray[i].get('id') == parentNodeId) {
                        var node  = me.expandedNodeArray[i];
                        if(me.expandedNodeArray[i].get('nodeType') != APC.NODETYPE_TASK){
                            me.expandedNodeArray[i].collapse(false,function(optional){
                                node.expand();
                            },this);
                        }
                        else{
                            //由于根节点被隐藏，collapse的回调函数不执行，因此将expand函数延迟1s执行
                            me.expandedNodeArray[i].collapse();
                            setTimeout(function(){node.expand();},1000);
                        }
                    }
                }
            }
        }
    },
    //与服务器建立WebSocket通信
    startWebSocket: function () {
        var me = this;
        if ('WebSocket' in window) {
            try {
                me.webSocket = new WebSocket("ws://" + APC.BACKEND_URL + "/AppPlatService/WebsocketAction");
            } catch (e) {
                Ext.MessageBox.show({
                    title: "系统提示",
                    msg: "websocket连接建立失败",
                    buttons: Ext.Msg.OK
                });
            }
        }
        else {
            Ext.MessageBox.show({
                title: "系统提示",
                msg: "当前浏览器不支持WebSocket，无法进行协同工作",
                buttons: Ext.Msg.OK
            });
        }
        me.webSocket.onopen = function (evt) {
        };
        me.webSocket.onclose = function (evt) {
            Ext.MessageBox.show({
                title: "系统提示",
                msg: "与服务器连接失败，当前状态无法协同工作",
                buttons: Ext.Msg.OK
            });
        };
        //设置监听响应
        me.webSocket.onmessage = function (event) {
            if (event.data == null) return;
            var json = JSON.parse(event.data);
            //如果是本机发出的消息则忽略
            if (sessionStorage.getItem("userId") == json.userId) return;
            if (json.command != 'refreshTree') return;
            me.refreshSolutionTree(json.taskId,json.parentNodeId);
        }
    },
    //向服务器发出消息指令
    sendInfo: function (userId, command, taskId,parentNodeId) {
        var me = this;
        if (me.webSocket == null || me.webSocket.readyState != 1) return;
        var json = {
            'userId': userId,
            'command': command,
            'taskId': taskId,
            'parentNodeId':parentNodeId
        };
        this.webSocket.send(JSON.stringify(json));
    }
});
