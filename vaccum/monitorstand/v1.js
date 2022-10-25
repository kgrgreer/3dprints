const T = 9;
const a = 10;

function monitor() {
    return cube({size:[200,10,100], center: [1,1,0]}).rotateX(10).translate([0,0,3]).setColor([0.4,0.4,0.4]);
}

function holder() {
  var s = cube({size:[50,50,50]}).rotateZ(45).translate([0,-40,0]);
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,14,-20]));
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,0,6]));

  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(-25).translate([0,-140,30]));
  s = s.scale([1.6,1,1])
  return s;
}

function main() {
  var s = holder();

  s = s.subtract(monitor());
  return s;
}
