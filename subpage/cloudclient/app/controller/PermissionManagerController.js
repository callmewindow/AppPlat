/**
 * Created by acm-windows on 2014/5/19.
 */
Ext.define('CloudClient.controller.PermissionManagerController',{
        extend: 'Ext.app.Controller',
        views: [
            'PermissionManagerPanel'
        ],
        refs: [
            {
                ref: 'permissionManagerPanel',
                selector: 'permissionmanagerpanel'
            }
        ],
        init: function(application) {
            this.control({
                "#findPerBtn":{
                    click: 'onFindPerClick'
                },
                "#findUserBtn":{
                    click: 'onFindUserClick'
                },
                "#updatePerBtn":{
                    click: 'onUpdatePerClick'
                }
            });
        },
        onLaunch:function(application){

        },
        onFindPerClick: function(button, e, eOpts){
            var userId = this.getPermissionManagerPanel().getComponent('userId').getValue( );
            var domain = this.getPermissionManagerPanel().getComponent('domain').getValue( );
            var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "PermissionManagerServlet?type=findPer&userId="
                +userId+"&domain="+domain;
            Ext.Ajax.request({url: url,callback: findPerBack});
        },
        onFindUserClick: function(button, e, eOpts){
            var userId = this.getPermissionManagerPanel().getComponent('userId').getValue( );
            var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "PermissionManagerServlet?type=findUser&userId="
                +userId;
            Ext.Ajax.request({url: url,callback: findUserBack});
        },
        onUpdatePerClick: function(button, e, eOpts){
            var userId = this.getPermissionManagerPanel().getComponent('userId').getValue( );
            var domain = this.getPermissionManagerPanel().getComponent('domain').getValue( );
            var permission = this.getPermissionManagerPanel().getComponent('permission').getValue( );
            var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "PermissionManagerServlet?type=updatePer&userId="
                +userId+"&domain="+domain+"&permission="+permission;
            Ext.Ajax.request({url: url,callback: updatePerBack});
        }
});
function findPerBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.PermissionManagerController();
            var resultPanel = resultCtrl.getPermissionManagerPanel().getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}
function findUserBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.PermissionManagerController();
            var resultPanel = resultCtrl.getPermissionManagerPanel().getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}
function updatePerBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.PermissionManagerController();
            var resultPanel = resultCtrl.getPermissionManagerPanel().getComponent("result");

        resultPanel.body.appendChild(result);

            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;

    }
}