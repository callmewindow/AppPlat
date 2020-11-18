/**
* Created by Taivas on 7/14/14.
*/
//function ruranus = uranus(jdate)
var uranus = function(jdate) {
//
//    % true-of-date heliocentric, ecliptic
//    % position vector of Uranus
//
//% input
//
//%  jdate = julian day
//
//% output
//
//%  rneptune = position vector of Uranus (kilometers)
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    atr = pi / 648000;
    var atr = Math.PI / 648000;
//
//ruranus = zeros(3, 1);
    var ruranus = new Array(3);
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
//f7 = r2r(0.664614 + 0.00003265562 * djd);
//g8 = r2r(0.725368 + 0.00001672092 * djd);
    var g5 = r2r(0.056531 + 0.00023080893 * djd);
    var g6 = r2r(0.882987 + 0.00009294371 * djd);
    var l7 = r2r(0.870169 + 0.00003269438 * djd);
    var g7 = r2r(0.400589 + 0.00003269438 * djd);
    var f7 = r2r(0.664614 + 0.00003265562 * djd);
    var g8 = r2r(0.725368 + 0.00001672092 * djd);
//
//% heliocentric ecliptic longitude (radians)
//
//pl = 19397 * sin(g7) + 570 * sin(2 * g7);
//pl = pl - 536 * tjd * cos(g7) + 143 * sin(g6 - 2 * g7);
//pl = pl + 110 * tjd * sin(g7) + 102 * sin(g6 - 3 * g7);
//pl = pl + 76 * cos(g6 - 3 * g7) - 49 * sin(g5 - g7);
//pl = pl + 32 * tjd * tjd - 30 * tjd * cos(2 * g7);
//pl = pl + 29 * sin(2 * g5 - 6 * g6 + 3 * g7);
//pl = pl + 29 * cos(2 * g7 - 2 * g8) - 28 * cos(g7 - g8);
//pl = pl + 23 * sin(3 * g7) - 21 * cos(g5 - g7);
//pl = pl + 20 * sin(g7 - g8) + 20 * cos(g6 - 2 * g7);
//pl = pl - 19 * cos(g6 - g7) + 17 * sin(2 * g7 - 3 * g8);
//pl = pl + 14 * sin(3 * g7 - 3 * g8) + 13 * sin(g6 - g7);
//pl = pl - 12 * tjd * tjd * cos(g7) - 12 * cos(g7);
//pl = pl + 10 * sin(2 * g7 - 2 * g8) - 9 * sin(2 * f7);
//pl = pl - 9 * tjd * tjd * sin(g7) + 9 * cos(2 * g7 - 3 * g8);
//pl = pl + 8 * tjd * cos(g6 - 2 * g7) + 7 * tjd * cos(g6 - 3 * g7);
//pl = pl - 7 * tjd * sin(g6 - 3 * g7) + 7 * tjd * sin(2 * g7);
//pl = pl + 6 * sin(2 * g5 - 6 * g6 + 2 * g7);
//pl = pl + 6 * cos(2 * g5 - 6 * g6 + 2 * g7);
//pl = pl + 5 * sin(g6 - 4 * g7) - 4 * sin(3 * g7 - 4 * g8);
//pl = pl + 4 * cos(3 * g7 - 3 * g8) - 3 * cos(g8);
//pl = pl - 2 * sin(g8);
    var pl = 19397 * Math.sin(g7) + 570 * Math.sin(2 * g7);
    pl = pl - 536 * tjd * Math.cos(g7) + 143 * Math.sin(g6 - 2 * g7);
    pl = pl + 110 * tjd * Math.sin(g7) + 102 * Math.sin(g6 - 3 * g7);
    pl = pl + 76 * Math.cos(g6 - 3 * g7) - 49 * Math.sin(g5 - g7);
    pl = pl + 32 * tjd * tjd - 30 * tjd * Math.cos(2 * g7);
    pl = pl + 29 * Math.sin(2 * g5 - 6 * g6 + 3 * g7);
    pl = pl + 29 * Math.cos(2 * g7 - 2 * g8) - 28 * Math.cos(g7 - g8);
    pl = pl + 23 * Math.sin(3 * g7) - 21 * Math.cos(g5 - g7);
    pl = pl + 20 * Math.sin(g7 - g8) + 20 * Math.cos(g6 - 2 * g7);
    pl = pl - 19 * Math.cos(g6 - g7) + 17 * Math.sin(2 * g7 - 3 * g8);
    pl = pl + 14 * Math.sin(3 * g7 - 3 * g8) + 13 * Math.sin(g6 - g7);
    pl = pl - 12 * tjd * tjd * Math.cos(g7) - 12 * Math.cos(g7);
    pl = pl + 10 * Math.sin(2 * g7 - 2 * g8) - 9 * Math.sin(2 * f7);
    pl = pl - 9 * tjd * tjd * Math.sin(g7) + 9 * Math.cos(2 * g7 - 3 * g8);
    pl = pl + 8 * tjd * Math.cos(g6 - 2 * g7) + 7 * tjd * Math.cos(g6 - 3 * g7);
    pl = pl - 7 * tjd * Math.sin(g6 - 3 * g7) + 7 * tjd * Math.sin(2 * g7);
    pl = pl + 6 * Math.sin(2 * g5 - 6 * g6 + 2 * g7);
    pl = pl + 6 * Math.cos(2 * g5 - 6 * g6 + 2 * g7);
    pl = pl + 5 * Math.sin(g6 - 4 * g7) - 4 * Math.sin(3 * g7 - 4 * g8);
    pl = pl + 4 * Math.cos(3 * g7 - 3 * g8) - 3 * Math.cos(g8);
    pl = pl - 2 * Math.sin(g8);
//
//plon = l7 + atr * pl;
    var plon = l7 + atr * pl;
//
//% heliocentric ecliptic latitude (radians)
//
//pb = 2775 * sin(f7) + 131 * sin(g7 - f7) + 130 * sin(g7 + f7);
    var pb = 2775 * Math.sin(f7) + 131 * Math.sin(g7 - f7) + 130 * Math.sin(g7 + f7);
//
//plat = atr * pb;
    var plat = atr * pb;
//
//% heliocentric distance (kilometers)
//
//pr = 19.21216 - 0.90154 * cos(g7) - 0.02488 * tjd * sin(g7);
//pr = pr - 0.02121 * cos(2 * g7) - 0.00585 * cos(g6 - 2 * g7);
//pr = pr - 0.00508 * tjd * cos(g7) - 0.00451 * cos(g5 - g7);
//pr = pr + 0.00336 * sin(g6 - g7) + 0.00198 * sin(g5 - g7);
//pr = pr + 0.00118 * cos(g6 - 3 * g7) + 0.00107 * sin(g6 - 2 * g7);
//pr = pr - 0.00103 * tjd * sin(2 * g7);
//pr = pr - 0.00081 * cos(3 * g7 - 3 * g8);
    var pr = 19.21216 - 0.90154 * Math.cos(g7) - 0.02488 * tjd * Math.sin(g7);
    pr = pr - 0.02121 * Math.cos(2 * g7) - 0.00585 * Math.cos(g6 - 2 * g7);
    pr = pr - 0.00508 * tjd * Math.cos(g7) - 0.00451 * Math.cos(g5 - g7);
    pr = pr + 0.00336 * Math.sin(g6 - g7) + 0.00198 * Math.sin(g5 - g7);
    pr = pr + 0.00118 * Math.cos(g6 - 3 * g7) + 0.00107 * Math.sin(g6 - 2 * g7);
    pr = pr - 0.00103 * tjd * Math.sin(2 * g7);
    pr = pr - 0.00081 * Math.cos(3 * g7 - 3 * g8);
//
//r = 149597870.691 * pr;
    var r = 149597870.691 * pr;
//
//% heliocentric ecliptic position vector (kilometers)
//
//ruranus(1) = r * cos(plat) * cos(plon);
//ruranus(2) = r * cos(plat) * sin(plon);
//ruranus(3) = r * sin(plat);
    ruranus[0] = r * Math.cos(plat) * Math.cos(plon);
    ruranus[1] = r * Math.cos(plat) * Math.sin(plon);
    ruranus[2] = r * Math.sin(plat);
    return ruranus;
//
//
}