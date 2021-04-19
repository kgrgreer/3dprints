var D1 = 11.7;
var D2 = 40;
var H  = 1.2;

function main() {
  var s = cylinder({r:D2/2, h:H});

  s = s.subtract(cylinder({r:D1/2, h:H}));

  for ( var i = 0 ; i < 8 ; i++ ) {
      s = s.subtract(cylinder({r:1, h:H}).translate([D1/2,0,0]).rotateZ(360/8*i));
      s = s.subtract(cylinder({r:3, h:H}).translate([D1+2,0,0]).rotateZ(360/8*(0.5+i)));
  }
  return s;
}
