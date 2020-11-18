/**
 * Created by Administrator on 2014/4/30.
 */

var windo=null;
Ext.define('AppPlat.controller.Accessibility.ChatController', {
    extend: 'Ext.app.Controller',
    views:[
        'Accessibility.ChatMessagePanel',
        "Accessibility.ChatWindow"
    ],
    refs: [
        {
            ref: 'chatMessagePanel',
            selector: 'chatmessagepanel'
        },
        {
            ref: 'chatWindow',
            selector: 'chatwindow'
        }
    ],
    require:[
        'Ext.tab.*',
        'Ext.window.*',
        'Ext.tip.*',
        'Ext.layout.container.Border'

    ],
    init: function(application) {
        this.control({
            "#chatBtn": {
                click: 'onChatClick'//this.onChatClick
            },
            "#sendBtn":{
                click: 'onSendClick'
            }
//            "sendButton":{
//                click: 'onSendClick'
//            }
        });

    },
    onLaunch:function(application){

    },
    onChatClick: function(button, e, eOpts) {

        var win;
        if (!windo) {
            win = Ext.create('AppPlat.view.Accessibility.ChatWindow');
            windo=Ext.get(win.id);
            win.show(this, function() {});
        }
        else if(!windo.isVisible()){
            win=windo;
            win.show(this, function() {});
        }
      else{
           win=windo;
           win.hide(this,function(){});
          // win.destroy(this,function(){});
         // windo=null;
        }


//        if (win.isVisible()) {
//            win.hide(this, function() {
//                buttons.dom.disabled=false;
//            });
//        } else {
//            win.show(this, function() {
//                buttons.dom.disabled=false;
//            });
//        }

    },
    onSendClick: function(button, e, eOpts){alert("sdfsd");
       // Ext.MessageBox.alert('Information',  '开始发送');
       // Ext.MessageBox.alert('Information',  document.getElementById('message').value);
        //var div = document.createElement('div');
//        var div = document.getElementById('chatMessage');
//        div.innerHTML = document.getElementById('message').value;
//        document.body.appendChild(div);

    }
});

