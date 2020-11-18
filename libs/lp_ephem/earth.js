/**
* Created by Taivas on 7/10/14.
*/
//function rearth = earth (jdate)
var earth = function(jdate) {
//
//    % true-of-date heliocentric, ecliptic
//    % position vector of the Earth
//
//% input
//
//%  jdate = julian day
//
//% output
//
//%  rearth = position vector of the earth (kilometers)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    atr = pi / 648000;
    var atr = Math.PI / 648000;
//
//rearth = zeros(3, 1);
    var rearth = new Array(3);
//
//% fundamental time arguments
//
//djd = jdate - 2451545;
    var djd = jdate - 2451545;
//
//t = djd / 36525 + 1;
//
    var t = djd / 36525 + 1;
//% fundamental trig arguments (radians)
//
//gs = r2r(0.993126 + 0.0027377785 * djd);
//lm = r2r(0.606434 + 0.03660110129 * djd);
//ls = r2r(0.779072 + 0.00273790931 * djd);
//g2 = r2r(0.140023 + 0.00445036173 * djd);
//g4 = r2r(0.053856 + 0.00145561327 * djd);
//g5 = r2r(0.056531 + 0.00023080893 * djd);
//
    var gs = r2r(0.993126 + 0.0027377785 * djd);
    var lm = r2r(0.606434 + 0.03660110129 * djd);
    var ls = r2r(0.779072 + 0.00273790931 * djd);
    var g2 = r2r(0.140023 + 0.00445036173 * djd);
    var g4 = r2r(0.053856 + 0.00145561327 * djd);
    var g5 = r2r(0.056531 + 0.00023080893 * djd);
//% heliocentric ecliptic longitude (radians)
//
//pl = 6910 * sin(gs) + 72 * sin(2 * gs) - 17 * t * sin(gs);
//pl = pl - 7 * cos(gs - g5) + 6 * sin(lm - ls);
//pl = pl + 5 * sin(4 * gs - 8 * g4 + 3 * g5);
//pl = pl - 5 * cos(2 * (gs - g2));
//pl = pl - 4 * sin(gs - g2) + 4 * cos(4 * gs - 8 * g4 + 3 * g5);
//pl = pl + 3 * sin(2 * (gs - g2)) - 3 * sin(g5) - 3 * sin(2 * (gs - g5));
//
    var pl = 6910 * Math.sin(gs) + 72 * Math.sin(2 * gs) - 17 * t * Math.sin(gs);
    pl = pl - 7 * Math.cos(gs - g5) + 6 * Math.sin(lm - ls);
    pl = pl + 5 * Math.sin(4 * gs - 8 * g4 + 3 * g5);
    pl = pl - 5 * Math.cos(2 * (gs - g2));
    pl = pl - 4 * Math.sin(gs - g2) + 4 * Math.cos(4 * gs - 8 * g4 + 3 * g5);
    pl = pl + 3 * Math.sin(2 * (gs - g2)) - 3 * Math.sin(g5) - 3 * Math.sin(2 * (gs - g5));
//plon = ls + atr * pl;
    var plon = ls + atr * pl;
//
//% heliocentric ecliptic latitude (radians)
//
//plat = 0;
    var plat = 0;
//
//% heliocentric distance (kilometers)
//
//r = 149597870.691 * (1.00014 - 0.01675 * cos(gs) - 0.00014 * cos(2 * gs));
    var r = 149597870.691 * (1.00014 - 0.01675 * Math.cos(gs) - 0.00014 * Math.cos(2 * gs));
//
//% heliocentric ecliptic position vector (kilometers)
//
//rearth(1) = -r * cos(plat) * cos(plon);
//rearth(2) = -r * cos(plat) * sin(plon);
//rearth(3) = -r * sin(plat);
    rearth[0] = -r * Math.cos(plat) * Math.cos(plon);
    rearth[1] = -r * Math.cos(plat) * Math.sin(plon);
    rearth[2] = -r * Math.sin(plat);

    return rearth;
}