const T = 9;
const a = 10;
const FN = 150;

function monitor() {
    var s = cube({size:[360,10,230], center: [1,1,0]});

    s = s.subtract(s.rotateX(70).translate([0,10,-7]));

    s = s.translate([0,0,0]).rotateX(10).translate([0,0,3]).setColor([0.4,0.4,0.4]);

    return s;
}

function holder() {
  var s = cylinder({r1:35, r2:50, h:72, fn: FN});
  s = s.subtract(cylinder({r1:35*0.9, r2:54*0.85, h:72, fn: FN}))

  s = s.rotateZ(45).translate([0,-10,0]);
  s = s.union(cube({size:[92,10,8], center:[1,1,0]}))
  s = s.subtract(cube({size:[140,100,100], center:[1,0,0]}).rotateX(10).translate([0,8,-20]));
  s = s.subtract(cube({size:[140,100,100], center:[1,0,0]}).rotateX(10).translate([0,0,7]));

  s = s.scale([1.2,1.3,1])
  s = s.subtract(cube({size:[300,100,100]}).translate([0,0,10]).rotateX(60).translate([-100,-50,-5]))

  return s.scale([1.5,1.5,1.5]);
}

function main() {
  var s = holder();

  s = s.subtract(monitor());

  var c = cylinder({r:30, h: 200, fn: FN}).rotateY(90).scale([1,0.8,2.6]).rotateX(-14.5).translate([-100,-48,0]);
  c = c.intersect(cube({size:[200,200,200], center: [1,1,0]}).translate([0,0,3]))
  s = s.subtract(c)
  return s;
}
