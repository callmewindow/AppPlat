/**
* Created by Taivas on 7/13/14.
*/
//function rvenus = venus (jdate)
var venus = function(jdate) {
//
//    % true-of-date heliocentric, ecliptic
//    % position vector of venus
//
//% input
//
//%  jdate = julian day
//
//% output
//
//%  rvenus = position vector of venus (kilometers)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    atr = pi / 648000;
    var atr = Math.PI / 648000;
//
//rvenus = zeros(3, 1);
    var rvenus = new Array(3);
//
//% fundamental time arguments
//
//djd = jdate - 2451545;
    var djd = jdate - 2451545;
//
//t = djd / 36525 + 1;
    var t = djd / 36525 + 1;
//
//% fundamental trig arguments (radians)
//
//gs = r2r(0.993126 + 0.0027377785 * djd);
//l2 = r2r(0.505498 + 0.00445046867 * djd);
//g2 = r2r(0.140023 + 0.00445036173 * djd);
//f2 = r2r(0.292498 + 0.00445040017 * djd);
    var gs = r2r(0.993126 + 0.0027377785 * djd);
    var l2 = r2r(0.505498 + 0.00445046867 * djd);
    var g2 = r2r(0.140023 + 0.00445036173 * djd);
    var f2 = r2r(0.292498 + 0.00445040017 * djd);
//
//% heliocentric ecliptic longitude (radians)
//
//pl = 2814 * sin(g2) - 181 * sin(2 * f2);
//pl = pl - 20 * t * sin(g2) + 12 * sin(2 * g2);
//pl = pl - 10 * cos(2 * gs - 2 * g2) + 7 * cos(3 * gs - 3 * g2);
    var pl = 2814 * Math.sin(g2) - 181 * Math.sin(2 * f2);
    var pl = pl - 20 * t * Math.sin(g2) + 12 * Math.sin(2 * g2);
    var pl = pl - 10 * Math.cos(2 * gs - 2 * g2) + 7 * Math.cos(3 * gs - 3 * g2);
//
//plon = l2 + atr * pl;
    var plon = l2 + atr * pl;
//
//% heliocentric ecliptic latitude (radians)
//
//plat = 12215 * sin(f2) + 83 * sin(g2 + f2) + 83 * sin(g2 - f2);
//plat = atr * plat;
    var plat = 12215 * Math.sin(f2) + 83 * Math.sin(g2 + f2) + 83 * Math.sin(g2 - f2);
    var plat = atr * plat;
//
//% heliocentric distance (kilometers)
//
//r = 149597870.691 * (0.72335 - 0.00493 * cos(g2));
    var r = 149597870.691 * (0.72335 - 0.00493 * Math.cos(g2));
//
//% heliocentric ecliptic position vector (kilometers)
//
//rvenus(1) = r * cos(plat) * cos(plon);
//rvenus(2) = r * cos(plat) * sin(plon);
//rvenus(3) = r * sin(plat);
    rvenus[0] = r * Math.cos(plat) * Math.cos(plon);
    rvenus[1] = r * Math.cos(plat) * Math.sin(plon);
    rvenus[2] = r * Math.sin(plat);
    return rvenus;
//
}