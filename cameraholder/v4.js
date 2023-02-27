
function cs(r, p) {
  var s = cube({size:[r*2,r*2,2], center: [1,1,0]});
  if ( p ) {
      for ( var i = 0 ; i < 4 ; i++ ) {
     var c = cube([r*p,r*p,2]).subtract(cylinder({fn:12,r: r*p,h:2}));
    s = s.subtract(c.translate([r-r*p,r-r*p,0]));
    s = s.rotateZ(90);
      }
  }
  return s.translate([0,0,-1]);
}

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s = [];

  for ( var i = 0 ; i < 20 ; i = (i * 1.02 + 0.1 + i)/2 ) {
    var t = cs(interp(70/2, 45/2, interp(Math.sqrt(i/20), Math.pow(i/20,0.1), i/20)), Math.sqrt((i+0.25)/20.25)).translate([0,0,i*0.98]);
    t = t.rotateY(i*2)
    s.push(t);
  }

  s = union(s);

  s = s.union(s.translate([0,0,-0.25]))
  s = s.union(s.translate([0,0,-0.5]))
  s = s.union(s.translate([0,0,-1]))
  s = s.union(s.translate([0,0,-0.125]))

  s  = s.intersect(cube({size:[100,100,100], center:[1,1,0]}));

  s = s.rotateY(-40);
  s = s.subtract(cylinder({r:1, h:100}).translate([0,15,0]));
  s = s.subtract(cylinder({r:1, h:100}).translate([0,-15,0]));
  s = s.rotateY(40);

  return s;
}
