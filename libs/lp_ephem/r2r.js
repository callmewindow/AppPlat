/**
 * Created by Taivas on 7/10/14.
 */
//function y = r2r (x)
var r2r = function(x) {
//
//    % revolutions to radians function
//
//% input
//
//%  x = argument (revolutions; 0 <= x <= 1)
//
//% output
//
//%  y = equivalent x (radians; 0 <= y <= 2 pi)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    y = 2.0 * pi * (x - fix(x));
    return 2.0 * Math.PI * (x - Math.fix(x));
}