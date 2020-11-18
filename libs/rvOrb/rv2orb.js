/**
 * Created by Taivas on 7/6/14.
 */
//%----------------------- Begin Code Sequence -----------------------------%
//% Purpose:                                                                %
//% Convert a given set of state vectors in ECI reference frame to orbital  %
//% elements.                                                               %
//%-------------------------------------------------------------------------%
//%                                                                         %
//% Inputs:                                                                 %
//%--------
//%r_ECI                  [3 x N]                         Position Vector in
//    %                                                       ECI coordinate
//%                                                       frame of reference
//%
//%v_ECI                  [3 x N]                         Velocity vector in
//    %                                                       ECI coordinate
//%                                                       frame of reference
//%
//%mu                     double                          Gravitational Constant
//%                                                       Defaults to Earth if
//    %                                                       not specified
//% Outputs:
//%---------                                                                %
//%a                      [1 x N]                         Semi-Major Axis
//%                                                       (km)
//%
//%eMag                   [1 x N]                         Eccentricity
//%                                                       (unitless)
//%
//%i                      [1 x N]                         inclination
//%                                                       (radians)
//%
//%O                      [1 x N]                         Right Ascention of
//%                                                       the ascending node
//%                                                       (radians)
//%
//%o                      [1 x N]                         Argument of perigee
//%                                                       (radians)
//%
//%M                      [1 x N]                         Mean Anomaly
//%no M is in this program, should be nu.                (radians)
//%
//%truLon                 [1 x N]                         True Longitude
//%                                                       (radians)
//%
//%argLat                 [1 x N]                         Argument of Latitude
//%                                                       (radians)
//%
//%lonPer                 [1 x N]                         Longitude of Periapse
//%                                                       (radians)
//%
//%p                      [1 x N]                         Semilatus Rectum
//%                                                       (km)
//%
//% References:
//%-------------
//%Vallado,D. Fundamentals of Astrodynamics and Applications. 2007.
//%
//% Function Dependencies:
//    %------------------
//%None
//%------------------------------------------------------------------       %
//% Programed by Darin Koblick  03-04-2012                                  %
//    % Updated to address circular equatorial orbits       12/12/2013          %
//%------------------------------------------------------------------       %
//function [a,eMag,i,O,o,nu,truLon,argLat,lonPer,p] = rv2orb(r,v,mu)
var rv2orb = function(r_p, v_p, mu) {
    var length = r_p.length/3;
    var r;
    var r_v;
    var v;
    var v_v;

    var h = new Array(3);
    var h_v = Vector.Zero(3);
    var repmat = Vector.Zero(3); //temp
    var n = new Array(3);
    var n_v = Vector.Zero(3);
    var nMag;
    var vMag;
    var rMag;
    var hMag;
    var e = new Array(3);
    var e_v;
    var eMag;
    var zeta;

    var idx;
    var a;
    var p;

    var i_theta;
    var O;
    var o;
    var nu;
    var lonPer;
    var argLat;
    var truLon;
//if ~exist('mu','var');  t = getConst(); mu = t.Earth.Mu; end
    if (!mu) {
        mu = 398600.4418;
    }
    for(var j = 0; j<length; j++) {
//%Specific angular momentum
//h = cross(r,v);
        r = [r_p[j*3], r_p[j*3+1], r_p[j*3+2]];
        v = [v_p[j*3], v_p[j*3+1], v_p[j*3+2]];
        r_v = Vector.create(r);
        v_v = Vector.create(v);
        h_v = r_v.cross(v_v);
        h = [h_v.elements[0], h_v.elements[1], h_v.elements[2]];
//n = cross(repmat([0;0;1],[1,size(r,2)]),h); nMag = sqrt(sum(n.^2,1));repmat, n are vectors, nMag is a number;
        repmat = Vector.create([0, 0, 1]);
        n_v = repmat.cross(h);
        n = [n_v.elements[0], n_v.elements[1], n_v.elements[2]];
        nMag = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
//vMag = sqrt(sum(v.^2,1)); vMag is a number.
        vMag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
//rMag = sqrt(sum(r.^2,1)); rMag is a number.
        rMag = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
//hMag = sqrt(sum(h.^2,1)); hmag is a number.
        hMag = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);
//e = (1./mu).*(bsxfun(@times,(vMag.^2 - mu./rMag),r) - bsxfun(@times,dot(r,v),v)); e is a number.
        for (var i = 0; i < 3; i++) {
            e[i] = 1 / mu * ((vMag * vMag - mu/rMag) * r[i] - r_v.dot(v_v) * v[i]);
        }
        e_v = Vector.create(e);
//eMag = sqrt(sum(e.^2,1)); eMag is a number.
        eMag = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
//zeta = (vMag.^2)./2 - mu./rMag; zeta is a number.
        zeta = vMag * vMag / 2 - mu/rMag;
//%Special Procedure when we have a parabolic orbit
//idx = eMag ~= 1; idx is a number.
        idx = 1 != eMag;
//a = NaN(size(eMag)); a is a number.
        a = NaN;
//p = NaN(size(eMag)); p is a number.
        p = NaN;
//if any(idx)
//    a(idx) = -mu./(2.*zeta(idx));
//p = a(idx).*(1-eMag(idx).^2);
//else
//a(idx) = Inf;
//p(idx) = (hMag(idx).^2)./mu;
//end
        if (idx) {
            a = -mu / 2 / zeta;
            p = a * (1 - eMag * eMag);
        }else {
            a = Infinity;
            p = hMag * hMag / mu;
        }
//%Compute the angles
//i = acos(h(3,:)./hMag); i is a number.
        i_theta = Math.acos(h[2] / hMag);
//O = acos(n(1,:)./nMag);
        O = Math.acos(n[0] / nMag);
//o = acos(dot(n,e)./(nMag.*eMag));
        o = Math.acos(n_v.dot(e_v) / nMag / eMag);
//nu = acos(dot(e,r)./(eMag.*rMag));
        nu = Math.acos(e_v.dot(r_v) / eMag / rMag);
//lonPer = acos(e(1,:)./eMag);
        lonPer = Math.acos(e[0] / eMag);
//argLat = acos(dot(n,r)./(nMag.*rMag));
        argLat = Math.acos(n_v.dot(r_v) / nMag / rMag);
//truLon = acos(r(1,:)./rMag);
        truLon = Math.acos(r[0] / rMag);
//%Account for those cases where satellite is in circular orbit
//O(n(1,:) == 0) = 0;
        if(0 == n[0]) O = 0;
//o(dot(n,e) == 0) = 0;
        if(0 == n_v.dot(e_v)) o = 0;
//lonPer(e(1,:) == 0) = 0;
        if(0 == e[0]) lonPer = 0;
//nu(dot(e,r) == 0) = 0;
        if(0 == e_v.dot(r_v)) nu = 0;
//argLat(dot(n,r) == 0) = 0;
        if(0 == n_v.dot(r_v)) argLat = 0;
//%Apply Quadrant Checks to All Determined Angles
//idx = n(2,:) < 0; if any(idx);  O(idx) = 2*pi - O(idx);  end
        idx = n[1] < 0;
        if(idx){
            O = 2 * Math.PI - O;
        }
//idx = e(3,:) < 0; if any(idx); o(idx) = 2*pi - o(idx); end
        idx = e[2] < 0;
        if(idx){
            o = 2 * Math.PI - o;
        }
//idx = dot(r,v) < 0; if any(idx); nu(idx) = 2*pi - nu(idx); end
        idx = r_v.dot(v_v) < 0;
        if(idx){
            nu = 2 * Math.PI - nu;
        }
//idx = e(2,:) < 0; if any(idx); lonPer(idx) = 2*pi-lonPer(idx);  end
        idx = e[1] < 0;
        if(idx){
            lonPer = 2 * Math.PI - lonPer;
        }
//idx = r(3,:) < 0; if any(idx); argLat(idx) = 2*pi - argLat(idx); end
        idx = r[2] < 0;
        if(idx){
            argLat = 2 * Math.PI - argLat;
        }
//idx = r(2,:) < 0; if any(idx); truLon(idx) = 2*pi - truLon(idx); end
        idx = r[1] < 0;
        if(idx){
            truLon = 2 * Math.PI - truLon;
        }
        console.log();
    }
    return new Array(a, eMag, i_theta, O, o, nu, truLon, argLat, lonPer, p);
//end
}