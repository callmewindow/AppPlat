/**
 * Created by acm-windows on 2014/7/19.
 */
var isLeapYear = function(x)
{
    var ret=false;
    if(x%4 == 0)
    {
        if(x%100 == 0)
        {
            if(x%400 == 0)
                ret=true;
            else
                ret=false;
        }
        else
            ret=true;
    }
    return ret;
};

var calculateEndDate = function(day, month, year, n){
    var daymax = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    n++;
    var temp;
    if(isLeapYear(year))
        temp = 366;
    else
        temp = 365;
    while(n > temp)
    {
        n -= temp;
        year++;
        if(isLeapYear(year))
            temp = 366;
        else
            temp = 365;
    }
    if(isLeapYear(year))
    {
        daymax[1]=29;
        while(n>daymax[month-1])
        {
            n-=daymax[month-1];
            month++;
        }
        daymax[1]=28;
    }
    else
    {
        while(n>daymax[month-1])
        {
            n-=daymax[month-1];
            month++;
        }
    }
    day=n;
    var endDate = new Date();
    endDate.setFullYear(year,month-1,day);
    return endDate;
};
var calculateStartDate = function(date, n){
    var endTime = date.getTime();
    var overTime = n * 24 * 3600000;
    var startDate = new Date(endTime - overTime);
    return startDate;
};
//计算一个时期加了若干秒后的日期
var calculateEndTime = function(time, n){
    var sTime = time.getTime();
    var eTime = sTime + n.toFixed(0) * 1000;
    return new Date(eTime);
};