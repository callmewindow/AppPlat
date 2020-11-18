/**
 * Created by Taivas on 7/4/14.
 */
Math.cot = function(v){
    return 0 == Math.tan(v)?NaN:1/Math.tan(v);
};

Math.acot = function(theta){
    return Math.PI/2 == theta?NaN:Math.atan(1/theta);
};

Math.sign = function(v){
    if(v>0) return 1;
    else if(v<0) return -1;
    return 0;
};

Math.cosh = function(v){
    return (Math.exp(v) + Math.exp(-v)) / 2.0;
};

Math.sinh = function(v){
    return (Math.exp(v) - Math.exp(-v)) / 2.0;
};

Math.fix = function(x){
    return x > 0 ? Math.floor(x) : Math.ceil(x);
};

//function y = atan3 (a, b)
Math.atan3 = function(a, b) {
//
//    % four quadrant inverse tangent
//
//% input
//
//%  a = sine of angle
//%  b = cosine of angle
//
//% output
//
//%  y = angle (radians; 0 =< c <= 2 * pi)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    epsilon = 0.0000000001;
    var epsilon = 0.0000000001;
//
//pidiv2 = 0.5 * pi;
    var pidiv2 = 0.5 * Math.PI;
//
//if (abs(a) < epsilon)
//    y = (1 - sign(b)) * pidiv2;
//return;
//else
//c = (2 - sign(a)) * pidiv2;
//end
    var y;
    var c;
    if(Math.abs(a) < epsilon){
        y = (1 - Math.sign(b)) * pidiv2;
        return y;
    }else {
        c = (2 - Math.sign(a)) * pidiv2;
    }
//
//if (abs(b) < epsilon)
//    y = c;
//return;
//else
//y = c + sign(a) * sign(b) * (abs(atan(a / b)) - pidiv2);
//end
    if(Math.abs(b) < epsilon){
        y = c;
        return y;
    }else {
        y = c + Math.sign(a) * Math.sign(b) * (Math.abs(Math.atan(a / b)) - pidiv2);
    }
    return y;
}