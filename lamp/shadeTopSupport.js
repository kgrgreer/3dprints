const R    = 40;
const R2   = 33/2;
const H    = 145;
const FN   = 120;


function holder() {
  var s = cube({size:[1000,4,10], center:[1,1,0]});
  s = s.union(s.rotateZ(90))

  s = s.union(cylinder({r:40/2,h:10}))
  s = s.subtract(cylinder({r:33/2,h:10}))

  return s.translate([0,0,10]);
}

function main() {
        s = sphere({r:R+20, fn: FN});
    var inside = sphere({r:R+20-1, fn: FN});
    s = s.subtract(inside);

    s = s.scale([1,1,3]);
    inside = inside.scale([1,1,3]);

    s = s.union(holder().intersect(inside));

    s = s.translate([0,0,-10]);
    s = s.intersect(cube({size:[1000,1000,R], center:[1,1,0]}))

    return s;
}
