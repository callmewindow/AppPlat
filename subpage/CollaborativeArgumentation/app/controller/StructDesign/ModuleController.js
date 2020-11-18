Ext.define('AppPlat.controller.StructDesign.ModuleController', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'basicComponentGridPanel',
            selector: 'basiccomponentgridpanel'
        },
        {
            ref: 'internalLoadGridPanel',
            selector: 'internalloadgridpanel'
        },
        {
            ref: 'externalLoadGridPanel',
            selector: 'externalloadgridpanel'
        },
        {
            ref: 'platformgridPanel',
            selector: 'platformgridpanel'
        },
        {
            ref: 'expansiongridPanel',
            selector: 'expansiongridpanel'
        }
    ],

    init: function(application) {
        this.control({
            //基础模型模块
            'basiccomponentgridpanel':{
                itemdblclick:this.basicLoad
            },
            //平台模型模块
            'platformgridpanel':{
                itemdblclick:this.platformLoad
            },
            //内部模型模块
            'internalloadgridpanel':{
                itemdblclick:this.internalLoad
            },
            //外部模型模块
            'externalloadgridpanel':{
                itemdblclick:this.externalLoad
            },
            //扩展包模型模块
            'expansiongridpanel':{
                itemdblclick:this.expansionLoad
            }
        });
    },

    onLaunch:function(application){
    },

    //基础结构项选择
    basicLoad:function(grid, rowindex, e){
        record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            //将基础模型导入场景
            var total = Struct.structures.length;
            Struct.structures[total] = new Structure();
            var startPoint = new THREE.Vector3(-200, 0, -200);
            if (total == 0) startPoint = new THREE.Vector3(0, 0, 0);
            Struct.structures[total].initBasicModel(record[0].data.name, startPoint);
            Struct.structures[total].setChineseName(record[0].data.name);
            Struct.structManage.allUnselect();
            Struct.structures[total].select();
            Struct.structManage.refresh();
            Struct.render();
            Struct.windowManage.updateLW();
            Struct.sceneManage.initView();
            Struct.cooperationManage.sendInfo("Addition", Struct.structures[total].id);
            Struct.cooperationManage.sendInfo("LockControl", Struct.structures[total].id, true);
        }
    },

    //平台结构项选择
    platformLoad:function(grid, rowindex, e){
        record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            //将平台模型导入场景
            var total = Struct.structures.length;
            Struct.structures[total] = new Structure();
            var startPoint = new THREE.Vector3(-200, 0, -200);
            if (total == 0) startPoint = new THREE.Vector3(0, 0, 0);
            Struct.structures[total].initByOBJMTL(total, '../../resources/objmodel/platform/' + record[0].data.name + '.obj',
                    '../../resources/objmodel/platform/' + record[0].data.name + '.mtl', startPoint, null, null,
                function(){
                    Struct.structManage.allUnselect();
                    Struct.structures[total].select();
                    Struct.structManage.refresh();
                    Struct.render();
                    Struct.windowManage.updateLW();
                    Struct.sceneManage.initView();
                    Struct.cooperationManage.sendInfo("LockControl", Struct.structures[total].id, true);
                });
            Struct.structures[total].setChineseName(record[0].data.name);
            Struct.render();
            Struct.cooperationManage.sendInfo("Addition", Struct.structures[total].id);
        }
    },

    //内部结构项选择
    internalLoad:function(grid, rowindex, e){
        record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            //将内部载荷模型导入场景
            var total = Struct.structures.length;
            Struct.structures[total] = new Structure();
            var startPoint = new THREE.Vector3(-200, 0, -200);
            if (total == 0) startPoint = new THREE.Vector3(0, 0, 0);
            Struct.structures[total].initByOBJMTL(total, '../../resources/objmodel/internal/' + record[0].data.name + '.obj',
                    '../../resources/objmodel/internal/' + record[0].data.name + '.mtl', startPoint, null, null,
                function(){
                    Struct.structManage.allUnselect();
                    Struct.structures[total].select();
                    Struct.structManage.refresh();
                    Struct.render();
                    Struct.windowManage.updateLW();
                    Struct.sceneManage.initView();
                    Struct.cooperationManage.sendInfo("LockControl", Struct.structures[total].id, true);
                });
            Struct.structures[total].setChineseName(record[0].data.name);
            Struct.render();
            Struct.cooperationManage.sendInfo("Addition", Struct.structures[total].id);
        }
    },

    //外部结构项选择
    externalLoad:function(grid, rowindex, e){
        record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            //将外部载荷模型导入场景
            var total = Struct.structures.length;
            Struct.structures[total] = new Structure();
            var startPoint = new THREE.Vector3(-200, 0, -200);
            if (total == 0) startPoint = new THREE.Vector3(0, 0, 0);
            Struct.structures[total].initByOBJMTL(total, '../../resources/objmodel/external/' + record[0].data.name + '.obj',
                    '../../resources/objmodel/external/' + record[0].data.name + '.mtl', startPoint, null, null,
                function(){
                    Struct.structManage.allUnselect();
                    Struct.structures[total].select();
                    Struct.structManage.refresh();
                    Struct.render();
                    Struct.windowManage.updateLW();
                    Struct.sceneManage.initView();
                    Struct.cooperationManage.sendInfo("LockControl", Struct.structures[total].id, true);
                });
            Struct.structures[total].setChineseName(record[0].data.name);
            Struct.render();
            Struct.cooperationManage.sendInfo("Addition", Struct.structures[total].id);
        }
    },

    //拓展包结构项选择
    expansionLoad:function(grid, rowindex, e){
        record = grid.getSelectionModel().getSelection();
        if (record != 'undefined') {
            //将外部载荷模型导入场景
            var total = Struct.structures.length;
            Struct.structures[total] = new Structure();
            var startPoint = new THREE.Vector3(-200, 0, -200);
            if (total == 0) startPoint = new THREE.Vector3(0, 0, 0);
            Struct.structures[total].initByOBJMTL(total, '../../resources/objmodel/expansion/' + record[0].data.name + '.obj',
                    '../../resources/objmodel/expansion/' + record[0].data.name + '.mtl', startPoint, null, null,
                function(){
                    Struct.structManage.allUnselect();
                    Struct.structures[total].select();
                    Struct.structManage.refresh();
                    Struct.render();
                    Struct.windowManage.updateLW();
                    Struct.sceneManage.initView();
                });
            Struct.structures[total].setChineseName(record[0].data.name);
            Struct.render();
        }
    }
});