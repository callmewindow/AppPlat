window.onbeforeunload = beforeUnload;
function beforeUnload() {
    if (Struct.structures != null) {
        var total = Struct.structures.length;
        for (var i = 0; i < total; i++) {
            if (Struct.structures[i].selectFlag) {
                Struct.structures[i].unselect();
                Struct.cooperationManage.sendInfo("LockControl", Struct.structures[i].id, false);
            }
        }
        console.log("结构锁资源释放完毕");
    }

    if (ORBIT.Satellite != null) {
        ORBIT.Satellite.unlockSelect();
    }

    Ext.MessageBox.show({title: '解锁操作', msg: '资源正在释放，请稍候……'});
}

Ext.define('AppPlat.controller.StructDesign.MenuController', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'structFileGridPanel',
            selector: 'structfilegridpanel'
        },
        {
            ref: 'buttongrouppanel',
            selector: 'buttongrouppanel'
        },
        {
            ref: 'helperwindow',
            selector: 'helperwindow'
        },
        {
            ref: 'StructListWindow',
            selector: 'structlistWindow'
        },
        {
            ref: 'WorkTabPanel',
            selector: 'worktabpanel'
        }
    ],

    onLaunch: function (application) {
    },

    init: function (application) {
        this.control({
            //新建结构文件按钮
            '#btnNewStructFile': {
                click: this.btnNewStructFileClick
            },
            //打开结构文件按钮
            '#btnOpenStructFile': {
                click: this.btnOpenStructFileClick
            },
            //打开文件列表中文件
            'structfilegridpanel': {
                itemdblclick: this.fileLoad
            },
            //保存结构文件按钮
            '#btnSaveStructFile': {
                click: this.btnSaveStructFileClick
            },
            //导出文件按钮
            '#btnExport': {
                click: this.btnExportClick
            },
            //返回按钮
            '#btnBackNavigation': {
                click: this.btnBackNavigationClick
            },

            //漫游模式按钮
            '#btnViewMode': {
                click: this.btnViewModeClick
            },
            //初始化视角按钮
            '#btnInitview': {
                click: this.btnInitviewClick
            },
            //全屏按钮
            '#btnMax': {
                click: this.btnMaxClick
            },
            //还原按钮
            '#btnRestore': {
                click: this.btnRestoreClick
            },

            //助手按钮
            '#btnHelper': {
                click: this.btnHelperClick
            },
            //演示视频按钮
            '#btnMovie': {
                click: this.btnMovieClick
            },

            //提交按钮
            '#btnUpdate': {
                click: this.btnUpdateClick
            }
        });
    },

    //新建结构文件按钮响应
    btnNewStructFileClick: function () {
        if (Struct.structures.length == 0) {
            Struct.sceneManage.resetScene();
        }
        else //Ext.MessageBox.confirm('提示', '未保存的工作将会丢失，是否继续？', function(btn) {
        //if (btn == 'yes') {
            Struct.sceneManage.resetScene();
        // }
        // });
    },

    //打开结构文件按钮响应
    fileWindow: null,//打开文件窗口
    btnOpenStructFileClick: function () {
        var me = this;
        me.getButtongrouppanel().queryById('StructMenu').menu.hide();
        this.fileWindow = Ext.create('AppPlat.view.StructDesign.StructFileWindow');
        this.fileWindow.queryById('structFileGridPanel').store.proxy.extraParams = {
            path: sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN
        };
        this.fileWindow.queryById('structFileGridPanel').store.reload();
        this.fileWindow.show();
    },
    //加载场景
    fileLoad: function (grid, rowindex, e) {
        var record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            var me = this;
            if (me.getStructurescenepanelp().queryById('fileNameLbl').text == APC.NEW_FILE_NAME && Struct.structures.length == 0) {
                Struct.sceneManage.resetScene();
                Struct.storageManage.initByJson(sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + record[0].data.name +
                    "/" + record[0].data.name + ".json");
                Struct.render();
                me.fileWindow.close();
            } else
            //Ext.MessageBox.confirm('提示', '未保存的工作将会丢失，是否继续？', function(btn) {
            //if (btn == 'yes') {
            {
                Struct.sceneManage.resetScene();
                Struct.storageManage.initByJson(sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + record[0].data.name +
                    "/" + record[0].data.name + ".json");
                Struct.render();
                me.fileWindow.close();
                me.getStructurescenepanelp().queryById('fileNameLbl').setText(record[0].data.name);
            }
            //});
        }
    },

    //保存结构文件按钮响应
    btnSaveStructFileClick: function () {
        var me = this;
        me.getButtongrouppanel().queryById('StructMenu').menu.hide();
        var path = me.getApplication().getController('AppPlat.controller.TreeController.TreeController').getSolutionTree().getSelectionModel().getSelection()[0].get('nodeFilePath') + "/";
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFilesNameWithoutExtension.json",
            method: 'GET',
            params: {
                path: path
            },
            callback: function (options, success, response) {
                var jsonResult;
                if (response.responseText != null && response.responseText != "") {
                    jsonResult = Ext.JSON.decode(response.responseText);
                } else {
                    jsonResult = response.responseText;
                }

                Ext.MessageBox.prompt('文件名称', '请输入文件名称:', function (btn, text) {
                    if (btn == "ok") {
                        var isRepeat = me.repeatabilityVerification(text, jsonResult);
                        if (isRepeat) {
                            Ext.MessageBox.show({
                                title: '保存失败',
                                msg: '文件名称已存在，请重新保存',
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        } else if (text == null || text == '') {
                            Ext.MessageBox.show({
                                title: '保存失败',
                                msg: '文件名称不能为空，请重新保存',
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        }
                        else {
                            Struct.storageManage.sceneSave(sessionStorage.getItem("userId"), path + text, text);
                        }
                    }
                });
            }
        });
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

    //导出按钮
    btnExportClick: function () {
        Ext.MessageBox.show({
            title: '卫星结构保存',
            msg: '正在导出obj格式数据，请稍候……'
        });
        var me = this;
        setTimeout(function () {
            me.getButtongrouppanel().queryById('StructMenu').menu.hide();
            var aLink = document.createElement('a');
            var data = Struct.storageManage.exportObj();
            var blob = new Blob([data]);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            aLink.download = me.getStructurescenepanel().queryById('fileNameLbl').text + '.obj';
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
//            Ext.MessageBox.show({
//                title: '卫星结构保存',
//                msg: '已将obj格式数据导出至下载位置',
//                buttons: Ext.Msg.OK
//            });

            me.getButtongrouppanel().queryById('StructMenu').menu.hide();
            var aLink = document.createElement('a');
            var data = "../../../../../../resources/objmodel/Struct.mtl";
            var blob = new Blob([data]);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            aLink.download = me.getStructurescenepanel().queryById('fileNameLbl').text + '.mtl';
            aLink.href = "../../../../../../resources/objmodel/Struct.mtl";
            aLink.dispatchEvent(evt);
            Ext.MessageBox.show({
                title: '卫星结构保存',
                msg: '已将mtl格式数据导出至下载位置',
                buttons: Ext.Msg.OK
            });
        }, "1000");
    },

    //返回按钮
    btnBackNavigationClick: function () {
        this.getButtongrouppanel().queryById('StructMenu').menu.hide();
        window.location.href = "../Navigation/Navigation.html";
    },

    //漫游模式按钮响应
    btnViewModeClick: function () {
        this.getButtongrouppanel().queryById('StructObservation').menu.hide();
        if (!Struct.sceneManage.viewSwitch) {
            Struct.sceneManage.viewSwitch = true;
            Struct.sceneManage.initView();
            Struct.sceneManage.viewMode();
        } else {
            Struct.sceneManage.viewSwitch = false;
        }
    },

    //恢复初始视角按钮
    btnInitviewClick: function () {
        this.getButtongrouppanel().queryById('StructObservation').menu.hide();
        Struct.sceneManage.initView();
    },

    //全屏按钮响应
    btnMaxClick: function () {
        this.getButtongrouppanel().queryById('StructObservation').menu.hide();
        if (window.parent != window) {
            var data = {
                "command": "max"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
            Struct.windowManage.cwPoint.x = 875;
            Struct.windowManage.cwPoint.y = 75;
            Struct.windowManage.controlWindow.setPosition([875, 75]);
            Struct.sceneManage.map.style.left = 1045 + "px";
            Struct.sceneManage.map.style.top = 578 + "px";
        }
    },

    //还原按钮响应
    btnRestoreClick: function () {
        this.getButtongrouppanel().queryById('StructObservation').menu.hide();
        if (window.parent != window) {
            var data = {
                "command": "restore"
            };
            window.parent.postMessage(JSON.stringify(data), '*');
            Struct.windowManage.cwPoint.x = 595;
            Struct.windowManage.cwPoint.y = 75;
            Struct.windowManage.controlWindow.setPosition([595, 75]);
            Struct.sceneManage.map.style.left = 765 + "px";
            Struct.sceneManage.map.style.top = 578 + "px";
        }
    },

    //助手按钮响应
    helper: Ext.create('AppPlat.view.StructDesign.HelperWindow'),//文件助手
    btnHelperClick: function () {
        this.getButtongrouppanel().queryById('StructHelp').menu.hide();
        this.helper.setPosition([0, 75]);
        this.helper.show();
    },

    //演示视频按钮响应
    btnMovieClick: function () {
        this.getButtongrouppanel().queryById('StructHelp').menu.hide();
        var videoDemoWindow = Ext.create('AppPlat.view.StructDesign.VideoDemoWindow');
        videoDemoWindow.show();
    },

    //提交按钮响应
    btnUpdateClick: function () {
        Ext.MessageBox.show({
            title: '卫星结构提交',
            msg: '卫星结构数据提交中，请稍候...'
        });
        setTimeout(function () {
            if (Struct.structures != null && Struct.structures.length != 0) {
                var path = Struct.cooperationManage.taskId + "/" + Struct.cooperationManage.solutionId + "/" +
                    Struct.cooperationManage.satelliteId + "/";
                Ext.Ajax.request({
                    url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
                    method: 'POST',
                    jsonData: {
                        parentPath: path,
                        fileName: Struct.cooperationManage.nodeId + ".obj",
                        data: Struct.storageManage.exportObj()
                    }
                });

                function createXmlHttpRequest() {
                    if (window.ActiveXObject) {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    } else if (window.XMLHttpRequest) {
                        return new XMLHttpRequest();
                    }
                }

                var svgrul = "../../resources/objmodel/Struct.mtl";
                var xmlHttpRequest = createXmlHttpRequest();
                xmlHttpRequest.onreadystatechange = callback;
                xmlHttpRequest.open("GET", svgrul, true);
                xmlHttpRequest.send(null);
                function callback() {
                    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                        Struct.storageManage.mtlData = xmlHttpRequest.responseText;
                        Ext.Ajax.request({
                            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
                            method: 'POST',
                            jsonData: {
                                parentPath: path,
                                fileName: Struct.cooperationManage.nodeId + ".mtl",
                                data: Struct.storageManage.mtlData
                            }
                        });
                    }
                }
            }
            Ext.MessageBox.show({
                title: '卫星结构提交',
                msg: '已提交最新卫星结构数据',
                buttons: Ext.Msg.OK
            });
        }, "1000");
    }
});