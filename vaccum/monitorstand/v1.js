const T = 9;
const a = 10;
const FN = 136;

function monitor() {
    var s = cube({size:[360,10,230], center: [1,1,0]});

    s = s.subtract(s.rotateX(70).translate([0,10,-7]));

    s = s.translate([0,0,3]).rotateX(10).translate([0,0,3]).setColor([0.4,0.4,0.4]);

    return s;
}

function holder() {
  var s = cube({size:[50,50,50]}).rotateZ(45).translate([0,-40,0]);
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,14,-20]));
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,0,6]));

  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(-25).translate([0,-140,30]));
  s = s.scale([1.6,1,1])
  return s;
}

function holder2() {
  var s = cylinder({r:50, h:70, fn: FN}).rotateZ(45).translate([0,-10,0]);
  s = s.subtract(s.scale([0.85,0.85,1]))
  s = s.union(cube({size:[92,10,8], center:[1,1,0]}))
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,10,-20]));
  s = s.subtract(cube({size:[100,100,100], center:[1,0,0]}).rotateX(10).translate([0,0,8]));

  s = s.scale([1.2,1.3,1])
  s = s.subtract(cube({size:[200,100,100]}).translate([0,0,10]).rotateX(50).translate([-100,-70,-5]))

  return s.scale([1.5,1.5,1.5]);
}

function main() {
  var s = holder2();

  s = s.subtract(monitor());

//  s = s.subtract(cylinder({r:20, h: 200}).rotateY(90).translate([-100,-40,30]).scale([1,1,1]))
  return s;
}
