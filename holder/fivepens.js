function main() {
    const W = 14.5;
    var s = cylinder({r:7.5, h:40, fn:140})
    s = s.subtract(cylinder({r:6, h:25}).translate([0,0,4]))
    var leg = cube({size:[70,50,10], center:[1,0,0]}).translate([0,0,0]);
    leg = leg.subtract(cylinder({r1:18,r2:28, h:20, fn:140}).translate([0,28,0]).scale([1.1,1.6,1]))
    leg = leg.intersect(cylinder({r1:34,r2:24, h:20, fn:140}).translate([0,28,0]).scale([1.1,1.6,1]))
    leg = leg.rotateX(-5);
    s = union(
      s,
      s.translate([-W,0,0]),
      s.translate([W,0,0]),
      s.translate([-2*W,0,0]),
      s.translate([2*W,0,0]),
      cylinder({r:7.5, h:25, fn:140}).scale([0.6,1.05,1]).translate([2*W,0,-10]).rotateX(-20).translate([0,-5,0]),
      cylinder({r:7.5, h:25, fn:140}).scale([0.6,1.05,1]).translate([-2*W,0,-10]).rotateX(-20).translate([0,-5,0]),
      leg
    );
    s = s.union(cube({size:[4*W,15,40], center:[1,1,0]}))
    s = s.subtract(cylinder({r:6, h:50}).translate([0,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([-W,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([W,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([-2*W,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([2*W,0,4]))
    s = s.rotateX(-6);
    s = s.translate([0,0,-1.5]);
    s = s.intersect(cube({size:[1000,70,35], center:[1,1,0]}))
    return s;
}
