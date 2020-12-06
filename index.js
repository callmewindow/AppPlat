//vsso域名链接
var vssoHref = 'http://localhost:18080/';
//var vssoHref = 'http://vsso.nssdc.ac.cn/';
var href = window.location.href;

//获取机构链接
$.ajax({
	url: "/webdo/MhsyWebdo/getJglj", //提交的路径
	type: "post",       //提交方式
	data: {
		//向后台提交的数据
	},
	dataType: "JSON",       //规定请求成功后返回的数据
	success: function (data) {
//		alert(JSON.stringify(data));
		//请求成功之后进入该方法，data为成功后返回的数据
		var html = "";
		var morehtml = "";
		for(var i = 0;i<data.dataList.length;i++){
			$("#open_link").empty();
			if(i<6){
				html += "<li><a target='_blank' class='go-to' href='"+data.dataList[i].JGLJNR+"'><div class='jglogo'><img src='../../../Uploaddoc/"+data.dataList[i].TP+"' /> </div></a></li>";
			}else{
				$("#open_link").append('MORE >>');
				morehtml += "<li><a target='_blank' class='go-to' href='"+data.dataList[i].JGLJNR+"'><div class='jglogo'><img src='../../../Uploaddoc/"+data.dataList[i].TP+"' /> </div></a></li>";
				
			}
		}
		$("#jgljtp").append(html);
		$("#jglink_zk").append(morehtml);
		html = '';
		morehtml = '';
	},
	error: function (errorMsg) {
		//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
	}
});
//var pagehref = location.href;
//var str = pagehref.split("/");
//var strname = str.slice(str.length-1, str.length).toString(String).split(".");
//var pagename = strname.slice(0, 1);
//alert(pagename);
//搜索
function searchcom(){
	var ssgjz = $("#ssgjz").val();
	var ssfl = $("#ssfl").val();
//	if(ssfl == '元数据集'){
		var tempwindow=window.open('_blank');
		if(ssgjz == ''||ssgjz == null ){
			tempwindow.location.href = vssoHref + 'page.html#/inSubjectSearch/flbm,'+'1000';
		}else{
			tempwindow.location.href = vssoHref + 'page.html#/inSubjectSearch/gjz,'+ssgjz;
			
			$.ajax({
				url: "/webdo/MhsyWebdo/getSscs", //提交的路径
				type: "post",       //提交方式
				data: {
					//向后台提交的数据
					ssgjz : ssgjz
				},
				dataType: "JSON",       //规定请求成功后返回的数据
				success: function (data) {
					//请求成功之后进入该方法，data为成功后返回的数据
				},
				error: function (errorMsg) {
					//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
				}
			});
		}
		
//	}else if(ssfl == '数据工具'){
//		if(ssgjz == ''||ssgjz == null ){
//			tempwindow.location.href = vssoHref + 'mhsy/html/gongjulist.html';
//		}else{
//			tempwindow.location.href = vssoHref + 'mhsy/html/gongjulist.html?ssgjz='+ssgjz;
//			$.ajax({
//				url: "/webdo/MhsyWebdo/getSscs", //提交的路径
//				type: "post",       //提交方式
//				data: {
//					//向后台提交的数据
//					ssgjz : ssgjz
//				},
//				dataType: "JSON",       //规定请求成功后返回的数据
//				success: function (data) {
//					//请求成功之后进入该方法，data为成功后返回的数据
//				},
//				error: function (errorMsg) {
//					//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
//				}
//			});
//		}
//	}
	
}

//获取重大任务
function selectZdrw(){
	$.ajax({
		url: "/webdo/MhsyWebdo/getZdrw", //提交的路径
		type: "post",       //提交方式
		data: {
			//向后台提交的数据
		},
		dataType: "JSON",       //规定请求成功后返回的数据
		success: function (data) {
			//alert(JSON.stringify(data));
			//请求成功之后进入该方法，data为成功后返回的数据
			var html = "";
			for(var i = 0;i<data.dataList.length;i++){
				html += '<div class="index_left_fourimg"><a href="major.html"><img src="../../../Uploaddoc/"'+data.dataList[i].TP+' />';
				html += '<div class="index_left_text"><p class="index_left_cn">'+data.dataList[i].ZDRW+'</p><p class="index_left_en">'+data.dataList[i].ZDRWYW+'</p></div>';
				html += '</a></div>';
			}
			$("#zdrw1").append(html);
			html = '';
		},
		error: function (errorMsg) {
			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
		}
	});
}
//页面访问量查询
function selectYmfwl(){	
	$.ajax({
		url: "/webdo/MhsyWebdo/getYmfwl", //提交的路径
		type: "post",       //提交方式
		data: {
			//向后台提交的数据
		},
		dataType: "JSON",       //规定请求成功后返回的数据
		success: function (data) {
			//请求成功之后进入该方法，data为成功后返回的数据
			//alert(JSON.stringify(data));
			$("#ymfwl").append(data.dataList[0].YMFWL);
			$("#zjfwl").append(data.dataList[0].ZJFWL);
			$("#sjzyl").append(data.dataList[0].SJZYL);
			$("#sjxzl").append(data.dataList[0].SJXZL);
			$("#jzsj").append("截止："+data.dataList[0].JZSJ);
			$("#zxsjj").append(data.sjjcount);
		},
		error: function (errorMsg) {
			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
		}
	});
}
//总计访问量查询
function selectZjfwl(){
	$.ajax({
		url: "/webdo/MhsyWebdo/getZjfwl", //提交的路径
		type: "post",       //提交方式
		data: {
			//向后台提交的数据
		},
		dataType: "JSON",       //规定请求成功后返回的数据
		success: function (data) {
			//请求成功之后进入该方法，data为成功后返回的数据
			//alert(JSON.stringify(data));
		},
		error: function (errorMsg) {
			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
		}
	});
}
//将时间戳转换成日期
function formatDate(now) { 
	var year=now.getFullYear();  //取得4位数的年份
	var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
	if(month<10){
		month = "0"+month;
	}
	var date=now.getDate();      //返回日期月份中的天数（1到31）
	if(date<10){
		date = "0"+date;
	}
	//return year+"-"+month+"-"+date; 
	return month+"-"+date; 
}

//登录状态
var dlzt = '';
var yh = '';
var yhmid = '';
var loginFlag='';
//通过token获取登录者的用户名
function yhdl(){
	$.ajax({
		url: "/webdo/MhsyWebdo/getToken", //提交的路径
		type: "post",       //提交方式
		async:false,
		data: {
			//向后台提交的数据
		},
		dataType: "JSON",       //规定请求成功后返回的数据
		success: function (data) {
			//请求成功之后进入该方法，data为成功后返回的数据
			//alert(JSON.stringify(data));
			dlzt = data.status;
			yh = data.yonghu;
			loginFlag = data.loginFlag;
			if(data.YHZT=='正常'){
        		$("#htgl").css("display","");
        	}else if(data.YHZT=='待申请'){
        		$("#htgl").css("display","none");
        		
        	}
			if(dlzt == 1){
				yhmid = data.userid;
				var html = '';
				html = '<img src="../img/photo.png" /><div>'+data.yonghuming+'</div>';
				$("#yhm").append(html);
				$("#dlmc").html(data.yonghuming);
				$("#wdl").css("display","none");
				$("#ydl").css("display","");
			}else if(dlzt == 0){
				//$("#zx").css("display","none");
				$("#ydl").css("display","none");
				$("#wdl").css("display","");
				
			}
			
		},
		error: function (errorMsg) {
			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
		}
	});
}
//前端网页跳转
function qdtz(){
	if(dlzt == 0){
		var ym = window.location.host;
		window.location.href = 'https://umt.nssdc.ac.cn/login?service=http://'+ym+'/logindo';
    	var url = window.location.href;
    	$.ajax({
    		url: "/webdo/MhsyWebdo/qdtz", //提交的路径
    		type: "post",       //提交方式
    		async:false,
    		data: {
    			//向后台提交的数据
    			url : url
    		},
    		dataType: "JSON",       //规定请求成功后返回的数据
    		success: function (data) {
    			//请求成功之后进入该方法，data为成功后返回的数据
    			
    		},
    		error: function (errorMsg) {
    			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
    		}
    	});
	}else{
		window.location.href = '../../../mhsy/html/index.html#';
	}
}

//我的访问  （需要用户在登录状态下查看）
function wdfw(){
	if(dlzt == 0){
		qdtz();
		var ym = window.location.host;
		window.location.href = 'https://umt.nssdc.ac.cn/login?service=http://'+ym+'/logindo';
	}else{
		var ym = window.location.host;
		window.location.href = 'http://'+ym+'/mhsy/html/visit_mydata.html';
		//window.location.href = '../html/visit_info.html';
	}
}
//vsso我的访问  （需要用户在登录状态下查看）
function vssowdfw(){
	if(dlzt == 0){
		qdtz();
		var ym = window.location.host;
		window.location.href = 'https://umt.nssdc.ac.cn/login?service=http://'+ym+'/logindo';
	}else{
		var tempwindow=window.open('_blank');
		var ym = window.location.host;
		tempwindow.location.href = 'http://'+ym+'/mhsy/html/visit_mydata.html';
		//window.location.href = '../html/visit_info.html';
	}
}
//意见建议 （需要用户在登录状态下查看）
function yjjy(){
	if(dlzt == 0){
		qdtz();
		var ym = window.location.host;
		window.location.href = 'https://umt.nssdc.ac.cn/login?service=http://'+ym+'/logindo';
	}else{
		//window.location.href = '../html/visit_mydata.html';
		window.location.href = '../html/visit_info.html';
	}
}
//移除用户
function tc(){
	$.ajax({
		url: "/webdo/MhsyWebdo/remove", //提交的路径
		type: "post",       //提交方式
		async:false,
		data: {
			//向后台提交的数据
		},
		dataType: "JSON",       //规定请求成功后返回的数据
		success: function (data) {
			//请求成功之后进入该方法，data为成功后返回的数据
			//alert(JSON.stringify(data));
		},
		error: function (errorMsg) {
			//请求失败之后进入该方法，errorMsg为失败后返回的错误信息
		}
	});
}
//注销
function zx(){
	var _that = this;
	tc();
	logoutCas(href, loginFlag);
}
//管理后台
function glht(){
	var ym = window.location.host;
	window.location.href='http://'+ym+'/page.html#/htgl';
//	window.location.href='http://www.nssdc.ac.cn/page.html#/htgl';
}
//数据政策
function sjzc(){
	alert("资源正在建设中......");
}

/**
 * 注销cas
 * @param url 客户端的注销回调函数 http://xxxxxx
 * @param loginFlag 客户端通过接口获取的登录标识 loginFlag
 */
function logoutCas(url, loginFlag) {
    jQuery.ajax({
        url: "https://umt.nssdc.ac.cn/logoutClient.do?loginFlag=" + loginFlag,
        async: true,
        type: "get",
        dataType: 'JSONP',
        jsonp: "callback",
        jsonpCallback: "jsonpCallback",
        success: function (data) {
            if (data && data != "") {//第三方登录进来
                window.top.location.href = data + url;//注销：第三方、cas、客户端
            } else {//非第三方登录进来
                window.top.location.href = "https://umt.nssdc.ac.cn/logout?service=" + url;//注销：cas、客户端
            }
        }
    });
}
