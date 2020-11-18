/**
 * Created by winter on 2014/11/27.
 */

function NodeView(){}
NodeView.prototype =
   {
       nodeId:null,
       taskId:null,//该节点所属任务的id
       solutionId:null,//该节点所属方案的id
       toolType:null,//该节点的类型
       scenePerspective:null,
       setNodeId:function(nodeId){
           this.nodeId = nodeId
       },
       getNodeId:function(){
           return this.nodeId
       },
       setTaskId:function(taskId){
           this.taskId = taskId
       },
       getTaskId:function(){
           return this.taskId
       },
       setSolutionId:function(solutionId){
           this.solutionId = solutionId
       },
       getSolutionId:function(){
           return this.solutionId
       },
       setToolType:function(toolType){
           this.toolType = toolType
       },
       getToolType:function(){
           return this.toolType
       },
       setScenePerspective:function(scenePerspective){
           this.scenePerspective = scenePerspective
       },
       getScenePerspective:function(){
           return this.scenePerspective
       }
   }


