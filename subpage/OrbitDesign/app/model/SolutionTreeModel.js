/**
 * Created by winter on 2014/4/23.
 */
Ext.define('OrbitDesignApp.model.SolutionTreeModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.Ajax'
    ],
    fields: [
        { name: 'id'   },
        { name: 'name' },
        { name: 'leaf' },
        { name: 'nodeType'},
        { name: 'parentId'},
        { name: 'rootId'},
        { name: 'isRoot'},
        { name: 'nodeOrder',type: 'int'},
        { name: 'dataId'},
        { name: 'nodeFilePath'}
    ],
    proxy:  {
        type: 'rest',
        format:'json',
        appendId:false,
        noCache:true,
        api: {
            read:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/getTreeNodes",
            update:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/updateTreeNode",
            destroy:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/deleteTreeNode",
            create:APC.APPPLAT_SERVICE_URL_PREFIX+"OrbitFileManage/addTreeNode"
        },
        reader: {
            type: 'json',
            messageProperty: 'message'
        }
    }
});