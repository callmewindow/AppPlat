/**
* Created by Taivas on 7/13/14.
*/
//function rneptune = neptune(jdate)
    var neptune = function(jdate) {
//
//    % true-of-date heliocentric, ecliptic
//    % position vector of Neptune
//
//% input
//
//%  jdate = julian day
//
//% output
//
//%  rneptune = position vector of Neptune (km)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    atr = pi / 648000;
    var atr = Math.PI / 648000;
//
//rneptune = zeros(3, 1);
    var rneptune = new Array(3);
//
//% fundamental time arguments
//
//djd = jdate - 2451545;
    var djd = jdate - 2451545;
//
//tjd = djd / 36525 + 1;
    var tjd = djd / 36525 + 1;
//
//% fundamental trig arguments (radians)
//
//g5 = r2r(0.056531 + 0.00023080893 * djd);
//g6 = r2r(0.882987 + 0.00009294371 * djd);
//l7 = r2r(0.870169 + 0.00003269438 * djd);
//g7 = r2r(0.400589 + 0.00003269438 * djd);
//l8 = r2r(0.846912 + 0.00001672092 * djd);
//g8 = r2r(0.725368 + 0.00001672092 * djd);
//f8 = r2r(0.480856 + 0.00001663715 * djd);
    var g5 = r2r(0.056531 + 0.00023080893 * djd);
    var g6 = r2r(0.882987 + 0.00009294371 * djd);
    var l7 = r2r(0.870169 + 0.00003269438 * djd);
    var g7 = r2r(0.400589 + 0.00003269438 * djd);
    var l8 = r2r(0.846912 + 0.00001672092 * djd);
    var g8 = r2r(0.725368 + 0.00001672092 * djd);
    var f8 = r2r(0.480856 + 0.00001663715 * djd);
//
//% heliocentric ecliptic longitude (radians)
//
//pl = 3523 * sin(g8) - 50 * sin(2 * f8);
//pl = pl - 43 * tjd * cos(g8) + 29 * sin(g5 - g8);
//pl = pl + 19 * sin(2 * g8) - 18 * cos(g5 - g8);
//pl = pl + 13 * cos(g6 - g8) + 13 * sin(g6 - g8);
//pl = pl - 9 * sin(2 * g7 - 3 * g8) + 9 * cos(2 * g7 - 2 * g8);
//pl = pl - 5 * cos(2 * g7 - 3 * g8) - 4 * tjd * sin(g8);
//pl = pl + 4 * cos(g7 - 2 * g8) + 4 * tjd * tjd * sin(g8);
    var pl = 3523 * Math.sin(g8) - 50 * Math.sin(2 * f8);
    pl = pl - 43 * tjd * Math.cos(g8) + 29 * Math.sin(g5 - g8);
    pl = pl + 19 * Math.sin(2 * g8) - 18 * Math.cos(g5 - g8);
    pl = pl + 13 * Math.cos(g6 - g8) + 13 * Math.sin(g6 - g8);
    pl = pl - 9 * Math.sin(2 * g7 - 3 * g8) + 9 * Math.cos(2 * g7 - 2 * g8);
    pl = pl - 5 * Math.cos(2 * g7 - 3 * g8) - 4 * tjd * Math.sin(g8);
    pl = pl + 4 * Math.cos(g7 - 2 * g8) + 4 * tjd * tjd * Math.sin(g8);
//
//plon = l8 + atr * pl;
    var plon = l8 + atr * pl;
//
//% heliocentric ecliptic latitude (radians)
//
//pb = 6404 * sin(f8) + 55 * sin(g8 + f8);
//pb = pb + 55 * sin(g8 - f8) - 33 * tjd * sin(f8);
    var pb = 6404 * Math.sin(f8) + 55 * Math.sin(g8 + f8);
    pb = pb + 55 * Math.sin(g8 - f8) - 33 * tjd * Math.sin(f8);
//
//plat = atr * pb;
    var plat = atr * pb;
//
//% heliocentric distance (kilometers)
//
//pr = 30.07175 - 0.25701 * cos(g8);
//pr = pr - 0.00787 * cos(2 * l7 - g7 - 2 * l8);
//pr = pr + 0.00409 * cos(g5 - g8) - 0.00314 * tjd * sin(g8);
//pr = pr + 0.0025 * sin(g5 - g8) - 0.00194 * sin(g6 - g8);
//pr = pr + 0.00185 * cos(g6 - g8);
    var pr = 30.07175 - 0.25701 * Math.cos(g8);
    pr = pr - 0.00787 * Math.cos(2 * l7 - g7 - 2 * l8);
    pr = pr + 0.00409 * Math.cos(g5 - g8) - 0.00314 * tjd * Math.sin(g8);
    pr = pr + 0.0025 * Math.sin(g5 - g8) - 0.00194 * Math.sin(g6 - g8);
    pr = pr + 0.00185 * Math.cos(g6 - g8);

//r = 149597870.66 * pr;
    var r = 149597870.66 * pr;
//
//% heliocentric ecliptic position vector (kilometers)
//
//rneptune(1) = r * cos(plat) * cos(plon);
//rneptune(2) = r * cos(plat) * sin(plon);
//rneptune(3) = r * sin(plat);
    rneptune[0] = r * Math.cos(plat) * Math.cos(plon);
    rneptune[1] = r * Math.cos(plat) * Math.sin(plon);
    rneptune[2] = r * Math.sin(plat);
    return rneptune;
}