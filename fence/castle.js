const WIDTH  = 26.2;
const HEIGHT = 10;

// 36.5
function pyramid(size) {
  var s = cube({size:[size, size, 15], center:[true,true,false]});

  var s2 = cube({size: [100,100,100]}).rotateY(-50).translate([size/2,-size/2,0]);
  s = s.subtract(s2);

  s = s.rotateZ(90);
  s = s.subtract(s2);

  s = s.rotateZ(90);
  s = s.subtract(s2);

  s = s.rotateZ(90);
  s = s.subtract(s2);

  return s;
}

function main() {
    var s = pyramid(WIDTH+10).translate([0,0,HEIGHT])
    var base = cube({size:[WIDTH,WIDTH,HEIGHT], center:[true,true,false]})
    s = s.union(base)
    var l = cube({size: [2,WIDTH,37]}).translate([13,-13.1,-27])
    var l2 = cube({size: [WIDTH,WIDTH,2], center:[true,true,false]}).translate([0,0,-27])
    s = s.union(l)
    s = s.union(l2)
    return s;
}
