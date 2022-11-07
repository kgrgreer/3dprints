function main() {
    var s = cylinder({r:7.5, h:40, fn:140})
    s = s.subtract(cylinder({r:6, h:20}).translate([0,0,4]))
    var leg = cube({size:[56,50,10], center:[1,0,0]}).translate([0,0,0]);
    leg = leg.subtract(cylinder({r:22,h:40, fn:140}).translate([0,28,0]).scale([1,1.6,1]))
    s = union(
      s,
      s.translate([-14,0,0]),
      s.translate([14,0,0]),
      s.translate([-28,0,0]),
      s.translate([28,0,0]),
      leg
    );
    s = s.union(cube({size:[57,15,40], center:[1,1,0]}))
    s = s.subtract(cylinder({r:6, h:50}).translate([0,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([-14,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([14,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([-28,0,4]))
    s = s.subtract(cylinder({r:6, h:50}).translate([28,0,4]))
    s = s.rotateX(-6);
    s = s.translate([0,0,-1.5]);
    s = s.intersect(cube({size:[1000,70,30], center:[1,1,0]}))
    return s;
}
