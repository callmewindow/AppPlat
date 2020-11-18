/******************************************
 * 类名：协同管理
 * 类型：逻辑类
 * 作用：负责协同操作的数据传输和同步
 * 创建者：杜鹏宇
 * 最后一次修改者：杜鹏宇
 * 最后一次修改时间：20141130
 *****************************************/

var CooperationManage = function(){
    this.ws = null;//websocket连接
    this.taskId = null,//记录当前场景taskId
    this.solutionId = null,//记录当前场景solutionId
    this.nodeId = null,//记录当前场景nodeid
    this.satelliteId = null
}
CooperationManage.prototype = {
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
//            var json = {
//                'sceneInfo' : {
//                    'data' : sceneData,
//                    'taskId' : this.taskId,
//                    'solutionId' : this.solutionId,
//                    'nodeId' : this.nodeId
//                },
//                'userID' : Struct.userID,
//                'command' : command,
//                'id' : id,
//                'data' : {
//                    'flag': data
//                }
//            };
//            Struct.cooperationManage.ws.send(JSON.stringify(json));
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
            if (Struct.userID == json.userID || json.sceneInfo.taskId != Struct.cooperationManage.taskId
                || json.sceneInfo.solutionId != Struct.cooperationManage.solutionId || json.sceneInfo.nodeId != Struct.cooperationManage.nodeId) return;
            var no = Struct.structManage.searchByID(json.id);
            switch(json.command){
                //增 指令
                case "Addition":
                    var total = Struct.structures.length;
                    Struct.structures[total] = new Structure();
                    Struct.structures[total].initBySynchronous(json.id, json.position, json.rotation, json.scale, json.data, function(){
                        Struct.structManage.refresh();
                        Struct.render();
                        Struct.windowManage.updateLW();
                    });                    break;
                //删 指令
                case "Delete":
                    Struct.structures[no].delete();
                    Struct.structures.splice(no, 1);
                    break;
                //改 指令
                case "Modify":
                    Struct.structures[no].refresh(json.position, json.rotation, json.scale);
                    Struct.structures[no].data = json.data.data;
                    break;
                //锁 指令
                case "LockControl":
                    //data为true时加锁，反之解锁
                    if (json.data.flag) {
                        Struct.structures[no].lock();
                        Struct.structures[no].unselect();
                    }
                    else {
                        Struct.structures[no].unlock();
                    }
                    break;
                //并 指令
                case "Combine":
                    //data参数不为null时表示组合，否则表示分离
                    if (json.data != null && json.data != false){
                        var total = Struct.structures.length;
                        Struct.structures[total] = new Structure();
                        Struct.structures[total].id = json.id;
                        Struct.structures[total].initByCombina(json.data);
                        Struct.structManage.deleteByID(json.data, false);
                        Struct.structures[Struct.structManage.searchByID(json.id)].lock();
                        Struct.render();
                    }
                    else {
                        var idList = Struct.structManage.breakByID(json.id);
                        if (json.data != false) {
                            Struct.structManage.unselectById(idList);
                            Struct.structManage.lockById(idList);
                        }
                    }
                    break;
                //添加合并,添加组合体
                case "AddandCmb":
                    Struct.structManage.callBackCount = json.data.length;
                    for (var i = 0; i < json.data.length; i++) {
                        Struct.structManage.idLists[i] = json.data[i].id;
                        var total = Struct.structures.length;
                        Struct.structures[total] = new Structure();
                        Struct.structures[total].initBySynchronous(json.data[i].id, json.data[i].position, json.data[i].rotation, json.data[i].scale, json.data[i], function () {
                            Struct.structManage.callBackCount--;
                            if (Struct.structManage.callBackCount == 0) {
                                Struct.structManage.combineByID(Struct.structManage.idLists, json.id);
                                Struct.structManage.idLists = new Array();
                            }
                        });
                    }
                    break;
                default :
                    break;
            }
            //更新相关显示
            Struct.structManage.refresh();
            Struct.render();
        }
    },

    //向服务器发出消息指令
    sendInfo : function(command, id, data){
        //非协同工作时忽略操作
        if (this.ws == null || this.ws.readyState != 1) return;
        var no = Struct.structManage.searchByID(id);
        var sceneData = Struct.storageManage.getSceneJsonData();
        var idlist = Struct.structManage.getLockList();
        switch(command) {
            //增 指令
            case "Addition":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId' : idlist
                    },
                    'userID' : Struct.userID,
                    'command' : command,
                    'id' : id,
                    'data' : {
                        'basicFlag': Struct.structures[no].basicFlag,
                        'pathobj' : Struct.structures[no].pathobj,
                        'pathmtl' : Struct.structures[no].pathmtl,
                        'data': Struct.structures[no].data
                    },
                    'position' : {
                        'x' : Struct.structures[no].object.position.x,
                        'y' : Struct.structures[no].object.position.y,
                        'z' : Struct.structures[no].object.position.z
                    },
                    'rotation' : {
                        'x' : Struct.structures[no].object.rotation.x,
                        'y' : Struct.structures[no].object.rotation.y,
                        'z' : Struct.structures[no].object.rotation.z
                    },
                    'scale' : {
                        'x' : Struct.structures[no].object.scale.x,
                        'y' : Struct.structures[no].object.scale.y,
                        'z' : Struct.structures[no].object.scale.z
                    }
                };
                break;
            //删\并 指令
            case "Delete":
            case "Combine":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId' : idlist
                    },
                    'userID': Struct.userID,
                    'command': command,
                    'id': id,
                    'data': data
                }
                break;
            //改 指令
            case "Modify":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId' : idlist
                    },
                    'userID' : Struct.userID,
                    'command' : command,
                    'id' : id,
                    'data' : {
                        'data': Struct.structures[no].data
                    },
                    'position' : {
                        'x' : Struct.structures[no].object.position.x,
                        'y' : Struct.structures[no].object.position.y,
                        'z' : Struct.structures[no].object.position.z
                    },
                    'rotation' : {
                        'x' : Struct.structures[no].object.rotation.x,
                        'y' : Struct.structures[no].object.rotation.y,
                        'z' : Struct.structures[no].object.rotation.z
                    },
                    'scale' : {
                        'x' : Struct.structures[no].object.scale.x,
                        'y' : Struct.structures[no].object.scale.y,
                        'z' : Struct.structures[no].object.scale.z
                    }
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
                        'lockId' : idlist
                    },
                    'userID' : Struct.userID,
                    'command' : command,
                    'id' : id,
                    'data' : {
                        'flag': data
                    }
                };
                break;
				//添加合并
            case "AddandCmb":
                var json = {
                    'sceneInfo' : {
                        'data' : sceneData,
                        'taskId' : this.taskId,
                        'solutionId' : this.solutionId,
                        'nodeId' : this.nodeId,
                        'lockId' : idlist
                    },
                    'userID': Struct.userID,
                    'teamID': Struct.teamID,
                    'command': command,
                    'id': id,
                    'data': data
                };
                break;
            default :
                break;
        }
        this.ws.send(JSON.stringify(json));
    }
}