// title      : OpenJSCAD.org Logo
// author     : Rene K. Mueller
// license    : MIT License
// revision   : 0.003
// tags       : Logo,Intersection,Sphere,Cube
// file       : logo.jscad

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function top() {
  var s = sphere({r:20});

  s = s.intersect(cube({size:[100,100,-100], center:[1,1,0]}));
  s = s.subtract(cylinder({r:6,h:-1000}));
  s = s.scale([1,1,2])
  return s;
}

function main() {
  var s;
  var pr = 70;
  var D = 0.1/5;
  for ( var i = 0 ; i < 1 ; i+=D ) {
      r = interp(70,10,Math.pow(i,0.2));
      var c = cylinder({r1:pr, r2:r, h:D*130,fn:8});
      if ( i > 0.05 )
        c = c.subtract(cylinder({r1:pr-1, r2:r-1, h:D*130,fn:8}))
      c = c.translate([0,0,i*130]);
      s = s ? s.union(c) : c;
      pr = r;
  }

 // s = s.union(top().translate([0,0,140]));

    return s;
}
