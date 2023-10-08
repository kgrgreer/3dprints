const FN = 36;

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
  var pr = 60;
  var D  = 0.01;
  for ( var i = 0 ; i < 1 ; i+=D, D = interp(0.01, 0.02, i) ) {
      r = interp(60,2,Math.pow(i,0.2));
      if ( i > 0.5 ) r = interp(20,r,Math.pow((1-i)/0.5,0.25))
      var c = cylinder({r1:pr, r2:r, h:D*132,fn: FN});

      if ( i > 0.05 ) {
        if ( i > 0.9 ) {
          c = c.subtract(cylinder({r:4.5, h:D*132}))
        } else {
          c = c.subtract(cylinder({r1:pr-2, r2:r-2, h:D*132,fn: FN}))
        }
      }
      c = c.translate([0,0,i*130]);
      s = s ? s.union(c) : c;
      pr = r;
  }

 // s = s.union(top().translate([0,0,140]));

  s = s.subtract(cube({size:[6,100,200],center:[1,0,0]}).translate([0,0,7]))
  s = s.translate([0,0,2]).union(cylinder({r:60,h:2,fn:FN}))
  s = s.subtract(cylinder({r:27,h:9,fn:FN}))
    return s.scale([1,1,1.12]);
}
