const D = 40;
const L = 100;
const FN = 36;
const T = 2;

function main() {
  var s = cylinder({r: D/2, h:L, fn: FN})
    .union(cylinder({r: D/2-T, h:L, fn: FN}));
  s = s.subtract(cube({size:[50,25,L-20]}).translate([-15,-12.5,10]));
  s = s.union(cylinder({r: D/2+5, h:5, fn: FN}));
  var p = cylinder({r: 5, h:L, fn: FN}).translate([D/2+8,0,0])
  for ( var i = 0 ; i < 10 ; i ++ )
    s = s.subtract(p.rotateZ(36*i));
  return s;

}
