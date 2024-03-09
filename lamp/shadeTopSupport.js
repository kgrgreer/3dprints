const R    = 55;
const R2   = 33/2;
const H    = 35;
const FN   = 120;


function holder() {
  var s = cube({size:[1000,4,8], center:[1,1,0]});
  s = s.union(s.rotateZ(90))

  s = s.union(cylinder({r:40/2,h:8}))
  s = s.subtract(cylinder({r:33/2,h:8}))

return s;
}

function main() {
    var s      = cylinder({r:148/2, h: 2*H, fn: FN});
    var inside = cylinder({r:148/2-1.2, h: 2*H, fn: FN});

    s = s.subtract(inside);
    s = s.union(holder().intersect(inside));
    s = s.intersect(cube({size:[1000,1000,H], center:[1,1,0]}))

    return s;
}
