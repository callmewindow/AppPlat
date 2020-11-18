Ext.define('AppPlat.store.SolutionTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'AppPlat.model.SolutionTreeModel',
    autoLoad:true,
    expanded:true,
    listeners:{
        'append':{
            fn: function(parent, node){
                node.isExpandable = function() {
                    return !this.isLeaf() && (this.get('expandable') || this.hasChildNodes());
                };
                node.isLoaded = function() {
                    return false;//每次展开节点的时候都重新加载子节点
//                    var a1 = this.hasChildNodes();
//                    return this.hasChildNodes();// 如果有孩子节点，说明已经加载完成，如果没有孩子节点说明还未加载
                }
            }
        }
    }
});