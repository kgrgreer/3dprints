
function cs(r, p) {
  var s = cube({size:[r*2,r*2,2], center: [1,1,0]});
  if ( p ) {
      for ( var i = 0 ; i < 4 ; i++ ) {
     var c = cube([r*p,r*p,2]).subtract(cylinder({fn:80,r: r*p,h:2}));
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

  for ( var i = 0 ; i <= 20 ; i += interp(0.2, 0.5, i/20)/2 ) {
//    var r = interp(70/2, 45/2, interp(i/20, Math.pow(i/20, 0.01), i/20));
    var r = interp(70/2, 45/2, i/20)-3*Math.sin(i/20*Math.PI);
    var t = cs(r, (i+1)/21);
    t = t.translate([-r,0,-3])
    t = t.rotateY(i*2);
    t = t.translate([r,0,3])
    t = t.translate([0,0,i/8])
    s.push(t);
  }

  s = union(s);

  s  = s.intersect(cube({size:[100,100,100], center:[1,1,0]}));
  /*
  s = s.rotateY(-40);
  s = s.subtract(cylinder({r:1, h:100}).translate([0,15,0]));
  s = s.subtract(cylinder({r:1, h:100}).translate([0,-15,0]));
  s = s.rotateY(40);
  */

  return s;
}
