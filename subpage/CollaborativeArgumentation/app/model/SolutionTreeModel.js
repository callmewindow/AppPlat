/**
 * Created by winter on 2014/4/23.
 */
Ext.define('AppPlat.model.SolutionTreeModel', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.LocalStorage',
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
            read:APC.APPPLAT_SERVICE_URL_PREFIX+"TreeManage/getTreeNodes",
            update:APC.APPPLAT_SERVICE_URL_PREFIX+"TreeManage/updateTreeNode",
            destroy:APC.APPPLAT_SERVICE_URL_PREFIX+"TreeManage/deleteTreeNode",
            create:APC.APPPLAT_SERVICE_URL_PREFIX+"TreeManage/addTreeNode"
        },
        reader: {
            type: 'json',
            messageProperty: 'message'
        }
    }
});