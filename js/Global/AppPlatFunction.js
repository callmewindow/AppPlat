/**
 * Created by winter on 2015/3/9.
 */
/**
 * Created by winter on 2014/5/5.
 */
APF = {
    //按照YYYY-MM-DD HH24:MI:SS格式输出时间
    getNowTime:function(){
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1;  //月
    var day = now.getDate(); //日
    var hh = now.getHours();//时
    var mm = now.getMinutes();//分
    var ss = now.getSeconds();//妙
    var time = year;
    if(month < 10){
        time += '-0' + month;
    }else{
        time += '-' + month;
    }
    if(day < 10){
        time += '-0' + day;
    }else{
        time += '-' + day;
    }
    if(hh < 10){
        time += ' 0' + hh;
    }else{
        time += ' ' + hh;
    }
    if(mm < 10){
        time += ':0' + mm;
    }else{
        time += ':' + mm;
    }
    if(ss < 10){
        time += ':0' + ss;
    }else{
        time += ':' + ss;
    }
    return time;
}

};
