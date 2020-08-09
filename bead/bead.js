const FN = 13;

function main () {
  var s = sphere({r: 8, fn:FN});
  s = s.subtract(cube({size:[20,20,20], center:[true,true,false]}).translate([0,0,5]))
  s = s.subtract(cube({size:[20,20,-20], center:[true,true,false]}).translate([0,0,-5]))
  s = s.translate([0,0,8]).subtract(cylinder({r:4, h:20, fn:FN})).scale([1,1,1])

  s = s.scale(0.78);
  return s;
}
