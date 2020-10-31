const D1 = 108;
const D2 = 108+5;
const D3 = 40;
const FN = 220;

function main() {
  var s = cylinder({r: D1/2, h:10, fn: FN});
  s = s.union(cylinder({r1: D1/2, r2:D2/2, h:10, fn: FN}).translate([0,0,10]));
  s = s.union(cylinder({r1: D2/2, r2:D3/2, h:50, fn: FN}).translate([0,0,20]));
  return s;
}
