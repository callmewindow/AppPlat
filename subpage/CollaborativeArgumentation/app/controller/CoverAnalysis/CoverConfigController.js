/**
 * Created by Administrator on 2014/7/3.
 */
Ext.define('AppPlat.controller.CoverAnalysis.CoverConfigController', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'selectGroundStationInfoPanel',
            selector: 'selectgroundstationinfopanel'
        },
        {
            ref: 'schedulerView',
            selector: 'schedulerview'
        },
        {
            ref: 'analysisResultGridPanel',
            selector: 'analysisresultgridpanel'
        }
    ],
    solutionNode: null,
    coverAnaNodes:null,
    theader:null,
    div_meng:null,
    font_meng: null,
    init: function (application) {
        var me = this;
        this.control({
            'selectgroundstationinfopanel combobox[itemId=param_sg]': {
                change: me.handleSelectChanged
            },
            '#btnOverStaAnaCompute': {
                click: me.handleOverStaAnaCompute
            }
        });
    },
    onLaunch: function (application) {
    },
    initOrRefreshCombobox: function (solutionNode) {
        var me = this;
        this.solutionNode = solutionNode;
        var gsAndSatelliteArray = new Array();
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "TreeManage/getCoverAnaNodeBySolutionId.json",
            method: 'GET',
            params: {
                solutionId: solutionNode.get('id')
            },
            success: function (response) {
                var nodes = JSON.parse(response.responseText);
                me.coverAnaNodes = nodes;
                for (i = 0; i < nodes.length; i++) {
                    var obj = new Array(nodes[i].name, nodes[i].id,nodes[i].nodeType,nodes[i].nodeFilePath);
                    gsAndSatelliteArray.push(obj);
                }
                if(gsAndSatelliteArray.length == 0)   return;
                var dropdown_list = me.getSelectGroundStationInfoPanel().queryById('param_sg');
                if(dropdown_list.getStore().data.length == 0){
                    dropdown_list.store = new Ext.data.ArrayStore({
                        fields: ['name', 'value'],
                        data:gsAndSatelliteArray
                    })
                }else{
                    dropdown_list.getStore().loadData(gsAndSatelliteArray,false);
                }
                dropdown_list.setValue(gsAndSatelliteArray[0][1]);
            }
        });

    },
//    //根据方案节点获得地面站节点和卫星节点
//    getGsAndSatellite: function (solutionNode) {
//        //如果节点未展开，那么展开节点加载数据
//        var gsAndSatelliteArray = new Array();
//        Ext.Ajax.request({
//            url: APC.APPPLAT_SERVICE_URL_PREFIX + "TreeManage/getCoverAnaNodeBySolutionId.json",
//            method: 'GET',
//            params: {
//                solutionId: solutionNode.get('id')
//            },
//            success: function (response) {
//                var nodes = JSON.parse(response.responseText);
//                for (i = 0; i < nodes.length; i++) {
//                    var obj = new Array(nodes[i].name, nodes[i].id,nodes[i].nodeType,nodes[i].nodeFilePath);
//                    gsAndSatelliteArray.push(obj);
//                }
//                return gsAndSatelliteArray;
//            }
//        });
//
//    },
    //根据方案节点获得地面站节点和卫星节点
    getTargetNode: function (solutionNode,id) {
        for (i = 0; i < this.coverAnaNodes.length; i++) {
            if (this.coverAnaNodes[i].id == id) {
                return this.coverAnaNodes[i];
            }
        }
    },
    handleSelectChanged: function (_this, newValue, oldValue, eOpts) {
        var me = this;
        var checkbox_list = this.getSelectGroundStationInfoPanel().queryById('checkbox_list');
        checkbox_list.removeAll(true);
        var gsAndSatelliteArray = new Array();
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "TreeManage/getCoverAnaNodeBySolutionId.json",
            method: 'GET',
            params: {
                solutionId: me.solutionNode.get('id')
            },
            success: function (response) {
                var nodes = JSON.parse(response.responseText);
                me.coverAnaNodes = nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var obj = new Array(nodes[i].name, nodes[i].id,nodes[i].nodeType,nodes[i].nodeFilePath);
                    gsAndSatelliteArray.push(obj);
                }
                var counter = 0;
                if (newValue.indexOf("sat") > -1) {
                    for (var i = 0; i < gsAndSatelliteArray.length; i++) {
                        if (gsAndSatelliteArray[i][1].indexOf("gro") > -1) {
                            if(counter == 0)
                                checkbox_list.add({checked:true, width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            else
                                checkbox_list.add({width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            counter++;
                        }
                    }
                }
                else if(newValue.indexOf("gro") > -1) {
                    for (var i = 0; i < gsAndSatelliteArray.length; i++) {
                        if (gsAndSatelliteArray[i][1].indexOf("sat") > -1) {
                            if(counter == 0)
                                checkbox_list.add({checked:true, width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            else
                                checkbox_list.add({width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            counter++;
                        }
                    }
                }else if(newValue.indexOf("sen") > -1) {
                    for (var i = 0; i < gsAndSatelliteArray.length; i++) {
                        if (gsAndSatelliteArray[i][1].indexOf("sky") > -1) {
                            if(counter==0)
                                checkbox_list.add({checked:true, width: 150, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            else
                                checkbox_list.add({width: 150, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            counter++;
                        }
                    }
                }  else if(newValue.indexOf("sky") > -1) {
                    for (var i = 0; i < gsAndSatelliteArray.length; i++) {
                        if (gsAndSatelliteArray[i][1].indexOf("sen") > -1) {
                            if(counter==0)
                                checkbox_list.add({checked:true, width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            else
                                checkbox_list.add({width: 100, boxLabel: gsAndSatelliteArray[i][0], name: gsAndSatelliteArray[i][0], inputValue: gsAndSatelliteArray[i]});
                            counter++;
                        }
                    }
                }

            }
        });

    },
    handleOverStaAnaCompute: function (component, e) {
        var me = this;
        me.clearTable();
        if(AnalysisManagement.gsData == null){
            AnalysisManagement.gsData = new Array();
        }
        else{
            AnalysisManagement.gsData.length = 0;
        }
        var checkbox_list = this.getSelectGroundStationInfoPanel().queryById('checkbox_list');
        var ischeked = false;
        for (var i = 0; i < checkbox_list.items.items.length; i++) {
            if (checkbox_list.items.items[i].checked) {
                var data1 = new Object();
                var node1 = checkbox_list.items.items[i].inputValue;
                data1.checktype = "affiliated-param";
                data1.id = node1[1];
                data1.parentPath = node1[3];
                data1.name = checkbox_list.items.items[i].name;
                if (node1[2] == APC.NODETYPE_SATELLITE) {
                    data1.type = "satellite";
                }
                else if(node1[2] == APC.NODETYPE_GROUNDSTATION) {
                    data1.type = "groundstation";
                }
                else if(node1[2] == APC.NODETYPE_SENSOR) {
                    data1.type = "sensor";
                }
                else if(node1[2] == APC.NODETYPE_SKY_COVER_POINT) {
                    data1.type = "skypoint";
                }
                else if(node1[2] == APC.NODETYPE_SKY_COVER_REGIN) {
                    data1.type = "skyregion";
                }
                else{
                    return;
                }
                ischeked = true;
                AnalysisManagement.gsData.push(data1);
            }
        }
        if (!ischeked) {
            return false;
        }
        var name = this.getSelectGroundStationInfoPanel().queryById('param_sg').rawValue;
        var value = this.getSelectGroundStationInfoPanel().queryById('param_sg').value;
        var node2 = me.getTargetNode(me.solutionNode,value);
        var data2 = new Object();
        data2.id = node2.id;
        data2.parentPath = node2.nodeFilePath;
        data2.checktype = "main-param";
        data2.name = name;
        data2.type = node2.nodeType;
        if (node2.nodeType == APC.NODETYPE_SATELLITE) {
            data2.type = "satellite";
        }
        else if(node2.nodeType == APC.NODETYPE_GROUNDSTATION)
        {
            data2.type = "groundstation";
        }
        else if(node2.nodeType == APC.NODETYPE_SENSOR)
        {
            data2.type = "sensor";
        }
        else if(node2.nodeType == APC.NODETYPE_SKY_COVER_POINT){
            data2.type = "skypoint";
        }
        else if(node2.nodeType == APC.NODETYPE_SKY_COVER_REGIN){
            data2.type = "skyregion";
        }
        else{
            return;
        }
        AnalysisManagement.gsData.push(data2);
        // console.log(AnalysisManagement.gsData);

        var temporaryData1 = new Object();
        temporaryData1.data = AnalysisManagement.gsData;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "CollaDesignManage/getGsAndSatData",
            method: 'POST',
            params: JSON.stringify(temporaryData1),
            success: function (response) {
                var temporaryData2 = JSON.parse(response.responseText);
                for (i = 0; i < temporaryData2.data.length; i++) {
                    var gsOrSatData = AnalysisManagement.gsData[i];
                    var data = JSON.parse(temporaryData2.data[i].value);
                    if (gsOrSatData.type == 'satellite') {
                        gsOrSatData.a = data.a;
                        gsOrSatData.e = data.e;
                        gsOrSatData.i = data.i;
                        gsOrSatData.Om = data.Om;
                        gsOrSatData.om = data.om;
                        gsOrSatData.theta = data.theta;
//                        gsOrSatData.epochTime = data.epochTime;
                        gsOrSatData.epochTime = new Date();
                        gsOrSatData.epochTime.setTime(Date.parse(data.t_start));
                        gsOrSatData.StartSimuTime = new Date();
                        gsOrSatData.StartSimuTime.setTime(Date.parse(data.t_start));
//                        gsOrSatData.StopSimuTime = data.t_stop;
                        gsOrSatData.StopSimuTime = new Date();
                        gsOrSatData.StopSimuTime.setTime(Date.parse(data.t_start));
                        var startDay =gsOrSatData.StopSimuTime.getDate();
                        gsOrSatData.StopSimuTime.setDate(startDay +1);
                        gsOrSatData.starcombo = data.centerid;

                    }
                    else if(gsOrSatData.type == 'groundstation'){
                        gsOrSatData.longitude = data.longitude;
                        gsOrSatData.latitude = data.latitude;
                        gsOrSatData.height = data.height;
                        gsOrSatData.minAngle = data.minAngle;
                    }
                    else if(gsOrSatData.type == 'sensor'){
                        gsOrSatData.name = data.name;
                        gsOrSatData.type = data.type;
                        gsOrSatData.startTime = new Date();
                        gsOrSatData.startTime.setTime(Date.parse(data.startTime));
                        gsOrSatData.endTime = new Date();
                        gsOrSatData.endTime.setTime(Date.parse(data.endTime));
                        gsOrSatData.azimuth = data.azimuth;
                        gsOrSatData.elevation = data.elevation;
                        gsOrSatData.openangle = data.openangle;
                        gsOrSatData.bh = data.bh;
                        gsOrSatData.parentID = data.parentID;
                        AnalysisManagement.gsData.push(JSON.parse(temporaryData2.data[i].satellite));
                        var time = AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].epochTime;
                        AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].epochTime = new Date();
                        AnalysisManagement.gsData[AnalysisManagement.gsData.length - 1].epochTime.setTime(Date.parse(time));
                    }
                    else if(gsOrSatData.type == 'skypoint'){
                        gsOrSatData.name = data.name;
                        gsOrSatData.type = data.type;
                        gsOrSatData.ascension = data.ascension;
                        gsOrSatData.declination = data.declination;
                    }
                    else if(gsOrSatData.type == 'skyregion'){
                        gsOrSatData.name = data.name;
                        gsOrSatData.type = data.type;
                        gsOrSatData.ascension = data.ascension;
                        gsOrSatData.declination = data.declination;
                        gsOrSatData.R = data.R;
                    }
                }

                me.handleInit();
            },
            failure: function () {
            }
        })
//        console.log(AnalysisManagement.gsData);
    },
    handleInit: function () {
        var me = this;
        this.createMeng();

        this.div_meng.style.display = "block";
        this.font_meng.style.display = "block";

        var data = AnalysisManagement.gsData;
        //处理scheduler.json
        var GravitationalConstant = {
            'sun': 1.9891e30 * 6.672e-11 / 1e9,
            'mercury': 3.30e23 * 6.672e-11 / 1e9,
            'venus': 4.869e24 * 6.672e-11 / 1e9,
            'earth': 5.976e24 * 6.672e-11 / 1e9,
            'mars': 6.4219e23 * 6.672e-11 / 1e9,
            'jupiter': 1.9e27 * 6.672e-11 / 1e9,
            'saturn': 5.688e26 * 6.672e-11 / 1e9,
            'uranus': 8.686e25 * 6.672e-11 / 1e9,
            'neptune': 1.0247e26 * 6.672e-11 / 1e9,
            'moon': 7.349e22 * 6.672e-11 / 1e9
        };
        var numberSecond = function (h, m, s) {
            return (h * 3600 + m * 60 + s) / 86400;
        };
        //计算数据
        for (var i = 1; i < data.length; i++) {
            if (data[i].checktype != null && data[i].checktype != undefined) {
                if (data[i].checktype == "main-param") {//找到主参数
                    if(this.theader == null){
                        var headeritems = document.getElementsByClassName("x-column-header-text");
                        if(headeritems!=null)
                            for(var ii = 0 ; ii < headeritems.length; ii++){
                                if(headeritems[ii].innerText == "GSTATION"){
                                    this.theader = headeritems[ii];
                                    break;
                                }
                            }
                    }
                    if(data[i].name!=null){
                        this.theader.innerText = data[i].name;
                    }
                    else{
                        this.theader.innerText = " ";
                    }
                    var jsondata = new Array();
                    var jsondata_table = new Array();
                    if (data[i].type == "satellite") {
                        var satellite_name = sessionStorage.getItem("userId") + data[i].name;
                        var mu = GravitationalConstant[data[i].starcombo];
                        var porbit = data[i];
//                        porbit.i = porbit.i * Math.PI / 180.0;
//                        porbit.Om = porbit.Om * Math.PI / 180.0;
//                        porbit.om = porbit.om * Math.PI / 180.0;
//                        porbit.theta = porbit.theta * Math.PI / 180.0;

                        var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                        var epochTime = julian(porbit.epochTime.getMonth() + 1, porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                            numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                        var StartSimuTime = julian(porbit.StartSimuTime.getMonth() + 1, porbit.StartSimuTime.getDate(), porbit.StartSimuTime.getFullYear()) +
                            numberSecond(porbit.StartSimuTime.getHours(), porbit.StartSimuTime.getMinutes(), porbit.StartSimuTime.getSeconds());
                        var StopSimuTime = julian(porbit.StopSimuTime.getMonth() + 1, porbit.StopSimuTime.getDate(), porbit.StopSimuTime.getFullYear()) +
                            numberSecond(porbit.StopSimuTime.getHours(), porbit.StopSimuTime.getMinutes(), porbit.StopSimuTime.getSeconds());
                        var time = (StartSimuTime - epochTime) * 24 * 60 * 60;
                        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([0])[time], new Array([mu])[0]);
                        var X = finalPosition[0][0][0];
                        var Y = finalPosition[0][0][1];
                        var Z = finalPosition[0][0][2];
                        var VX = finalPosition[1][0][0];
                        var VY = finalPosition[1][0][1];
                        var VZ = finalPosition[1][0][2];
//                        var hb = AnalysisManagement.gsData[0].hb;
                        var hb = 60;//步长默认设为60
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].checktype == "affiliated-param") {
                                var item_table = new Object();
                                item_table.Id = "groundstation" + j;
                                item_table.Name = data[j].name;
                                data[j].ResourceId = item_table.Id;
                                jsondata_table.push(item_table);

                                var item = new Object();
                                item.ResourceId = item_table.Id;
                                item.satellite = satellite_name;
                                item.groundstation = item_table.Name;
                                item.X = X.toString();
                                item.Y = Y.toString();
                                item.Z = Z.toString();
                                item.VX = VX.toString();
                                item.VY = VY.toString();
                                item.VZ = VZ.toString();
                                item["START-DATE"] = StartSimuTime.toString();
                                item["END-DATE"] = StopSimuTime.toString();
                                item.HB = hb.toString();
                                item.DLAT = data[j].longitude.toString();
                                item.DLON = data[j].latitude.toString();
                                item.ALT = data[j].height.toString();
                                item.HM = data[j].minAngle.toString();
                                jsondata.push(item);
                            }
                        }
                    }
                    else if (data[i].type == "groundstation") {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].checktype == "affiliated-param") {
                                var mu = GravitationalConstant[data[j].starcombo];

                                var porbit = data[j];

                                var item_table = new Object();
                                item_table.Id = "satellite" + j;
                                item_table.Name = data[j].name;
                                data[j].ResourceId = item_table.Id;
                                jsondata_table.push(item_table);

                                var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                                var epochTime = julian(porbit.epochTime.getMonth() + 1, porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                                    numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                                var StartSimuTime = julian(porbit.StartSimuTime.getMonth() + 1, porbit.StartSimuTime.getDate(), porbit.StartSimuTime.getFullYear()) +
                                    numberSecond(porbit.StartSimuTime.getHours(), porbit.StartSimuTime.getMinutes(), porbit.StartSimuTime.getSeconds());
                                var StopSimuTime = julian(porbit.StopSimuTime.getMonth() + 1, porbit.StopSimuTime.getDate(), porbit.StopSimuTime.getFullYear()) +
                                    numberSecond(porbit.StopSimuTime.getHours(), porbit.StopSimuTime.getMinutes(), porbit.StopSimuTime.getSeconds());
                                var time = (StartSimuTime - epochTime) * 24 * 60 * 60;
                                var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([0])[time], new Array([mu])[0]);
                                var item = new Object();
                                item.ResourceId = item_table.Id;
                                item.satellite = sessionStorage.getItem("userId") + item_table.Name;
                                item.groundstation = data[i].name;
                                item.X = finalPosition[0][0][0].toString();
                                item.Y = finalPosition[0][0][1].toString();
                                item.Z = finalPosition[0][0][2].toString();
                                item.VX = finalPosition[1][0][0].toString();
                                item.VY = finalPosition[1][0][1].toString();
                                item.VZ = finalPosition[1][0][2].toString();
                                item["START-DATE"] = StartSimuTime.toString();
                                item["END-DATE"] = StopSimuTime.toString();
//                                item.HB = AnalysisManagement.gsData[0].hb.toString();//步长
                                item.HB = "60";//步长默认设为60
                                item.DLAT = data[i].longitude.toString();
                                item.DLON = data[i].latitude.toString();
                                item.ALT = data[i].height.toString();
                                item.HM = data[i].minAngle.toString();
                                jsondata.push(item);
                            }
                        }
                    }
                    else{
                        this.handleSky();
                        return;
                    }
                    var jsondata_str = JSON.stringify(jsondata);//console.log(jsondata_str);
                    var jsondata_table_str = JSON.stringify(jsondata_table);//console.log(jsondata_table_str);
                    // var exmaple = "[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]";
                    // console.log(jsondata_str);
                    // console.log(jsondata_table_str);


                    Ext.apply(
                        this.getSchedulerView().resourceStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr: jsondata_table_str
                        });

                    Ext.apply(
                        this.getSchedulerView().eventStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr: jsondata_str,
                            type: 1
                        });
                    this.getSchedulerView().resourceStore.load({
                        scope: this,
                        callback: function (records, operation, success) {
                            me.getSchedulerView().eventStore.load({
                                scope: this,
                                callback: function (records, operation, success) {
                                    me.div_meng.style.display = "none";
                                    me.font_meng.style.display = "none";
                                    if(records!=null && records.length > 0){
                                        if(records[0].data.ResourceId!=null && records[0].data.ResourceId!=""){
                                            for(var i = 0 ; i < records.length ; i++){
                                                if(records[i].data.Title == "timeout"){
                                                    Ext.MessageBox.show({
                                                        title: "提示",
                                                        msg: "计算超时（限制在40s以内）！请修改您的参数！",
                                                        modal: true,
                                                        buttons: Ext.Msg.YES
                                                    });
                                                    break;
                                                }
                                            }
                                            me.loadDataForAnaysisTable();
                                        }
                                        else{
                                            // console.log(records);
                                            Ext.MessageBox.show({
                                                title: "提示",
                                                msg: "与计算服务断开！",
                                                modal: true,
                                                buttons: Ext.Msg.YES
                                            });
                                        }
                                    }
                                    else{
                                        console.log("未知错误!");
                                    }
                                }
                            });
                        }
                    });

                    break;
                }
            }
        }
    },
    handleSky: function (){
        var me = this;
        var data = AnalysisManagement.gsData;
        var GravitationalConstant = {
            'sun': 1.9891e30 * 6.672e-11 / 1e9,
            'mercury': 3.30e23 * 6.672e-11 / 1e9,
            'venus': 4.869e24 * 6.672e-11 / 1e9,
            'earth': 5.976e24 * 6.672e-11 / 1e9,
            'mars': 6.4219e23 * 6.672e-11 / 1e9,
            'jupiter': 1.9e27 * 6.672e-11 / 1e9,
            'saturn': 5.688e26 * 6.672e-11 / 1e9,
            'uranus': 8.686e25 * 6.672e-11 / 1e9,
            'neptune': 1.0247e26 * 6.672e-11 / 1e9,
            'moon': 7.349e22 * 6.672e-11 / 1e9
        };

        var numberSecond = function(h, m, s) {
            return (h * 3600 + m * 60 + s)/86400;
        };
        // console.log(data);
        for(var i = 0 ; i < data.length; i++) {
            if(data[i].checktype !=null && data[i].checktype!=undefined){
                if(data[i].checktype == "main-param"){
                    if(this.theader == null){
                        var headeritems = document.getElementsByClassName("x-column-header-text");
                        if(headeritems!=null)
                            for(var ii = 0 ; ii < headeritems.length; ii++){
                                if(headeritems[ii].innerText == "GSTATION"){
                                    this.theader = headeritems[ii];
                                    break;
                                }
                            }
                    }
                    if(data[i].name!=null){
                        this.theader.innerText = data[i].name;
                    }
                    else{
                        this.theader.innerText = " ";
                    }
                    var jsondata = new Array();
                    var jsondata_table = new Array();
                    if(data[i].type == "sensor"){
                        var satellite_name = sessionStorage.getItem("userId")+AnalysisManagement.gsData[0].task + data[i].name;
                        var startTime = data[i].startTime;
                        var endTime = data[i].endTime;
                        var openangle = data[i].openangle;
                        var hb = data[i].bh;
                        var porbit = null;
                        for(var j = 0 ; j < AnalysisManagement.gsData.length; j++){
                            if(AnalysisManagement.gsData[j].centerid != null && AnalysisManagement.gsData[j].centerid != undefined){
                                porbit = AnalysisManagement.gsData[j];
                                break;
                            }
                        }
                        var mu = GravitationalConstant[porbit.centerid];
                        var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                        var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) + numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                        var StartSimuTime = julian(startTime.getMonth()+1,  startTime.getDate(), startTime.getFullYear()) +
                            numberSecond(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                        var StopSimuTime = julian(endTime.getMonth()+1, endTime.getDate(), endTime.getFullYear()) +
                            numberSecond(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                        var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
                        if(time < 0){
                            StartSimuTime = epochTime;
                            StopSimuTime = StartSimuTime + 1;
                            time = 0;
                        }
                        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([time])[0], new Array([mu])[0]);
                        var X = finalPosition[0][0][0];
                        var Y = finalPosition[0][0][1];
                        var Z = finalPosition[0][0][2];
                        var VX = finalPosition[1][0][0];
                        var VY = finalPosition[1][0][1];
                        var VZ = finalPosition[1][0][2];
                        for(var j = 0 ; j < data.length; j++){
                            if(data[j].checktype == "affiliated-param"){
                                var item_table = new Object();
                                item_table.Id = "sky"+j;
                                data[j].ResourceId = item_table.Id;
                                item_table.Name = data[j].name;
                                jsondata_table.push(item_table);

                                var item = new Object();
                                item.ResourceId = item_table.Id;
                                item.sensor = satellite_name;
                                item.sky = item_table.Name;
                                item.type = data[j].type;
                                item.ascension = data[j].ascension;
                                item.declination = data[j].declination;
                                item.azimuth = data[i].azimuth;
                                item.elevation = data[i].elevation;
                                if(data[j].type == "skyregion"){
                                    item.R = data[j].R;
                                }
                                item.startTime = StartSimuTime;
                                item.endTime = StopSimuTime;
                                item.X = X;
                                item.Y = Y;
                                item.Z = Z;
                                item.VX = VX;
                                item.VY = VY;
                                item.VZ = VZ;
                                item.hb = hb;
                                item.openangle = openangle;
                                jsondata.push(item);
                            }
                        }
                    }
                    else if(data[i].type == "skypoint" || data[i].type == "skyregion") {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].checktype == "affiliated-param") {
                                var item_table = new Object();
                                item_table.Id = "sensor" + j;
                                data[j].ResourceId = item_table.Id;
                                item_table.Name = data[j].name;
                                jsondata_table.push(item_table);

                                var porbit = null;
                                for(var k = 0 ; k < AnalysisManagement.gsData.length; k++){
                                    if(AnalysisManagement.gsData[k].centerid != null && AnalysisManagement.gsData[k].centerid != undefined){
                                        porbit = AnalysisManagement.gsData[k];
                                        break;
                                    }
                                }

                                var startTime = data[j].startTime;
                                var endTime = data[j].endTime;
                                var mu = GravitationalConstant[porbit.centerid];
                                var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                                var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                                    numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                                var StartSimuTime = julian(startTime.getMonth()+1,  startTime.getDate(), startTime.getFullYear()) +
                                    numberSecond(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                                var StopSimuTime = julian(endTime.getMonth()+1, endTime.getDate(), endTime.getFullYear()) +
                                    numberSecond(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                                var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
                                if(time < 0){
                                    StartSimuTime = epochTime;
                                    StopSimuTime = StartSimuTime + 1;
                                    time = 1;
                                }
                                var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([time])[0], new Array([mu])[0]);

                                var item = new Object();
                                item.ResourceId = item_table.Id;
                                item.sensor = sessionStorage.getItem("userId")+AnalysisManagement.gsData[0].task + item_table.Name;
                                item.sky = data[i].name;
                                item.type = data[i].type;
                                item.ascension = data[i].ascension;
                                item.declination = data[i].declination;
                                item.azimuth = data[j].azimuth;
                                item.elevation = data[j].elevation;
                                if(data[i].type == "skyregion"){
                                    item.R = data[i].R;
                                }
                                item.startTime = StartSimuTime;
                                item.endTime = StopSimuTime;
                                item.X = finalPosition[0][0][0];
                                item.Y = finalPosition[0][0][1];
                                item.Z = finalPosition[0][0][2];
                                item.VX = finalPosition[1][0][0];
                                item.VY = finalPosition[1][0][1];
                                item.VZ = finalPosition[1][0][2];
                                item.hb = data[j].bh;
                                item.openangle = data[j].openangle;
                                jsondata.push(item);
                            }
                        }
                    }
                    var jsondata_str = JSON.stringify(jsondata);
                    // console.log(jsondata_str);
//                    if(jsondata_str.length > 8096){
//                        Ext.MessageBox.show({
//                            title: "提示",
//                            msg: "一次性计算数量超限！",
//                            modal: true,
//                            buttons: Ext.Msg.YES
//                        });
//                        return;
//                    }
                    var jsondata_table_str = JSON.stringify(jsondata_table);//console.log(jsondata_table_str);
                    // var exmaple = "[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]";
                    //console.log(exmaple);

                    Ext.apply(
                        this.getSchedulerView().resourceStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr:jsondata_table_str
                        });

                    Ext.apply(
                        this.getSchedulerView().eventStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr:jsondata_str,
                            type:2
                        });
                    this.getSchedulerView().resourceStore.load();
                    this.getSchedulerView().eventStore.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            me.div_meng.style.display = "none";
                            me.font_meng.style.display = "none";
                            if(records!=null && records.length > 0){
                                if(records[0].data.ResourceId!=null && records[0].data.ResourceId!=""){
                                    for(var i = 0 ; i < records.length ; i++){
                                        if(records[i].data.Title == "timeout"){
                                            Ext.MessageBox.show({
                                                title: "提示",
                                                msg: "计算超时（限制在40s以内）！请修改您的参数！",
                                                modal: true,
                                                buttons: Ext.Msg.YES
                                            });
                                            break;
                                        }
                                    }
                                    me.loadDataForAnaysisTable();
                                }
                                else{
                                    // console.log(records);
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "与计算服务断开！",
                                        modal: true,
                                        buttons: Ext.Msg.YES
                                    });
                                }
                            }
                            else{
                                console.log("未知错误!");
                            }
                        }
                    });
                    break;
                }
            }
        }
    },
    loadDataForAnaysisTable: function(){
        var data = this.getSchedulerView().eventStore.data.items;
        var obj_aar = new Array();
        for(var i = 0 ; i < data.length; i++){
            var item = new Object();
            item.resultId = (i+1).toString();
            var d = data[i].data.StartDate;
            if(d!=null){
                item.startTime = d.getFullYear().toString() + "-" +
                    ((d.getMonth() + 1)/10).toString().split('.')[0] + ((d.getMonth() + 1)%10).toString() + "-" +
                    (d.getDate()/10).toString().split('.')[0] + (d.getDate() %10).toString() + " " +
                    (d.getHours()/10).toString().split('.')[0] + (d.getHours()%10).toString() + ":" +
                    (d.getMinutes()/10).toString().split('.')[0] + (d.getMinutes()%10).toString() + ":" +
                    (d.getSeconds()/10).toString().split('.')[0] + (d.getSeconds()%10).toString();
            }
            d = data[i].data.EndDate;
            if(d!=null){
                item.endTime = d.getFullYear().toString() + "-" +
                    ((d.getMonth() + 1)/10).toString().split('.')[0] + ((d.getMonth() + 1)%10).toString() + "-" +
                    (d.getDate()/10).toString().split('.')[0] + (d.getDate() %10).toString() + " " +
                    (d.getHours()/10).toString().split('.')[0] + (d.getHours()%10).toString() + ":" +
                    (d.getMinutes()/10).toString().split('.')[0] + (d.getMinutes()%10).toString() + ":" +
                    (d.getSeconds()/10).toString().split('.')[0] + (d.getSeconds()%10).toString();
            }
            if(d!=null)
            {
                var _time = (data[i].data.EndDate.getTime() - data[i].data.StartDate.getTime())/1000;
                if(_time == 0)
                    continue;
                item.passTime = _time.toString();
            }
            for(var j = 0 ; j < AnalysisManagement.gsData.length; j++){
                if(AnalysisManagement.gsData[j].ResourceId == data[i].data.ResourceId){
                    item.passName = AnalysisManagement.gsData[j].name;
                    break;
                }
            }
            if(item.startTime == null && item.endTime == null)
                continue;
            item.index = data[i].index;
            obj_aar.push(item);
        }
        this.getAnalysisResultGridPanel().store.loadData(obj_aar);
    },
    clearTable: function(){
        this.getAnalysisResultGridPanel().store.loadData([]);
    },
    createMeng: function(){
        if(this.div_meng == null){//初始化蒙皮
            var divs = document.getElementsByClassName("x-panel x-border-item x-box-item x-panel-default");
            for(var i = 0 ; i < divs.length; i++){
                if(divs[i].id!=null && divs[i].id.indexOf("addedcenterpanel")>-1){
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
    }
});