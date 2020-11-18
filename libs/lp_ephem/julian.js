/**
* Created by Taivas on 7/10/14.
*/
//function jdate = julian (month, day, year)
//
var julian = function(month, day, year) {
//    % Julian date
//
//% Input
//
//%  month = calendar month [1 - 12]
//%  day   = calendar day [1 - 31]
//%  year  = calendar year [yyyy]
//
//% Output
//
//%  jdate = Julian date
//
//% special notes
//
//%  (1) calendar year must include all digits
//
//%  (2) will report October 5, 1582 to October 14, 1582
//    %      as invalid calendar dates and stop
//
//% Orbital Mechanics with MATLAB
//
//    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
//    y = year;
//    m = month;
//    b = 0;
//    c = 0;
//
    var y = year;
    var m = month;
    var b = 0;
    var c = 0;
//  if (m <= 2)
//      y = y - 1;
//      m = m + 12;
//  end
    if (m <= 2) {
        y--;
        m += 12;
    }

//
//if (y < 0)
//    c = -.75;
//end
    if (y < 0) {
        c = -0.75;
    }
//
//% check for valid calendar date
//
//if (year < 1582)
//    % null
//elseif (year > 1582)
//a = fix(y / 100);
//b = 2 - a + floor(a / 4);
//elseif (month < 10)
//% null
//elseif (month > 10)
//a = fix(y / 100);
//b = 2 - a + floor(a / 4);
//elseif (day <= 4)
//% null
//elseif (day > 14)
//a = fix(y / 100);
//b = 2 - a + floor(a / 4);
//else
//clc; home;
//
//fprintf('\n\n  this is an invalid calendar date!!\n');
//
//keycheck;
//
//return;
//end
//
    if (year < 1582) {
    }else if (year > 1582) {
        var a = Math.fix(y / 100);
        b = 2 - a + Math.floor(a / 4);
    }else if (month < 10){
    }else if (month > 10) {
        a = Math.fix(y / 100);
        b = 2 - a + Math.floor(a / 4);
    }else if (day <= 4){
    }else if (day > 14) {
        a = Math.fix(y / 100);
        b = 2 - a + Math.floor(a / 4);
    }else{
        console.log('\n  this is an invalid calendar date!!\n');
    }
//jd = fix(365.25 * y + c) + fix(30.6001 * (m + 1));
//
    var jd = Math.fix(365.25 * y + c) + Math.fix(30.6001 * (m + 1));
//jdate = jd + day + b + 1720994.5;
    return jd + day + b + 1720994.5;
//
}