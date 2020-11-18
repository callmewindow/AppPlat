/**
 * Created by Administrator on 2014/7/3.
 */
Ext.define('AppPlat.controller.DataTransAnalysis.DataTransController', {
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
        },
        {
            ref: 'buttonGroupPanel',
            selector: 'buttongrouppanel'
        },
        {
            ref: 'chainanAlysisPanel',
            selector: 'chainanalysispanel'
        }
    ],
    SchedulerDemo:null,
    channelComputPanel: null,
    isSave:false,
    chainAnalysisParentPath:null,
    chainAnalysisFileName:null,
    currentChainAnalysis: new Object(),
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
            },
            '#btnResetChainAnalysis':{
                click:this.handleResetChainAnalysis
            }
        });
    },
    handleBeforeRender:function(panel,eOpts){
    },
    handleInit: function (){
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
                        var time = (StartSimuTime - epochTime) * 24 * 60 * 60;
                        var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([0])[time], new Array([mu])[0]);
                        var X = finalPosition[0][0][0];
                        var Y = finalPosition[0][0][1];
                        var Z = finalPosition[0][0][2];
                        var VX = finalPosition[1][0][0];
                        var VY = finalPosition[1][0][1];
                        var VZ = finalPosition[1][0][2];
                        var hb = AnalysisManagement.gsData[0].hb;
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
                                var time = (StartSimuTime - epochTime) * 24 * 60 * 60;
                                var finalPosition = keplerUniversal(position[0][0], position[1][0], new Array([0])[time], new Array([mu])[0]);
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
                                item.HB = AnalysisManagement.gsData[0].hb.toString();//步长
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
                    this.getSchedulerView().resourceStore.load();
                    this.getSchedulerView().eventStore.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            this.loadDataForAnaysisTable();
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
                item.passTime = ((data[i].data.EndDate.getTime() - data[i].data.StartDate.getTime())/1000).toString();
            for(var j = 0 ; j < AnalysisManagement.gsData.length; j++){
                if(AnalysisManagement.gsData[j].ResourceId == data[i].data.ResourceId){
                    item.passName = AnalysisManagement.gsData[j].name;
                    break;
                }
            }

            obj_aar.push(item);
        }
        this.getAnalysisResultGridPanel().store.loadData(obj_aar);
    },
    onLaunch: function (application) {
    },
    calculateClick: function(button, e, eOpts){
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
        this.channelComputPanel.down('#btnChainAnalysisComputeSave').setDisabled(true);
        if(!me.isSave){
            me.isSave = true;
            this.getController("AppPlat.controller.TreeController").newChainAnalysisClick();
        }
        else{
            AnalysisManagement.prototype.saveFileByPath(this.chainAnalysisParentPath,this.chainAnalysisFileName,JSON.stringify( me.currentChainAnalysis));
        }
    },
    saveChainAnalysisFileByPath: function(parentPath,filePath){
        this.chainAnalysisParentPath = parentPath;
        this.chainAnalysisFileName = filePath;
        AnalysisManagement.prototype.saveFileByPath(parentPath,filePath,JSON.stringify( this.currentChainAnalysis));
    },
//    updateChainAnaysis:function(obj){
//        this.channelComputPanel = obj;
//        this.isNewCA = false;
//        var data =  AnalysisManagement.taData[AnalysisManagement.taData.length - 1];
//        data.save = true;
//        this.channelComputPanel.queryById('transmitterPower').setValue(data.transmitterPower);
//        this.channelComputPanel.queryById('minGain').setValue(data.minGain);
//        this.channelComputPanel.queryById('feederLoss').setValue(data.feederLoss);
//        this.channelComputPanel.queryById('downCarrierFrequency').setValue(data.downCarrierFrequency);
//        this.channelComputPanel.queryById('satelliteEIRP').setValue(data.satelliteEIRP);
//        this.channelComputPanel.queryById('apogeeHeight').setValue(data.apogeeHeight);
//        this.channelComputPanel.queryById('groundAntennaElevation').setValue(data.groundAntennaElevation);
//        this.channelComputPanel.queryById('groundGT').setValue(data.groundGT);
//        this.channelComputPanel.queryById('openingAngle').setValue(data.openingAngle);
//        this.channelComputPanel.queryById('starDistance').setValue(data.starDistance);
//        this.channelComputPanel.queryById('atmosphericLoss').setValue(data.atmosphericLoss);
//        this.channelComputPanel.queryById('polarizationLoss').setValue(data.polarizationLoss);
//        this.channelComputPanel.queryById('equipmentLoss').setValue(data.equipmentLoss);
//        this.channelComputPanel.queryById('leqsbtj').setValue(data.leqsbtj);
//        this.channelComputPanel.queryById('dsl').setValue(data.dsl);
//        this.channelComputPanel.queryById('output_pts').setValue(data.pis);
//        this.channelComputPanel.queryById('output_eirp').setValue(data.eirp);
//        this.channelComputPanel.queryById('output_a').setValue(data.a_for_earch);
//        this.channelComputPanel.queryById('output_km').setValue(data.r_xdjj);
//        this.channelComputPanel.queryById('output_lsdown').setValue(data.lsdown);
//        this.channelComputPanel.queryById('output_dbhz').setValue(data.s_no_down);
//        this.channelComputPanel.queryById('output_dsl').setValue(data.d_s);
//        this.channelComputPanel.queryById('output_sno').setValue(data.d_sno_down);
//        this.channelComputPanel.queryById('output_xxdb').setValue(data.xxday);
//    },
    addDataToWindow:function(window,eOpts){
        var me = this;
        var rootNode = this.getApplication().getController('AppPlat.controller.TreeController').getSolutionTree().getRootNode();
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
    handleResetChainAnalysis: function (component, e) {
        this.initIsNewCA(this.getChainanAlysisPanel());
    },
    handleOverStationAnalysisClick: function (component, e) {
        this.isSave = false;
        this.initIsNewCA(this.getChainanAlysisPanel());
    },
    initIsNewCA: function(obj){
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
    getChainAnalysisData:function(parentPath,fileName){
        var me = this;
        this.isSave = true;
        this.chainAnalysisParentPath = parentPath;
        this.chainAnalysisFileName = fileName;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: parentPath+'/'+ fileName
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.updateChainAnaysisByData(data);
            },
            failure: function () {
            }
        });
    },
    updateChainAnaysisByData:function(data){
        this.getChainanAlysisPanel().queryById('transmitterPower').setValue(data.transmitterPower);
        this.getChainanAlysisPanel().queryById('minGain').setValue(data.minGain);
        this.getChainanAlysisPanel().queryById('feederLoss').setValue(data.feederLoss);
        this.getChainanAlysisPanel().queryById('downCarrierFrequency').setValue(data.downCarrierFrequency);
        this.getChainanAlysisPanel().queryById('satelliteEIRP').setValue(data.satelliteEIRP);
        this.getChainanAlysisPanel().queryById('apogeeHeight').setValue(data.apogeeHeight);
        this.getChainanAlysisPanel().queryById('groundAntennaElevation').setValue(data.groundAntennaElevation);
        this.getChainanAlysisPanel().queryById('groundGT').setValue(data.groundGT);
        this.getChainanAlysisPanel().queryById('openingAngle').setValue(data.openingAngle);
        this.getChainanAlysisPanel().queryById('starDistance').setValue(data.starDistance);
        this.getChainanAlysisPanel().queryById('atmosphericLoss').setValue(data.atmosphericLoss);
        this.getChainanAlysisPanel().queryById('polarizationLoss').setValue(data.polarizationLoss);
        this.getChainanAlysisPanel().queryById('equipmentLoss').setValue(data.equipmentLoss);
        this.getChainanAlysisPanel().queryById('leqsbtj').setValue(data.leqsbtj);
        this.getChainanAlysisPanel().queryById('dsl').setValue(data.dsl);
        this.getChainanAlysisPanel().queryById('output_pts').setValue(data.pis);
        this.getChainanAlysisPanel().queryById('output_eirp').setValue(data.eirp);
        this.getChainanAlysisPanel().queryById('output_a').setValue(data.a_for_earch);
        this.getChainanAlysisPanel().queryById('output_km').setValue(data.r_xdjj);
        this.getChainanAlysisPanel().queryById('output_lsdown').setValue(data.lsdown);
        this.getChainanAlysisPanel().queryById('output_dbhz').setValue(data.s_no_down);
        this.getChainanAlysisPanel().queryById('output_dsl').setValue(data.d_s);
        this.getChainanAlysisPanel().queryById('output_sno').setValue(data.d_sno_down);
        this.getChainanAlysisPanel().queryById('output_xxdb').setValue(data.xxday);
    }
});