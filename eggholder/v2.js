const FN = 32*4;

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s;
  var pr = 20;
  var D  = 0.005;
  var r = pr;
  for ( var i = 0 ; i < 1 && pr > 4 ; i+=D, D = interp(0.01, 0.02, i) ) {
      r = r * interp(0.93, 1, i);
      var c = cylinder({r1:pr, r2:r, h:D*50+0.01, fn: FN});

      c = c.translate([0,0,i*50]);
      s = s ? s.union(c) : c;
      pr = r;
  }


  s = egg(s, 25);
  var c = sphere({r:10, fn: FN}).scale([1.1,1,2]).translate([18,0,23])
  for ( var i = 0 ; i < 5 ; i++ ) {
     s = s.subtract(c.rotateZ(i*360/5))
  }
 return s;
}

function egg(s, h) {
    var egg  = sphere({r:21/2, fn:FN}).scale([1,1,26/21]);
    var egg2 = egg.subtract(cube({size:[100,100,100],center:[1,1,0]}).translate([0,0,-2]));
    egg2 = egg2.scale([1.2,1.2,1.2]);
    egg2 = egg2.translate([0,0,h]);

    s = s.union(egg2);
    s = s.subtract(egg.translate([0,0,h]));

    return s;
}
