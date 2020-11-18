/**
 * Created by Taivas on 7/3/14.
 * math_extend.js, sylvester lib are needed.
 */
//% dengli add
//% r0 = [42000; 0; 0];
//% v0 = [0; 0; 3.0807];
//% t = 60;
//% mu = 398600.4418;
//
/* Input parameters
 * r0_p Array[n*3]={x1,y1,z1,x2,y2,z2...xn,yn,zn};
 * v0_p Array[n*3]={x1,y1,z1,x2,y2,z2...xn,yn,zn};
 * t    Array[n]={1,2,3,...,n};
 * mu   var=398600.4418;
 */
//function [r,v] = keplerUniversal(r0,v0,t,mu)
var keplerUniversal = function(r0_p,v0_p,t,mu){
    //%Purpose:
    //%Most effecient way to propagate any type of two body orbit using kepler's
    //%equations.
    //%-------------------------------------------------------------------------%
    //%                                                                         %
    //% Inputs:                                                                 %
    //%--------
    //%r_ECI                  [3 x N]                         Position Vector in
    //%                                                       ECI coordinate
    //%                                                       frame of reference
    //%
    //%v_ECI                  [3 x N]                         Velocity vector in
    //%                                                       ECI coordinate
    //%                                                       frame of reference
    //%
    //%t                      [1 x N]                         time vector in
    //%                                                       seconds
    //%
    //%mu                     double                          Gravitational Constant
    //%                                                       Defaults to Earth if
    //%                                                       not specified
    //% Outputs:
    //%---------                                                                %
    //%r_ECI                  [3 x N]                         Final position
    //%                                                       vector in ECI
    //%
    //%v_ECI                  [3 x N]                         Final velocity
    //%                                                       vector in ECI
    //%--------------------------------------------------------------------------
    //% Programmed by Darin Koblick 03-04-2012                                  %
    //%--------------------------------------------------------------------------
//    return value
    var length = r0_p.length/3;
    var r0;
    var r0_v; //vector of r0
    var v0;
    var v0_v; //vector of v0
    var r = new Array(length);
    var v = new Array(length);
    var X0;
    var v0Mag;
    var r0Mag;
    var alpha;
    var idx;

    var h = Vector.Zero(3);
    var hMag;
    var p;
    var s;
    var w;

    var a;

    var err;
    var dr0v0Smu;
    var Smut;

    var rr;
    var X02;
    var X03;
    var psi;
    var c23;
    var c2;
    var c3;
    var X0tOmPsiC3;
    var X02tC2;
    var Xn;

    var f;
    var g;
    var gdot;
    var fdot;
//    if ~exist('mu','var'); mu = 398600.4418; end; mu is numbers
    if (!mu) {
        mu = 398600.4418;
    }
    //    tol = 1e-8;
    var tol = 1e-8;
    for(var j = 0; j<length; j++) {
        r0 = [r0_p[j*3], r0_p[j*3+1], r0_p[j*3+2]];
        v0 = [v0_p[j*3], v0_p[j*3+1], v0_p[j*3+2]];
        r0_v = Vector.create(r0);
        v0_v = Vector.create(v0);
        //    v0Mag = sqrt(sum(v0.^2,1));  r0Mag = sqrt(sum(r0.^2,1)); both are numbers.
        v0Mag = Math.sqrt(v0[0] * v0[0] + v0[1] * v0[1] + v0[2] * v0[2]);
        r0Mag = Math.sqrt(r0[0] * r0[0] + r0[1] * r0[1] + r0[2] * r0[2]);
        //    alpha = -(v0Mag.^2)./mu + 2./r0Mag; alpha is numbers.
        alpha = -v0Mag * v0Mag / mu + 2 / r0Mag;
//    %% Compute initial guess (X0) for Newton's Method
//    X0 = NaN(size(t)); //X0 is a number.
        X0 = NaN;
//    %Check if there are any Eliptic/Circular orbits
//    idx = alpha > 0.000001; idx is a numbers.
        idx = alpha > 0.000001;
//    if any(idx)
//        X0(idx) = sqrt(mu).*t(idx).*alpha(idx);
//    end
        if (idx) {
            X0 = Math.sqrt(mu) * t[j] * alpha;
        }
//    %Check if there are any Parabolic orbits
//    idx = abs(alpha) < 0.000001;
        idx = Math.abs(alpha) < 0.000001;
//    if any(idx)
//        h = cross(r0(:,idx),v0(:,idx)); hMag = sqrt(sum(h.^2,1));
//    p = (hMag.^2)./mu; s = acot(3.*sqrt(mu./(p.^3)).*t(idx))./2;
//    w = atan(tan(s).^(1/3)); X0(idx) = sqrt(p).*2.*cot(2.*w);
//    end
        if (idx) {
            h = r0_v.cross(v0_v);
            hMag = Math.sqrt(h.elements[0] * h.elements[0]
                + h.elements[1] * h.elements[1]
                + h.elements[2] * h.elements[2]);
            p = hMag * hMag / mu;
            s = Math.acot(3 * Math.sqrt(mu / (p * p * p)) * t[j]) / 2;
            w = Math.atan(Math.pow(Math.tan(s), 1 / 3));
            X0 = Math.sqrt(p) * 2 * Math.cot(2 * w);
        }
//    %Check if there are any Hyperbolic orbits
//    idx = alpha < -0.000001;
        idx = alpha < -0.000001;
//    if any(idx)
//        a = 1./alpha(idx);
//    X0(idx) = sign(t(idx)).*Math.sqrt(-a).*...
//        log(-2.*mu.*alpha(idx).*t(idx)./ ...
//    (dot(r0(:,idx),v0(:,idx))+sign(t(idx)).*Math.sqrt(-mu.*a).*...
//        (1-r0Mag(idx).*alpha(idx))));
//    end
        if (idx) {
            a = 1 / alpha;
            X0 = Math.sign(t[j]) * Math.sqrt(-a)
                * Math.log(-2 * mu * alpha * t[j] / r0_v.dot(v0_v) + Math.sign(t[j]) * Math.sqrt(-mu * a) * (1 - r0Mag[j] * alpha));
        }
//    %% Newton's Method to converge on solution
//    % Declare Constants that do not need to be computed within the while loop
//    err = Inf;
        err = Infinity;
//    dr0v0Smu = dot(r0,v0)./sqrt(mu); dr0v0Smu is a number.
        dr0v0Smu = r0_v.dot(v0_v) / Math.sqrt(mu);
//    Smut = sqrt(mu).*t; Smut is a number.
        Smut = Math.sqrt(mu) * t[j];
//    while any(abs(err) > tol)
//    X02 = X0.^2;
//    X03 = X02.*X0;
//    psi = X02.*alpha;
//    [c2,c3] = c2c3(psi);
//    X0tOmPsiC3 = X0.*(1-psi.*c3);
//    X02tC2 = X02.*c2;
//    r = X02tC2 + dr0v0Smu.*X0tOmPsiC3 + r0Mag.*(1-psi.*c2);
//    Xn = X0 + (Smut-X03.*c3-dr0v0Smu.*X02tC2-r0Mag.*X0tOmPsiC3)./r;
//    err = Xn-X0;
//    X0 = Xn;
//    end
        while (Math.abs(err) > tol) {
            X02 = X0 * X0;  //X02 is a number
            X03 = X02 * X0;  //X03 is a number
            psi = X02 * alpha;  //psi is a number
            c23 = c2c3(psi);  //c23 is a number
            c2 = c23[0];  //c2 is a number
            c3 = c23[1];  //c3 is a number
            X0tOmPsiC3 = X0 * (1 - psi * c3);  //X0t0mPsiC3 is a number
            X02tC2 = X02 * c2;  //X02tC2 is a number
            rr = X02tC2 + dr0v0Smu * X0tOmPsiC3 + r0Mag * (1 - psi * c2);  //rr is a number TODO
            Xn = X0 + (Smut - X03 * c3 - dr0v0Smu * X02tC2 - r0Mag * X0tOmPsiC3) / rr;  //Xn is a number
            err = Xn - X0;  //err is a number
            X0 = Xn;  //XO is a number
        }
//    f = 1 - (Xn.^2).*c2./r0Mag; g = t - (Xn.^3).*c3./Math.sqrt(mu); f,g are both numbers.
        f = 1 - (Xn * Xn) * c2 / r0Mag;
        g = t - (Xn * Xn * Xn) * c3 / Math.sqrt(mu);
//    gdot = 1 - c2.*(Xn.^2)./r; fdot = Xn.*(psi.*c3-1).*Math.sqrt(mu)./(r.*r0Mag); gdot, fdot are numbers.
        gdot = 1 - c2 * (Xn * Xn) / rr;
        fdot = Xn * (psi * c3 - 1) * Math.sqrt(mu) / (rr * r0Mag);
//    r = bsxfun(@times,f,r0) + bsxfun(@times,g,v0); r is array of vector
//    v = bsxfun(@times,fdot,r0) + bsxfun(@times,gdot,v0); v is array of vector
        r[j] = new Array(3);
        v[j] = new Array(3);
        for (var i = 0; i < 3; i++) {
            r[j][i] = f * r0[i] + g * v0[i];
            v[j][i] = fdot * r0[i] + gdot * v0[i];
        }
    }
//    %% Ensure Solution Integrity
//    %idx = round((f.*gdot - fdot.*g)./tol).*tol ~= 1; r(:,idx) = NaN; v(:,idx) = NaN;
    return new Array(r,v);
};
/*
 function [c2,c3] = c2c3(psi)
 %Vallado pg. 71 Algorithm 1
 c2 = NaN(size(psi));
 c3 = NaN(size(psi));
 idx = psi > 1e-6;
 if any(idx)
 c2(idx) = (1-cos(sqrt(psi(idx))))./psi(idx);
 c3(idx) = (sqrt(psi(idx))-sin(sqrt(psi(idx))))./sqrt(psi(idx).^3);
 end
 idx = psi < -1e-6;
 if any(idx)
 c2(idx) = (1 - cosh(sqrt(-psi(idx))))./psi(idx);
 c3(idx) = (sinh(sqrt(-psi(idx)))-sqrt(-psi(idx)))./sqrt(-psi(idx).^3);
 end
 idx = abs(psi) <= 1e-6;
 if any(idx)
 c2(idx) = 0.5;
 c3(idx) = 1/6;
 end
 end
 */
var c2c3 = function(psi) {
//    %Vallado pg. 71 Algorithm 1
//    c2 = NaN(size(psi));
//    c3 = NaN(size(psi));
    var length = psi.length;
    var c2 = NaN;
    var c3 = NaN;
//    idx = psi > 1e-6;
    var idx = psi > 1e-6;
//    if any(idx)
//        c2(idx) = (1-cos(sqrt(psi(idx))))./psi(idx);
//        c3(idx) = (sqrt(psi(idx))-sin(sqrt(psi(idx))))./sqrt(psi(idx).^3);
//    end
    if (idx) {
        c2 = (1 - Math.cos(Math.sqrt(psi))) / psi;
        c3 = (Math.sqrt(psi) - Math.sin(Math.sqrt(psi)))/Math.sqrt(psi * psi * psi);
    }
//    idx = psi < -1e-6;
    idx = psi < -1e-6;
//    if any(idx)
//        c2(idx) = (1 - cosh(sqrt(-psi(idx))))./psi(idx);
//    c3(idx) = (sinh(sqrt(-psi(idx)))-sqrt(-psi(idx)))./sqrt(-psi(idx).^3);
//    end
    if(idx) {
        c2 = (1 - Math.cosh(Math.sqrt(-psi)))/psi;
        c3 = (Math.sinh(Math.sqrt(-psi)) - Math.sqrt(-psi))/Math.sqrt(-psi * psi * psi);
    }
//    idx = abs(psi) <= 1e-6;
    idx = Math.abs(psi) <= 1e-6;
//    if any(idx)
//        c2(idx) = 0.5;
//    c3(idx) = 1/6;
//    end
    if(idx) {
        c2 = 0.5;
        c3 = 1/6;
    }
    return new Array(c2,c3);
};