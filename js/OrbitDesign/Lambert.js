/**
 * Created by dell on 2015/1/23.
 */
var Lambert = function(){
};
Lambert.prototype = {
    //获取卫星转移轨道时的起始速度和到达速度
    //接收卫星的起始位置、到达位置和飞行所需的时间
    getSatTransferVelocity: function(startPosition, endPosition, fTime){
        var velocity;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "OrbitFileManage/getSatTransferVelocity.json",
            method: "GET",
            async: false,
            params: {
                R1:[
                    startPosition.x,
                    startPosition.y,
                    startPosition.z
                ],
                R2:[
                    endPosition.x,
                    endPosition.y,
                    endPosition.z
                ],
                FTIME: fTime
            },
            success: function(response){
                var data = JSON.parse(response.responseText);
                var info;
                info = data["INFO"];
                if(info == 0){
                    velocity = new Array(2);
                    velocity[0] = new THREE.Vector3();
                    velocity[1] = new THREE.Vector3();

                    velocity[0].x = data["V1"][0]["x"];
                    velocity[0].y = data["V1"][0]["y"];
                    velocity[0].z = data["V1"][0]["z"];

                    velocity[1].x = data["V2"][0]["x"];
                    velocity[1].y = data["V2"][0]["y"];
                    velocity[1].z = data["V2"][0]["z"];
                }
                else{
                    velocity = null;
                }
            }
        });
        return velocity;
    }
};