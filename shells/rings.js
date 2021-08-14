const D = 0.9;

function t(s) {
  return s.rotateX(15).rotateY(15).translate([0.15,1,2]);
}

function ring(s) {
    return cylinder({r1: s, r2: s*D, h:s/2}).subtract(cylinder({r1: s-0.1, r2: s*D-0.1, h:s/2}));
}

function snail(s) {
  if ( s < 5 ) return sphere();

  return ring(s).union(t(snail(s*D)));
}

function main() {
  return snail(10);
}
