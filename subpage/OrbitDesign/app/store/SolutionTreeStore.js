Ext.define('OrbitDesignApp.store.SolutionTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'OrbitDesignApp.model.SolutionTreeModel',
    autoLoad:false,
    expanded:true,
    listeners:{
        'append':{
            fn: function(parent, node){
                node.isExpandable = function() {
                    return !this.isLeaf() && (this.get('expandable') || this.hasChildNodes());
                };
                node.isLoaded = function() {
                    var a1 = this.hasChildNodes();
                    return this.hasChildNodes();// 如果有孩子节点，说明已经加载完成，如果没有孩子节点说明还未加载
                }
            }
        }
    }
});