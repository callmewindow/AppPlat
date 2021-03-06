/**
 * Created by Administrator on 2014/7/3.
 */
Ext.define('DataTransAnalysisApp.controller.DataTransController', {
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
            "#btnChainAnalysisCompute": {
                click:this.onChainAnalysis
            },
            "#btnChainAnalysisComputeSave":{
                click:me.onChainAnalysisSave
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
    handleInit: function (){
        var me = this;
        var data = AnalysisManagement.gsData;
        //处理scheduler.json

        if(me.getController("DataTransAnalysisApp.controller.TreeController").div_meng!=null){
            me.getController("DataTransAnalysisApp.controller.TreeController").stree_availiable = false;
            me.getController("DataTransAnalysisApp.controller.TreeController").div_meng.style.display = 'block';
            me.getController("DataTransAnalysisApp.controller.TreeController").font_meng.style.display = 'block';
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
                    var jsondata_table_str = JSON.stringify(jsondata_table);//console.log(jsondata_table_str);
                    // var exmaple = "[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]";
                    //console.log(exmaple);
//                    console.log(jsondata_str);
//                    console.log(jsondata_table_str);

                    Ext.apply(
                        this.getSchedulerView().resourceStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr:jsondata_table_str
                        });

                    Ext.apply(
                        this.getSchedulerView().eventStore.proxy.extraParams, {
                            //jsonstr:"[{\"ResourceId\":\"satellite0\",\"satellite\":\"COMW\",\"groundstation\":\"GSTATION\",\"X\":\"10218.754169\",\"Y\":\"-166.522423\",\"Z\":\"0.0\",\"VX\":\"2.859956\",\"VY\":\"5.362549\",\"VZ\":\"3.122562\",\"START-DATE\":\"2454283\",\"END-DATE\":\"2454284\",\"HB\":\"60\",\"DLAT\":\"0.0\",\"DLON\":\"2.859956\",\"ALT\":\"0\",\"HM\":\"5\"}]",
                            jsonstr:jsondata_str,
                            filepath:"S:\\Users\\xpzsoft\\Desktop\\coverjson\\data\\"
                        });
                    this.getSchedulerView().resourceStore.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            me.getSchedulerView().eventStore.load({
                                scope: me,
                                callback: function(records, operation, success) {
                                    if(me.getController("DataTransAnalysisApp.controller.TreeController").div_meng!=null){
                                        me.getController("DataTransAnalysisApp.controller.TreeController").stree_availiable = true;
                                        me.getController("DataTransAnalysisApp.controller.TreeController").div_meng.style.display = 'none';
                                        me.getController("DataTransAnalysisApp.controller.TreeController").font_meng.style.display = 'none';
                                    }
                                    if(records!=null && records.length > 0){
                                        if(records[0].data.ResourceId!=null && records[0].data.ResourceId!=""){
//                                            var items = document.getElementsByClassName("x-grid-cell-inner");
//                                            var len = 0, fid = null, findex = -1;
//                                            for(var i = 0 ; i < records.length ; i++){
//                                                if(records[i].data.ResourceId!=fid){
//                                                    fid = records[0].data.ResourceId;
//                                                    len++;
//                                                }
//                                            }
//                                            fid = null;
                                            for(var i = 0 ; i < records.length ; i++){
//                                                if(records[i].data.ResourceId!=fid){
                                                    //fid = records[0].data.ResourceId;
//                                                    findex++;
                                                    if(records[i].data.Title == "nodata"){
//                                                        items[findex+len].style.backgroundColor = "#8F8F8F";
//                                                        items[findex+len].style.textAlign = "cenetr";
//                                                        items[findex+len].innerText = "No Data";
                                                    }
                                                    else if(records[i].data.Title == "timeout"){
//                                                        items[findex+len].style.backgroundColor = "#EEA2AD";
//                                                        items[findex+len].style.textAlign = "cenetr";
//                                                        items[findex+len].innerText = "Time Out";
                                                        Ext.MessageBox.show({
                                                            title: "提示",
                                                            msg: "计算超时（限制在40s以内）！请修改您的参数！",
                                                            modal: true,
                                                            buttons: Ext.Msg.YES
                                                        });
                                                        break;
                                                    }
//                                                }
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
            if(d!=null){
                var _time = (data[i].data.EndDate.getTime() - data[i].data.StartDate.getTime())/1000;
                if(_time == 0)
                    continue;
                item.passTime = ((data[i].data.EndDate.getTime() - data[i].data.StartDate.getTime())/1000).toString();
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
    initIsNewCA: function(obj){
        this.currentChainAnalysis = new Object();
        this.currentChainAnalysis.save = false;
        this.currentChainAnalysis.type = "chainanaysis";
        this.channelComputPanel = obj;
        this.channelComputPanel.queryById('transmitterPower').setValue(100);
        this.channelComputPanel.queryById('minGain').setValue(42.7);
        this.channelComputPanel.queryById('feederLoss').setValue(-0.5);
        this.channelComputPanel.queryById('downCarrierFrequency').setValue(-2.0);
        this.channelComputPanel.queryById('satelliteEIRP').setValue(8400.0);
        this.channelComputPanel.queryById('apogeeHeight').setValue(900000000);
        this.channelComputPanel.queryById('groundAntennaElevation').setValue(5.0);
        this.channelComputPanel.queryById('groundGT').setValue(0.0356301);
        this.channelComputPanel.queryById('openingAngle').setValue(-1.0);
        this.channelComputPanel.queryById('starDistance').setValue(-0.5);
        this.channelComputPanel.queryById('atmosphericLoss').setValue(0.0);
        this.channelComputPanel.queryById('polarizationLoss').setValue(53.5);
        this.channelComputPanel.queryById('equipmentLoss').setValue(1.4);
        this.channelComputPanel.queryById('leqsbtj').setValue(-0.8);
        this.channelComputPanel.queryById('dsl').setValue(32000);
        this.channelComputPanel.queryById('output_pts').setValue(null);
        this.channelComputPanel.queryById('output_eirp').setValue(null);
        this.channelComputPanel.queryById('output_a').setValue(null);
        this.channelComputPanel.queryById('output_km').setValue(null);
        this.channelComputPanel.queryById('output_lsdown').setValue(null);
        this.channelComputPanel.queryById('output_dbhz').setValue(null);
        this.channelComputPanel.queryById('output_dsl').setValue(null);
        this.channelComputPanel.queryById('output_sno').setValue(null);
        this.channelComputPanel.queryById('output_xxdb').setValue(null);
    },
    onChainAnalysis:function(button, e, eOpts){
        var me = this;
        var params = new Array();
        params[0] = button.findParentByType('panel').down('#transmitterPower').value;
        params[1] = button.findParentByType('panel').down('#minGain').value;
        params[2] = button.findParentByType('panel').down('#feederLoss').value;
        params[3] = button.findParentByType('panel').down('#downCarrierFrequency').value;
        params[4] = button.findParentByType('panel').down('#satelliteEIRP').value;
        params[5] = button.findParentByType('panel').down('#apogeeHeight').value;
        params[6] = button.findParentByType('panel').down('#groundAntennaElevation').value;
        params[7] = button.findParentByType('panel').down('#groundGT').value;
        params[8] = button.findParentByType('panel').down('#openingAngle').value;
        params[9] = button.findParentByType('panel').down('#starDistance').value;
        params[10] = button.findParentByType('panel').down('#atmosphericLoss').value;
        params[11] = button.findParentByType('panel').down('#polarizationLoss').value;
        params[12] = button.findParentByType('panel').down('#equipmentLoss').value;
        params[13] = button.findParentByType('panel').down('#leqsbtj').value;
        params[14] = button.findParentByType('panel').down('#dsl').value;
        this.channelComputPanel = button.findParentByType('panel');
        this.channelComputPanel.down('#btnChainAnalysisComputeSave').setDisabled(false);

        me.currentChainAnalysis.transmitterPower = params[0];
        me.currentChainAnalysis.minGain = params[1];
        me.currentChainAnalysis.feederLoss = params[2];
        me.currentChainAnalysis.downCarrierFrequency = params[3];
        me.currentChainAnalysis.satelliteEIRP = params[4];
        me.currentChainAnalysis.apogeeHeight = params[5];
        me.currentChainAnalysis.groundAntennaElevation = params[6];
        me.currentChainAnalysis.groundGT = params[7];
        me.currentChainAnalysis.openingAngle = params[8];
        me.currentChainAnalysis.starDistance = params[9];
        me.currentChainAnalysis.atmosphericLoss = params[10];
        me.currentChainAnalysis.polarizationLoss = params[11];
        me.currentChainAnalysis.equipmentLoss = params[12];
        me.currentChainAnalysis.leqsbtj = params[13];
        me.currentChainAnalysis.dsl = params[14];
        if(AnalysisManagement.taData == null){
            AnalysisManagement.taData = new Array();
        }
        for(var i = 0 ; i < params.length ; i++){
            if(params[i] == undefined || params[i] == null){
                return;
            }
        }
        Ext.Ajax.request({
            url:APC.APPPLAT_SERVICE_URL_PREFIX+"DataTransAnalysisManage/channelComput.json",
            method:'GET',
//                async:false,
            params: {
                params:params
            },
            success: function(response){
                var data = JSON.parse(response.responseText);
                me.channelComputPanel.down('#output_pts').setValue(data.pis);
                me.channelComputPanel.down('#output_eirp').setValue(data.eirp);
                me.channelComputPanel.down('#output_a').setValue(data.a_for_earch);
                me.channelComputPanel.down('#output_km').setValue(data.r_xdjj);
                me.channelComputPanel.down('#output_lsdown').setValue(data.lsdown);
                me.channelComputPanel.down('#output_dbhz').setValue(data.s_no_down);
                me.channelComputPanel.down('#output_dsl').setValue(data.d_s);
                me.channelComputPanel.down('#output_sno').setValue(data.d_sno_down);
                me.channelComputPanel.down('#output_xxdb').setValue(data.xxday);
                me.currentChainAnalysis.pis = data.pis;
                me.currentChainAnalysis.eirp = data.eirp;
                me.currentChainAnalysis.a_for_earch = data.a_for_earch;
                me.currentChainAnalysis.r_xdjj = data.r_xdjj;
                me.currentChainAnalysis.lsdown = data.lsdown;
                me.currentChainAnalysis.s_no_down = data.s_no_down;
                me.currentChainAnalysis.d_s = data.d_s;
                me.currentChainAnalysis.d_sno_down = data.d_sno_down;
                me.currentChainAnalysis.xxday = data.xxday;
            }
        });
    },
    onChainAnalysisSave:function(button, e, eOpts){
        var me = this;
        if(me.getController("DataTransAnalysisApp.controller.TreeController").getSolutionTree().getRootNode() ==null){
            Ext.MessageBox.show({title: '提示', msg: '请首先创建任务', buttons: Ext.Msg.OK});
        }
        else{
            this.channelComputPanel.down('#btnChainAnalysisComputeSave').setDisabled(true);
            if(!me.currentChainAnalysis.save){
                AnalysisManagement.taData.push(me.currentChainAnalysis);
                me.currentChainAnalysis.save = true;
                me.currentChainAnalysis.name = "链路分析"+AnalysisManagement.taData.length;
                this.getController("DataTransAnalysisApp.controller.TreeController").addList(APC.NODETYPE_CHAIN_ANALYSIS, me.currentChainAnalysis.name);
            }
            else{
                AnalysisManagement.prototype.saveFileByPath(sessionStorage.getItem("userId") + "/" + APC.DATA_TRANS_ANALYSIS + "/" + AnalysisManagement.gsData[0].taskid + "/"+  me.currentChainAnalysis.id,  me.currentChainAnalysis.id + '.json',JSON.stringify( me.currentChainAnalysis));
            }
        }
    },
    updateChainAnaysis:function(obj){
        this.channelComputPanel = obj;
        this.currentChainAnalysis = AnalysisManagement.taData[AnalysisManagement.taData.length - 1];
        var data =  AnalysisManagement.taData[AnalysisManagement.taData.length - 1];
        data.save = true;
        this.channelComputPanel.queryById('transmitterPower').setValue(data.transmitterPower);
        this.channelComputPanel.queryById('minGain').setValue(data.minGain);
        this.channelComputPanel.queryById('feederLoss').setValue(data.feederLoss);
        this.channelComputPanel.queryById('downCarrierFrequency').setValue(data.downCarrierFrequency);
        this.channelComputPanel.queryById('satelliteEIRP').setValue(data.satelliteEIRP);
        this.channelComputPanel.queryById('apogeeHeight').setValue(data.apogeeHeight);
        this.channelComputPanel.queryById('groundAntennaElevation').setValue(data.groundAntennaElevation);
        this.channelComputPanel.queryById('groundGT').setValue(data.groundGT);
        this.channelComputPanel.queryById('openingAngle').setValue(data.openingAngle);
        this.channelComputPanel.queryById('starDistance').setValue(data.starDistance);
        this.channelComputPanel.queryById('atmosphericLoss').setValue(data.atmosphericLoss);
        this.channelComputPanel.queryById('polarizationLoss').setValue(data.polarizationLoss);
        this.channelComputPanel.queryById('equipmentLoss').setValue(data.equipmentLoss);
        this.channelComputPanel.queryById('leqsbtj').setValue(data.leqsbtj);
        this.channelComputPanel.queryById('dsl').setValue(data.dsl);
        this.channelComputPanel.queryById('output_pts').setValue(data.pis);
        this.channelComputPanel.queryById('output_eirp').setValue(data.eirp);
        this.channelComputPanel.queryById('output_a').setValue(data.a_for_earch);
        this.channelComputPanel.queryById('output_km').setValue(data.r_xdjj);
        this.channelComputPanel.queryById('output_lsdown').setValue(data.lsdown);
        this.channelComputPanel.queryById('output_dbhz').setValue(data.s_no_down);
        this.channelComputPanel.queryById('output_dsl').setValue(data.d_s);
        this.channelComputPanel.queryById('output_sno').setValue(data.d_sno_down);
        this.channelComputPanel.queryById('output_xxdb').setValue(data.xxday);
    },
    addDataToWindow:function(window,eOpts){
        var me = this;
        var rootNode = this.getApplication().getController('DataTransAnalysisApp.controller.TreeController').getSolutionTree().getRootNode();
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
                    break;
                }
            }
        }
        this.getSchedulerView().switchViewPreset("minuteAndHour", record.data.StartDate, record.data.EndDate);
        this.getSchedulerView().zoomOut();
    },
    handelClearTabel: function(){
        for(var i = 1 ; i < AnalysisManagement.gsData.length ; i++){
            if(AnalysisManagement.gsData[i].checktype == "main-param"){
                for(var j = 1 ; j < AnalysisManagement.gsData.length ; j++){
                    if(AnalysisManagement.gsData[j].checktype == "affiliated-param"){
                        return true;
                    }
                }
                break;
            }
        }

        this.getSchedulerView().eventStore.removeAll();
        this.getSchedulerView().resourceStore.removeAll();
        this.loadDataForAnaysisTable();
        if(this.getController("DataTransAnalysisApp.controller.TreeController").headerTableName!=null){
            this.getController("DataTransAnalysisApp.controller.TreeController").headerTableName.textContent = AnalysisManagement.prototype.NO_DATA;
        }
        return false;
    },
    handleClearPassTimeTable: function(){
        this.getAnalysisResultGridPanel().store.loadData([]);
    }
});