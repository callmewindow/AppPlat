/**
 * Created by dell on 2015/1/27.
 */
var Orbit = function(){
};
Orbit.getPlanetPosition = function(pname, overTime){
    var position ;
    switch(pname){
        case "mercury":
            position = mercury(overTime);
            break;
        case "venus":
            position = venus(overTime);
            break;
        case "earth":
            position = earth(overTime);
            break;
        case "mars":
            position = mars(overTime);
            break;
        case "jupiter":
            position = jupiter(overTime);
            break;
        case "saturn":
            position = saturn(overTime);
            break;
        case "uranus":
            position = uranus(overTime);
            break;
        case "neptune":
            position = neptune(overTime);
            break;
        case "moon":
            var moonPositin = moon(overTime);
            var earthPosition = earth(overTime);
            position = new Array(3);
            position[0] = moonPositin[0] + earthPosition[0];
            position[1] = moonPositin[1] + earthPosition[1];
            position[2] = moonPositin[2] + earthPosition[2];
            break;
        case "sun":
            position = new Array(3);
            position[0] = 0;
            position[1] = 0;
            position[2] = 0;
            break;
    }
    return position;
};