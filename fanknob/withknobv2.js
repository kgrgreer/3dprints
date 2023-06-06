const R2 = 6.2/2*1.03;
const R1 = R2+2.5;
const R3 = R1+1.5;
const H1 = 10;
const H2 = 8;

function main() {
  var s = cylinder({r:R3, h: H1+0.5});
  var h1 = cylinder({r:R2, h: H2});
  var h2 = cylinder({r:R2+0.05, h: H1});
  var screw = cylinder({r:1.2, h: 10}).rotateX(90).translate([0,10,3]);

  h1 = h1.subtract(screw);
  h1 = h1.subtract(cube({size:[10,10,10], center:[1,0,0]}).translate([0,R2-5/2,0]));
  h2 = h2.subtract(cube({size:[10,10,10], center:[1,0,0]}).translate([0,1,0]));

  s = s.subtract(h2.translate([0,0,-2]).scale([1.03,1.03,1]));
  s = s.union(h1.translate([0,0,H1+0.5]).rotateZ(180))
  s = s.subtract(screw);

  s = s.union(cylinder({r: 12, h: 12, fn:12}).rotateZ(360/24).translate([0,0,10]));

s = s.subtract(cube({size:[20,10,10], center:[1,0,0]}).translate([0,R1,0]));
  s = s.rotateX(180);

  return s;
}
