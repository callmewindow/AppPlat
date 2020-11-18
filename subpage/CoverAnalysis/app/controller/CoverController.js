/**
 * Created by Administrator on 2014/7/3.
 */
Ext.define('CoverAnalysisApp.controller.CoverController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'coverConfigPanel',
            selector: 'coverconfigpanel'
        },
        {
            ref: 'schedulerView',
            selector: 'schedulerview'
        },
        {
            ref: 'selectGroundStationInfoWindow',
            selector: 'selectgroundstationinfowindow'
        },
        {
            ref: 'analysisResultGridPanel',
            selector: 'analysisresultgridpanel'
        }
    ],
    SchedulerDemo:null,
    channelComputPanel: null,
    isNewCA : true,
    currentChainAnalysis: false,
    init: function (application) {
        var me = this;
        this.control({
            '#calculate': {
                click:this.calculateClick
            },
            'schedulerview':{
                scheduleclick:this.handleScheduleClick,
                beforerender:me.handleBeforeRender,
                select:this.handleSelect
            },
            'analysisresultgridpanel':{
                select:me.selectAnalysisResultRow
            },
            '#coverParaCombo':{
                change:this.coverTypeChange
            },
            'coveranalysispreparewindow': {
                render: me.addDataToWindow
            }
        });
    },
    selectAnalysisResultRow:function(panel, record, index, eOpts ){
            var data = this.getSchedulerView().eventStore.data.items;
            for(var i = 0 ; i < data.length ; i++){
                if(data[i].index == record.data.index){
                    this.getSchedulerView().switchViewPreset("minuteAndHour", data[i].data.StartDate, data[i].data.EndDate);
                    this.getSchedulerView().zoomOut();
                    break;
                }
            }

    },
    handleBeforeRender:function(panel,eOpts){
        //  this.getStore('SchedulerResourceStore').load();
        // // var ojb = Ext.JSON.decode("[{Id: 'Satellite1', Name: '卫星1'},{Id: 'Satellite2', Name: '卫星2'}]");
        // // console.log(ojb);
        // // this.getStore('SchedulerResourceStore').loadData(ojb);
        //  this.getStore('SchedulerEventStore').load();
//         this.getStore('SchedulerEventStore').load({
//             scope: this,
//              callback: function(records, operation, success) {
//                 // 对象 operation 包含
//                  // 所有 load 操作的详细信息
//                  console.log(records);
//     }
// });

    },
    handleSky: function (){
        var me = this;
        var data = AnalysisManagement.gsData;

//        if(me.getController("CoverAnalysisApp.controller.TreeController").div_meng!=null){
//            me.getController("CoverAnalysisApp.controller.TreeController").stree_availiable = true;
//            me.getController("CoverAnalysisApp.controller.TreeController").div_meng.style.display = 'none';
//            me.getController("CoverAnalysisApp.controller.TreeController").font_meng.style.display = 'none';
//        }
//        Ext.MessageBox.alert("提示", "正在建设中");
//        return;

        if(me.getController("CoverAnalysisApp.controller.TreeController").div_meng!=null){
            me.getController("CoverAnalysisApp.controller.TreeController").stree_availiable = false;
            me.getController("CoverAnalysisApp.controller.TreeController").div_meng.style.display = 'block';
            me.getController("CoverAnalysisApp.controller.TreeController").font_meng.style.display = 'block';
        }
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

        for(var i = 1 ; i < data.length; i++) {
            if(data[i].checktype !=null && data[i].checktype!=undefined){
                if(data[i].checktype == "main-param"){
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
                            if(AnalysisManagement.gsData[j].type == "satellite" && AnalysisManagement.gsData[j].id == data[i].parentID){
                                porbit = AnalysisManagement.gsData[j];
                                break;
                            }
                        }
                        var mu = GravitationalConstant[porbit.starcombo];
                        var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                        var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                            numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                        var StartSimuTime = julian(startTime.getMonth()+1,  startTime.getDate(), startTime.getFullYear()) +
                            numberSecond(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                        var StopSimuTime = julian(endTime.getMonth()+1, endTime.getDate(), endTime.getFullYear()) +
                            numberSecond(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                        var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
                        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([time])[0], new Array([mu])[0]);
                        var X = finalPosition[0][0][0];
                        var Y = finalPosition[0][0][1];
                        var Z = finalPosition[0][0][2];
                        var VX = finalPosition[1][0][0];
                        var VY = finalPosition[1][0][1];
                        var VZ = finalPosition[1][0][2];
                        for(var j = 1 ; j < data.length; j++){
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
                                    if(AnalysisManagement.gsData[k].type == "satellite" && AnalysisManagement.gsData[k].id == data[j].parentID){
                                        porbit = AnalysisManagement.gsData[k];
                                        break;
                                    }
                                }

                                var startTime = data[j].startTime;
                                var endTime = data[j].endTime;
                                var mu = GravitationalConstant[porbit.starcombo];
                                var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                                var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                                    numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                                var StartSimuTime = julian(startTime.getMonth()+1,  startTime.getDate(), startTime.getFullYear()) +
                                    numberSecond(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                                var StopSimuTime = julian(endTime.getMonth()+1, endTime.getDate(), endTime.getFullYear()) +
                                    numberSecond(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                                var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
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
                    var jsondata_str = JSON.stringify(jsondata);console.log(jsondata_str);
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
                        callback: function(records, operation, success) {console.log(records);
                            if(me.getController("CoverAnalysisApp.controller.TreeController").div_meng!=null){
                                me.getController("CoverAnalysisApp.controller.TreeController").stree_availiable = true;
                                me.getController("CoverAnalysisApp.controller.TreeController").div_meng.style.display = 'none';
                                me.getController("CoverAnalysisApp.controller.TreeController").font_meng.style.display = 'none';
                            }
                            if(records!=null && records.length > 0){
                                if(records[0].data.ResourceId!=null && records[0].data.ResourceId!=""){
//                                    var items = document.getElementsByClassName("x-grid-cell-inner");
//                                    var len = 0, fid = null, findex = -1;
//                                    for(var i = 0 ; i < records.length ; i++){
//                                        if(records[i].data.ResourceId!=fid){
//                                            fid = records[0].data.ResourceId;
//                                            len++;
//                                        }
//                                    }
//                                    fid = null;
                                    for(var i = 0 ; i < records.length ; i++){
//                                        if(records[i].data.ResourceId!=fid){
////                                            fid = records[0].data.ResourceId;
////                                            findex++;
//                                        }
                                        if(records[i].data.Title == "nodata"){
//                                            items[findex+len].style.backgroundColor = "#8F8F8F";
//                                            items[findex+len].style.textAlign = "cenetr";
//                                            items[findex+len].innerText = "No Data";
                                        }
                                        else if(records[i].data.Title == "timeout"){
//                                            items[findex+len].style.backgroundColor = "#EEA2AD";
//                                            items[findex+len].style.textAlign = "cenetr";
//                                            items[findex+len].innerText = "Time Out";
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
                                    console.log(records);
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
    handleInit: function (){
        var me = this;
        var data = AnalysisManagement.gsData;

        if(me.getController("CoverAnalysisApp.controller.TreeController").div_meng!=null){
            me.getController("CoverAnalysisApp.controller.TreeController").stree_availiable = false;
            me.getController("CoverAnalysisApp.controller.TreeController").div_meng.style.display = 'block';
            me.getController("CoverAnalysisApp.controller.TreeController").font_meng.style.display = 'block';
        }
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

        var numberSecond = function(h, m, s) {
            return (h * 3600 + m * 60 + s)/86400;
        };
        //计算数据
        for(var i = 1 ; i < data.length; i++) {
            if(data[i].checktype !=null && data[i].checktype!=undefined){
                if(data[i].checktype == "main-param"){
                    var jsondata = new Array();
                    var jsondata_table = new Array();
                    if(data[i].type == "satellite"){
                        var satellite_name = sessionStorage.getItem("userId")+AnalysisManagement.gsData[0].task + data[i].name;
                        var mu = GravitationalConstant[data[i].starcombo];
                        var porbit = data[i];
//                        porbit.i = porbit.i * Math.PI / 180.0;
//                        porbit.Om = porbit.Om * Math.PI / 180.0;
//                        porbit.om = porbit.om * Math.PI / 180.0;
//                        porbit.theta = porbit.theta * Math.PI / 180.0;

                        var position = orb2rv(new Array([porbit.a * (1 - Math.pow(porbit.e, 2))])[0], new Array([porbit.e])[0], new Array([porbit.i * Math.PI / 180.0])[0], new Array([porbit.Om * Math.PI / 180.0])[0], new Array([porbit.om * Math.PI / 180.0])[0], new Array([porbit.theta * Math.PI / 180.0])[0], new Array([0])[0], new Array([0])[0], new Array([0])[0], new Array([mu])[0]);
                        var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                            numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                        var StartSimuTime = julian(porbit.StartSimuTime.getMonth()+1,  porbit.StartSimuTime.getDate(), porbit.StartSimuTime.getFullYear()) +
                            numberSecond(porbit.StartSimuTime.getHours(), porbit.StartSimuTime.getMinutes(), porbit.StartSimuTime.getSeconds());
                        var StopSimuTime = julian(porbit.StopSimuTime.getMonth()+1,  porbit.StopSimuTime.getDate(), porbit.StopSimuTime.getFullYear()) +
                            numberSecond(porbit.StopSimuTime.getHours(), porbit.StopSimuTime.getMinutes(), porbit.StopSimuTime.getSeconds());
                        var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
                        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([time])[0], new Array([mu])[0]);
                        var X = finalPosition[0][0][0];
                        var Y = finalPosition[0][0][1];
                        var Z = finalPosition[0][0][2];
                        var VX = finalPosition[1][0][0];
                        var VY = finalPosition[1][0][1];
                        var VZ = finalPosition[1][0][2];
                        var hb = data[i].hb;
                        for(var j = 0 ; j < data.length; j++){
                            if(data[j].checktype == "affiliated-param"){
                                var item_table = new Object();
                                item_table.Id = "groundstation"+j;
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
                    else if(data[i].type == "groundstation") {
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
                                var epochTime = julian(porbit.epochTime.getMonth()+1,  porbit.epochTime.getDate(), porbit.epochTime.getFullYear()) +
                                    numberSecond(porbit.epochTime.getHours(), porbit.epochTime.getMinutes(), porbit.epochTime.getSeconds());
                                var StartSimuTime = julian(porbit.StartSimuTime.getMonth()+1,  porbit.StartSimuTime.getDate(), porbit.StartSimuTime.getFullYear()) +
                                    numberSecond(porbit.StartSimuTime.getHours(), porbit.StartSimuTime.getMinutes(), porbit.StartSimuTime.getSeconds());
                                var StopSimuTime = julian(porbit.StopSimuTime.getMonth()+1,  porbit.StopSimuTime.getDate(), porbit.StopSimuTime.getFullYear()) +
                                    numberSecond(porbit.StopSimuTime.getHours(), porbit.StopSimuTime.getMinutes(), porbit.StopSimuTime.getSeconds());
                                var time = Math.round((StartSimuTime - epochTime) * 24 * 60 * 60);
                                var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([time])[0], new Array([mu])[0]);
                                var item = new Object();
                                item.ResourceId = item_table.Id;
                                item.satellite = sessionStorage.getItem("userId")+AnalysisManagement.gsData[0].task + item_table.Name;
                                item.groundstation = data[i].name;
                                item.X = finalPosition[0][0][0].toString();
                                item.Y = finalPosition[0][0][1].toString();
                                item.Z = finalPosition[0][0][2].toString();
                                item.VX = finalPosition[1][0][0].toString();
                                item.VY = finalPosition[1][0][1].toString();
                                item.VZ = finalPosition[1][0][2].toString();
                                item["START-DATE"] = StartSimuTime.toString();
                                item["END-DATE"] = StopSimuTime.toString();
                                item.HB = data[j].hb.toString();//步长
                                item.DLAT = data[i].longitude.toString();
                                item.DLON = data[i].latitude.toString();
                                item.ALT = data[i].height.toString();
                                item.HM = data[i].minAngle.toString();
                                jsondata.push(item);
                            }
                        }
                    }
                    var jsondata_str = JSON.stringify(jsondata);//console.log(jsondata_str);
                    if(jsondata_str.length > 8096){
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "一次性计算数量超限！",
                            modal: true,
                            buttons: Ext.Msg.YES
                        });
                        return;
                    }
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
                            type:1
                        });
                    this.getSchedulerView().resourceStore.load();
                    this.getSchedulerView().eventStore.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            if(me.getController("CoverAnalysisApp.controller.TreeController").div_meng!=null){
                                me.getController("CoverAnalysisApp.controller.TreeController").stree_availiable = true;
                                me.getController("CoverAnalysisApp.controller.TreeController").div_meng.style.display = 'none';
                                me.getController("CoverAnalysisApp.controller.TreeController").font_meng.style.display = 'none';
                            }
                            if(records!=null && records.length > 0){
                                if(records[0].data.ResourceId!=null && records[0].data.ResourceId!=""){
//                                    var items = document.getElementsByClassName("x-grid-cell-inner");
//                                    var len = 0, fid = null, findex = -1;
//                                    for(var i = 0 ; i < records.length ; i++){
//                                        if(records[i].data.ResourceId!=fid){
//                                            fid = records[0].data.ResourceId;
//                                            len++;
//                                        }
//                                    }
//                                    fid = null;
                                    for(var i = 0 ; i < records.length ; i++){
//                                        if(records[i].data.ResourceId!=fid){
//                                            fid = records[0].data.ResourceId;
//                                            findex++;
                                            if(records[i].data.Title == "nodata"){
//                                                items[findex+len].style.backgroundColor = "#8F8F8F";
//                                                items[findex+len].style.textAlign = "cenetr";
//                                                items[findex+len].innerText = "No Data";
                                            }
                                            else if(records[i].data.Title == "timeout"){
//                                                items[findex+len].style.backgroundColor = "#EEA2AD";
//                                                items[findex+len].style.textAlign = "cenetr";
//                                                items[findex+len].innerText = "Time Out";
                                                Ext.MessageBox.show({
                                                    title: "提示",
                                                    msg: "计算超时（限制在40s以内）！请修改您的参数！",
                                                    modal: true,
                                                    buttons: Ext.Msg.YES
                                                });
                                                break;
                                            }
//                                        }
                                    }
                                    me.loadDataForAnaysisTable();
                                }
                                else{
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "与计算服务断开！",
                                        modal: true,
                                        buttons: Ext.Msg.YES
                                    });
                                }
                            }
                            else{
                                console.log("系统未知错误!");
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
            for(var j = 1 ; j < AnalysisManagement.gsData.length; j++){
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
    onLaunch: function (application) {
    },
    calculateClick: function(button, e, eOpts){
    },
    addDataToWindow:function(window,eOpts){
        var me = this;
        var rootNode = this.getApplication().getController('CoverAnalysisApp.controller.TreeController').getSolutionTree().getRootNode();
        if(rootNode != null){
            Ext.apply(
                window.queryById('coverParaCombo').store.model.proxy.extraParams, {
                    rootId: rootNode.get('id')
                })
            window.queryById('coverParaCombo').store.load({
                scope: this,
                callback: function(records, operation, success) {
                    window.queryById('coverParaCombo').setValue(records[0].get('id'));//只能用add,不能直接对items进行赋值
                    var items = [];
                    for(var i=0;i<records.length;i++)
                    {
                        var node=records[i];
                        var chk =me.getCheckbox(node.get('name'),node.get('id'),node.get('id'),node.get('nodeType'));
                        items.push(chk);
                    }
                    window.queryById('coverParaGroup').add(items);//只能用add,不能直接对items进行赋值
                    window.queryById('coverParaGroup').doLayout();//重新调整版面布局
                }
            });
        }
    },
    coverTypeChange: function(combobox,newValue,oldValue,eOpts){
        if(this.getCoverAnalysisPrepareWindow() != null){
            var type ;
            var dataArray = combobox.getStore().data.items;
            for(i = 0; i < dataArray.length; i++){
                if(dataArray[i].get('id') == newValue){
                    type = dataArray[i].get('nodeType');
                    break;
                }
            }
            var items = this.getCoverAnalysisPrepareWindow().queryById('coverParaGroup').items.items;
            if(type == APC.NODETYPE_SATELLITE || type ==APC.NODETYPE_SENSOR){
                for( i  = 0;i< items.length;i++){
                    if(items[i].inputValue == APC.NODETYPE_SATELLITE||items[i].inputValue == APC.NODETYPE_SENSOR){
                        items[i].setDisabled(true);
                    }else if(items[i].inputValue == APC.NODETYPE_PLANET_COVER_POINT||items[i].inputValue == APC.NODETYPE_PLANET_COVER_SQUARE||items[i].inputValue == APC.NODETYPE_PLANET_COVER_GLOBAL){
                        items[i].setDisabled(false);
                    }
                }
            }
            else{
                for( i  = 0;i< items.length;i++){
                    if(items[i].inputValue == APC.NODETYPE_SATELLITE||items[i].inputValue == APC.NODETYPE_SENSOR){
                        items[i].setDisabled(false);
                    }else if(items[i].inputValue == APC.NODETYPE_PLANET_COVER_POINT||items[i].inputValue == APC.NODETYPE_PLANET_COVER_SQUARE||items[i].inputValue == APC.NODETYPE_PLANET_COVER_GLOBAL){
                        items[i].setDisabled(true);

                    }
                }
            }
        }

    },
    //在点击每一行的时候能够将该行的界面给显示出来
    handleScheduleClick:function( scheduler, clickedDate, rowIndex, resource, e, eOpts ){
        // console.log(clickedDate);
        // var eventStore = this.getSchedulerView().getEventStore().data;
        // var items = eventStore.items;
        // var resourseId = resource.get("Id");
        // var eventRecord = null;
        // for(i = 0 ; i < items.length;i++){
        //     if(items[i].get("ResourceId") == resourseId){
        //         eventRecord = items[i];
        //     }
        // }
        // var startDate = eventRecord.get("StartDate");
        // var endDate = eventRecord.get("EndDate");
        // var viewPreset = this.getSchedulerView().viewPreset;
        // this.getSchedulerView().switchViewPreset(viewPreset, startDate, endDate);

    },
    handleSelect: function(scheduler, record, eOpts ){
        if(record.id.toString().indexOf("Sch.model.Resource")>-1){
            var data = this.getSchedulerView().eventStore.data.items;
            for(var i = 0 ; i < data.length ; i++){
                if(data[i].data.ResourceId == record.data.Id){
                    record.data.StartDate = data[i].data.StartDate;
                    record.data.EndDate = data[i].data.EndDate;
                    var elapse = record.data.EndDate.getTime() - record.data.StartDate.getTime();
                    if(elapse != 0) {
                        if(elapse < 3600){
                            this.getSchedulerView().switchViewPreset("secondAndMinute", record.data.StartDate, record.data.EndDate);
                        }
                        else{
                            this.getSchedulerView().switchViewPreset("minuteAndHour", record.data.StartDate, record.data.EndDate);
                        }
                        this.getSchedulerView().zoomOut();
                    }
                    break;
                }
            }
        }
    },
    handelClearTabel: function(){
        for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
            if(AnalysisManagement.gsData[i].checktype == "main-param"){
                for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
                    if(AnalysisManagement.gsData[j].checktype == "affiliated-param"){
                        return AnalysisManagement.gsData[j].type;
                    }
                }
                break;
            }
        }

        this.getSchedulerView().eventStore.removeAll();
        this.getSchedulerView().resourceStore.removeAll();
        this.loadDataForAnaysisTable();
        if(this.getController("CoverAnalysisApp.controller.TreeController").headerTableName!=null) {
            this.getController("CoverAnalysisApp.controller.TreeController").headerTableName.textContent = AnalysisManagement.prototype.NO_DATA;
        }
        return null;
    },
    handleClearPassTimeTable: function(){
        this.getAnalysisResultGridPanel().store.loadData([]);
    },
    listTimeNxNyNz: function(obj){
        var iz = Math.sin(obj.elevation);
        var ix = Math.cos(obj.elevation) * Math.sin(obj.azimuth);
        var iy = Math.cos(obj.elevation) * Math.cos(obj.azimuth);console.log(iz+"    "+iy+"    "+ix);
        var centerid, echoTime,  a, e, i, Om, om, theta;
        var data = AnalysisManagement.gsData;
        for(var j = 1 ; j < data.length ; j++){
            if(data[j].type == "satellite" && obj.parentID == data[j].id){
                centerid = data[j].starcombo;
                echoTime = data[j].epochTime;
                a = data[j].a;
                e = data[j].e;
                i = data[j].i * Math.PI / 180;
                Om = data[j].Om * Math.PI / 180;
                om = data[j].om * Math.PI / 180;
                theta = data[j].theta * Math.PI / 180;
                break;
            }
        }
        if(centerid == null || centerid == undefined){
            return null;
        }
        var arr = new Array();//传参数 obj.startTime, obj.endTime, obj.bh, arr, ix, iy, iz
        Coordinate.getSensorVector(centerid, echoTime, a, e, i, Om, om, theta, obj.startTime, obj.endTime, obj.bh, arr, ix, iy, iz);
        return arr;
    }
});