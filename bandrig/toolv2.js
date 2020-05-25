function main() {
  var s = cube({size:[45,10,4],radius:0.25, center: true, round:true})
  var peg = cube({size:[4,35,4],radius:1, center: true, round:true}).translate([0,15,0])
  var notch = cube({size:[4,1.25,2.5],center: true}).union(cube({size:[4,2,1.25],center: true}).translate([0,0.375,-1])).translate([0,18,1.4])
  var endnotch = cube({size:[4,3,1],center: true}).translate([0,32,0])
  var holering = cylinder({r:3.5, h:4.5}).translate([-22,0,-2]);
  var hole = cylinder({r:2, h:30}).translate([-22,0,-5]);

  s = s.union(cylinder({r:5,h:4}).translate([22,0,-2]));
  s = s.union(cylinder({r:5,h:4}).translate([-22,0,-2]));
  s = s.union(peg);
  s = s.subtract(notch)
  s = s.subtract(endnotch)
  s = s.union(holering)
  s = s.subtract(hole)
  return s.translate([0,0,2]);
}
