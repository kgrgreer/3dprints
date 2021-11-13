const R1 = 6;
const R2 = 12;
const R3 = 18;

const L = 125;
const T = 8;

const FN = 80;

function main() {
  var s = cylinder({h: L, r:R2, fn: FN});

  s = s.union(cylinder({h: T, r:R3, fn: FN}));
  s = s.union(cylinder({h: T, r:R3, fn: FN}).translate([0,0,L-T]));

  s = s.union(cylinder({r1: R3, r2: R2, h: 1.6*T, fn: FN}).translate([0,0,T]));

  s = s.union(cylinder({r1: R2, r2: R3, h: 1.6*T, fn: FN}).translate([0,0,L-2.6*T]));

  s = s.union(sphere({r:R3-1, fn: FN}).scale([1,1,3.25]).translate([0,0,L/2]));

  s = s.subtract(cylinder({h: L, r:R1, fn: FN}));

  return s;
}
