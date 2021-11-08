const R1 = 6;
const R2 = 17;
const R3 = 20;

const L = 127;
const T = 10;

const FN = 80;

function main() {
  var s = cylinder({h: L, r:R2, fn: FN});

  s = s.union(cylinder({h: T, r:R3, fn: FN}));
  s = s.union(cylinder({h: T, r:R3, fn: FN}).translate([0,0,L-T]));

  s = s.union(cylinder({r1: R3, r2: R2, h: T, fn: FN}).translate([0,0,T]));

  s = s.union(cylinder({r1: R2, r2: R3, h: T, fn: FN}).translate([0,0,L-2*T]));

  s = s.subtract(cylinder({h: L, r:R1, fn: FN}));

  return s;
}
