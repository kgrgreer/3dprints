const FN = 18;
const HOLE_D = 4.8;
const H = 12;



function f(t) {
  t = t * Math.sqrt(Math.sqrt(Math.sqrt(t))) + t * (1-t);
  return cube({size:[1+t*1.62, 1+t*t*t*t*0.8, 0.5+t*t*t/2], round: true}).translate([3*Math.sqrt(t),5*t*t,1.2*0.7*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t]);
}

function merge(f, c) {
  var a = [];
  for ( var i = 0 ; i < c ; i++ ) a.push(f(i/(c-1)));
  return union.apply(null, a);
}

function main() {
  var s = merge(f, 25).translate([-0.5, 0,0]);
  // s = union(s, s.scale([-1,1,1]))

  s = s.scale(12).translate([0,-65,0]);

  var hole = cylinder({fn: FN, r:HOLE_D/2, h: H*5}).translate([0,-58,0]);
  s = s.subtract(hole.translate([-11,0,0]));
  s = s.subtract(hole.translate([11,0,0]));

  for ( var i = 0 ; i < 4 ; i++ ) {
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([37+i*7,12.5,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([37+i*7, 0, H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([-37-i*7,12.5,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([-37-i*7,0,H+0.6]));

    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([37+(-0.5+i)*7,12.5/2,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([-37-(-0.5+i)*7,12.5/2,H+0.6]));
  }

  return s;
}
