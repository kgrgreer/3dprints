function main() {
  var s = cube({size:[60,10,2.5],radius:0.25, center: true, round:true})
  var peg = cube({size:[2.5,15,2.5],radius:1, center: true, round:true}).translate([0,10,0])
  var notch = cube({size:[4,1,2],center: true}).translate([0,11,1.4])
  s = s.union(peg);
  s = s.subtract(notch)
  return s.translate([0,0,1.1]);
}
