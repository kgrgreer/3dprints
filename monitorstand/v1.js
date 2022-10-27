const T = 9;
const a = 10;
const FN = 150;

function monitor() {
    var s = cube({size:[360,10,230], center: [1,1,0]});

    s = s.subtract(s.rotateX(70).translate([0,10,-7]));

    s = s.translate([0,0,3]).rotateX(10).translate([0,0,3]).setColor([0.4,0.4,0.4]);

    return s;
}

function holder() {
  var s = cylinder({r:50, h:72, fn: FN}).rotateZ(45).translate([0,-10,0]);
  s = s.subtract(s.scale([0.92,0.92,1]))
  s = s.union(cube({size:[92,10,8], center:[1,1,0]}))
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,10,-20]));
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,0,8]));

  s = s.scale([1.2,1.3,1])
  s = s.subtract(cube({size:[200,100,100]}).translate([0,0,10]).rotateX(50).translate([-100,-70,-5]))

  return s.scale([1.5,1.5,1.5]);
}

function main() {
  var s = holder();

  s = s.subtract(monitor());

  s = s.subtract(cylinder({r:30, h: 200, fn: FN}).rotateY(90).translate([-100,-48,0]).scale([1,1,1.8]))
  return s;
}
