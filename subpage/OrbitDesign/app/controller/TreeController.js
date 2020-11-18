Ext.define('OrbitDesignApp.controller.TreeController', {
    extend: 'Ext.app.Controller',
    views: [
        'SolutionTree',
        'ContextMenu',
        'PropertyWindow',
        'OrbitDesign.OrbitFileInfoWindow',
        'OrbitDesign.SatelliteParaWindow',
        'OrbitDesign.OrbitSectionWindow'
    ],
    models: ['SolutionTreeModel'],
    stores: ['SolutionTreeStore',
        'OrbitDesign.OrbitSectionStore'
    ],
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
            ref: 'orbitOperationToolbar',
            selector: 'orbitoperationtoolbar'
        },
        {
            ref: 'orbitDesignViewPort',
            selector: 'orbitdesignviewport'
        },
        {
            ref: 'satelliteParaWindow',
            selector: 'satelliteparawindow'
        },
        {
            ref: 'orbitSectionWindow',
            selector: 'orbitsectionwindow'
        },
        {
            ref: 'contextMenu',
            selector: 'contextmenu',
            xtype: 'contextmenu',
            autoCreate: true
        }
    ],
    fileName: null,//标识值，标识当前打开的轨道文件名称
    satelliteName: null,
    isFileSaved: false,//标识值，标识当前打开的轨道文件是否被保存
    satelliteParaWindow: null,
    orbitSectionWindow: null,
    concreteSubject: null,
    satelliteNumber: 1,
    taskNumber: 1,
    taskArray: new Array(),
    satelliteNameArray: new Array(),
    init: function (application) {
        ColArgu.init();
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
            '#btnNewOrbitFile': {
                click: me.handleNewOrbitFileClick
            },
            '#btnAddSatellite': {
                click: me.handleAddSatelliteClick
            },
            '#btnRenameSatellite': {
                click: me.handleRenameClick
            },
            '#orbitSectionDesignItem': {
                click: me.handleOrbitSectionItemClick
            },
            '#btnPropertyPanel': {
                click: me.openParaWindow
            },
            //为下拉按钮定义事件
            '#newOrbitFileItem': {
                click: me.handleNewOrbitFileClick
            },
            '#addSatelliteItem': {
                click: me.handleAddSatelliteClick
            },
            '#deleteNodeItem': {
                click: me.handleDeleteClick
            },
            '#showSatelliteOrbitItem': {
                click: me.handleShowOrbitClick
            },
            '#hideSatelliteOrbitItem': {
                click: me.handleHideOrbitClick
            },
            '#renameNodeItem': {
                click: me.handleRenameClick
            },
            '#propertyItem': {
                click: me.openParaWindow
            },
            '#addOrbitSection': {
                click: me.handleAddOrbitSection
            },
            '#removeOrbitSection': {
                click: me.handleRemoveOrbitSection
            },
            'solutiontree': {
                edit: me.updateList,
                validateedit: me.validateEdit,
                itemcontextmenu: me.handleIemRightClicked,
                containercontextmenu: me.handleContainerRightClicked,
                beforeitemexpand: me.expandNode,
                itemexpand: me.handleTreeItemExpand,
                select: me.handleItemSelected,
                itemclick: me.handleItemClick,
                itemdblclick: me.handleItemDblClick,
                containerclick: me.handleContainerClick
//                beforecelldblclick: me.cancelCelldblclick
            },
            //当卫星轨道参数的的窗口关闭时的响应函数
            'satelliteparawindow': {
                close: me.satelliteParaWindowClose
            },
            "satelliteparawindow combobox[itemId=attitudeType]": {
                change: this.onParaAttitudeTypeChg
            },
            //修改卫星轨道时
            //中心星体改变的响应事件
            "satelliteparawindow combobox[itemId=starcombo]": {
                change: this.onParastarChg
            },
            //仿真开始时间改变的响应事件
            "satelliteparawindow datetimefield[itemId=startSimuTime]": {
                change: this.onParastartChg
            },
            //仿真结束时间改变的响应事件
            "satelliteparawindow datetimefield[itemId=stopSimuTime]": {
                change: this.onParastopChg
            },
            //历元时刻改变的响应事件
            "satelliteparawindow datetimefield[itemId=epochTime]": {
                change: this.onParaepochChg
            },
            //坐标系改变的响应事件
            "satelliteparawindow combobox[itemId=axescombo]": {
                change: this.onParacChg
            },
            //半长轴改变的响应事件
            "satelliteparawindow textfield[itemId=paraanfield]": {
                change: this.onParaaChg
            },
            //偏心率改变的响应事件
            "satelliteparawindow textfield[itemId=paraenfield]": {
                change: this.onParaeChg
            },
            //轨道倾角改变的响应事件
            "satelliteparawindow textfield[itemId=parainfield]": {
                change: this.onParaiChg
            },
            //升交点赤经改变的响应事件
            "satelliteparawindow textfield[itemId=paraOmnfield]": {
                change: this.onParaOmChg
            },
            //近心点幅角改变的响应事件
            "satelliteparawindow textfield[itemId=paraomnfield]": {
                change: this.onParaomChg
            },
            //真近点角改变的响应事件
            "satelliteparawindow textfield[itemId=parathetanfield]": {
                change: this.onParathetaChg
            },
            //偏航角改变的响应事件
            "satelliteparawindow textfield[itemId=driftAnglenfield]": {
                change: this.onParaDrifChg
            },
            //滚转角改变的响应事件
            "satelliteparawindow textfield[itemId=rollAnglenfield]": {
                change: this.onParaRollChg
            },
            //俯仰角改变的响应事件
            "satelliteparawindow textfield[itemId=pitchAnglenfield]": {
                change: this.onParaPitchChg
            },
            //方位角改变的响应事件
            "satelliteparawindow textfield[itemId=azimuthalAnglenfield]": {
                change: this.onParaAzimuthaChg
            },
            //仰角改变的响应事件
            "satelliteparawindow textfield[itemId=elevationAnglenfield]": {
                change: this.onParaElevationChg
            },
            //自旋速度改变的响应事件
            "satelliteparawindow textfield[itemId=spinSpeednfield]": {
                change: this.onParaSpinChg
            },
            //修改轨道段设计窗口中卫星参数的响应事件
            //半长轴改变的响应事件
            "orbitsectionwindow textfield[itemId=paraanfield]": {
                change: this.onSectionParaaChg
            },
            //偏心率改变的响应事件
            "orbitsectionwindow textfield[itemId=paraenfield]": {
                change: this.onSectionParaeChg
            },
            //轨道倾角改变的响应事件
            "orbitsectionwindow textfield[itemId=parainfield]": {
                change: this.onSectionParaiChg
            },
            //升交点赤经改变的响应事件
            "orbitsectionwindow textfield[itemId=paraOmnfield]": {
                change: this.onSectionParaOmChg
            },
            //近心点幅角改变的响应事件
            "orbitsectionwindow textfield[itemId=paraomnfield]": {
                change: this.onSectionParaomChg
            },
            //真近点角改变的响应事件
            "orbitsectionwindow textfield[itemId=parathetanfield]": {
                change: this.onSectionParathetaChg
            },
            //轨道段设计窗口关闭响应函数
            "orbitsectionwindow":{
                close: me.orbitSectionWindowClose
            },

            "#orbitSectionGridPanel":{
                beforeedit: me.beforeRowEditing,  //编辑轨道段前响应函数
                edit: me.handleRowEditing,       //保存轨道段修改时响应函数
                canceledit: me.cancelEditing,    //取消轨道段的保存时响应函数
                select: me.selectRow            //当选中某轨道段时
            },

            //修改轨道转移目标星体时响应函数
            "#targetPlanetEditor":{
                change: me.handleTargetPlanetEditing
            },
            //修改轨道转移开始时间时响应函数
            "#startTimeEditor":{
                change: me.handleStartTimeEditing
            },
            //修改轨道转移结束时间时响应函数
            "#endTimeEditor":{
                change: me.handleEndTimeEditing
            }
        })
    },
    onLaunch: function (application) {
        var me = this;
        this.concreteSubject = new ConcreteSubject();
        this.registereButtonListeners();
        this.registereMenuButtonListeners();
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/getTaskNameByUserId.json",
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
                    var obj = new Object();
                    obj.name = jsonResult[i].perTaskName;
                    me.taskArray.push(obj);
                }
            }
        });
    },
    registereButtonListeners: function () {
    },
    registereMenuButtonListeners: function () {
        var me = this;
        var newOrbitFileItem = me.getContextMenu().queryById('newOrbitFileItem');
        var orbitFileItemObserver = new MenuObserver();
        orbitFileItemObserver.visibleTypeList = ['NoRoot'];
        orbitFileItemObserver.menuButton = newOrbitFileItem;
        orbitFileItemObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(orbitFileItemObserver);

        var addSatelliteItem = me.getContextMenu().queryById('addSatelliteItem');
        var satelliteObserver = new MenuObserver();
        satelliteObserver.visibleTypeList = [APC.NODETYPE_TASK];
        satelliteObserver.menuButton = addSatelliteItem;
        satelliteObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(satelliteObserver);

        var orbitSectionDesignItem = me.getContextMenu().queryById('orbitSectionDesignItem');
        var orbitSectionDesignItemObserver = new MenuObserver();
        orbitSectionDesignItemObserver.visibleTypeList = [APC.NODETYPE_SATELLITE];
        orbitSectionDesignItemObserver.menuButton = orbitSectionDesignItem;
        orbitSectionDesignItemObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(orbitSectionDesignItemObserver);

        var propertyItem = me.getContextMenu().queryById('propertyItem');
        var propertyItemObserver = new MenuObserver();
        propertyItemObserver.visibleTypeList = [APC.NODETYPE_SATELLITE];
        propertyItemObserver.menuButton = propertyItem;
        propertyItemObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(propertyItemObserver);

        var renameNodeItem = me.getContextMenu().queryById('renameNodeItem');
        var renameNodeItemObserver = new MenuObserver();
        renameNodeItemObserver.visibleTypeList = [APC.NODETYPE_TASK, APC.NODETYPE_SATELLITE];
        renameNodeItemObserver.menuButton = renameNodeItem;
        renameNodeItemObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(renameNodeItemObserver);

        var deleteNodeItem = me.getContextMenu().queryById('deleteNodeItem');
        var deleteNodeItemObserver = new MenuObserver();
        deleteNodeItemObserver.visibleTypeList = [APC.NODETYPE_SATELLITE];
        deleteNodeItemObserver.menuButton = deleteNodeItem;
        deleteNodeItemObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(deleteNodeItemObserver);

        var showSatelliteOrbitItem = me.getContextMenu().queryById('showSatelliteOrbitItem');
        var showSatelliteOrbitObserver = new MenuObserver();
        showSatelliteOrbitObserver.visibleTypeList = [APC.NODETYPE_SATELLITE];
        showSatelliteOrbitObserver.menuButton = showSatelliteOrbitItem;
        showSatelliteOrbitObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(showSatelliteOrbitObserver);

        var hideSatelliteOrbitItem = me.getContextMenu().queryById('hideSatelliteOrbitItem');
        var hideSatelliteOrbitObserver = new MenuObserver();
        hideSatelliteOrbitObserver.visibleTypeList = [APC.NODETYPE_SATELLITE];
        hideSatelliteOrbitObserver.menuButton = hideSatelliteOrbitItem;
        hideSatelliteOrbitObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(hideSatelliteOrbitObserver);

        var simuparaItem = me.getContextMenu().queryById('simuparaItem');
        var simuparaObserver = new MenuObserver();
        simuparaObserver.visibleTypeList = [APC.NODETYPE_TASK];
        simuparaObserver.menuButton = simuparaItem;
        simuparaObserver.concreteSubject = this.concreteSubject;
        this.concreteSubject.addObserver(simuparaObserver);


    },
    handleIemRightClicked: function (view, list, node, rowIndex, e, contextMenu) {
        this.getContextMenu().setList(list);
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    btnBackNavigationClick: function () {
        this.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
        window.location.href = "../../subpage/Navigation/Navigation.html";
    },
    OnPostCommandMax: function () {
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
    /**
     * 处理树状视图右击事件
     * @param component
     * @param e
     * @param eOpts
     */
    handleContainerRightClicked: function (component, e, eOpts) {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
        this.concreteSubject.nodeType = 'NoRoot';
        this.concreteSubject.notify();
        this.getContextMenu().showAt(e.getX(), e.getY());
        e.preventDefault();
    },
    //刷新卫星属性的输入框中的值
    refreshSatParaField: function () {
        if (ORBIT.satelliteName != null && ORBIT.satelliteName != undefined) {
            var sid = ORBIT.satelliteName;
            var satellite = ORBIT.satellite[sid];
            var orbitPara = ORBIT.orbit[sid].getOrbitPara();
            this.queryById('starcombo').setValue(satellite.centerid);
            this.queryById('startSimuTime').setValue(satellite.t_start);
            this.queryById('stopSimuTime').setValue(satellite.t_stop);
            this.queryById('epochTime').setValue(satellite.epochTime);
            this.queryById('axescombo').setValue(satellite.axis);
            this.queryById('paraanfield').setValue(orbitPara.a);
            this.queryById('paraenfield').setValue(orbitPara.e);
            var pi = 180 / Math.PI;
            var i = orbitPara.i * pi;
            var Om = orbitPara.Om * pi, om = orbitPara.om * pi, theta = orbitPara.theta * pi;
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
    enableSatParaField: function () {
        if (ORBIT.satelliteName != null && ORBIT.satelliteName != undefined) {
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
    disableSatParaField: function () {
        if (ORBIT.satelliteName != null && ORBIT.satelliteName != undefined) {
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
    openParaWindow: function (view, record, item, index, e, eOpts) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //electionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        if (selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                if (this.satelliteParaWindow == null) {
                    this.satelliteParaWindow = Ext.create('OrbitDesignApp.view.OrbitDesign.SatelliteParaWindow');
                    this.satelliteParaWindow.refreshSatParaField = this.refreshSatParaField;
                    this.satelliteParaWindow.enableSatParaField = this.enableSatParaField;
                    this.satelliteParaWindow.disableSatParaField = this.disableSatParaField;
                }
                var viewPort = me.getOrbitDesignViewPort();
                var width = viewPort.getSize().width;
                var basePosition = me.getOrbitScenePanel().getPosition();
                basePosition[0] += me.getOrbitScenePanel().getWidth() - this.satelliteParaWindow.width;
                this.satelliteParaWindow.setPosition(basePosition[0], basePosition[1], true);

                var sid = selectedList.get('name');
                ORBIT.satelliteName = sid;
                var satellite = ORBIT.satellite[sid];
//                this.satelliteParaWindow.queryById('starcombo').disable(false);
//                this.satelliteParaWindow.queryById('startSimuTime').disable(false);
//                this.satelliteParaWindow.queryById('stopSimuTime').disable(false);
//                this.satelliteParaWindow.queryById('epochTime').disable(false);
//                this.satelliteParaWindow.queryById('axescombo').disable(false);
                this.satelliteParaWindow.queryById('starcombo').setValue(satellite.centerid);
                this.satelliteParaWindow.queryById('startSimuTime').setValue(satellite.t_start);
                this.satelliteParaWindow.queryById('stopSimuTime').setValue(satellite.t_stop);
                this.satelliteParaWindow.queryById('epochTime').setValue(satellite.epochTime);
                this.satelliteParaWindow.queryById('axescombo').setValue(satellite.axis);
                this.satelliteParaWindow.queryById('paraanfield').setValue(ORBIT.orbitpara[sid].a);
                this.satelliteParaWindow.queryById('paraenfield').setValue(ORBIT.orbitpara[sid].e);
                var pi = 180 / Math.PI;
                var i = ORBIT.orbitpara[sid].i * pi;
                var Om = ORBIT.orbitpara[sid].Om * pi, om = ORBIT.orbitpara[sid].om * pi, theta = ORBIT.orbitpara[sid].theta * pi;
                this.satelliteParaWindow.queryById('parainfield').setValue(i);
                this.satelliteParaWindow.queryById('paraOmnfield').setValue(Om);
                this.satelliteParaWindow.queryById('paraomnfield').setValue(om);
                this.satelliteParaWindow.queryById('parathetanfield').setValue(theta);

                this.satelliteParaWindow.queryById('attitudeType').setValue(satellite.attitudeType);
//                this.satelliteParaWindow.queryById('attitudeType').disable(false);
                if (satellite.attitudeType == "3axes") {
                    this.satelliteParaWindow.queryById('driftAnglenfield').setValue(satellite.driftAzimuthal * pi);
                    this.satelliteParaWindow.queryById('rollAnglenfield').setValue(satellite.rollElevation * pi);
                    this.satelliteParaWindow.queryById('pitchAnglenfield').setValue(satellite.pitchSpinSpeed * pi);
                }
                else {
                    this.satelliteParaWindow.queryById('azimuthalAnglenfield').setValue(satellite.driftAzimuthal * pi);
                    this.satelliteParaWindow.queryById('elevationAnglenfield').setValue(satellite.rollElevation * pi);
                    this.satelliteParaWindow.queryById('spinSpeednfield').setValue(satellite.pitchSpinSpeed);
                }
                this.satelliteParaWindow.show();
            }
        }
    },
    //当卫星轨道参数的的窗口关闭时的响应函数
    satelliteParaWindowClose: function (window, eOpts) {
        ORBIT.satelliteName = null;
    },
    //判断当前选中的卫星与属性面板是否一样，若不一样，隐藏特征点
    hideChaBySatName: function () {
        if (!ORBIT.isSelectSat) {
            hideCharacter();
            ORBIT.Orbit.resetOrbitColor();
        }
        else {
            if (ORBIT.satelliteName != ORBIT.selectOrbit && ORBIT.selectOrbitSectionId != ORBIT.selectOrbit) {
                hideCharacter();
                ORBIT.Orbit.resetOrbitColor();
            }
        }
    },
    //修改卫星轨道时
    //中心星体改变的响应事件
    onParastarChg: function (numberfield, newValue, oldValue, eOpts) {
        if (ORBIT.satelliteName) {
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
    onParastartChg: function (numberfield, newValue, oldValue, eOpts) {
        if (ORBIT.satelliteName) {
            if (compareTime(newValue, ORBIT.satellite[ORBIT.satelliteName].t_stop) >= 0) {
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
    onParastopChg: function (numberfield, newValue, oldValue, eOpts) {
        if (ORBIT.satelliteName) {
            if (compareTime(newValue, ORBIT.satellite[ORBIT.satelliteName].t_start) <= 0) {
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
    onParaepochChg: function (numberfield, newValue, oldValue, eOpts) {
        ORBIT.satellite[ORBIT.satelliteName].epochTime = newValue;
        refreshSatellite();
        refreshoAxes();
        refreshCamera();
    },
    //坐标系改变的响应事件
    onParacChg: function (numberfield, newValue, oldValue, eOpts) {
    },
    detectionUpdateSatelliteInfo: function (window, value, paraId, paraField) {
        var flags = true;
        if (value == null) {
            flags = true;
        }
        else if (!window.queryById(paraField).isValid()) {
            flags = false;
        }
        else {
            var flag = ORBIT.formatDetection.detectionOrbitPara(value, ORBIT.min[paraId], ORBIT.max[paraId]);
            if (!flag) {
                flags = false;
            }
        }
        return flags;
    },
    //半长轴改变的响应事件
    onParaaChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "a", "paraanfield");
        if (flag && newValue != null) {
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
            }
        }
        else {
//            if (newValue > ORBIT.max['a']) {
                this.satelliteParaWindow.queryById('paraanfield').setValue(oldValue);
//            }
        }
    },

    //偏心率改变的响应事件
    onParaeChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "e", "paraenfield");
        if (flag) {
            if (ORBIT.satelliteName) {
                if (newValue != null) {
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
                if(ORBIT.valueE != undefined){
                    ORBIT.valueE.innerHTML = newValue;
                }
            }
        }
        else {
            this.satelliteParaWindow.queryById('paraenfield').setValue(oldValue);
        }
    },
    //轨道倾角改变的响应事件
    onParaiChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "i", "parainfield");
        if (flag) {
            if (ORBIT.satelliteName) {
                if (newValue != null) {
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
            }
        }
        else {
            this.satelliteParaWindow.queryById('parainfield').setValue(oldValue);
        }
    },
    //升交点赤经改变的响应事件
    onParaOmChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "Om", "paraOmnfield");
        if (flag) {
            if (ORBIT.satelliteName) {
                if (newValue != null) {
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
            }
        }
        else {
            this.satelliteParaWindow.queryById('paraOmnfield').setValue(oldValue);
        }
    },
    //近心点幅角改变的响应事件
    onParaomChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "om", "paraomnfield");
        if (flag) {
            if (ORBIT.satelliteName) {
                if (newValue != null) {
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
            }
        }
        else {
            this.satelliteParaWindow.queryById('paraomnfield').setValue(oldValue);
        }
    },
    //真近点角改变的响应事件
    onParathetaChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "theta", "parathetanfield");
        if (flag) {
            if (ORBIT.satelliteName) {
                if (newValue != null) {
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
            }
        }
        else {
            this.satelliteParaWindow.queryById('parathetanfield').setValue(oldValue);
        }
    },
    //偏航角改变的响应事件
    onParaDrifChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "driftAnglenfield", "driftAnglenfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('driftAnglenfield').setValue(oldValue);
        }
    },
    //滚转角改变的响应事件
    onParaRollChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "rollAnglenfield", "rollAnglenfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('rollAnglenfield').setValue(oldValue);
        }
    },
    //俯仰角改变的响应事件
    onParaPitchChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "pitchAnglenfield", "pitchAnglenfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('pitchAnglenfield').setValue(oldValue);
        }
    },
    //方位角改变的响应事件
    onParaAzimuthaChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "azimuthalAnglenfield", "azimuthalAnglenfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('azimuthalAnglenfield').setValue(oldValue);
        }
    },
    //仰角改变的响应事件
    onParaElevationChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "elevationAnglenfield", "elevationAnglenfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('elevationAnglenfield').setValue(oldValue);
        }
    },
    //自旋速度改变的响应事件
    onParaSpinChg: function (numberfield, newValue, oldValue, eOpts) {
        var flag = this.detectionUpdateSatelliteInfo(this.satelliteParaWindow, newValue, "spinSpeednfield", "spinSpeednfield");
        if (!flag) {
            this.satelliteParaWindow.queryById('spinSpeednfield').setValue(oldValue);
        }
    },
    //轨道段设计窗口中卫星参数修改响应
    //半长轴改变的响应事件
    onSectionParaaChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "a", "paraanfield");
            if (flag && newValue != null) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    orbitPara.a = newValue;
                    var centerid = orbit.getCenter(id);
                    orbitPara.T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(newValue, 3) / ORBIT.GravitationalConstant[centerid]);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                if (newValue > ORBIT.max['a']) {
                    this.orbitSectionWindow.queryById('paraanfield').setValue(oldValue);
                }
            }
        }
    },
    //偏心率改变的响应事件
    onSectionParaeChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "e", "paraenfield");
            if (flag) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    if(newValue != null){
                        orbitPara.e = newValue;
                    }
                    var centerid = orbit.getCenter(id);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                this.orbitSectionWindow.queryById('paraenfield').setValue(oldValue);
            }
        }
    },
    //轨道倾角改变的响应事件
    onSectionParaiChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "i", "parainfield");
            if (flag) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    if(newValue != null){
                        orbitPara.i = newValue * Math.PI / 180;
                    }
                    var centerid = orbit.getCenter(id);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                this.orbitSectionWindow.queryById('parainfield').setValue(oldValue);
            }
        }
    },
    //升交点赤经改变的响应事件
    onSectionParaOmChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "Om", "paraOmnfield");
            if (flag) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    if(newValue != null){
                        orbitPara.Om = newValue * Math.PI / 180;
                    }
                    var centerid = orbit.getCenter(id);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                this.orbitSectionWindow.queryById('paraOmnfield').setValue(oldValue);
            }
        }
    },
    //近心点幅角改变的响应事件
    onSectionParaomChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "om", "paraomnfield");
            if (flag) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    if(newValue != null){
                        orbitPara.om = newValue * Math.PI / 180;
                    }
                    var centerid = orbit.getCenter(id);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                this.orbitSectionWindow.queryById('paraomnfield').setValue(oldValue);
            }
        }
    },
    //真近点角改变的响应事件
    onSectionParathetaChg: function(numberfield, newValue, oldValue, eOpts){
        if(ORBIT.isSectionWindowSatPara){
            var flag = this.detectionUpdateSatelliteInfo(this.orbitSectionWindow, newValue, "theta", "parathetanfield");
            if (flag) {
                if (ORBIT.selectSectionId && ORBIT.selectOrbitSectionId) {
                    var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
                    var id = ORBIT.selectSectionId;
                    var orbitPara = orbit.getOrbitSectionPara(id);
                    if(newValue != null){
                        orbitPara.theta = newValue * Math.PI / 180;
                    }
                    var centerid = orbit.getCenter(id);
                    var section = orbit.getOrbitSectionById(id);
                    ORBIT.scene.remove(section.object);
                    section.object = orbit.makeOrbit(orbitPara, "Satellite", centerid, ORBIT.selectOrbitSectionId, false);
                    ORBIT.scene.add(section.object);
                    ORBIT.satellite[ORBIT.selectOrbitSectionId].isExit = true;
                    this.hideChaBySatName();
                    refreshObject();
                    refreshCamera();
                    if(ORBIT.valueA != undefined) {
                        ORBIT.valueA.innerHTML = newValue;
                    }
                }
            }
            else {
                this.orbitSectionWindow.queryById('parathetanfield').setValue(oldValue);
            }
        }
    },
    handleItemSelected: function (view, record, index, eOpts) {
        this.concreteSubject.nodeType = record.get('nodeType');
        this.concreteSubject.notify();
    },
    handleItemClick: function (node, record, item, index, e, eOpts) {
        this.changeHoverText();
        this.changeSelectSate();//设置选中卫星（显示其特征点，并将其轨道变色）
    },
    handleItemDblClick: function (node, record, item, index, e, eOpts) {
        this.changeHoverText();
        this.changeSatAngle();//将视角切换到该卫星视角
    },
    changeHoverText: function () {
        var me = this;
        var listTree = me.getSolutionTree();
        var cellEditingPlugin = listTree.cellEditingPlugin;
        cellEditingPlugin.cancelEdit();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //electionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        if (selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                var sid = selectedList.get('name');
                var pi = 180 / Math.PI;
                var i = ORBIT.orbitpara[sid].i * pi;
                var Om = ORBIT.orbitpara[sid].Om * pi, om = ORBIT.orbitpara[sid].om * pi, theta = ORBIT.orbitpara[sid].theta * pi;
                var basePosition = me.getOrbitScenePanel().getPosition();
                basePosition[0] += me.getOrbitScenePanel().getWidth();
                basePosition[1] += me.getOrbitScenePanel().getHeight();
                HoverText.initOrRefreshHoverTextDiv((ORBIT.orbitpara[sid].a).toFixed(2), (ORBIT.orbitpara[sid].e).toFixed(2), (i).toFixed(2), (Om).toFixed(2), (om).toFixed(2), (theta).toFixed(2), basePosition);
            }
        }
    },
    //选中卫星（显示其特征点）
    changeSelectSate: function () {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0];
        if (selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                var sid = selectedList.get('name');
                //修改行星视角控件中的值
//                ORBIT.isSelectSat = true;
//                ORBIT.selectOrbit = sid;
//                hideCharacter();
//                ORBIT.Orbit.resetOrbitColor();
//                showCharacter(sid);
//                ORBIT.orbit[sid].setOrbitColor('#ff7e00');
//                ORBIT.planetaryTrackVisibility = false;
//                removePlanetOrbit();//隐藏行星轨迹
//                HoverText.hideHoverText();//隐藏行星文字
//                ORBIT.sunDiv.style.display = "none";//隐藏太阳图标div
                var cid = ORBIT.orbit[sid].getCenterId();
                if (cid != ORBIT.tracedObject.id) {

                }
                var pid = 'angel' + cid.charAt(0).toUpperCase() + cid.substring(1);
//                this.getOrbitOperationToolbar().queryById('planetCombo').setValue(pid);
                //选中卫星（包括设置其轨道颜色，显示其特征点以及右下角显示卫星参数）
                selectSat(sid);
            }
            else {
//                ORBIT.isSelectSat = false;
//                ORBIT.selectOrbit = null;
//                hideCharacter();
//                ORBIT.Orbit.resetOrbitColor();
//                HoverText.hideSatellitePara();
//                refreshCamera();
                cancleSelectSat();
            }
        }
    },
    //将视角切换到选中卫星
    changeSatAngle: function () {
        ORBIT.sunDiv.style.display = "none";
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0];
        if (selectedList != null && selectedList != undefined) {
            if (selectedList.get('nodeType') == APC.NODETYPE_SATELLITE) {
                var sid = selectedList.get('name');
                var orbit = ORBIT.orbit[sid];
                ORBIT.isSelectSat = true;
                ORBIT.selectOrbit = sid;
                orbit.hideCharacter();
                ORBIT.Orbit.resetOrbitColor();
                orbit.showCharacter();
                orbit.setOrbitColor('#ff7e00');
                ORBIT.planetaryTrackVisibility = false;
                removePlanetOrbit();//隐藏行星轨迹
                HoverText.hideHoverText();//隐藏行星文字
                ORBIT.sunDiv.style.display = "none";//隐藏太阳图标div
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
                me.getOrbitOperationToolbar().queryById('planetCombo').setValue('noPlanet');
                me.getOrbitOperationToolbar().queryById('planetAxesCombo').setValue('noAxes');
                me.getOrbitOperationToolbar().queryById('earthAxesCombo').setValue('noAxes');
                me.getOrbitOperationToolbar().queryById('otherAxesCombo').setValue('noAxes');
            }
            else {
                ORBIT.isSelectSat = false;
                ORBIT.selectOrbit = null;
                hideCharacter();
                ORBIT.Orbit.resetOrbitColor();
                HoverText.hideSatellitePara();
                refreshCamera();
            }
        }
    },
    handleContainerClick: function (listTree, e, eOpts) {
        var listTree = this.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        selectionModel.deselectAll();
        this.concreteSubject.nodeType = 'NoRoot';
    },
    handleNewOrbitFileClick: function (component, e) {
        var me = this;
        me.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
        var text = '任务' + me.taskNumber;
        var isRepeat = me.repeatabilityVerification(text, me.taskArray);
        while (isRepeat) {
            me.taskNumber++;
            text = '任务' + me.taskNumber;
            isRepeat = me.repeatabilityVerification(text, me.taskArray);
        }
        ;
        me.addList(APC.NODETYPE_TASK, text);
    },
    //重复性验证
    repeatabilityVerification: function (text, jsonResult) {
        var i;
        for (i = 0; i < jsonResult.length; i++) {
            if (jsonResult[i].name == text) {
                return true;
            }
        }
        return false;

    },
    //判断是够存在任务节点，如果不存在任务节点添加任务节点后再添加卫星节点，如果存在，则直接添加卫星节点。
    handleAddSatelliteClick: function (component, e) {
        var me = this;
        var rootNodeList = me.getSolutionTree().getRootNode();
        me.getOrbitOperationToolbar().queryById('OrbitMenu').menu.hide();
        if (rootNodeList == null) {
            var text = '任务' + me.taskNumber;
            var isRepeat = me.repeatabilityVerification(text, me.taskArray);
            while (isRepeat) {
                me.taskNumber++;
                text = '任务' + me.taskNumber;
                isRepeat = me.repeatabilityVerification(text, me.taskArray);
            }
            ;
            //添加任务节点后，调用addAnSatellite方法创建一个卫星节点
            me.addList(APC.NODETYPE_TASK, text, 'addAnSatellite');
            rootNodeList = me.getSolutionTree().getRootNode();
        } else {
            me.addAnSatellite(rootNodeList);
        }
    },
    addAnSatellite: function (rootNodeList) {
        var me = this;
        if (!me.getSolutionTree().getRootNode().isExpanded()) {
            me.getSolutionTree().getRootNode().expand(false,
                function (optional) {
                    me.addSatellite();
                }
                , this);
        } else {
            me.addSatellite();
        }
    },
    addSatellite: function () {
        var me = this;
        var childNameArray = new Array();
        var childNodes = me.getSolutionTree().getRootNode().childNodes;
        for (i = 0; i < childNodes.length; i++) {
            var childName = new Object();
            childName.name = childNodes[i].get('name');
            childNameArray.push(childName);
        }
        var text = '卫星' + me.satelliteNumber;
        var isRepeat = me.repeatabilityVerification(text, childNameArray);
        while (isRepeat) {
            me.satelliteNumber++;
            text = '卫星' + me.satelliteNumber;
            isRepeat = me.repeatabilityVerification(text, childNameArray);
        }
        ;
        me.addList(APC.NODETYPE_SATELLITE, text);
    },
    handleRenameClick: function (component, e) {
        var listTree = this.getSolutionTree(),
            cellEditingPlugin = listTree.cellEditingPlugin,
            selectionModel = listTree.getSelectionModel(),
            selectedList = selectionModel.getSelection()[0];
        cellEditingPlugin.startEdit(selectedList, 0);
    },
    getSelectedList: function () {
        var listTree = this.getSolutionTree(),
            selectionModel = listTree.getSelectionModel(),
            selectedList = selectionModel.getSelection()[0];
        return selectedList;
    },
    //禁用轨道段窗口中卫星属性控件
    disableSatPara: function(){
        var me = this;
        var panel = this.queryById("orbitPara");
        panel.queryById("axescombo").setDisabled(true);
        panel.queryById("paraanfield").setDisabled(true);
        panel.queryById("paraenfield").setDisabled(true);
        panel.queryById("parainfield").setDisabled(true);
        panel.queryById("paraOmnfield").setDisabled(true);
        panel.queryById("paraomnfield").setDisabled(true);
        panel.queryById("parathetanfield").setDisabled(true);
    },
    //禁用轨道段窗口中卫星属性控件
    enableSatPara: function(){
        var me = this;
        var panel = this.queryById("orbitPara");
        panel.queryById("axescombo").setDisabled(false);
        panel.queryById("paraanfield").setDisabled(false);
        panel.queryById("paraenfield").setDisabled(false);
        panel.queryById("parainfield").setDisabled(false);
        panel.queryById("paraOmnfield").setDisabled(false);
        panel.queryById("paraomnfield").setDisabled(false);
        panel.queryById("parathetanfield").setDisabled(false);
    },
    //禁用toolbar里的操作
    disableOperation: function(){
        this.getOrbitOperationToolbar().queryById('btnNewOrbitFile').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('btnAddSatellite').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('btnOpenOrbitFile').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('btnSaveOrbitFile').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('btnExportOrbitFile').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('simuparaBtn').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('VisibileCtrlButton').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('simuPLBtn').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('simuRWBtn').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('simuSTBtn').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('simuFFBtn').setDisabled(true);
        this.getOrbitOperationToolbar().queryById('planetScaleSlider').setDisabled(true);
    },
    //启用toolbar里的操作
    eableOperation: function(){
        this.getOrbitOperationToolbar().queryById('btnNewOrbitFile').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('btnAddSatellite').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('btnOpenOrbitFile').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('btnSaveOrbitFile').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('btnExportOrbitFile').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('simuparaBtn').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('VisibileCtrlButton').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('simuPLBtn').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('simuRWBtn').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('simuSTBtn').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('simuFFBtn').setDisabled(false);
        this.getOrbitOperationToolbar().queryById('planetScaleSlider').setDisabled(false);
    },
    //获取选中的轨道段
    getSelectOrbitSection: function(){
        var me = this;
        var panel = me.orbitSectionWindow.queryById("orbitSectionGridPanel");
        var sm = panel.getSelectionModel();
        return sm.getSelection()[0];
    },
    //清空卫星属性框中的值
    resetSectionPara: function(){
        var panel = this.queryById("orbitPara");
        panel.queryById("axescombo").setValue("");
        panel.queryById("paraanfield").setValue("");
        panel.queryById("paraenfield").setValue("");
        panel.queryById("parainfield").setValue("");
        panel.queryById("paraOmnfield").setValue("");
        panel.queryById("paraomnfield").setValue("");
        panel.queryById("parathetanfield").setValue("");
    },
    //将所选轨道段的值赋给卫星属性框
    refreshSectionPara: function(){
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        if(ORBIT.selectSectionId != null){
            var orbitPara = orbit.getOrbitSectionPara(ORBIT.selectSectionId);
            var panel = this.queryById("orbitPara");
            var rToA = 180 / Math.PI;
            panel.queryById("axescombo").setValue("iAxes");
            panel.queryById("paraanfield").setValue(orbitPara.a);
            panel.queryById("paraenfield").setValue(orbitPara.e);
            panel.queryById("parainfield").setValue(orbitPara.i * rToA);
            panel.queryById("paraOmnfield").setValue(orbitPara.Om * rToA);
            panel.queryById("paraomnfield").setValue(orbitPara.om * rToA);
            panel.queryById("parathetanfield").setValue(orbitPara.theta * rToA);
        }
        else{
            this.resetSectionPara();
        }
    },
    refreshOrbitSection: function(){
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        var sectionList = orbit.getOrbitSection();
        var row, rowList = new Array();
        for(var i in sectionList){
            row = Ext.create('OrbitSectionModel', {
                numberId: sectionList[i]["numberId"],
                currentPlanet: sectionList[i]["currentPlanet"],
                targetPlanet: sectionList[i]["targetPlanet"],
                startTime: sectionList[i]["startTime"],
                endTime: sectionList[i]["endTime"],
                speedDifference: sectionList[i]["speedDifference"]
            });
            rowList.push(row);
        }
        var panel = this.queryById("orbitSectionGridPanel");
        panel.getStore().loadData(rowList, false);
        //disable卫星属性框
        this.disableSatPara();
        //清空卫星属性框中的值
        this.resetSectionPara();
        //禁用删除按钮
//        me.queryById('removeOrbitSection').setDisabled(true);
    },
    //轨道段设计
    handleOrbitSectionItemClick:function (component, e) {
        var me = this;
        //设置要设计轨道段的卫星
        ORBIT.selectOrbitSectionId = me.getSelectedList().get("name");
        //加载数据，显示出window
        if (this.orbitSectionWindow == null) {
            this.orbitSectionWindow = Ext.create('OrbitDesignApp.view.OrbitDesign.OrbitSectionWindow');
            this.orbitSectionWindow.refreshOrbitSection = this.refreshOrbitSection;
            this.orbitSectionWindow.refreshSectionPara = this.refreshSectionPara;
            this.orbitSectionWindow.resetSectionPara = this.resetSectionPara;
            this.orbitSectionWindow.disableSatPara = this.disableSatPara;
            this.orbitSectionWindow.enableSatPara = this.enableSatPara;
        }
        //设置窗口的位置
        var basePosition = me.getOrbitScenePanel().getPosition();
        basePosition[1] += me.getOrbitScenePanel().getHeight() - this.orbitSectionWindow.height;
        this.orbitSectionWindow.setPosition(basePosition[0], basePosition[1], true);
        //加载轨道段
        this.orbitSectionWindow.refreshOrbitSection();
        //将删除按钮disable掉
//        me.orbitSectionWindow.queryById('removeOrbitSection').setDisabled(true);

        me.orbitSectionWindow.show();
        //将卫星设置选中的状态
        selectSat(me.getSelectedList().get("name"));
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        orbit.showAllSection();
//        addOrbitSectionAxis();
//        refreshCamera();
        //刷新轨道段特征轴
//        ORBIT.Orbit.refreshOrbitSectionAxis();
        //进入太阳系场景
//        resetCamera();
        //禁用toolbar上的操作
        this.disableOperation();
        refreshCamera();
    },

    //添加轨道段
    handleAddOrbitSection:function (component, e) {
        ORBIT.isTargetPlanetPassive = false;
        ORBIT.isStartTimePassive = false;
        ORBIT.isEndTimePassive = false;
        var me = this;
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        var startCenter = orbit.getLastCenter();
        var endCenter = ORBIT.Planet.getDefaultPlanet(startCenter);
        var sTime = orbit.getDefaultSTime();
        var panel = me.orbitSectionWindow.queryById("orbitSectionGridPanel");
//        orbit.addOrbitTransfer(sTime, startCenter, endCenter);
        var selectSection = me.getSelectOrbitSection();
        var id;
        if(selectSection != null && selectSection != undefined){
            id = selectSection.data.numberId - 1;
        }
        else{
            id = orbit.orbitSection.length - 1;
        }
        orbit.addDefaultSection(id);
        orbit.showAllSection();
        //如果当前选中的的卫星与轨道段设计的卫星不同则隐藏特征轴
        if(ORBIT.selectOrbitSectionId != ORBIT.selectOrbit){
            orbit.hideCharacter();
        }
//        addOrbitSectionAxis();
//        refreshCamera();
        //刷新轨道段特征轴
//        ORBIT.Orbit.refreshOrbitSectionAxis();
        refreshObject();
        refreshCamera();
//        var len = orbit.orbitSection.length;
//        var r = Ext.create('OrbitSectionModel', {
//            numberId: len,
//            currentPlanet: ORBIT.Planet.toChinese(orbit.getStartCenter(len - 1)),
//            targetPlanet: ORBIT.Planet.toChinese(orbit.getEndCenter(len - 1)),
//            startTime: formatDate(orbit.getStartTime(len - 1)),
//            endTime: formatDate(orbit.getEndTime(len - 1)),
//            speedDifference: orbit.getSpeedDifference(len - 1)
//        });
//        var sum = orbit.getSectionSum();
//        panel.getStore().insert(sum, r);
        //刷新轨道段列表
        this.orbitSectionWindow.refreshOrbitSection();
        //对新增行启用编辑
        panel.getPlugin('rowEditing').startEdit(id + 2, 0);
        //禁用删除按钮
//        me.orbitSectionWindow.queryById('removeOrbitSection').setDisabled(true);
        ORBIT.isTargetPlanetPassive = true;
        ORBIT.isStartTimePassive = true;
        ORBIT.isEndTimePassive = true;


        Ext.apply(
            panel.getStore().proxy.extraParams, {
                id: me.getSelectedList().get("id")
            });
        panel.getStore().sync({
            success: function (batch, options) {
            },
            failure: function (batch, options) {
            }
        });
    },

    //当选中某轨道段时
    selectRow: function(rowModel, record, index, eOpts){
        var me = this;
        var selectRow = me.getSelectOrbitSection();
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        ORBIT.selectSectionId = selectRow.data.numberId - 1;
        //判断转中的是否是转移轨道
        if(orbit.getIsTransfer(ORBIT.selectSectionId)){
            //disable卫星属性框
            me.orbitSectionWindow.disableSatPara();
            ORBIT.isSectionWindowSatPara = false;
            //清空卫星属性框中的值
            me.orbitSectionWindow.resetSectionPara();
            ORBIT.isSectionWindowSatPara = true;
        }
        else{
            //enable卫星属性框
            me.orbitSectionWindow.enableSatPara();
            ORBIT.isSectionWindowSatPara = false;
            //将所选轨道段的值赋给卫星属性框
            me.orbitSectionWindow.refreshSectionPara();
            ORBIT.isSectionWindowSatPara = true;
        }


        //panel.getPlugin('rowEditing').cancelEdit();
        var sum = ORBIT.orbit[ORBIT.selectOrbitSectionId].getSectionSum();
//        var numberId = selectRow.data.numberId;
//        if(numberId == sum && numberId > 0){
//              me.orbitSectionWindow.queryById('removeOrbitSection').setDisabled(false);
//        }
//        else{
//            me.orbitSectionWindow.queryById('removeOrbitSection').setDisabled(true);
//        }
    },
    //编辑轨道段前响应函数
    beforeRowEditing: function( editor, context, eOpts){
        var me = this;
        ORBIT.currentRowEditor = editor.editor;
        var selectRow = me.getSelectOrbitSection();
        if(selectRow != undefined){
            if(selectRow.data.numberId != ORBIT.selectRowSection["numberId"]){
                if(selectRow.data.targetPlanet != ORBIT.selectRowSection["targetPlanet"]){
                    ORBIT.isTargetPlanetPassive = false;
                }
                if(selectRow.data.startTime != ORBIT.selectRowSection["startTime"]){
                    ORBIT.isStartTimePassive = false;
                }
                if(selectRow.data.endTime != ORBIT.selectRowSection["endTime"]){
                    ORBIT.isEndTimePassive = false;
                }
            }
            ORBIT.selectRowSection = {numberId: selectRow.data.numberId, targetPlanet: selectRow.data.targetPlanet,
                startTime: selectRow.data.startTime, endTime: selectRow.data.endTime};
//            var sum = ORBIT.orbit[ORBIT.selectOrbitSectionId].getSectionSum();
            var numberId = selectRow.data.numberId;
            if(numberId == 0){
                ORBIT.currentRowEditor.queryById("targetPlanetEditor").setDisabled(true);
//                ORBIT.currentRowEditor.queryById("startTimeEditor").setDisabled(true);
//                ORBIT.currentRowEditor.queryById("endTimeEditor").setDisabled(true);
//                ORBIT.currentRowEditor.queryById("speedDifferenceEditor").setDisabled(true);
            }
            else{
                ORBIT.currentRowEditor.queryById("targetPlanetEditor").setDisabled(false);
//                ORBIT.currentRowEditor.queryById("startTimeEditor").setDisabled(false);
//                ORBIT.currentRowEditor.queryById("endTimeEditor").setDisabled(false);
//                ORBIT.currentRowEditor.queryById("speedDifferenceEditor").setDisabled(false);
            }
        }
    },
    //修改轨道转移目标星体时响应函数
    handleTargetPlanetEditing: function( editor, newValue, oldValue, eOpts ){
        if(ORBIT.isTargetPlanetPassive){
            var currentPlanet = ORBIT.currentRowEditor.queryById("currentPlanetEditor").getValue();
            var id = ORBIT.selectSectionId;
            var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
            var len = orbit.orbitSection.length;
            var startCenter = ORBIT.Planet.toEnglish(currentPlanet);
            var endCenter = ORBIT.Planet.toEnglish(newValue);
            var sTime = new Date(orbit.getStartTime(id));
            var eTime;
            if(startCenter == endCenter){
                eTime = new Date(sTime.toString());
            }
            orbit.updateSection(id, sTime, startCenter, endCenter, eTime);
//            if(id < len - 1){
//                orbit.updateStartTime(id + 1, orbit.getEndTime(id));
//            }
            ORBIT.isEndTimePassive = false;
            ORBIT.currentRowEditor.queryById("endTimeEditor").setValue(
                formatDate(orbit.getEndTime(id))
            );
            ORBIT.isEndTimePassive = true;
            ORBIT.currentRowEditor.queryById("speedDifferenceEditor").setValue(
                orbit.getSpeedDifference(id)
            );
            orbit.showAllSection();
            //刷新轨道段特征轴
//                ORBIT.Orbit.refreshOrbitSectionAxis();
            refreshObject();
            refreshCamera();
        }
        else{
            ORBIT.isTargetPlanetPassive = true;
        }
    },
    //修改轨道转移开始时间时响应函数
    handleStartTimeEditing: function( editor, newValue, oldValue, eOpts ){
        if(ORBIT.isStartTimePassive){
            var id = ORBIT.selectSectionId;
            var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
            var currentPlanet = ORBIT.currentRowEditor.queryById("currentPlanetEditor").getValue();
            var startCenter = ORBIT.Planet.toEnglish(currentPlanet);
            var targetPlanet = ORBIT.currentRowEditor.queryById("targetPlanetEditor").getValue();
            var endCenter = ORBIT.Planet.toEnglish(targetPlanet);
            var sTime = newValue;
            var eTime;
            if(startCenter == endCenter){
                eTime = orbit.getEndTime(ORBIT.selectSectionId);
            }
            orbit.updateSection(id, sTime, startCenter, endCenter, eTime);
//            orbit.updateEndTime(id - 1, newValue);
            ORBIT.isEndTimePassive = false;
            ORBIT.currentRowEditor.queryById("endTimeEditor").setValue(
                formatDate(orbit.getEndTime(id))
            );
            ORBIT.isEndTimePassive = true;
            ORBIT.currentRowEditor.queryById("speedDifferenceEditor").setValue(
                orbit.getSpeedDifference(id)
            );
            orbit.showAllSection();
            //刷新轨道段特征轴
//                ORBIT.Orbit.refreshOrbitSectionAxis();
            refreshObject();
            refreshCamera();
        }
        else{
            ORBIT.isStartTimePassive = true;
        }
    },
    //修改轨道转移结束时间时响应函数
    handleEndTimeEditing: function( editor, newValue, oldValue, eOpts ){
        if(ORBIT.isEndTimePassive){
            var id = ORBIT.selectSectionId;
            var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
            var len = orbit.orbitSection.length;
            var currentPlanet = ORBIT.currentRowEditor.queryById("currentPlanetEditor").getValue();
            var startCenter = ORBIT.Planet.toEnglish(currentPlanet);
            var targetPlanet = ORBIT.currentRowEditor.queryById("targetPlanetEditor").getValue();
            var endCenter = ORBIT.Planet.toEnglish(targetPlanet);
            var sTime = orbit.getStartTime(id);
            var eTime = newValue;
            if(orbit.getIsTransfer(id) && !orbit.isTransfer(id, sTime, startCenter, endCenter, newValue)){
                ORBIT.isEndTimePassive = false;
                ORBIT.currentRowEditor.queryById("endTimeEditor").setValue(oldValue);
                ORBIT.isEndTimePassive = true;
            }
            else{
                orbit.updateSection(id, sTime, startCenter, endCenter, eTime);
//                if(id < len - 1){
//                    orbit.updateStartTime(id + 1, newValue);
//                }
                ORBIT.currentRowEditor.queryById("speedDifferenceEditor").setValue(
                    orbit.getSpeedDifference(id)
                );
                orbit.showAllSection();
                //刷新轨道段特征轴
//                ORBIT.Orbit.refreshOrbitSectionAxis();
                refreshObject();
                refreshCamera();
            }
        }
        else{
            ORBIT.isEndTimePassive = true;
        }
    },
    //保存轨道段修改时响应函数
    handleRowEditing: function ( editor, e, eOpts ){
        var me = this;
        this.orbitSectionWindow.refreshOrbitSection();
        Ext.apply(
            me.orbitSectionWindow.queryById("orbitSectionGridPanel").getStore().proxy.extraParams, {
                id: me.getSelectedList().get("id")
            });
        me.orbitSectionWindow.queryById("orbitSectionGridPanel").getStore().sync({
            success: function (batch, options) {
            },
            failure: function (batch, options) {
            }
        });
    },
    //取消轨道段的保存时响应函数
    cancelEditing: function( editor, context, eOpts ){
    },

    //删除轨道段
    handleRemoveOrbitSection: function (component, e) {
        var me = this;
        var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
        var panel = me.orbitSectionWindow.queryById("orbitSectionGridPanel");
        var store = panel.getStore();
        var sm = panel.getSelectionModel();
        panel.getPlugin('rowEditing').cancelEdit();
        var selectRow = sm.getSelection()[0];
        if(selectRow == null || selectRow == undefined || orbit.getSectionSum() == 0 || selectRow.data.numberId == 0){
            this.getOrbitSectionWindow().queryById('errorLabel').setText(APC.TIP_OF_DELETE_ORBIT_SECTION);
            setTimeout(function(){
                Ext.getCmp('orbitSectionWindow').queryById('errorLabel').setText("");
            }, 2000);
            return;
        }
        var id = selectRow.data.numberId - 1;
        orbit.deleteSection(id);
//        store.remove(selectRow);
        if (store.getCount() > 0) {
            sm.select(0);
        }
        orbit.showAllSection();
        //刷新轨道段特征轴
//        ORBIT.Orbit.refreshOrbitSectionAxis();
        refreshCamera();
//        if(ORBIT.orbit[ORBIT.selectOrbitSectionId].getSectionSum() == 0){
//            me.orbitSectionWindow.queryById('removeOrbitSection').setDisabled(true);
//        }
        this.orbitSectionWindow.refreshOrbitSection();


        Ext.apply(
            store.proxy.extraParams, {
                id: me.getSelectedList().get("id")
            });
        store.sync({
            success: function (batch, options) {
            },
            failure: function (batch, options) {
            }
        });
    },
    //卫星轨道段设计关闭
    orbitSectionWindowClose: function(){
        if(ORBIT.selectOrbitSectionId != null){
            var orbit = ORBIT.orbit[ORBIT.selectOrbitSectionId];
            if(orbit.isSectionValid()){
                ORBIT.selectOrbitSectionId = null;
                orbit.refresh();
                //隐藏轨道段特征轴
//            removeOrbitSectionAxis();
                //启用toolbar上的操作
                this.eableOperation();
                //重置仿真时间及场景
                resetSimuTimeAndScene();
            }
            else{
                this.orbitSectionWindow.show();
                Ext.MessageBox.show({title: '消息', msg: '轨道段设计不合法，无法进行仿真', buttons: Ext.Msg.OK});
            }
        }
    },
    expandNode: function (node, eOpts) {
        //这里使用getSolutionTreeStoreStore是个大隐患
        var listTree = this.getSolutionTree();
        Ext.apply(
            this.getSolutionTreeStoreStore().model.proxy.extraParams, {
                id: node.data.id
            })
    },
    handleTreeItemExpand: function (node, eOpts) {
        var me = this;
        var childNodes = node.childNodes;
        var length = childNodes.length;
        for (i = 0; i < length; i++) {
            var node = childNodes[i];
            if (node.get('nodeType') == APC.NODETYPE_SATELLITE) {
                node.set('iconCls', APC.NODETYPE_SATELLITE);
            }
        }
    },
    //使双击的时候重命名节点功能失效
    cancelCelldblclick: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        return false;
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
    //初始化视角下拉框
    initAngleCombo: function () {
        var pid = 'angelSun';
        this.getOrbitOperationToolbar().queryById('planetCombo').setValue(pid);
    },
    addList: function (type, name, addAnSatellite) {
        var me = this;
        var listTree = me.getSolutionTree();
        var selectionModel = listTree.getSelectionModel();
        var selectedList = selectionModel.getSelection()[0]; //electionModel.getSelection()返回值为Ext.data.Model[]，[0]选定其中一个record
        var rootNodeList = me.getSolutionTree().getRootNode();
        var solutionTreeStore = listTree.getStore('SolutionTreeStore');
        var parentList;
        var newList = null;
        var iconCls = null;
        var isLeaf = null;
        if (type == APC.NODETYPE_TASK) {
            me.satelliteNumber = 1;
            me.fileName = name;
            solutionTreeStore.setRootNode({
                nodeType: type,
                leaf: false,
                name: me.fileName,
                isRoot: false,
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
                        me.getSolutionTree().getRootNode().setId(callbackJson.id);
                        me.getSolutionTree().getRootNode().set("parentId", callbackJson.parentId);
                        me.getSolutionTree().getRootNode().set('rootId', callbackJson.rootId);
                        me.getSolutionTree().getRootNode().set('dataId', callbackJson.dataId);
                        var fileName = callbackJson.id;
                        if (fileName != null) {
                            //保存文件xpz filename = 树节点id+后缀
                            ORBIT.saveManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, fileName);
                            ORBIT.saveManage.mergeTaskToDB(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, fileName, false);
                        }
                        //如果传了addAnSatellite这个参数，则为任务节点添加一个子节点
                        if (addAnSatellite == 'addAnSatellite') {
                            me.addAnSatellite(me.getSolutionTree().getRootNode());
                        }
                    }
                    ORBIT.fileName = callbackJson.name;
                    var obj = new Object();
                    obj.name = callbackJson.name;
                    me.taskArray.push(obj);//添加完任务以后，更新taskArray
                    me.isFileSaved = false;
                },
                failure: function (batch, options) {
                    var error = batch.exceptions[0].getError(),
                        msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                    Ext.MessageBox.show({
                        title: '添加任务失败',
                        msg: msg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            });//调用create API
            newList = me.getSolutionTree().getRootNode();
            parentList = newList;
        }
        else if (type == APC.NODETYPE_SATELLITE) {
            me.satelliteName = name;
            parentList = rootNodeList;
            iconCls = APC.NODETYPE_SATELLITE;
            isLeaf = true;
            newList = Ext.create('OrbitDesignApp.model.SolutionTreeModel', {
                name: me.satelliteName,
                leaf: isLeaf,
                nodeType: type,
                parentId: parentList.get('id'),
                isRoot: false,
                rootId: parentList.get('id'),
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
                            var rootNode = listTree.getRootNode();
                            var fileName = rootNode.internalId;
                            if (fileName != null && callbackJson != null) {
                                ORBIT.saveManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, callbackJson.id, callbackJson.name);
                                ORBIT.saveManage.mergeTaskToDB(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + fileName, fileName, false);
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
        if (type == APC.NODETYPE_TASK) {
            initOrbitScene();
            this.initAngleCombo();
            HoverText.hideSatellitePara();
        }
        else if (type == APC.NODETYPE_SATELLITE) {
            initSatelliteOrbit(me.satelliteName);
            this.changeSelectSate();
            this.changeHoverText();
            refreshObject();
            refreshCamera();
        }
    },
    validateEdit: function (editor, context, eOpts) {
        var me = this;
        var oldValue = context.originalValue;
        var newValue = context.value;
        var list = context.record;
        var isRepeat;
        var rootNodeList = me.getSolutionTree().getRootNode();
        if (list.get('nodeType') == APC.NODETYPE_TASK) {
            isRepeat = me.repeatabilityVerification(newValue, this.taskArray);
            if (!isRepeat) {
                for (i = 0; i < me.taskArray.length; i++) {
                    if (me.taskArray[i].name == oldValue) {
                        me.taskArray[i].name = newValue;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        else if (list.get('nodeType') == APC.NODETYPE_SATELLITE) {
            var childNodes = rootNodeList.childNodes;
            var saelliteNameArray = new Array();
            for (i = 0; i < childNodes.length; i++) {
                if (childNodes[i].get('name') != oldValue) {
                    var obj = new Object();
                    obj.name = childNodes[i].get('name');
                    saelliteNameArray.push(obj);
                }
            }
            var isRepeat = me.repeatabilityVerification(newValue, saelliteNameArray);
            if (!isRepeat) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    updateList: function (editor, e) {
        var me = this;
        var list = e.record;
        list.save({
            success: function (list, operation) {
                renameSateOrbit(editor.context.originalValue, editor.context.value, list.data.nodeType);
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
                return false;
            }
        });
        //调用update API
    },
    handleDeleteClick: function (component, e) {
        this.deleteList(this.getSolutionTree().getSelectionModel().getSelection()[0]);
    },
    handleShowOrbitClick: function (component, e) {
        var seleteNodeName = this.getSolutionTree().getSelectionModel().getSelection()[0].data.name;
        ORBIT.scene.add(ORBIT.satellite[seleteNodeName].object);
        if(ORBIT.planetaryCoordinatesVisibility){
            ORBIT.scene.add(ORBIT.satellite[seleteNodeName].axis_orbit.object);
        }
        ORBIT.scene.add(ORBIT.orbit[seleteNodeName].object);
        ORBIT.satellite[seleteNodeName].isExit = true;
        ORBIT.satellite[seleteNodeName].isVisable = true;
        refreshCamera();
    },
    handleHideOrbitClick: function (component, e) {
        var seleteNodeName = this.getSolutionTree().getSelectionModel().getSelection()[0].data.name;
        ORBIT.scene.remove(ORBIT.satellite[seleteNodeName].object);
        ORBIT.scene.remove(ORBIT.satellite[seleteNodeName].axis_orbit.object);
        ORBIT.scene.remove(ORBIT.orbit[seleteNodeName].object);
        ORBIT.satellite[seleteNodeName].isVisable = false;
        refreshCamera();
    },
    /**
     * 删除选中的节点，刷新视图
     * @param {SimpleTasks.model.List} list
     */
    deleteList: function (list) {
        var me = this;
        var listTree = me.getSolutionTree();
        if (list != undefined && listTree != undefined) {
            var listName = list.get('name');
            var listsStore = listTree.getStore('SolutionTreeStore');
            var listParent = list.parentNode;
            var nodeType = list.get('nodeType');
            var sid = list.get("name");
            var nodeId = list.internalId;
            var typeCH = ColArgu.colArguTreeUtil.typeE2C(list.get('nodeType'));
            Ext.Msg.show({
                title: '删除' + typeCH + '?',
                msg: '你是否要删除' + listName + '?',
                buttons: Ext.Msg.YESNO,
                fn: function (response) {
                    if (response === 'yes') {
                        // destroy the tree node on the server
                        if (nodeType == APC.NODETYPE_SATELLITE) {
                            //修改视角
                            if (ORBIT.tracedTargetTpye == "Sate" && ORBIT.tracedObject.id == sid) {
//                                HoverText.changeAngle();
                                var orbit = ORBIT.orbit[ORBIT.tracedObject.id];
                                var id = orbit.detectCurrentSection();
                                var pid = orbit.getCenter(id);
                                pid = 'angel' + pid.charAt(0).toUpperCase() + pid.substring(1);
                                me.getOrbitOperationToolbar().queryById('planetCombo').setValue(pid);
                            }
                            list.remove();
                            listsStore.model.proxy.extraParams = {
                                userId: sessionStorage.getItem('userId')
                            };
                            //调用delete API
                            listsStore.sync({
                                success: function (batch, options) {
                                    var callbackJson = Ext.JSON.decode(batch.operations[0].response.responseText);

                                        if (nodeType == APC.NODETYPE_SATELLITE) {
                                            deleteSateOrbit(sid);
                                            var listTree = me.getSolutionTree();
                                            var rootNodeId = listTree.getRootNode().internalId;
                                            if (rootNodeId != null) {
                                                ORBIT.saveManage.deleteSatellite(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + rootNodeId, nodeId);
                                            }
                                        }

                                },
                                failure: function (batch, options) {
                                    alert('failure');
                                    var error = batch.exceptions[0].getError(),
                                        msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
                                    Ext.MessageBox.show({
                                        title: '删除节点失败',
                                        msg: msg,
                                        icon: Ext.Msg.ERROR,
                                        buttons: Ext.Msg.OK
                                    });
                                }
                            });
                        }
                        else {
                            //修改视角
                            if (ORBIT.tracedTargetTpye == "Sate") {
                                HoverText.changeAngle();
                            }
                            //删除根节点
                            var node = listTree.getRootNode();
                            var rootNodeId = node.internalId;
                            listsStore.removeAll();
                            if (rootNodeId != null) {
                                ORBIT.saveManage.deleteScene(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.ORBIT_DESIGN + "/" + rootNodeId);
                            }
                            ORBIT.fileName = null;
                            ORBIT.isSelectSat = false;
                            ORBIT.selectOrbit = null;
                            HoverText.hideSatellitePara();
                            initSimuTime();
                            initSateOrbit();
                            resetScene();
                        }
                    }
                }
            });
        }
    }
});
