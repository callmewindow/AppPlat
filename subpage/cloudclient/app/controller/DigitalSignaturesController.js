/**
 * Created by acm-windows on 2014/5/20.
 */

Ext.define('CloudClient.controller.DigitalSignaturesController',{
    extend: 'Ext.app.Controller',
    views: [
        'DigitalSignaturesPanel'
    ],
    refs: [
        {
            ref: 'digitalSignaturesPanel',
            selector: 'digitalsignaturespanel'
        }
    ],
    init: function(application) {
        this.control({
            "#verficationBtn":{
                click: 'onVerficationClick'
            }
        });
    },
    onLaunch:function(application){

    },
    onVerficationClick: function(button, e, eOpts){
        var signature = this.getDigitalSignaturesPanel().getComponent('signature').getValue( );
        var url = APC.APPPLAT_SERVICE_SERVLET_URL_PREFIX + "DigitalSignaturesServlet?signature="
            +signature;
        Ext.Ajax.request({url: url,callback: signatureBack});
    }
});
function signatureBack(options, success, response){
    if (success) {
            var result = new Ext.Element(document.createElement('div'));
            result.update( '<b>'+response.responseText+'</b>');
            var resultCtrl = new CloudClient.controller.DigitalSignaturesController();
            var resultPanel = resultCtrl.getDigitalSignaturesPanel().getComponent("result");
            resultPanel.body.appendChild(result);
            var resultScroll = resultPanel.body.dom;
            resultScroll.scrollTop = resultScroll.scrollHeight - resultScroll.offsetHeight;
    }
}