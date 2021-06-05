const H = 12+6;
const D = 54;
const T = 2;
const FN = 260;
const BOLT_R = 2.05;

function holder() {
    var s = cube({size:[24.5,10,H], round:true, radius:3, fn: 40}).translate([-4,-5,0]);
    var c = cylinder({r:BOLT_R, h:20}).rotateX(90).translate([6,10,4]);
    s = s.subtract(c);
    s = s.subtract(c.translate([0,0,10]));
    s = s.subtract(c.scale([1.5,1.5,2.2]).translate([4,0,0]));

    return s;
}

function main() {
  var s = cylinder({r: D/2+T, h:H, fn: FN});
  s = s.union(holder().translate([D/2+T-2,0,0]));
  s = s.subtract(cylinder({r: D/2, h:H, fn: FN}));
  s = s.subtract(cube({size:[100,1.5,100]}).translate([0,-0.75,0]));
  return s;
}
