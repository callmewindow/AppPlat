/**
* Created by Taivas on 7/9/14.
*/
//%----------------------- Begin Code Sequence -----------------------------%
//% Purpose:                                                                %
//% Convert a given set of Keplerian Orbital Elements to state vectors in   %
//    % in the ECI frame of reference                                           %
//%                                                                         %
//%-------------------------------------------------------------------------%
//%                                                                         %
//% Inputs:                                                                 %
//%--------
//%p                      [1 x N]                         Semilatus Rectum
//%                                                       (km)
//%
//%e                      [1 x N]                         Eccentricity Magnitude
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
//%nu                     [1 x N]                         True Anomaly
//%                                                       (radians)
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
//%mu                     double                          Gravitational Constant
//%                                                       Defaults to Earth if
//    %                                                       not specified
//%
//% Outputs:
//%---------                                                                %
//%r_ECI                  [3 x N]                         Position Vector in
//    %                                                       ECI coordinate
//%                                                       frame of reference
//%
//%v_ECI                  [3 x N]                         Velocity vector in
//    %                                                       ECI coordinate
//%                                                       frame of reference
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
//    %------------------------------------------------------------------       %
//    function [r,v] = orb2rv(p,e,i,O,o,nu,truLon,argLat,lonPer,mu)
var orb2rv = function(p_p, e_p, i_p, O_p, o_p, nu_p, truLon_p, argLat_p, lonPer_p, mu){
    var length = p_p.length;

    var ietol;
    var idx;
    var rPQW = new Array(3);
    var vPQW = new Array(3);
    var PQW2IJK = new Array(9);

    var cO;
    var sO;
    var co;
    var so;
    var ci;
    var si;

    var r = new Array(length);
    var v = new Array(length);
//if ~exist('mu','var');  mu = 398600.4418; end
    if (!mu) {
        mu = 398600.4418;
    }
    for(var j = 0; j<length; j++) {
//%Make all inputs consistent w/ dimensions
//p = p(:); e = e(:); i = i(:); O = O(:); o = o(:); nu = nu(:);
//if exist('truLon','var')
//    truLon = truLon(:); argLat = argLat(:); lonPer = lonPer(:);
//end
//ietol = 1e-8;
        ietol = 1e-8;
//idx = e < ietol & mod(i,pi) < ietol;
        idx = e_p < ietol && (i_p[j] - Math.PI * Math.floor(i_p[j]/Math.PI)) < ietol;
//if any(idx); o(idx) = 0; O(idx) = 0; nu(idx) = truLon(idx); end
        if(idx){
            o_p[j] = 0;
            O_p[j] = 0;
            nu_p[j] = 0;
        }
//idx = e < ietol & mod(i,pi) > ietol;
        idx = e_p < ietol && (i_p[j] - Math.PI * Math.floor(i_p[j]/Math.PI)) > ietol;
//if any(idx); o(idx) = 0; nu(idx) = argLat(idx); end
        if(idx){
            o_p[j] = 0;
            nu_p[j] = argLat_p[j];
        }
//idx = e > ietol & mod(i,pi) < ietol;
        idx = e_p > ietol && (i_p[j] - Math.PI * Math.floor(i_p[j]/Math.PI)) < ietol;
//if any(idx); O(idx) = 0; o(idx) = lonPer(idx); end
        if(idx){
            O_p[j] = 0;
            o_p[j] = lonPer_p[j];
        }
//%Find rPQW and vPQW
//rPQW = cat(2,p.*cos(nu)./(1 +e.*cos(nu)),p.*sin(nu)./(1+e.*cos(nu)),zeros(size(nu)));
        rPQW = new Array(p_p[j] * Math.cos(nu_p[j]) / (1 + e_p[j] * Math.cos(nu_p[j])), p_p[j] * Math.sin(nu_p[j]) / ( 1 + e_p[j] * Math.cos(nu_p[j])), 0);
//vPQW = cat(2,-sqrt(mu./p).*sin(nu),sqrt(mu./p).*(e+cos(nu)),zeros(size(nu)));
        vPQW = new Array(-Math.sqrt(mu / p_p[j]) * Math.sin(nu_p[j]), Math.sqrt(mu / p_p[j]) * (e_p[j] + Math.cos(nu_p[j])), 0);
//        console.log(-Math.sqrt(mu / p_p[j]) * Math.sin(nu_p[j]));
//%Create Transformation Matrix
//PQW2IJK = NaN(3,3,size(p,1)); Initiallizing at the beginning.
//cO = cos(O); sO = sin(O); co = cos(o); so = sin(o); ci = cos(i); si = sin(i); Initiallizing at the beginning.
        cO = Math.cos(O_p[j]);
        sO = Math.sin(O_p[j]);
        co = Math.cos(o_p[j]);
        so = Math.sin(o_p[j]);
        ci = Math.cos(i_p[j]);
        si = Math.sin(i_p[j]);
//PQW2IJK(1,1,:) = cO.*co-sO.*so.*ci; PQW2IJK(1,2,:) = -cO.*so-sO.*co.*ci; PQW2IJK(1,3,:) = sO.*si;
//PQW2IJK(2,1,:) = sO.*co+cO.*so.*ci; PQW2IJK(2,2,:) = -sO.*so+cO.*co.*ci; PQW2IJK(2,3,:) = -cO.*si;
//PQW2IJK(3,1,:) = so.*si;            PQW2IJK(3,2,:) = co.*si;             PQW2IJK(3,3,:) = ci;
        PQW2IJK = [cO * co - sO * so * ci, -cO * so - sO * co * ci, sO * si,
                   sO * co + cO * so * ci, -sO * so + cO * co * ci, -cO * si,
                   so * si, co * si, ci];
//%Transform rPQW and vPQW to rECI and vECI
//r = multiDimMatrixMultiply(PQW2IJK,rPQW)';
//v = multiDimMatrixMultiply(PQW2IJK,vPQW)';
        r[j] = multiDimMatrixMultiply(PQW2IJK,rPQW);
        v[j] = multiDimMatrixMultiply(PQW2IJK,vPQW);
//end
    }
    return new Array(r, v);
//
}
//function c = multiDimMatrixMultiply(a,b)
//c = NaN(size(b));
//c(:,1) = sum(bsxfun(@times,a(1,:,:),permute(b,[3 2 1])),2);
//c(:,2) = sum(bsxfun(@times,a(2,:,:),permute(b,[3 2 1])),2);
//c(:,3) = sum(bsxfun(@times,a(3,:,:),permute(b,[3 2 1])),2);
//end
var multiDimMatrixMultiply = function(a_p, b_p){
    var c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a_p[i*3] * b_p[0] + a_p[i*3+1] * b_p[1] + a_p[i*3+2] * b_p[2];
    }
    return c;
}
