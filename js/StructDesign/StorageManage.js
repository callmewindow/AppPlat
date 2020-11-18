/******************************************
 * 类名：存储管理
 * 类型：逻辑类
 * 作用：负责文件存储导出的相关逻辑
 * 创建者：杜鹏宇
 * 最后一次修改者：杜鹏宇
 * 最后一次修改时间：20141126
 *****************************************/

var StorageManage = function () {
    this.mtlData = null;
}
StorageManage.prototype = {
    //加载场景文件
    initByJson: function (path) {
        Ext.MessageBox.show({ msg: '正在加载……'});
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/getFileByString.json",
            method: 'GET',
            params: {
                path: path
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                //记录组件的组合关系
                me.reRenderSceneByData(data);
                Ext.MessageBox.close();
            },
            failure: function () {
                Ext.MessageBox.show({ msg: '加载失败', buttons: Ext.Msg.OK});
            }
        });
    },
    reRenderSceneByData: function (data) {
        for (var i in data) {
            if (i[0] == 'c') {
                var temp = data[i].idList.split(',');
                var total = Struct.structManage.idLists.length;
                Struct.structManage.idLists[total] = new Array();
                for (var j = 0; j < temp.length; j++)
                    Struct.structManage.idLists[total][j] = parseInt(temp[j]);
            }
        }
        //设置计数器，计数器为0时表示模型加载完成，可以进行组件组合
        Struct.structManage.callBackCount = data['Total'];
        //依次加载模型
        for (var i in data) {
            if (i[0] == 's') {
                var total = Struct.structures.length;
                Struct.structures[total] = new Structure();
                Struct.structures[total].id = data[i].id;
                Struct.structures[total].data.name = data[i].data.name;
                Struct.structures[total].data.quality = data[i].data.quality;
                Struct.structures[total].data.consumption = data[i].data.consumption;
                Struct.structures[total].data.initSize = data[i].data.initSize;
                if (data[i].basicFlag) {
                    Struct.structures[total].initBasicModel(data[i].pathobj, data[i].position, data[i].rotation, data[i].scale);
                    Struct.structManage.callBackCount--;
                    if (Struct.structManage.callBackCount == 0) {
                        for (var i = 0; i < Struct.structManage.idLists.length; i++)
                            Struct.structManage.combineByID(Struct.structManage.idLists[i]);
                        Struct.structManage.idLists = new Array();
                        Struct.structManage.allUnselect();
                    }
                } else
                //由于模型导入的多线程操作，需要采用回调的方法
                    Struct.structures[total].initByOBJMTL(total, data[i].pathobj, data[i].pathmtl, data[i].position, data[i].rotation, data[i].scale, function () {
                        Struct.structManage.callBackCount--;
                        if (Struct.structManage.callBackCount == 0) {
                            for (var i = 0; i < Struct.structManage.idLists.length; i++)
                                Struct.structManage.combineByID(Struct.structManage.idLists[i]);
                            Struct.structManage.idLists = new Array();
                            Struct.structManage.allUnselect();
                        }
                    });
            }
        }
        Struct.render();
    },

    //初始化锁设定
    initLockState: function (data) {
        for (var i = 0; i < Struct.structures.length; i++) {
            if (Struct.structures[i].selectFlag) {
                Struct.structures[i].unselect();
            }
        }
        if (data == null || data.length == 0) return;
        var temp = data.split(',');
        for (var i = 0; i < temp.length; i++) {
            if (Struct.structManage.searchByID(temp[i]) != null)
                Struct.structures[Struct.structManage.searchByID(temp[i])].lock();
        }
        Struct.render();
        Struct.windowManage.updateLW();
    },

    //场景保存
    sceneSave: function (userId, path, name) {
        Ext.MessageBox.show({title: '卫星结构保存', msg: '正在保存，请稍候……'});
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFolders.json",
            method: 'POST',
            jsonData: {
                parentPath: path
            },
            success: function (response) {
                if (response.responseText == "true") {
                    //文件夹创建成功后创建图片
                    me.saveAsPicture(userId, path, name);
                } else
                    Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（文件夹创建未成功）', buttons: Ext.Msg.OK});
            },
            failure: function () {
                Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（文件夹创建未成功）', buttons: Ext.Msg.OK});
            }
        });
    },

    //将场景保存为图片
    saveAsPicture: function (userId, path, name) {
        var me = this;
        //截图时去掉参考线和选中状态
        Struct.scene.remove(Struct.sceneManage.gridHelper);
        var idList = Struct.structManage.allUnselect();
        Struct.render();
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
            method: 'POST',
            jsonData: {
                parentPath: path,
                fileName: name + ".map",
                data: (Struct.renderer.domElement.toDataURL().substr(22))
            },
            success: function (response) {
                //恢复参考线和选中状态
                Struct.structManage.selectById(idList);
                Struct.scene.add(Struct.sceneManage.gridHelper);
                if (response.responseText == "true") {
                    //图片保存成功后再保存文件
                    me.saveAsFile(userId, path, name);
                } else
                    Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（保存场景图片未成功）', buttons: Ext.Msg.OK});
            },
            failure: function () {
                //恢复参考线和选中状态
                Struct.structManage.selectById(idList);
                Struct.scene.add(Struct.sceneManage.gridHelper);
                Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（保存场景图片未成功）', buttons: Ext.Msg.OK});
            }
        });
    },

    //场景保存为json文件
    saveAsFile: function (userId, path, name) {
        var me = this;
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/createFile.json",
            method: 'POST',
            jsonData: {
                parentPath: path,
                fileName: name + ".json",
                data: this.getSceneJsonData()
            },
            success: function (response) {
                if (response.responseText == "true") {
                    //成功后保存任务
                    me.saveTaskToDB(userId, path, name);
                } else
                    Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（保存数据文件未成功）', buttons: Ext.Msg.OK});
            },
            failure: function () {
                Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（保存数据文件未成功）', buttons: Ext.Msg.OK});
            }
        });
    },

    //保存任务数据到数据库
    saveTaskToDB: function (userId, path, name) {
        Ext.Ajax.request({
            url: APC.APPPLAT_SERVICE_URL_PREFIX + "StructFileManage/saveTaskToDB.json",
            method: 'POST',
            jsonData: {
                userId: userId,
                parentPath: path,
                fileName: name
            },
            success: function (response) {
                Struct.render();
                if (response.responseText == "true") {
                    Ext.MessageBox.show({title: '卫星结构保存', msg: '保存成功', buttons: Ext.Msg.OK});
                }
                else {
                    Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（数据库数据更新失败）', buttons: Ext.Msg.OK});
                }
            },
            failure: function () {
                Struct.render();
                Ext.MessageBox.show({title: '卫星结构保存', msg: '保存失败（数据库数据更新失败）', buttons: Ext.Msg.OK});
            }
        });
    },

    //场景数据提取
    getSceneJsonData: function () {
        var id = new Array();
        var total = 0;
        //记录组合体状态
        for (var i = 0; i < Struct.structures.length; i++) {
            if (Struct.structures[i].combinaFlag) {
                id[id.length] = Struct.structures[i].idList;
                total += Struct.structures[i].idList.length;
            }
            else
                total++;
        }
        //json字符串，total代表组件数
        var ans = "{\"Total\":" + total;
        var no = 0;
        if (total != 0) ans += ",\n";
        for (var i = 0; i < Struct.structures.length; i++)
            //添加单一组件
            if (!Struct.structures[i].combinaFlag) {
                ans += "\"s" + no + "\" :";
                no++;
                var json = {
                    'id': Struct.structures[i].id,
                    'pathobj': Struct.structures[i].pathobj,
                    'pathmtl': Struct.structures[i].pathmtl,
                    'position': {
                        'x': Struct.structures[i].object.position.x,
                        'y': Struct.structures[i].object.position.y,
                        'z': Struct.structures[i].object.position.z
                    },
                    'rotation': {
                        'x': Struct.structures[i].object.rotation.x,
                        'y': Struct.structures[i].object.rotation.y,
                        'z': Struct.structures[i].object.rotation.z
                    },
                    'scale': {
                        'x': Struct.structures[i].object.scale.x,
                        'y': Struct.structures[i].object.scale.y,
                        'z': Struct.structures[i].object.scale.z
                    },
                    'basicFlag': Struct.structures[i].basicFlag,
                    'data': {
                        'name': Struct.structures[i].data.name,
                        'quality': Struct.structures[i].data.quality,
                        'consumption': Struct.structures[i].data.consumption,
                        'initSize': Struct.structures[i].data.initSize
                    }
                };
                ans += JSON.stringify(json);
                if (no != total || id.length != 0)
                    ans += ",\n"
                else
                    ans += "\n"
            } else {
                //对于结构体添加每一个子组件
                for (var j = 0; j < Struct.structures[i].idList.length; j++) {
                    ans += "\"s" + no + "\" :";
                    no++;
                    var tempPosition = new THREE.Vector3();
                    tempPosition.x = Struct.structures[i].object.children[j].position.x * Struct.structures[i].object.scale.x;
                    tempPosition.y = Struct.structures[i].object.children[j].position.y * Struct.structures[i].object.scale.y;
                    tempPosition.z = Struct.structures[i].object.children[j].position.z * Struct.structures[i].object.scale.z;
                    tempPosition.applyMatrix4(Matrixs.axisZRotationMatrix(Struct.structures[i].object.rotation.z));
                    tempPosition.applyMatrix4(Matrixs.axisYRotationMatrix(Struct.structures[i].object.rotation.y));
                    tempPosition.applyMatrix4(Matrixs.axisXRotationMatrix(Struct.structures[i].object.rotation.x));
                    var json = {
                        'id': Struct.structures[i].idList[j],
                        'pathobj': Struct.structures[i].pathobj[j],
                        'pathmtl': Struct.structures[i].pathmtl[j],
                        'position': {
                            'x': Struct.structures[i].object.position.x + tempPosition.x,
                            'y': Struct.structures[i].object.position.y + tempPosition.y,
                            'z': Struct.structures[i].object.position.z + tempPosition.z
                        },
                        'rotation': {
                            'x': Struct.structures[i].object.rotation.x + Struct.structures[i].object.children[j].rotation.x,
                            'y': Struct.structures[i].object.rotation.y + Struct.structures[i].object.children[j].rotation.y,
                            'z': Struct.structures[i].object.rotation.z + Struct.structures[i].object.children[j].rotation.z
                        },
                        'scale': {
                            'x': Struct.structures[i].object.scale.x * Struct.structures[i].object.children[j].scale.x,
                            'y': Struct.structures[i].object.scale.y * Struct.structures[i].object.children[j].scale.y,
                            'z': Struct.structures[i].object.scale.z * Struct.structures[i].object.children[j].scale.z
                        },
                        'basicFlag': Struct.structures[i].basicFlag[j],
                        'data': {
                            'name': Struct.structures[i].data.name[j],
                            'quality': Struct.structures[i].data.quality[j],
                            'consumption': Struct.structures[i].data.consumption[j],
                            'initSize': Struct.structures[i].data.initSize[j]
                        }
                    };
                    ans += JSON.stringify(json);
                    if (no != total || id.length != 0)
                        ans += ",\n"
                    else
                        ans += "\n"
                }
            }
        //记录组合逻辑
        for (var i = 0; i < id.length; i++) {
            ans += "\"c" + i + "\" :";
            var json = {
                'idList': id[i].join()
            }
            ans += JSON.stringify(json);
            if (i != id.length - 1)
                ans += ",\n"
            else
                ans += "\n"
        }
        ans += "}";
        return ans;
    },

    //导出obj格式场景
    exportObj: function () {
        //将组件数据转化为obj数据
        var objExporter = function (id, vOffset, vtOffset, vnOffset) {
            var ans = {
                v: "",
                vLength: 0,
                vt: "",
                vtLength: 0,
                vn: "",
                vnLength: 0,
                f: "",
                fLength: 0
            }
            var no = Struct.structManage.searchByID(id);
            var object = Struct.structures[no].object.children[0];
            var geometry = null;
            // v数据部分
            if (Struct.structures[no].basicFlag)
                geometry = object.geometry;
            else
                geometry = object.children[object.children.length - 1].geometry;
            for (var i = 0; i < geometry.vertices.length; i++) {
                var vertex = new THREE.Vector3(geometry.vertices[ i ].x, geometry.vertices[ i ].y, geometry.vertices[ i ].z);
                vertex.applyMatrix4(Struct.structures[no].object.matrixWorld);
                ans.v += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
                ans.vLength++;
            }
            // vt数据部分
            if (Struct.structures[no].basicFlag) {
                geometry = object.geometry;
                if (geometry.faceVertexUvs[ 0 ].length != 0) {
                    for (var i = 0; i < geometry.faceVertexUvs[ 0 ].length; i++) {
                        var vertexUvs = geometry.faceVertexUvs[ 0 ][ i ];
                        for (var j = 0; j < vertexUvs.length; j++) {
                            var uv = vertexUvs[ j ];
                            ans.vt += 'vt ' + uv.x + ' ' + uv.y + '\n';
                            ans.vtLength++;
                        }
                    }
                }
            } else
                for (var k = 0; k < object.children.length; k++) {
                    geometry = object.children[k].geometry;
                    if (geometry.faceVertexUvs[ 0 ].length != 0) {
                        for (var i = 0; i < geometry.faceVertexUvs[ 0 ].length; i++) {
                            var vertexUvs = geometry.faceVertexUvs[ 0 ][ i ];
                            for (var j = 0; j < vertexUvs.length; j++) {
                                var uv = vertexUvs[ j ];
                                ans.vt += 'vt ' + uv.x + ' ' + uv.y + '\n';
                                ans.vtLength++;
                            }
                        }
                    }
                }
            // vn数据部分
            if (Struct.structures[no].basicFlag) {
                geometry = object.geometry;
                if (geometry.faces.length != 0) {
                    for (var i = 0; i < geometry.faces.length; i++) {
                        var normals = geometry.faces[ i ].vertexNormals;
                        for (var j = 0; j < normals.length; j++) {
                            var normal = new THREE.Vector3(normals[ j ].x, normals[ j ].y, normals[ j ].z);
                            normal.applyMatrix4(Struct.structures[no].object.matrixWorld);
                            ans.vn += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
                            ans.vnLength++;
                        }
                    }
                }
            } else
                for (var k = 0; k < object.children.length; k++) {
                    geometry = object.children[k].geometry;
                    if (geometry.faces.length != 0) {
                        for (var i = 0; i < geometry.faces.length; i++) {
                            var normals = geometry.faces[ i ].vertexNormals;
                            for (var j = 0; j < normals.length; j++) {
                                var normal = new THREE.Vector3(normals[ j ].x, normals[ j ].y, normals[ j ].z);
                                normal.applyMatrix4(Struct.structures[no].object.matrixWorld);
                                ans.vn += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
                                ans.vnLength++;
                            }
                        }
                    }
                }
            // f数据部分
            if (Struct.structures[no].basicFlag) {
                geometry = object.geometry;
                for (var i = 0, j = 1; i < geometry.faces.length; i++, j += 3) {
                    var face = geometry.faces[ i ];
                    ans.f += 'f ';
                    ans.f += ( face.a + 1 + vOffset) + '/' + ( j + vtOffset) + '/' + ( j + vnOffset) + ' ';
                    ans.f += ( face.b + 1 + vOffset) + '/' + ( j + 1 + vtOffset) + '/' + ( j + 1 + vnOffset) + ' ';
                    ans.f += ( face.c + 1 + vOffset) + '/' + ( j + 2 + vtOffset) + '/' + ( j + 2 + vnOffset) + '\n';
                    ans.fLength++;
                }
            } else
                for (var k = 0; k < object.children.length; k++) {
                    geometry = object.children[k].geometry;
                    if (geometry.faces.length != 0) {
                        var mtlname = object.children[k].material.name;
                        if (mtlname.length != 0)
                            ans.f += 'usemtl ' + mtlname + '\n';
                        for (var i = 0, j = 1; i < geometry.faces.length; i++, j += 3) {
                            var face = geometry.faces[ i ];
                            ans.f += 'f ';
                            ans.f += ( face.a + 1 + vOffset) + '/' + ( j + vtOffset) + '/' + ( j + vnOffset) + ' ';
                            ans.f += ( face.b + 1 + vOffset) + '/' + ( j + 1 + vtOffset) + '/' + ( j + 1 + vnOffset) + ' ';
                            ans.f += ( face.c + 1 + vOffset) + '/' + ( j + 2 + vtOffset) + '/' + ( j + 2 + vnOffset) + '\n';
                            ans.fLength++;
                        }
                    }
                }
            return ans;
        }

        var id = new Array();
        //先解散组合体
        for (var i = 0; i < Struct.structures.length; i++) {
            if (Struct.structures[i].combinaFlag) {
                id[id.length] = Struct.structManage.breakByID(Struct.structures[i].id);
                i = -1;
            }
        }
        //分别记录obj的四大数据部分
        var output = {
            v: "",
            vt: "",
            vn: "",
            f: ""
        };
        //为了将f数据合并需要增加偏移量
        var offset = {
            v: 0,
            vt: 0,
            vn: 0,
            f: 0
        };
        for (var i = 0; i < Struct.structures.length; i++) {
            var ans = objExporter(Struct.structures[i].id, offset.v, offset.vt, offset.vn);
            output.v += ans.v;
            output.vt += ans.vt;
            output.vn += ans.vn;
            output.f += ans.f;
            offset.v += ans.vLength;
            offset.vt += ans.vtLength;
            offset.vn += ans.vnLength;
            offset.f += ans.fLength;
        }
        //重新组合结构体
        for (var i = 0; i < id.length; i++)
            Struct.structManage.combineByID(id[i], 0);
        return output.v + output.vt + output.vn + output.f;
    }
}
//
//    //测试云存储是否保存成功
//    testStorerage: function(path){
//        var me = this;
//        Ext.Ajax.request({
//            url:APC.APPPLAT_SERVICE_URL_PREFIX+"StructFileManage/testStorerage.json",
//            method:'POST',
//            jsonData: {
//                parentPath:path
//            },
//            success: function(response){
//            },
//            failure: function(){
//            }
//        });
//    },
//
//    //获取存储区名称列表
//    getSaveList: function(){
//        Ext.Ajax.request({
//            url: APC.APPPLAT_SERVICE_URL_PREFIX+"StructFileManage/getSaveList.json",
//            method:'POST',
//            jsonData: {
//                path:"E:\\TempSave"
//            },
//            success: function(response){
//            }
//        });
//    },
//
//    //获取文件内容
//    getFileByString: function(path){
//        Ext.Ajax.request({
//            url: APC.APPPLAT_SERVICE_URL_PREFIX+"StructFileManage/getFileByString.json",
//            method:'POST',
//            jsonData: {
//                path:path
//            },
//            success: function(response){
//                return response.responseText;
//            }
//        });
//    }