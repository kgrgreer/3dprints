const W = 200;
const H = 140;
const T = 4;

function main() {
  var s = cube({size:[W,H,5],center:[1,1,0]});

  s = s.subtract(cube({size:[W-T*2,H-T*2,1],center:[1,1,0]}).translate([0,0,4]));
  return s;
}
