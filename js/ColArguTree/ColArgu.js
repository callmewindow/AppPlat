/**
 * Created by winter on 2014/6/30.
 */
var ColArgu = {
     colArguTreeUtil: null,
     addNodeManage:null,
     ProWinManage:null,
     init: function (){
         ColArgu.colArguTreeUtil = new ColArguTreeUtil();
         ColArgu.addNodeManage = new AddNodeManage();
         ColArgu.ProWinManage = new ProWinManage();
     }
}