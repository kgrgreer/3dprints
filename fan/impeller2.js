const R = 65;
const H = 30;
const N = 36;

function blade() {
    var s = cube({size:[5, 0.8, H]});

    s = s.rotateZ(-45);
    s = s.translate([R-5, 0, 0])

    return s;
}

function main () {
    var c = cylinder({r:R, h:.6, fn: 4*36})
    var s = c;
 s = s.union(c.subtract(c.scale([0.925,0.925,1])).translate([0,0,H]));

s = s.union(sphere({r:/*14*/8}))
  s = s.union(cylinder({r:6/2+2,h:14,fi:4*36}));
  s = s.subtract(cylinder({r:6.2/2,h:22,fi:36}));
  s = s.subtract(cylinder({r:6.5/2,h:4.1,fi:36}));

  var b = blade();
  for ( var i = 0 ; i < N ; i++ ) {
      s = s.union(b.rotateZ(360/N*i));
  }

  s = s.intersect(cube({size:[400,400,400],center:[true,true,false]}))
  return s;
}
