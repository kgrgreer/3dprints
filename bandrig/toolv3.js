function main() {
  var s = cube({size:[45,10,2.5],radius:0.25, center: true, round:true})
  var peg = cube({size:[3.5,50,2.5],radius:0.5, center: true, round:true}).translate([0,20,0])
  var notch = cube({size:[1.5,38,10],center: true}).translate([0,25,1.4])
  var holering = cylinder({r:3.5, h:1.75}).translate([-22,0,0]);
  var hole = cylinder({r:2, h:30}).translate([-22,0,-5]);

  s = s.union(cylinder({r:5,h:2.5}).translate([22,0,-1.25]));
  s = s.union(cylinder({r:5,h:2.5}).translate([-22,0,-1.25]));
  s = s.union(peg);
  s = s.subtract(notch)
  s = s.union(holering)
  s = s.subtract(hole)
  return s.translate([0,0,2]);
}
