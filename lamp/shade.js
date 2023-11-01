const R    = 55;
const R2   = 15;
const H    = 145;
const FN   = 120;


function holder() {
  var s = cube({size:[1000,4,8], center:[1,1,0]});
  s = s.union(s.rotateZ(90))

  s = s.union(cylinder({r:12,h:10}))
  s = s.subtract(cylinder({r:5,h:10}))

  return s.translate([0,0,R+7]);
}

function main() {
    s = sphere({r:R+20, fn: FN});
    var inside = sphere({r:R+20-0.8, fn: FN});
    s = s.subtract(inside);

    s = s.union(holder().intersect(inside));

    s = s.translate([0,0,-10]);
    s = s.intersect(cube({size:[1000,1000,R], center:[1,1,0]}))

   s = s.scale([1,1,2.5])
    s = s.rotateX(180);
    return s;
}
