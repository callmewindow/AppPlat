/**
* Created by Taivas on 7/12/14.
*/
//function rmars = mars (jdate)
var mars = function(jdate) {
//
//    % true-of-date heliocentric, ecliptic
//    % position vector of Mars
//
//% input
//
//%  jdate = julian day
//
//% output
//
//%  rmars = position vector of mars (kilometers)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    atr = pi / 648000;
    var atr = Math.PI / 648000;
//
//rmars = zeros(3, 1);
    var rmars = new Array(3);
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
//g2 = r2r(0.140023 + 0.00445036173 * djd);
//g4 = r2r(0.053856 + 0.00145561327 * djd);
//g5 = r2r(0.056531 + 0.00023080893 * djd);
//f4 = r2r(0.849694 + 0.00145569465 * djd);
//l4 = r2r(0.987353 + 0.00145575328 * djd);
//

var gs = r2r(0.993126 + 0.0027377785 * djd);
var g2 = r2r(0.140023 + 0.00445036173 * djd);
var g4 = r2r(0.053856 + 0.00145561327 * djd);
var g5 = r2r(0.056531 + 0.00023080893 * djd);
var f4 = r2r(0.849694 + 0.00145569465 * djd);
var l4 = r2r(0.987353 + 0.00145575328 * djd);

//% heliocentric ecliptic longitude (radians)
//
//pl = 38451 * sin(g4) + 2238 * sin(2 * g4) + 181 * sin(3 * g4);
//pl = pl - 52 * sin(2 * f4) + 37 * t * sin(g4) - 22 * cos(g4 - 2 * g5);
//pl = pl - 19 * sin(g4 - g5) + 17 * cos(g4 - g5) + 17 * sin(4 * g4);
//pl = pl - 16 * cos(2 * g4 - 2 * g5) + 13 * cos(gs - 2 * g4);
//pl = pl - 10 * sin(g4 - 2 * f4) - 10 * sin(g4 + 2 * f4);
//pl = pl + 7 * cos(gs - g4) - 7 * cos(2 * gs - 3 * g4);
//pl = pl - 5 * sin(g2 - 3 * g4) - 5 * sin(gs - g4) - 5 * sin(gs - 2 * g4);
//pl = pl - 4 * cos(2 * gs - 4 * g4) + 4 * t * sin(2 * g4) + 4 * cos(g5);
//pl = pl + 3 * cos(g2 - 3 * g4) + 3 * sin(2 * g4 - 2 * g5);
//

var pl = 38451 * Math.sin(g4) + 2238 * Math.sin(2 * g4) + 181 * Math.sin(3 * g4);
pl = pl - 52 * Math.sin(2 * f4) + 37 * t * Math.sin(g4) - 22 * Math.cos(g4 - 2 * g5);
pl = pl - 19 * Math.sin(g4 - g5) + 17 * Math.cos(g4 - g5) + 17 * Math.sin(4 * g4);
pl = pl - 16 * Math.cos(2 * g4 - 2 * g5) + 13 * Math.cos(gs - 2 * g4);
pl = pl - 10 * Math.sin(g4 - 2 * f4) - 10 * Math.sin(g4 + 2 * f4);
pl = pl + 7 * Math.cos(gs - g4) - 7 * Math.cos(2 * gs - 3 * g4);
pl = pl - 5 * Math.sin(g2 - 3 * g4) - 5 * Math.sin(gs - g4) - 5 * Math.sin(gs - 2 * g4);
pl = pl - 4 * Math.cos(2 * gs - 4 * g4) + 4 * t * Math.sin(2 * g4) + 4 * Math.cos(g5);
pl = pl + 3 * Math.cos(g2 - 3 * g4) + 3 * Math.sin(2 * g4 - 2 * g5);

//plon = l4 + atr * pl;
    var plon = l4 + atr * pl;

//
//% heliocentric ecliptic latitude (radians)
//
//plat = 6603 * sin(f4) + 622 * sin(g4 - f4) + 615 * sin(g4 + f4);
//plat = atr * (plat + 64 * sin(2 * g4 + f4));
//
    var plat = 6603 * Math.sin(f4) + 622 * Math.sin(g4 - f4) + 615 * Math.sin(g4 + f4);
    plat = atr * (plat + 64 * Math.sin(2 * g4 + f4));

//% heliocentric distance (kilometers)
//
//r = 1.53031 - 0.1417 * cos(g4) - 0.0066 * cos(2 * g4);
//r = 149597870.691 * (r - 0.00047 * cos(3 * g4));
    var r = 1.53031 - 0.1417 * Math.cos(g4) - 0.0066 * Math.cos(2 * g4);
    r = 149597870.691 * (r - 0.00047 * Math.cos(3 * g4));

//
//% heliocentric ecliptic position vector (kilometers)
//
//rmars(1) = r * cos(plat) * cos(plon);
//rmars(2) = r * cos(plat) * sin(plon);
//rmars(3) = r * sin(plat);
    rmars[0] = r * Math.cos(plat) * Math.cos(plon);
    rmars[1] = r * Math.cos(plat) * Math.sin(plon);
    rmars[2] = r * Math.sin(plat);
    return rmars;
}