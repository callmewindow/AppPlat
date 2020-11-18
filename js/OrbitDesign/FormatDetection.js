/**
 * Created by Administrator on 2014/10/14.
 */
var FormatDetection = function(){

};
FormatDetection.prototype = {
    detectionOrbitPara: function(value, minValue, maxValue){
        if(value < minValue || value > maxValue){
            return false;
        }
        else{
            return true;
        }
    },
    detectionIsNumber: function(num){
//        num = num + "";
//        var flag = true;
//        if(num)
//        for(var i = 0; i < num.length; i++){
//            if(num[i] == '-' || num[i] < '0' && num[i] ){
//
//            }
//        }
//        return flag;
        if(!(/^\d*$/.test(num))){
            return false;
        }
        return true;
    },
    //新建场景文件时各参数的不合法信息
    orbitFileErrInfo: {
        'orbitName':null,
        'simuTime': null,
        'step': null
    },
    //新建卫星时各轨道参数的不合法信息
    orbitErrInfo: {
        'satelliteFileName': null,
        'simuTime': null,
        'a': null,
        'e': null,
        'i': null,
        'Om': null,
        'om': null,
        'theta': null
    },
    //新建卫星时各姿态参数的不合法信息
    attitudeErrInfo:{
        "driftAnglenfield" : null,
        "rollAnglenfield": null,
        "pitchAnglenfield": null,
        "azimuthalAnglenfield": null,
        "elevationAnglenfield": null,
        "spinSpeednfield": null
    },
    //修改场景各参数的不合法信息
    sceneErrInfo: {
        'simuTime': null,
        'step': null
    },
    sleep: function(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }
};