/**
 * Created by Taivas on 5/14/14.
 */
//Class: Orbit parameters
ORBIT.OrbitPara  = function(pi, pa, pe, pOmega, pomega, ptheta, centerid) {
    this.i = pi / 180*Math.PI;                  //轨道倾角
    this.a = pa;                                 //半长轴
    this.e = pe;                                  //离心率
    this.Om = pOmega / 180*Math.PI;                //升交点赤经
    this.om = pomega / 180*Math.PI;                 //近心点幅角
    this.theta = ptheta / 180*Math.PI;              //真近心点
    this.c = this.a * this.e;                       //离心率
    this.b = Math.sqrt(this.a * this.a - this.c * this.c);//半短轴
    this.T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(this.a, 3)/ORBIT.GravitationalConstant[centerid]);//周期
//    this.setT = function (){
//        this.T = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(this.a, 3)/ORBIT.GravitationalConstant[centerid]);
//    }
};

//ORBIT.OrbitParaW  = function(OrbitPara, t1, t2, t3) {
//    this.OrbitPara =
//    this.i = pi / 180*Math.PI;                  //轨道倾角
//
//};
