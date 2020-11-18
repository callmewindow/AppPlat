/**
 * Created by Taivas on 5/14/14.
 */
//Class: Planet
ORBIT.Planet = function(planetname, rad, cent, dist, t_revolution, t_rotation, dip_equa, initrevol, initrota){
    this.textfilename = '../../resources/images/planettexture/' + planetname + 'map.jpg';
    this.radius = rad;
    this.centerid = cent;
    this.distance = dist;
    this.t_revol = t_revolution;
    this.t_rota = t_rotation;
    this.tilt = dip_equa/90*Math.PI/2;
    this.revol_init = initrevol/90*Math.PI/2;
    this.rota_init = initrota/90*Math.PI/2;
    this.object = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.radius, this.radius),
        new THREE.MeshLambertMaterial({map: new THREE.ImageUtils.loadTexture(this.textfilename, null, function(object){
            ORBIT.renderer.clear();
            ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
        })}));
//    this.object = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.radius, this.radius),
//        new THREE.MeshLambertMaterial({color:0x000000}));
    this.object.name = planetname;
    this.object.id = planetname;
    this.axis_ecliptic = new ORBIT.CoorAxes(this, 'e');
    this.axis_inertial = new ORBIT.CoorAxes(this, 'i');
    this.axis_fixed = new ORBIT.CoorAxes(this, 'f');
    this.axis_attitude = new ORBIT.CoorAxes(this, 'a');

    this.isInitIAxis = false;
    this.rotaLock = false;
    this.j2000MatrixNI = null;
    this.fixedNI = null;
    this.GSMNI = null;

    this.j2000NINow = null;
    this.fixedNINow = null;
    this.GSMNINow = null;

    this.j2000Matrix = null;
    this.fixed = null;
    this.GSM = null;

    this.position = null;
    this.isInit = false;
//    this.initRadBelt(this.object, this.object.name);
    this.traceObject = new THREE.Object3D();
    this.sunWind = new THREE.Object3D();
    this.initTrace(this.traceObject, this.object.name);
};
ORBIT.Planet.prototype.initPlanet = function(planetname){
    this.object.geometry.uvsNeedsUpdate = true;
    this.object.material.needsUpdate = true;
    this.object.material.map = new THREE.ImageUtils.loadTexture(this.textfilename, null, function(object){
        ORBIT.renderer.clear();
        ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
    });
//    this.object.name = planetname;
//    this.object.id = planetname;
    this.isInit = true;
//    this.initRadBelt(this.object, this.object.name);
};
//获取行星的辐射带数据
ORBIT.Planet.prototype.initRadBelt = function(planet, pid){
    switch(pid){
        case "mercury":break;
        case "venus":break;
        case "earth":
            var longitude = new Array(73);//经度值
            var latitude = new Array(141);//纬度值
            var high = new Array(100);//高度值
            var energy = new Array(100);//能量值
            for(var i = 0; i < 100; i++){
                energy[i] = new Array(141);
                for(var j = 0; j < 141; j++){
                    energy[i][j] = new Array(73);
                }
            }
            Ext.Ajax.request({
                url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getRadBeltPoint.json",
                method:'GET',
//                async:false,
                success: function(response){
                    var data = JSON.parse(response.responseText);
                    longitude = data['longitude'];
                    latitude = data['latitude'];
                    high = data['high'];
                    Ext.Ajax.request({
                        url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getRadBeltData.json",
                        method:'GET',
//                        async:false,
                        params:{
                            degree:2
                        },
                        success: function(response){
                            energy = JSON.parse(response.responseText);
                            //用散点描绘一个截面上的点；把同一颜色的点连成一个封闭的环，形成一个等值线，由绿到红电子通量增大
                            var gemory = new Array(5);
                            for(var i = 0; i < 5; i++){
                                gemory[i] = new THREE.Geometry();
                            }
                            for(var i = 0; i < 100; i++) {
                                for (var j = 0; j < 141; j++) {
                                    for(var k = 0; k < 1; k++){
                                        var point, energyDegree;
                                        if(i % 2 == 0){
                                            point = calculatePoint(longitude[k], latitude[j], high[i]);
                                            energyDegree = judgeEnergyColor(energy[i][j][k]);
                                        }
                                        else{
                                            point = calculatePoint(longitude[k], latitude[140 - j], high[i]);
                                            energyDegree = judgeEnergyColor(energy[i][140 - j][k]);
                                        }
                                        if(energyDegree != null){
                                            gemory[energyDegree].vertices.push(point);
                                        }
                                    }
                                }
                            }
                            var line = new Array(5);
                            line[0] = new THREE.Line(gemory[0], new THREE.MeshBasicMaterial({color: 0x00ff00}));
                            line[1] = new THREE.Line(gemory[1], new THREE.MeshBasicMaterial({color: 0x7fff00}));
                            line[2] = new THREE.Line(gemory[2], new THREE.MeshBasicMaterial({color: 0xffff00}));
                            line[3] = new THREE.Line(gemory[3], new THREE.MeshBasicMaterial({color: 0xff7f00}));
                            line[4] = new THREE.Line(gemory[4], new THREE.MeshBasicMaterial({color: 0xff0000}));
                            for(var i = 0; i < 5; i++) {
                                planet.add(line[i]);
                            }
                            refreshCamera();
                        }
                    });
                }
            });
            break;
        case "mars":break;
        case "jupiter":break;
        case "saturn":break;
        case "uranus":break;
        case "neptune":break;
        case "moon":break;
    }
};
//根据行星计算相邻行星
ORBIT.Planet.getDefaultPlanet = function(pid){
    switch(pid){
        case "mercury":return "venus";
        case "venus":return "mercury";
        case "earth":return "venus";
        case "mars":return "earth";
        case "jupiter":return "mars";
        case "saturn":return "jupiter";
        case "uranus":return "saturn";
        case "neptune":return "uranus";
        case "moon":return "earth";
    }
};
//将行星英文转换成中文
ORBIT.Planet.toChinese = function(pid){
    switch(pid){
        case "sun":return "太阳";
        case "mercury":return "水星";
        case "venus":return "金星";
        case "earth":return "地球";
        case "mars":return "火星";
        case "jupiter":return "木星";
        case "saturn":return "土星";
        case "uranus":return "天王星";
        case "neptune":return "海王星";
        case "moon":return "月球";
    }
};
//将行星中文转换成英文
ORBIT.Planet.toEnglish = function(pid){
    switch(pid){
        case "太阳":return "sun";
        case "水星":return "mercury";
        case "金星":return "venus";
        case "地球":return "earth";
        case "火星":return "mars";
        case "木星":return "jupiter";
        case "土星":return "saturn";
        case "天王星":return "uranus";
        case "海王星":return "neptune";
        case "月球":return "moon";
    }
};
var judgeEnergyColor = function(energy){
    if(energy < 600000){
        return null;
    }
    else if(energy >= 600000 && energy < 800000){
        return 0;
    }
    else if(energy >= 800000 && energy < 1200000){
        return 1;
    }
    else if(energy >= 1200000 && energy < 1800000){
        return 2;
    }
    else if(energy >= 1800000 && energy < 2500000){
        return 3;
    }
    else{
        return 4;
    }
};
//根据经度，纬度和高度确定太阳系中的一点
var calculatePoint = function(longitude, latitude, high){
    var point = new THREE.Vector3(63.78 * (1 + high), 0, 0);
    var matrix4 = new THREE.Matrix4();
    point.applyMatrix4(matrix4.makeRotationAxis(new THREE.Vector3(0, 0, 1), latitude));
    point.applyMatrix4(matrix4.makeRotationAxis(new THREE.Vector3(0, 1, 0), longitude));
    return point;
};

//xpzsoft
//获取行星的磁力线数据
//var track_colors = [0x0000ff,0x000f0f,0x000ff0,0x00ff00,0x0ff000,0xff0000,0x00f00f,0xf0000f,0x00f0f0,0x0f00f0,0xf00f00,0xf0f000];
//var track_colors = [0xdeeb23,0xf22c30,0xf4484c,0xf00f3b,0xe2f830,0xc38929,0xa9b420,0x98d01c,0x00f0f0,0x0f00f0,0xf00f00,0xf0f000];
//var track_colors = [0xFF0000,0xFF4040,0xFF6A6A,0xf00f3b,0xFF7F24,0xc38929,0xFFB90F,0x98d01c,0xFFC0CB,0x0f00f0,0xf00f00,0xf0f000];
var track_colors = [0xFF0000,0xFF4040,0xEE0000,0xFF0000,0xFFFF00,0xADFF2F,0x7FFFD4,0x98d01c,0xFFC0CB,0x0f00f0,0xf00f00,0xf0f000];
var track_colors_str = ["0xdeeb23","0xf22c30","0xf4484c","0xf00f3b","0xe2f830","0xc38929","0xa9b420","0x98d01c","0x00f0f0","0x0f00f0","0xf00f00","0xf0f000"];

var reciveTraceData = function(traceObj, lineId, top){
    Ext.Ajax.request({
                url:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getTrackPoints.json",
                method:'GET',
//                async:false,
                params: {
                    lineId:lineId
                },
                success: function(response){
                        var traceData = response.responseText;
                        var trace = JSON.parse(traceData);

                        var geometry = new THREE.Geometry();
                        var count = 0;
                        var black_color = new THREE.Color(0,0,0);
                        var this_color = new THREE.Color(track_colors[lineId]);
                        var len = 63.70 * 50;
                        var vertices_arr = new Array();
                        for(var ii = 0 ; ii < trace.length/2.5 ; ii++){
                            var paar1 = trace[ii]['parr'];
                            var paar2 = trace[(ii+1)%trace.length]['parr'];
                            if(paar1.length < paar2.length){
                                paar1 = trace[(ii+1)%trace.length]['parr'];
                                paar2 = trace[ii]['parr'];
                            }

                            for(var i = 0 ; i < paar2.length - 1; i++){
                                geometry.vertices.push(
                                    new THREE.Vector3( paar1[i].x * 63.78, paar1[i].y * 63.78, paar1[i].z * 63.78 ),
                                    new THREE.Vector3( paar1[i+1].x * 63.78, paar1[i+1].y * 63.78, paar1[i+1].z * 63.78 ),
                                    new THREE.Vector3( paar2[i].x * 63.78, paar2[i].y * 63.78, paar2[i].z * 63.78 ),
                                    new THREE.Vector3( paar2[i+1].x * 63.78, paar2[i+1].y * 63.78, paar2[i+1].z * 63.78 )
                                );
                                vertices_arr.push( new THREE.Vector3( paar1[i].x * 63.78, paar1[i].y * 63.78, paar1[i].z * 63.78 ),
                                    new THREE.Vector3( paar1[i+1].x * 63.78, paar1[i+1].y * 63.78, paar1[i+1].z * 63.78 ),
                                    new THREE.Vector3( paar2[i].x * 63.78, paar2[i].y * 63.78, paar2[i].z * 63.78 ),
                                    new THREE.Vector3( paar2[i+1].x * 63.78, paar2[i+1].y * 63.78, paar2[i+1].z * 63.78 )
                                );
                                geometry.faces.push( new THREE.Face3( count, count+1, count+2 ) );
                                geometry.faces.push( new THREE.Face3( count+3, count+2, count+1 ) );
                                count += 4;

                                var len1 = Math.sqrt(Math.pow(paar1[i].x * 63.78, 2) + Math.pow(paar1[i].y * 63.78, 2) + Math.pow(paar1[i].z * 63.78, 2));
                                var len2 = Math.sqrt(Math.pow(paar1[i+1].x * 63.78, 2) + Math.pow(paar1[i+1].y * 63.78, 2) + Math.pow(paar1[i+1].z * 63.78, 2));
                                var len3 = Math.sqrt(Math.pow(paar2[i].x * 63.78, 2) + Math.pow(paar2[i].y * 63.78, 2) + Math.pow(paar2[i].z * 63.78, 2));
                                var len4 = Math.sqrt(Math.pow(paar2[i+1].x * 63.78, 2) + Math.pow(paar2[i+1].y * 63.78, 2) + Math.pow(paar2[i+1].z * 63.78, 2));
                                var color1 = new THREE.Color(track_colors[lineId]);var color2 = new THREE.Color(track_colors[lineId]);
                                var color3 = new THREE.Color(track_colors[lineId]);var color4 = new THREE.Color(track_colors[lineId]);
                                color1.lerp(black_color, len1/len);
                                color2.lerp(black_color, len2/len);
                                color3.lerp(black_color, len3/len);
                                color4.lerp(black_color, len4/len);
                                geometry.faces[geometry.faces.length - 2].vertexColors[0] = color1;
                                geometry.faces[geometry.faces.length - 2].vertexColors[1] = color2;
                                geometry.faces[geometry.faces.length - 2].vertexColors[2] = color3;
                                geometry.faces[geometry.faces.length - 1].vertexColors[0] = color4;
                                geometry.faces[geometry.faces.length - 1].vertexColors[1] = color3;
                                geometry.faces[geometry.faces.length - 1].vertexColors[2] = color2;

                            }

                            for(var i = paar2.length; i < paar1.length; i++){
                                geometry.vertices.push(
                                    new THREE.Vector3( paar1[i].x * 63.78, paar1[i].y * 63.78, paar1[i].z * 63.78 ),
                                    new THREE.Vector3( paar1[i-1].x * 63.78, paar1[i-1].y * 63.78, paar1[i-1].z * 63.78 ),
                                    new THREE.Vector3( paar2[paar2.length-1].x * 63.78, paar2[paar2.length-1].y * 63.78, paar2[paar2.length-1].z * 63.78 )
                                );
                                vertices_arr.push(new THREE.Vector3( paar1[i].x * 63.78, paar1[i].y * 63.78, paar1[i].z * 63.78 ),
                                    new THREE.Vector3( paar1[i-1].x * 63.78, paar1[i-1].y * 63.78, paar1[i-1].z * 63.78 ),
                                    new THREE.Vector3( paar2[paar2.length-1].x * 63.78, paar2[paar2.length-1].y * 63.78, paar2[paar2.length-1].z * 63.78 )
                                );
                                geometry.faces.push( new THREE.Face3( count, count+1, count+2 ) );
                                count += 3;

                                var len1 = Math.sqrt(Math.pow(paar1[i].x * 63.78, 2) + Math.pow(paar1[i].y * 63.78, 2) + Math.pow(paar1[i].z * 63.78, 2));
                                var len2 = Math.sqrt(Math.pow(paar1[i-1].x * 63.78, 2) + Math.pow(paar1[i-1].y * 63.78, 2) + Math.pow(paar1[i-1].z * 63.78, 2));
                                var len3 = Math.sqrt(Math.pow(paar2[paar2.length-1].x * 63.78, 2) + Math.pow(paar2[paar2.length-1].y * 63.78, 2) + Math.pow(paar2[paar2.length-1].z * 63.78, 2));
                                var color1 = new THREE.Color(track_colors[lineId]);var color2 = new THREE.Color(track_colors[lineId]);
                                var color3 = new THREE.Color(track_colors[lineId]);
                                color1.lerp(black_color, len1/len);
                                color2.lerp(black_color, len2/len);
                                color3.lerp(black_color, len3/len);
                                geometry.faces[geometry.faces.length - 1].vertexColors[0] = color1;
                                geometry.faces[geometry.faces.length - 1].vertexColors[1] = color2;
                                geometry.faces[geometry.faces.length - 1].vertexColors[2] = color3;
                            }
                        }

                        geometry.computeBoundingSphere();

                        var material = new THREE.MeshBasicMaterial({transparent: true, side:THREE.DoubleSide, opacity:0.2,vertexColors:THREE.VertexColors });//双面光照
                        var mesh = new THREE.Mesh( geometry, material );
                        vertices_mf_arr.push(vertices_arr);
                        geometry_mf_arr.push(geometry);
                        traceObj.add(mesh);

//                        var particles = 0;
//                        for(var ii = 0 ; ii < trace.length ; ii++){
//                            var paar1 = trace[ii]['parr'];
//                            particles += paar1.length;
//                        }
//                        console.log(particles);
//
//                        var geometryP = new THREE.BufferGeometry();
//                        geometryP.addAttribute( 'position', Float32Array, particles, 3 );
//                        geometryP.addAttribute( 'color', Float32Array, particles, 3 );
//
//                        var positions = geometryP.attributes.position.array;
//                        var colors = geometryP.attributes.color.array;
//
//                        var counter = 0;
//                        var this_color = new THREE.Color(1,1,1);
//                        for(var ii = 0 ; ii < trace.length ; ii++){
//                            var paar1 = trace[ii]['parr'];
//                            for(var i = 0 ; i < paar1.length ; i++){
//                                positions[ counter ] = paar1[i].x * 63.78;
//                                positions[ counter + 1 ] = paar1[i].y * 63.78;
//                                positions[ counter + 2 ] = paar1[i].z * 63.78;
//
//                                colors[ counter ]     = this_color.r;
//                                colors[ counter + 1 ] = this_color.g;
//                                colors[ counter + 2 ] = this_color.b;
//                                counter += 3;
//                            }
//                        }
//
//                        geometryP.computeBoundingSphere();
//
//                        var materialP = new THREE.ParticleSystemMaterial( {
//                            size: 20,
//                            vertexColors: true,
//                            map: THREE.ImageUtils.loadTexture(
//                                "../../resources/images/point.PNG"
//                            ),
//                            blending: THREE.AdditiveBlending,
//                            transparent: true } );
//
//                        var particleSystem = new THREE.ParticleSystem( geometryP, materialP );
//                        particleSystem.sortParticles = true;
//
//                        traceObj.add(particleSystem);

                        if(lineId+1 < top){
                            reciveTraceData(traceObj, lineId+1, top);
                        }
                        else{
                            //create_ps_sun(ORBIT.planet["sun"].object);
//                            showParticleSunWind(traceObj);
                        }
                }
            });
};

var transfer16to10 = function (color){
    var cal_number = function(charnumber){
        var number = 0;
        switch (charnumber){
            case 'a':
                number = 10;
                break;
            case 'b':
                number = 11;
                break;
            case 'c':
                number = 12;
                break;
            case 'd':
                number = 13;
                break;
            case 'e':
                number = 14;
                break;
            case 'f':
                number = 15;
                break;
            default :
                number = parseInt(charnumber);
                break;
        }
        return number;
    };
    var obj = new Object();
    obj.r = cal_number(color.charAt(2))*16 + cal_number(color.charAt(3));
    obj.g = cal_number(color.charAt(4))*16 + cal_number(color.charAt(5));
    obj.b = cal_number(color.charAt(6))*16 + cal_number(color.charAt(7));
    return obj;
};

var geometry_mf_arr = new Array();
var vertices_mf_arr = new Array();

////太阳风离子系统
//var particle_pos = null;
//var particle_color = null;
//var particle_mesh = null;
//var particle_origin_pos = null;
//var particle_life = new Array();
//var create_ps_sunwind = function(traceObj){
//    var R_x = 1500;
//    var particles = 2000;
//    var geometryP = new THREE.Geometry();
//    var origin_pos = new THREE.Vector3(8000, 0, 0);
//    particle_origin_pos = origin_pos;
//    var positions = geometryP.vertices;
//    particle_pos = positions;
//    var colors = geometryP.colors;
//    particle_color = colors;
//    var base_color = new THREE.Color(0.4, 0.4, 0.4);
//    for(var i = 0 ; i < particles; i++){
//        var sinx = Math.random() * 0.6;
//        var cosx = -Math.sqrt(1 - Math.pow(sinx, 2));
//        if(Math.random() > 0.5){
//            sinx = -sinx;
//        }
//        var siny = 2 * Math.random() * 1 - 1;
//        var cosy = Math.sqrt(1 - Math.pow(siny, 2));
//        if(Math.random() > 0.5){
//            cosy = -cosy;
//        }
//        positions.push(new THREE.Vector3(R_x *cosx + origin_pos.x, R_x * sinx *siny + origin_pos.y, R_x * sinx * cosy + origin_pos.z));
//        colors.push(new THREE.Color(base_color.r, base_color.g,base_color.b));
//        particle_life.push(particle_attr());
//    }
//    geometryP.computeBoundingSphere();
//
//    var materialP = new THREE.ParticleSystemMaterial( {
//        size: 2000,
//        vertexColors: true,
//        map: THREE.ImageUtils.loadTexture(
//            "../../resources/images/particle/fire xie.png"
//        ),
//        blending: THREE.AdditiveBlending,
//        transparent: true,
//        opacity:0.1} );
//    var particleSystem = new THREE.ParticleSystem( geometryP, materialP );
//    particleSystem.sortParticles = true;
//    particle_mesh = particleSystem.geometry;
//    //ORBIT.planet["sun"].object.add(particleSystem);
//    traceObj.add(particleSystem);
//};
//
//var animate_sunwind = function(){
//    for(var i = 0 ; i < particle_pos.length; i++) {
//        if(particle_life[i].lifetime > 0){
//            particle_pos[i].x -= particle_life[i].speed_x;
//            particle_life[i].lifetime--;
//            particle_color[i].r -= particle_life[i].color_dert;
//            particle_color[i].g -= particle_life[i].color_dert;
//            particle_color[i].b -= particle_life[i].color_dert;
//        }
//        else{
//            var sinx = Math.random() * 0.6;
//            var cosx = -Math.sqrt(1 - Math.pow(sinx, 2));
//            if(Math.random() > 0.5){
//                sinx = -sinx;
//            }
//            var siny = 2 * Math.random() * 1 - 1;
//            var cosy = Math.sqrt(1 - Math.pow(siny, 2));
//            if(Math.random() > 0.5){
//                cosy = -cosy;
//            }
//            particle_pos[i].x = 2000 *cosx + particle_origin_pos.x;
//            particle_pos[i].y = 2000 * sinx *siny + particle_origin_pos.y;
//            particle_pos[i].z = 2000 * sinx * cosy + particle_origin_pos.z;
//            particle_color[i].r = 0.4;
//            particle_color[i].g = 0.4;
//            particle_color[i].b = 0.4;
//            particle_life[i].lifetime = 200 * (1 + Math.random());
//            particle_life[i].color_dert = 0.4 / particle_life[i].lifetime;
//        }
//    }
//    particle_mesh.verticesNeedUpdate = true;
//}

//太阳粒子系统
var sun_origin = null;
var particle_sun_R = null;
var particle_sunwind_R = null;
var particle_pos_sun = null;
var particle_color_sun = null;
var particle_mesh_sun = null;
var model_mesh_sun = null;
var particle_attr_sub = new Array();
var particle_tangle_sun = new Array();
var particle_pos_origin_sun = new Array();
var index_verctor4 = function(p1_index, p2_index, p3_index, level){
    var obj = new Object();
    obj.p1_index = p1_index;
    obj.p2_index = p2_index;
    obj.p3_index = p3_index;
    obj.level = level;
    return obj;
};
var compute_pos = function(pos1, pos2, R, orgin){
    var middle_x = (pos1.x + pos2.x)/2 - orgin.x;
    var middle_y = (pos1.y + pos2.y)/2 - orgin.y;
    var middle_z = (pos1.z + pos2.z)/2 - orgin.z;
    var len = Math.sqrt(Math.pow(middle_x, 2) + Math.pow(middle_y, 2) + Math.pow(middle_z, 2));
    var middle = new THREE.Vector3(middle_x*R/len + orgin.x, middle_y*R/len + orgin.y, middle_z*R/len + orgin.z);
    return middle;
};
var create_ps_sun = function(traceObj){
    ///太阳粒子球
    var R = 400;
    particle_sun_R = R;
    var level = 0;
    var sun_orogin = new THREE.Vector3(8000, 0, 0);
    sun_origin = sun_orogin;
    var pos1 = new THREE.Vector3(0 + sun_orogin.x, 0 + sun_orogin.y, R + sun_orogin.z);
    var pos2 = new THREE.Vector3(0 + sun_orogin.x, 0 + sun_orogin.y, -R + sun_orogin.z);
    var pos3 = new THREE.Vector3(R + sun_orogin.x, 0 + sun_orogin.y, 0 + sun_orogin.z);
    var pos4 = new THREE.Vector3(-R + sun_orogin.x, 0 + sun_orogin.y, 0 + sun_orogin.z);
    var pos5 = new THREE.Vector3(0 + sun_orogin.x, R + sun_orogin.y, 0 + sun_orogin.z);
    var pos6 = new THREE.Vector3(0 + sun_orogin.x, -R + sun_orogin.y, 0 + sun_orogin.z);
    particle_pos_origin_sun.push(pos1, pos2, pos3, pos4, pos5, pos6);
    var tangle1 = index_verctor4(0, 2, 4, 1);
    var tangle2 = index_verctor4(0, 2, 5, 1);
    var tangle3 = index_verctor4(0, 3, 4, 1);
    var tangle4 = index_verctor4(0, 3, 5, 1);
    var tangle5 = index_verctor4(1, 2, 4, 1);
    var tangle6 = index_verctor4(1, 2, 5, 1);
    var tangle7 = index_verctor4(1, 3, 4, 1);
    var tangle8 = index_verctor4(1, 3, 5, 1);
    particle_tangle_sun.push(tangle1,tangle2,tangle3,tangle4,tangle5,tangle6,tangle7,tangle8);
    while(level < 6){
        level++;
        var particle_tangle_sun_sub = new Array();
        for(var i = 0 ; i < particle_tangle_sun.length ; i++){
            var posl1 = particle_pos_origin_sun[particle_tangle_sun[i].p1_index];
            var posl2 = particle_pos_origin_sun[particle_tangle_sun[i].p2_index];
            var posl3 = particle_pos_origin_sun[particle_tangle_sun[i].p3_index];
            var new_pos1 = compute_pos(posl1, posl2, R, sun_orogin);
            var new_pos2 = compute_pos(posl1, posl3, R, sun_orogin);
            var new_pos3 = compute_pos(posl2, posl3, R, sun_orogin);
            particle_pos_origin_sun.push(new_pos1, new_pos2, new_pos3);
            var new_tangle1 = index_verctor4(particle_tangle_sun[i].p1_index, particle_pos_origin_sun.length - 3, particle_pos_origin_sun.length - 2, level+1);
            var new_tangle2 = index_verctor4(particle_tangle_sun[i].p2_index, particle_pos_origin_sun.length - 3, particle_pos_origin_sun.length - 1, level+1);
            var new_tangle3 = index_verctor4(particle_tangle_sun[i].p3_index, particle_pos_origin_sun.length - 2, particle_pos_origin_sun.length - 1, level+1);
            var new_tangle4 = index_verctor4(particle_pos_origin_sun.length - 3, particle_pos_origin_sun.length - 2, particle_pos_origin_sun.length - 1, level+1);
            particle_tangle_sun_sub.push(new_tangle1, new_tangle2, new_tangle3, new_tangle4);
        }
        particle_tangle_sun = particle_tangle_sun_sub;
    }
    var particles = particle_pos_origin_sun.length;
    var geometryP = new THREE.Geometry();
    var positions = geometryP.vertices;
    particle_pos_sun = positions;
    var colors = geometryP.colors;
    particle_color_sun = colors;
    var base_color = new THREE.Color(1, 1, 1);
    for(var ii = 0 ; ii < particles; ii++){
        positions[ii] = new THREE.Vector3(particle_pos_origin_sun[ii].x, particle_pos_origin_sun[ii].y, particle_pos_origin_sun[ii].z);
        colors[ii] = new THREE.Color(base_color.r , base_color.g  , base_color.b );
        particle_attr_sub.push(attr_ps_sun(null, positions[ii]));
    }

    ///太阳风粒子
    var R_x = 1100;
    particle_sunwind_R = R_x;
    var particles_x = 5000;
    var mix_x = 0.5;
    for(var ii =  particles; ii < particles + particles_x; ii++){
        var tangle_1 = Math.PI / 4 * 3 + Math.random() * Math.PI / 4 * 2;
        var tangle_2 = Math.PI * 2 * Math.random();
        var sinx = Math.sin(tangle_1);
        var cosx = Math.cos(tangle_1);
        var siny = Math.sin(tangle_2);
        var cosy = Math.cos(tangle_2);
        var lx = Math.sin(Math.PI / 4 * 3);
        if(sinx > 0)
            lx = -lx;
        positions[ii] = new THREE.Vector3(R_x *cosx + sun_orogin.x, R_x * sinx *siny + sun_orogin.y, R_x * sinx * cosy + sun_orogin.z);
        colors[ii] = new THREE.Color(base_color.r * mix_x, base_color.g * mix_x, base_color.b * mix_x);
        particle_attr_sub.push(particle_attr(null, R_x * lx *siny + sun_orogin.y, R_x * lx * cosy + sun_orogin.z, tangle_2));
    }
    geometryP.computeBoundingSphere();

    var materialP = new THREE.ParticleSystemMaterial( {
        size: 1500,
        vertexColors: true,
        map: THREE.ImageUtils.loadTexture(
            "../../resources/images/particle/fire xie.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity:0.1} );
    var particleSystem = new THREE.ParticleSystem( geometryP, materialP );
    particleSystem.sortParticles = true;
    particle_mesh_sun = particleSystem.geometry;
    traceObj.add(particleSystem);

    var sphere = new THREE.SphereGeometry( 1300, 32, 32);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00,
        map: THREE.ImageUtils.loadTexture(
            "../../resources/images/particle/mysun.png"
        )} );
    var mysphere = new THREE.Mesh( sphere, material );
    mysphere.position.x = sun_orogin.x;
    model_mesh_sun = mysphere;
    traceObj.add(mysphere);
};

var attr_ps_sun = function(obj, pos){
    if(obj==null)
        obj = new Object();
    obj.lifetime = 100+100*Math.random();
    obj.color = 0.5 + 0.5*Math.random();
    obj.dert_color = obj.color/obj.lifetime;
    obj.speed = 8+8*Math.random();
    obj.speed_x = obj.speed*(pos.x - sun_origin.x)/particle_sun_R;
    obj.speed_y = obj.speed*(pos.y - sun_origin.y)/particle_sun_R;
    obj.speed_z = obj.speed*(pos.z - sun_origin.z)/particle_sun_R;
    obj.type = "sun";
    return obj;
};

var particle_attr = function(obj, pos_y, pos_z, tangle_2){
    if(obj == null){
        obj = new Object();
    }
    obj.lifetime = 180 * (1 + Math.random());
    obj.color = 0.5;
    obj.dert_color = 0;
    obj.speed = -15 * (1 + Math.random());
    obj.speed_x =  -15 * (1 + Math.random());
    obj.speed_y =  0.0;
    obj.speed_z =  0.0;
    obj.begin_x2 = 1000;
    obj.pos_y = pos_y;
    obj.pos_z = pos_z;
    obj.tangle_2 = tangle_2;
    obj.nameda = 120;
    obj.type = "sunwind";
    return obj;
};

var animate_sun = function(){
    for(var i = 0 ; i < particle_pos_sun.length ; i++){
        if(particle_attr_sub[i].lifetime>0){
            if(particle_attr_sub[i].type == "sun"){
                particle_pos_sun[i].x += particle_attr_sub[i].speed_x;
                particle_pos_sun[i].y += particle_attr_sub[i].speed_y;
                particle_pos_sun[i].z += particle_attr_sub[i].speed_z;
                particle_color_sun[i].r -= particle_attr_sub[i].dert_color;
                particle_color_sun[i].g -= particle_attr_sub[i].dert_color;
                particle_color_sun[i].b -= particle_attr_sub[i].dert_color;
                particle_attr_sub[i].lifetime--;
            }
            else if(particle_attr_sub[i].type == "sunwind"){
                if(particle_pos_sun[i].x >= particle_attr_sub[i].begin_x2){
                    particle_pos_sun[i].x += particle_attr_sub[i].speed_x;
                    particle_pos_sun[i].y += particle_attr_sub[i].speed_y;
                    particle_pos_sun[i].z += particle_attr_sub[i].speed_z;
                }
               else{
                    particle_pos_sun[i].x += particle_attr_sub[i].speed_x;
                    particle_pos_sun[i].y = particle_attr_sub[i].pos_y + Math.sqrt((particle_attr_sub[i].begin_x2 - particle_pos_sun[i].x) * particle_attr_sub[i].nameda) * Math.sin(particle_attr_sub[i].tangle_2);
                    particle_pos_sun[i].z = particle_attr_sub[i].pos_z + Math.sqrt((particle_attr_sub[i].begin_x2 - particle_pos_sun[i].x) * particle_attr_sub[i].nameda) * Math.cos(particle_attr_sub[i].tangle_2);
                }
                particle_color_sun[i].r -= particle_attr_sub[i].dert_color;
                particle_color_sun[i].g -= particle_attr_sub[i].dert_color;
                particle_color_sun[i].b -= particle_attr_sub[i].dert_color;
                particle_attr_sub[i].lifetime--;
            }
        }
        else{
            if(particle_attr_sub[i].type == "sun"){
                particle_pos_sun[i].x = particle_pos_origin_sun[i].x;
                particle_pos_sun[i].y = particle_pos_origin_sun[i].y;
                particle_pos_sun[i].z = particle_pos_origin_sun[i].z;
                particle_attr_sub[i] = attr_ps_sun(particle_attr_sub[i],particle_pos_sun[i]);
                particle_color_sun[i].r = particle_attr_sub[i].color;
                particle_color_sun[i].g = particle_attr_sub[i].color;
                particle_color_sun[i].b = particle_attr_sub[i].color;
            }
            else if(particle_attr_sub[i].type == "sunwind"){
                var tangle_1 = Math.PI / 4 * 3 + Math.random() * Math.PI / 4 * 2;
                var tangle_2 = Math.PI * 2 * Math.random();
                var sinx = Math.sin(tangle_1);
                var cosx = Math.cos(tangle_1);
                var siny = Math.sin(tangle_2);
                var cosy = Math.cos(tangle_2);
                var lx = Math.sin(Math.PI / 4 * 3);
                if(sinx > 0)
                    lx = -lx;
                particle_pos_sun[i].x = particle_sunwind_R *cosx + sun_origin.x;
                particle_pos_sun[i].y = particle_sunwind_R * sinx *siny + sun_origin.y;
                particle_pos_sun[i].z = particle_sunwind_R * sinx * cosy + sun_origin.z;
                particle_color_sun[i].r = particle_attr_sub[i].color;
                particle_color_sun[i].g = particle_attr_sub[i].color;
                particle_color_sun[i].b = particle_attr_sub[i].color;
                particle_attr_sub[i] = particle_attr(particle_attr_sub[i], particle_sunwind_R * lx *siny * 0.9 + sun_origin.y, particle_sunwind_R * lx * cosy * 0.9 + sun_origin.z, tangle_2);
            }
        }
    }
    particle_mesh_sun.verticesNeedUpdate = true;
};

var handle_animate = null;
var renderMagneticField = function (){
    animate_sun();
    ORBIT.renderer.clear();
    ORBIT.renderer.render(ORBIT.scene, ORBIT.camera);
    handle_animate = requestAnimationFrame(renderMagneticField);
};

var showParticleSunWind = function(sunWind){
    if(sun_origin == null){
        create_ps_sun(sunWind);
        renderMagneticField();
    }
    else{
        sunWind.add(particle_mesh_sun);
        sunWind.add(model_mesh_sun);
        renderMagneticField();
    }
};

var hideParticleSunWind = function(sunWind){
    window.cancelAnimationFrame(handle_animate);
    ORBIT.scene.remove(sunWind);
};

//磁力线
ORBIT.Planet.prototype.initTrace = function(traceObj, pid){
    switch(pid){
        case "mercury":break;
        case "venus":break;
        case "earth":
            reciveTraceData(traceObj, 3, 7);
            break;
        case "mars":break;
        case "jupiter":break;
        case "saturn":break;
        case "uranus":break;
        case "neptune":break;
        case "moon":break;
    }
};
//刷新地磁场的比例
ORBIT.Planet.refreshTraceScale = function(scale){
    ORBIT.planet["earth"].traceObject.scale.set(scale, scale, scale);
};
//刷新太阳风的比例
ORBIT.Planet.refreshSunWIndScale = function(scale){
    ORBIT.planet["earth"].sunWind.scale.set(scale, scale, scale);
};
//更新太阳风位置
ORBIT.Planet.refreshSunWind = function(scale){
    var l = 2000 * scale - 2000;
    var position = Matrix.calculateDistanceByL(ORBIT.planet["earth"].object.position, l);
    ORBIT.planet["earth"].sunWind.position.x = position.x;
    ORBIT.planet["earth"].sunWind.position.y = position.y;
    ORBIT.planet["earth"].sunWind.position.z = position.z;
};
//画点
//var drawPoint = function(longitude, latitude, high, energy){
////    var geometry = new THREE.Geometry();
////    geometry.dynamic = true;
//    var point = calculatePoint(longitude, latitude, high);
////    geometry.vertices.push(point);
//    var material, color;
//    if(energy <= 1){
//        color = 0x00ff00;
//    }
//    else if(energy > 1 && energy <= 60){
//        color = 0x7fff00;
//    }
//    else if(energy > 60 && energy <= 120){
//        color = 0xffff00;
//    }
//    else if(energy > 120 && energy <= 180){
//        color = 0xff7f00;
//    }
//    else{
//        color = 0xff0000;
//    }
//    material = new THREE.MeshBasicMaterial({color: color});
////    var line = new THREE.Line(geometry, material, THREE.LineStrip);
////    return line;
//    var geometry = new THREE.SphereGeometry(1, 1, 1);
//    var points = new THREE.Mesh(geometry, material);
//    points.position.set(point.x, point.y, point.z);
//    points.scale.set(0.5, 0.5, 0.5);
//    return points;
//};