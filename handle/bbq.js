const R1 = 5;
const R2 = 20;
const R3 = 22;

const L = 60;
const T = 5;

const FN = 60;

function main() {
  var s = cylinder({h: L, r:R2, fn: FN});

  s = s.union(cylinder({h: T, r:R3, fn: FN}));
  s = s.union(cylinder({h: T, r:R3, fn: FN}).translate([0,0,L-T]));

  s = s.union(cylinder({r1: R3, r2: R2, h: T, fn: FN}).translate([0,0,T]));

  s = s.union(cylinder({r1: R2, r2: R3, h: T, fn: FN}).translate([0,0,L-2*T]));

  s = s.subtract(cylinder({h: L, r:R1, fn: FN}));

  return s;
}
