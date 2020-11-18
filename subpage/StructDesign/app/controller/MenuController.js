/**
 * 修改 by 杜鹏宇 on 2014/09/18
 */

//防止未保存退出
//window.onbeforeunload = beforeUnload;
//function beforeUnload(){
//    var warning="您即将离开此页面，请注意保存所做工作";
//    return warning;
//}

//控制菜单面板
Ext.define('StructDesignApp.controller.MenuController', {
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
            ref: 'structurescenepanel',
            selector: 'structurescenepanel'
        },
        {
            ref: 'helperwindow',
            selector: 'helperwindow'
        },
        {
            ref: 'StructListWindow',
            selector: 'structlistWindow'
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
            }
        });
    },

    //新建结构文件按钮响应
    btnNewStructFileClick: function () {
        var me = this;
        if (me.getStructurescenepanel().queryById('fileNameLbl').text == APC.NEW_FILE_NAME && Struct.structures.length == 0) {
            Struct.sceneManage.resetScene();
        }
        else //Ext.MessageBox.confirm('提示', '未保存的工作将会丢失，是否继续？', function(btn) {
        //if (btn == 'yes') {
        {
            Struct.sceneManage.resetScene();
            me.getStructurescenepanel().queryById('fileNameLbl').setText(APC.NEW_FILE_NAME);
        }
        //});
        me.getButtongrouppanel().queryById('StructMenu').menu.hide();
    },

    //打开结构文件按钮响应
    fileWindow: null,//打开文件窗口
    btnOpenStructFileClick: function () {
        var me = this;
        me.getButtongrouppanel().queryById('StructMenu').menu.hide();
        this.fileWindow = Ext.create('StructDesignApp.view.StructFileWindow');
        this.fileWindow.queryById('structFileGridPanel').store.proxy.extraParams = {
            userId: sessionStorage.getItem('userId')
        };
        this.fileWindow.queryById('structFileGridPanel').store.reload();
        this.fileWindow.show();
    },
    //加载场景
    fileLoad: function (grid, rowindex, e) {
        var record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            var me = this;
            Struct.sceneManage.resetScene();
            Struct.storageManage.initByJson(sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + record[0].data.perTaskName +
                "/" + record[0].data.perTaskName + ".json");
            Struct.render();
            me.fileWindow.close();
            me.getStructurescenepanel().queryById('fileNameLbl').setText(record[0].data.perTaskName);
        }
    },

    //保存结构文件按钮响应
    btnSaveStructFileClick: function () {
        var me = this;
        me.getButtongrouppanel().queryById('StructMenu').menu.hide();
        if (me.getStructurescenepanel().queryById('fileNameLbl').text == APC.NEW_FILE_NAME) {
            Ext.Ajax.request({
                url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getTaskNameByUserId.json",
                method: 'GET',
                params: {
                    userId: sessionStorage.getItem("userId")
                },
                callback: function (options, success, response) {
                    var jsonResult = new Array();
                    if (response.responseText != null && response.responseText != "") {
                        var result = Ext.JSON.decode(response.responseText);
                        for(i = 0; i< result.length;i++){
                            var obj = new Object();
                            obj.name = result[i].perTaskName;
                            jsonResult.push(obj);
                        }
                    } else {
                        jsonResult = response.responseText;
                    }

                    Ext.MessageBox.prompt('文件名称', '请输入文件名称:', function (btn, text) {
                        if (btn == "ok") {
                            //重复性验证
                            var repeatabilityVerification = function (text, jsonResult) {
                                var i;
                                for (i = 0; i < jsonResult.length; i++) {
                                    if (jsonResult[i].name == text) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            var isRepeat = repeatabilityVerification(text, jsonResult);
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
                                Struct.storageManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + text, text);
                                me.getStructurescenepanel().queryById('fileNameLbl').setText(text);
                            }
                        }
                    });
                }
            });
        }
        else {
            Struct.storageManage.sceneSave(sessionStorage.getItem("userId"), sessionStorage.getItem("userId") + "/" + APC.STRUCT_DESIGN + "/" + me.getStructurescenepanel().queryById('fileNameLbl').text, me.getStructurescenepanel().queryById('fileNameLbl').text);
        }
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
            Ext.MessageBox.show({
                title: '卫星结构保存',
                msg: '已将obj格式数据导出至下载位置',
                buttons: Ext.Msg.OK
            });

            me.getButtongrouppanel().queryById('StructMenu').menu.hide();
            var aLink = document.createElement('a');
            var data = "../../../../../../resources/objmodel/Struct.mtl";
            var blob = new Blob([data]);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            aLink.download = me.getStructurescenepanel().queryById('fileNameLbl').text + '.mtl';
            aLink.href = "../../resources/objmodel/Struct.mtl";
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
        window.location.href = "../../subpage/Navigation/Navigation.html";
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
            Struct.sceneManage.sceneMap.changePosition(1045, 578);
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
            Struct.sceneManage.sceneMap.changePosition(765, 578);
        }
    },

    //助手按钮响应
    helpWindow: null,
    btnHelperClick: function () {
        this.getButtongrouppanel().queryById('StructHelp').menu.hide();
        if (this.helpWindow == null)
            this.helpWindow = Ext.create('StructDesignApp.view.HelperWindow');//文件助手
        this.helpWindow.setPosition([0, 35]);
        this.helpWindow.show();
    },

    //演示视频按钮响应
    movieWindow: null,
    btnMovieClick: function () {
        this.getButtongrouppanel().queryById('StructHelp').menu.hide();
        if (this.movieWindow == null)
            this.movieWindow = Ext.create('StructDesignApp.view.VideoDemoWindow');
        this.movieWindow.show();
    }
});