const R2 = 6.2/2*1.01;
const R1 = R2+1;
const H1 = 5;
const H2 = 8;

function main() {
  var s = cylinder({r:R1, h: H1+1});
  var h1 = cylinder({r:R2, h: H2});
  var h2 = cylinder({r:R2, h: H1});

  h1 = h1.subtract(cube({size:[10,10,10], center:[1,0,0]}).translate([0,R2-5/2,0]));
  h2 = h2.subtract(cube({size:[10,10,10], center:[1,0,0]}).translate([0,1,0]));

  s = s.subtract(h2.translate([0,0,-2]));
  s = s.union(h1.translate([0,0,H1+1]).rotateZ(90))
  return s;
}
