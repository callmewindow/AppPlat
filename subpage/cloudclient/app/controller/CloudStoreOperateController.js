/**
 * Created by acm-windows on 2014/5/20.
 */

Ext.define('CloudClient.controller.CloudStoreOperateController',{
    extend: 'Ext.app.Controller',
    views: [
        'CloudStoreOperatePanel'
    ],
    refs: [
        {
            ref: 'cloudStoreOperatePanel',
            selector: 'cloudstoreoperatepanel'
        }
    ],
    init: function(application) {
        this.control({
            //注册目录操作的响应事件
            "#findDirBtn":{
                click: 'onFindDirClick'
            },
            "#createDirBtn":{
                click: 'onCreateDirClick'
            },
            "#updateDirBtn":{
                click: 'onUpdateDirClick'
            },
            "#delDirBtn":{
                click: 'onDelDirClick'
            },
            //注册文件操作的响应事件
            "#findFileDataBtn":{
                click: 'onFindFileDataClick'
            },
            "#updateFileBtn":{
                click: 'onUpdateFileClick'
            },
            "#delFileBtn":{
                click: 'onDelFileClick'
            },
            "#uploadBtn":{
                click: 'onUploadFileClick'
            },
            "#downloadBtn":{
                click: 'onDownloadFileClick'
            }
        });
    },
    onLaunch:function(application){

    },
    //目录操作
    onFindDirClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("userId").getValue();
        var directory = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent('directory').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=findDir&userId="
            +userId+"&directory="+directory;
        Ext.Ajax.request({url: url,callback: findDirBack});
    },
    onCreateDirClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("userId").getValue();
        var directory = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent('directory').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=createDir&userId="
            +userId+"&directory="+directory;
        Ext.Ajax.request({url: url,callback: createDirBack});
    },
    onUpdateDirClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("userId").getValue();
        var directory = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent('directory').getValue();
        var type = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("type").getValue();
        var destDirectory = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("destDirectory").getValue();

        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=updateDir&userId="
            +userId+"&directory="+directory+"&oprType="+type+"&destDirectory="+destDirectory;
        Ext.Ajax.request({url: url,callback: updateDirBack});
    },
    onDelDirClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent("userId").getValue();
        var directory = this.getCloudStoreOperatePanel().getComponent('dirOperate').getComponent('directory').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=delDir&userId="
            +userId+"&directory="+directory;
        Ext.Ajax.request({url: url,callback: delDirBack});
    },

    //文件操作
    onFindFileDataClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("userId").getValue();
        var filePath = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent('filePath').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=findFile&userId="
            +userId+"&filePath="+filePath;
        Ext.Ajax.request({url: url,callback: findFileBack});
    },
    onUpdateFileClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("userId").getValue();
        var filePath = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent('filePath').getValue();
        var type = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("type").getValue();
        var destFileOrDir = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("destFileOrDir").getValue();

        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=updateFile&userId="
            +userId+"&filePath="+filePath+"&oprType="+type+"&destFileOrDir="+destFileOrDir;
        Ext.Ajax.request({url: url,callback: updateFileBack});
    },
    onDelFileClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("userId").getValue();
        var filePath = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent('filePath').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=delFile&userId="
            +userId+"&filePath="+filePath;
        Ext.Ajax.request({url: url,callback: delFileBack});
    },
    onDownloadFileClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("userId").getValue();
        var filePath = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent('filePath').getValue();
        var localFileDir = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("fileLoad").getComponent('localFileDir').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=downloadFile&userId="
            +userId+"&filePath="+filePath+"&localFileDir="+localFileDir;
        Ext.Ajax.request({url: url,callback: downloadFileBack});
    },
    onUploadFileClick: function(button, e, eOpts){
        var userId = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("userId").getValue();
        var filePath = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent('filePath').getValue();
        var localFileDir = this.getCloudStoreOperatePanel().getComponent('fileOperate').getComponent("fileLoad").getComponent('localFileDir').getValue();
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "CloudStoreOperateServlet?type=uploadFile&userId="
            +userId+"&filePath="+filePath+"&localFileDir="+localFileDir;
        Ext.Ajax.request({url: url,callback: uploadFileBack});
    }
});
//目录操作的回调函数
function findDirBack(options, success, response){
    if (success) {

            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("dirOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}
function createDirBack(options, success, response){
    if (success) {

            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("dirOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}
function updateDirBack(options, success, response){
    if (success) {

            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("dirOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}
function delDirBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("dirOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}

//文件操作的回调函数
function findFileBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("fileOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}
function updateFileBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("fileOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}
function delFileBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("fileOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}
function downloadFileBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("fileOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}
function uploadFileBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.CloudStoreOperateController();
            var resultPanel = resultCtrl.getCloudStoreOperatePanel().getComponent("fileOperate").getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}