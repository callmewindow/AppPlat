/******************************************
 * 类名：协同管理
 * 类型：逻辑类
 * 作用：负责卫星轨道交互设计协同操作的数据传输和同步
 * 创建者：聂殿辉
 * 最后一次修改者：聂殿辉
 * 最后一次修改时间：20141214
 *****************************************/

var Cooperation = function(){
    this.ws = null;//websocket连接
    this.taskId = null;//记录当前场景taskId
    this.solutionId = null;//记录当前场景solutionId
    this.nodeId = null;//记录当前场景nodeid
}
Cooperation.prototype = {
    //初始化属性值
    initId: function(taskId, solutionId, nodeId){
        this.taskId = taskId;
        this.solutionId = solutionId;
        this.nodeId = nodeId;
    },
    //与服务器建立WebSocket通信
    startWebSocket : function(){
        if('WebSocket' in window){
            try{
                this.ws = new WebSocket("ws://" + APC.BACKEND_URL + "/AppPlatService/WebsocketAction");
            }catch(e){
                Ext.MessageBox.show({
                    title: "系统提示",
                    msg: "websocket连接建立失败",
                    buttons: Ext.Msg.OK
                });
            }
        }
        else{
            Ext.MessageBox.show({
                title: "系统提示",
                msg: "当前浏览器不支持WebSocket，无法进行协同工作",
                buttons: Ext.Msg.OK
            });
        }
        this.ws.onopen = function(evt) {
//            Ext.MessageBox.show({
//                title: "系统提示",
//                msg: "websocket连接成功",
//                buttons: Ext.Msg.OK
//            });
        };
        this.ws.onclose = function(evt) {
            Ext.MessageBox.show({
                title: "系统提示",
                msg: "与服务器连接失败，当前状态无法协同工作",
                buttons: Ext.Msg.OK
            });
        };
        //设置监听响应
        this.ws.onmessage = function(event){
            if (event.data == null) return;
            var json = JSON.parse(event.data);
            //如果是本机发出的消息则忽略
            if(json.command == 'refreshTree') return;
            if (sessionStorage.getItem("userId") == json.userID || json.sceneInfo.taskId != ORBIT.cooperation.taskId
                || json.sceneInfo.solutionId != ORBIT.cooperation.solutionId || json.sceneInfo.nodeId != ORBIT.cooperation.nodeId) return;
            switch(json.command){
                //增 指令
                case "Addition":
                    initSatelliteOrbit(json.sid);
                    refreshSatellite();
                    refreshOrbit();
                    hideCharacter(json.sid);
                    refreshCamera();
                    break;
                //删 指令
                case "Delete":
                    deleteSateOrbit(json.sid);
                    break;
                //改 指令
                case "Modify":
                    refreshSatelliteOrbit(json.sid, json.centerid,json.start, json.stop, json.epoch, json.a, json.e, json.i, json.Om, json.om, json.theta);
                    break;
                //锁 指令
                case "LockControl":
                    var sid = json.sid;
                    //data为true时加锁，反之解锁
                    if (json.data.flag) {
                        ORBIT.satellite[sid].lock();
                        ORBIT.satellite[sid].unselect();
                    }
                    else {
                        ORBIT.satellite[sid].unlock();
                    }
                    break;
                case "Rename":
                    renameSateOrbit(json.data.oldValue, json.data.newValue, json.data.type);
                    break;
                default :
                    break;
            }
        }
    },

    //向服务器发出消息指令
    sendInfo : function(command, id, data){
        //非协同工作时忽略操作
        if (this.ws == null || this.ws.readyState != 1) return;
        var sceneData = ORBIT.saveManage.getSceneJsonData();
        var idlist = ORBIT.Satellite.getLockList();
        switch(command) {
            //增 指令
            case "Addition":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId': idlist
                    },
                    'userID' : sessionStorage.getItem("userId"),
                    'command' : command,
                    'sid': id
                };
                break;
            //删\并 指令
            case "Delete":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId': idlist
                    },
                    'userID' : sessionStorage.getItem('userId'),
                    'command' : command,
                    'sid': id
                };
                break;
            //改 指令
            case "Modify":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId': idlist
                    },
                    'userID' : sessionStorage.getItem('userId'),
                    'command' : command,

                    'sid': id,
                    'centerid': ORBIT.satellite[id].centerid,
                    'start': ORBIT.satellite[id].t_start,
                    'stop': ORBIT.satellite[id].t_stop,
                    'epoch': ORBIT.satellite[id].epochTime,
                    'a': ORBIT.orbitpara[id].a,
                    'e': ORBIT.orbitpara[id].e,
                    'i': ORBIT.orbitpara[id].i,
                    'Om': ORBIT.orbitpara[id].Om,
                    'om': ORBIT.orbitpara[id].om,
                    'theta': ORBIT.orbitpara[id].theta
                };
                break;
            //锁 指令
            case "LockControl":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId': idlist
                    },
                    'userID' : sessionStorage.getItem('userId'),
                    'command' : command,

                    'sid' : id,
                    'data' : {
                        'flag': data
                    }
                };
                break;
            //重命名 指令
            case "Rename":
                data = JSON.parse(data);
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId': idlist
                    },
                    'userID' : sessionStorage.getItem('userId'),
                    'command' : command,

                    'data' : {
                        'oldValue': data.oldValue,
                        'newValue': data.newValue,
                        'type': data.type
                    }
                };
                break;
            default :
                break;
        }
        this.ws.send(JSON.stringify(json));
    }
};