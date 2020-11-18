/**
 * Created by winter on 2014/6/25.
 */


var ColArguTreeUtil = function(){

}

ColArguTreeUtil.prototype = {
    /**
     * Adds an empty list to the lists store and starts editing the new list
     * @param {String} the type of the treeNode.
     */
    //显示:当前日期加时间(如:200906121200)
    curentTime: function () {
        var now = new Date();
        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1;  //月
        var day = now.getDate(); //日
        var hh = now.getHours();//时
        var mm = now.getMinutes();//分
        var ss = now.getSeconds();//妙
        var clock = year;
        if (month < 10)
            clock += "0";
        clock += month;
        if (day < 10)
            clock += "0";
        clock += day;
        if (hh < 10)
            clock += "0";
        clock += hh;
        if (mm < 10) clock += '0';
        clock += mm;
        if (ss < 10) clock += '0';
        clock += ss;
        return(clock);
    },
    typeE2C: function (typeEH) {
        if (typeEH == APC.NODETYPE_SOLUTION) {
            return APC.NODETYPE_SOLUTION_CH;
        }
        else if (typeEH == APC.NODETYPE_SATELLITE) {
            return APC.NODETYPE_SATELLITE_CH;
        }
        else if (typeEH == APC.NODETYPE_GROUNDSTATION) {
            return APC.NODETYPE_GROUNDSTATION_CH;
        }
        else if (typeEH == APC.NODETYPE_SENSOR) {
            return APC.NODETYPE_SENSOR_CH;
        }else if (typeEH == APC.NODETYPE_COVER_ANALYSIS) {
            return APC.NODETYPE_COVER_ANALYSIS_CH;
        }else if (typeEH == APC.NODETYPE_DATATRANS_ANALYSIS) {
            return APC.NODETYPE_DATATRANS_ANALYSIS_CH;
        }else if (typeEH == APC.NODETYPE_STRUCTURE) {
            return APC.NODETYPE_STRUCTURE_CH;
        }else if (typeEH == APC.NODETYPE_OVERSTATION_ANALYSIS) {
            return APC.NODETYPE_OVERSTATION_ANALYSIS_CH;
        }else if (typeEH == APC.NODETYPE_CHAIN_ANALYSIS) {
            return APC.NODETYPE_CHAIN_ANALYSIS_CH;
        }else if (typeEH == APC.NODETYPE_ATTITUDEDATA) {
            return APC.NODETYPE_ATTITUDE_DATA_CH;
        }else if (typeEH == APC.NODETYPE_ORBITDATA) {
            return APC.NODETYPE_ORBIT_DATA_CH;
        }
    }

}