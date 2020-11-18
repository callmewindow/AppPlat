/**
 * Created by Administrator on 2014/5/7.
 */

var loginName="admin";
//Ext.onReady(function(){
//    getMsg();
//});
Ext.define('AppPlat.view.Accessibility.ChatWindow',{
    extend: 'Ext.window.Window',
    alias: 'widget.chatwindow',
    require:[
        'Ext.tab.*',
        'Ext.window.*',
        'Ext.tip.*',
        'Ext.layout.container.Border',
        'AppPlat.view.Accessibility.DiscussionGroupGridPanel'
    ],
    title: '群组聊天',
    renderTo:document.body,
    header: {
        titlePosition: 2,
        titleAlign: 'center'
    },
    //id: 'chatwindow',
    closable: false,
    closeAction: 'hide',
    width: 800,
    minWidth: 350,
    height: 500,
    tools: [{type: 'pin'}],
    layout: {
        type: 'border',
        padding: 5
    },
    iconCls :'my-userCommentIcon',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'discussiongroupgridpanel',
                    region: 'west',
                    title: '用户列表',
                    width: 130,
                    split: true,
                    collapsible: true,
                    floatable: false
                },
                {
                    region: 'center',
                    layout: 'border',
                    items: [
                        {
                            region: 'center',
                            title:'聊天记录  ',
                            layout: 'fit',
                            //itemId:'history_panel',
                            id: 'history_panel',
                            autoScroll:true,
                            iconCls :'my-userCommentIcon',
                            tools:[{
                                itemId: 'refresh',
                                qtip: '注意如果时间长没收到对方回应，试一下',
                                handler:function(event,toolEl,panel){

                                }
                            }]
                        }, {
                            region: 'south',
                            title: '聊天',
                            layout: 'fit',
                            iconCls: 'user_edit',
                            autoScroll:true,
                            //collapsible: true,
                            items:{
                                xtype:'form',
                                baseCls: 'x-plain',
                                autoHeight:true,
                                autoWidth:true,
                                bodyStyle: 'padding:10 10px 0;',
                                defaults: {
                                    anchor: '95%'
                                },
                                items:[

                                    {
                                        xtype: 'htmleditor',
                                        height:130,
                                        itemId: 'chathtmleditor',
                                        id: 'htmleditor',
                                        hideLabel :true
                                    }
                                ]
                            }
                            ,bbar :[{
                                text:'发送',//请输入Ctrl-Enter
                                itemId: 'sendButton',
                                handler:function() {
                                    sendmsg();
                                },
                                iconCls:'my-sendingIcon'
                            }

                                ,'-',{
                                    text:'清除',
                                    handler:function() {
                                        login();
                                        //Ext.getCmp("htmleditor").reset();
                                        // Ext.getComponent("htmleditor").reset();
                                        //Ext.getElementById("chathtmleditor").reset;
                                    }
                                }
//                                ,'-',{
//                                    text:'登陆',
//                                    handler:function() {
//                                        login();
//                                        // getMsg();
//                                    }
//                                }
                            ]
                        }
//                            {
//                            xtype: 'button',
//                            region: 'south',
//                            itemId: 'sendBtn',
//                            text: '发送'
//                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});




function login(){
    var userName = Ext.getCmp("htmleditor").getValue();
    var pars = {
        "userName":userName,
        "password": userName
    }
    var conn = new Ext.data.Connection();
    conn.request({
        url: '/ChatIM/servlet/LoginServlet',
        method: 'post',
        params: pars,
        callback: listener
    });
}
function listener(options, success, response){
    if (success) {
        try {
            var jsonObj = Ext.decode(response.responseText);// Ext.util.JSON.decode(response.responseText);
        } catch(e) {alert(e.getMessage)}
        if (jsonObj) {
            var cur = jsonObj.cur;
            if (cur && jsonObj.success) {
                getMsg();
            }
            Ext.getCmp("htmleditor").reset();
        } else if (response.responseText.trim())
            alert(response.responseText);
    } else {
        if (response.responseText.trim())
            alert(response.responseText);
    }
}


function getMsg(){
    Ext.Ajax.request({url: '/ChatIM/servlet/ReceiveMessageServlet',timeout: 180000, callback: msgget});
}
function msgget(options, success, response) {
    // requestCount--;
    if (success) {
        try {
            var jsonObj = Ext.decode(response.responseText);// Ext.util.JSON.decode(response.responseText);
        } catch(e) {alert(e.getMessage);}
        if (jsonObj && jsonObj.success) {
            var cur = jsonObj.cur;
            if (cur) {
                //显示聊天记录 style="margin:20px 5px 10px 5px"
                var msg = '<img src="../../libs/ext/shared/icons/fam/user.png"/> {0} <b>{1}</b>  说：<br>';
                var mc = Ext.String.format(msg, cur.time, cur.username);
                var chat_record = new Ext.Element(document.createElement('div'));
                chat_record.update( mc+ cur.content+'<br>' );//style="margin:0px 5px 0px 5px"
                Ext.getCmp("history_panel").body.appendChild(chat_record);
                var messageScroll = Ext.getCmp("history_panel").body.dom;
                messageScroll.scrollTop = messageScroll.scrollHeight - messageScroll.offsetHeight;
//                var canvas = new Ext.Element(document.createElement('canvas'));
//                var size_chat = chat_record.getSize();
//                if (!Ext.isIE && size_chat.height < 100) {
//                    chat_record.setHeight(30);
//                    size_chat.height = 30;
//                }
//                canvas.setSize(size_chat.width - 30, size_chat.height);
//                canvas.setSize(size_chat.width-40);
//                chat_record.appendChild(canvas);
//                var mc = Ext.String.format(msg, cur.time, cur.username);
//                Ext.getCmp("history_panel").body.insertHtml('beforeEnd', mc);
//                Ext.getCmp("history_panel").body.scroll('b', 10000, {
//                    duration: 0.1
//                });
                getMsg();
            }
            Ext.getCmp("htmleditor").reset();
        } else if (response.responseText.trim())
            alert(response.responseText);
    } else {
        if (response.responseText.trim())
            alert(response.responseText);
    }
}
function sendmsg() {
    Ext.getCmp("htmleditor").syncValue();
    var content_value = Ext.getCmp("htmleditor").getValue();
    if (content_value.trim() == '') {
        alert("您没有输入消息文本内容！");
        Ext.getCmp("htmleditor").focus(true);
        return;
    }
    var groupName = "gc";
    var nickname_value = 'forget';
    var pars = {
        "content": content_value,
        "groupName": groupName,
        "loginName":  loginName
        // "nickname":'forget'
    };
    var conn = new Ext.data.Connection();
    // 发送异步请求
    conn.request({
        // 请求地址
        url: '/ChatIM/servlet/ChatServlet',
        method: 'post',
        params: pars,
        // 指定回调函数
        callback: msgsent
    });
}
function msgsent(options, success, response){
    if (success) {
        try {
            var jsonObj = Ext.decode(response.responseText);// Ext.util.JSON.decode(response.responseText);
        } catch(e) {alert(e.getMessage)}
        if (jsonObj && jsonObj.success) {
            var cur = jsonObj.cur;
            var sessions = [];
            if (cur) {
                //显示聊天记录 style="margin:20px 5px 10px 5px"
                var msg = '   <img src="../../libs/ext/shared/icons/fam/user.png"/> {0} <b>{1}</b>  说：<br> ';
                var mc = Ext.String.format(msg, cur.time, cur.username);
                var chat_record = new Ext.Element(document.createElement('div'));
                chat_record.update(mc+cur.content+'<br>' );//style="margin:0px 5px 0px 5px"
                Ext.getCmp("history_panel").body.appendChild(chat_record);
                var messageScroll = Ext.getCmp("history_panel").body.dom;
                messageScroll.scrollTop = messageScroll.scrollHeight - messageScroll.offsetHeight;
//                var canvas = new Ext.Element(document.createElement('canvas'));
//                var size_chat = chat_record.getSize();
//                if (!Ext.isIE && size_chat.height < 100) {
//                    chat_record.setHeight(100);
//                    size_chat.height = 100;
//                }
//                canvas.setSize(size_chat.width - 30, size_chat.height);
//                canvas.setSize(size_chat.width-40);
//                chat_record.appendChild(canvas);
//                var mc = Ext.String.format(msg, cur.time, loginName);
//                Ext.getCmp("history_panel").body.insertHtml('beforeEnd', mc);
//                Ext.getCmp("history_panel").body.scroll('b', 10000, {
//                    duration: 0.1
//                });
            }
            Ext.getCmp("htmleditor").reset();
        } else if (response.responseText.trim())
            alert(response.responseText);
    } else {
        if (response.responseText.trim())
            alert(response.responseText);
    }
}




////event for source editing mode
//new Ext.KeyMap(Ext.getCmp("htmleditor").getEl(), [{
//    key: 13,
//    ctrl: true,
//    stopEvent: true,
//    fn: sendmsg
//}]);
////event for normal mode
//Ext.getCmp("htmleditor").onEditorEvent = function (e) {
//    this.updateToolbar();
//    var keyCode = (document.layers) ? keyStroke.which : e.keyCode;
//    if (keyCode == 13 && e.ctrlKey) sendmsg(); //it'a my handler
//}
//var requestCount = 0;
//function getMsgs() {
//    var conn = new Ext.data.Connection({
//        timeout: 24 * 3600 * 1000
//    });
//    // 发送异步请求
//    conn.request({
//        // 请求地址
//        url: 'chat/updateChatLong.jsp',
//        method: 'post',
//        // 指定回调函数
//        callback: getMsgsCallback
//    });
//}
//function getUsers() {
//    var conn = new Ext.data.Connection({
//        timeout: 24 * 3600 * 1000
//    });
//    // 发送异步请求
//    conn.request({
//        // 请求地址
//        url: 'chat/getUserLong.jsp',
//        method: 'post',
//        // 指定回调函数
//        callback: getUserLongCallback
//    });
//}
//function getUserLongCallback(options, success, response) {
//    if (success) {
//        try {
//            var jsonObj = Ext.util.JSON.decode(response.responseText);
//        } catch(e) {}
//        if (jsonObj) {
//            //不是退出时notify
//            if (jsonObj.nodes) {
//                imRootNode.reload();
//                getUsers();
//            }
//        }
//    } else {
//        if (response.responseText.trim()) alert(response.responseText);
//    }
//}
////回调函数
//
//
//function getMsgsCallback(options, success, response) {
//    if (success) {
//        try {
//            var jsonObj = Ext.util.JSON.decode(response.responseText);
//        } catch(e) {}
//        if (jsonObj) {
//            var msgs = jsonObj.msgs;
//            var msg = '<div style="margin:20px 5px 10px 5px">   <img src="js/ext/user_comment.png"/> {0} <b>{1}</b> 对 <b>{2}</b> 说：<br> </div>';
//            var sessions = [];
//            var c = imRootNode.childNodes;
//            for (var i = 0; i < c.length; i++) {
//                sessions[c[i].attributes.sessionId] = c[i].attributes;
//            }
//            if (msgs) {
//                for (var i = 0; i < msgs.length; i++) {
//                    var a = [];
//                    for (var j = 0; j < msgs[i].receivers.length; j++) {
//                        a.push(sessions[msgs[i].receivers[j]].loginName);
//                    }
//                    var chat_record = new Ext.Element(document.createElement('div'));
//                    chat_record.addClass('chat_record');
//                    chat_record.update('<span style="margin:0px 5px 0px 5px">' + msgs[i].content + '</span>');
//                    Ext.getCmp("history_panel").body.appendChild(chat_record);
//                    var canvas = new Ext.Element(document.createElement('canvas'));
//                    var size_chat = chat_record.getSize();
//                    if (!Ext.isIE && size_chat.height < 100) {
//                        chat_record.setHeight(100);
//                        size_chat.height = 100;
//                    }
//                    canvas.setSize(size_chat.width - 10, size_chat.height);
//                    //canvas.setSize(size_chat.width-,40);
//                    chat_record.appendChild(canvas);
//                    if (window['G_vmlCanvasManager']) {
//                        G_vmlCanvasManager.initElement(canvas.dom);
//                    }
//                    draw_m(chat_record.dom.lastChild, '#FFB100');
//                    var mc = String.format(msg, msgs[i].time, sessions[msgs[i].sender].loginName, a);
//                    Ext.getCmp("history_panel").body.insertHtml('beforeEnd', mc);
//                    Ext.getCmp("history_panel").body.scroll('b', 10000, {
//                        duration: 0.1
//                    });
//                }
//                if (!chatWin.isVisible()) {
//                    self.focus();
//                    Ext.example.msg('叮当', '您有新的短消息     <a href="javascript:window.startChatWin()">查看</a>');
//                }
//                getMsgs();
//            }
//        } else if (response.responseText.trim()) alert(response.responseText);
//    } else {
//        if (response.responseText.trim()) alert(response.responseText);
//    }
//}
////chatWin.show();
////chatWin.setSize(0,0);
////chatWin.hide();
//if (!Ext.isIE) {
//    chatWin.collapse();
//}
///*
// var chatTask = {
// run:reloadUser,
// //scope:this,
// interval: 5000 //1 second
// };
// time_pro = new Ext.util.TaskRunner();
// time_pro.start(chatTask);
// */
////长连接方式
//getMsgs();
////长连接方式
//getUsers();
////chatWin.hide();
//window.startChatWin = function () {
//    chatWin.show();
//    chatWin.center();
//    //Ext.getCmp('htmleditor').focus();
//};
//function draw_m(canvas, color) {
//    var context = canvas.getContext("2d");
//    var width = canvas.width;
//    var height2 = canvas.height - 4.5;
//    var height = canvas.height;
//    context.beginPath();
//    context.strokeStyle = color;
//    context.moveTo(0.5, 0.5 + 5);
//    context.arc(5.5, 5.5, 5, -Math.PI, -Math.PI / 2, false);
//    context.lineTo(width - 0.5 - 5, 0.5);
//    context.arc(width - 0.5 - 5, 5.5, 5, -Math.PI / 2, 0, false);
//    context.lineTo(width - 0.5, height2 - 5);
//    context.arc(width - 0.5 - 5, height2 - 5, 5, 0, Math.PI / 2, false);
//    context.lineTo(width / 2 + 3, height2);
//    context.lineTo(width / 2, height);
//    context.lineTo(width / 2 - 3, height2);
//    context.lineTo(0.5 + 5, height2);
//    context.arc(0.5 + 5, height2 - 5, 5, Math.PI / 2, Math.PI, false);
//    context.lineTo(0.5, 0.5 + 5);
//    context.stroke();
//}