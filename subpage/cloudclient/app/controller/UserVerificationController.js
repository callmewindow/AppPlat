/**
 * Created by acm-windows on 2014/5/20.
 */

Ext.define('CloudClient.controller.UserVerificationController',{
    extend: 'Ext.app.Controller',
    views: [
        'UserVerificationPanel'
    ],
    refs: [
        {
            ref: 'userVerificationPanel',
            selector: 'userverificationpanel'
        }
    ],
    init: function(application) {
        this.control({
            "#verificationBtn":{
                click: 'onVerficationClick'
            }
        });
    },
    onLaunch:function(application){

    },
    onVerficationClick: function(button, e, eOpts){
        var account = this.getUserVerificationPanel().getComponent('account').getValue( );
        var pwd = this.getUserVerificationPanel().getComponent('pwd').getValue( );
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "UserVerificationServlet?account="
            +account+"&pwd="+pwd;
        Ext.Ajax.request({url: url,callback: vericationBack});
    }
});
function vericationBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.UserVerificationController();
            var resultPanel = resultCtrl.getUserVerificationPanel().getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}