/**
 * Created by acm-windows on 2014/5/20.
 */

Ext.define('CloudClient.controller.AccessStatisicController',{
    extend: 'Ext.app.Controller',
    views: [
        'AccessStatisicPanel'
    ],
    refs: [
        {
            ref: 'accessStatisicPanel',
            selector: 'accessstatisicpanel'
        }
    ],
    init: function(application) {
        this.control({
            "#insertBtn":{
                click: 'onInsertClick'
            }
        });
    },
    onLaunch:function(application){

    },
    onInsertClick: function(button, e, eOpts){
        var uri = window.location.href;
        var userId = uri.match(new RegExp("userId=(.{24})"))[1];
        var account = this.getAccessStatisicPanel().getComponent('account').getValue( );
        var domain = this.getAccessStatisicPanel().getComponent('domain').getValue( );
        var url = this.getAccessStatisicPanel().getComponent('url').getValue( );
        var describe = this.getAccessStatisicPanel().getComponent('describe').getValue( );
        var ip = this.getAccessStatisicPanel().getComponent('ip').getValue( );
        var urls = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "AccessStatisicServlet?userId="
            +userId+"&account="+account+"&domain="+domain+"&url="+url+"&describe="+describe+"&ip="+ip;
        Ext.Ajax.request({url: urls,callback: insertBack});
    }
});

function insertBack(options, success, response){
    if (success) {

        var result = new Ext.Element(document.createElement('div'));
        result.update('<b>' + response.responseText + '</b>');
        var resultCtrl = new CloudClient.controller.AccessStatisicController();
        var resultPanel = resultCtrl.getAccessStatisicPanel().getComponent("result");
        resultPanel.body.appendChild(result);
        var resultScroll = resultPanel.body.dom;
        resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}