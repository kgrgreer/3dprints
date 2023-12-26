const FN = 32*4;

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s;
  var pr = 25;
  var D  = 0.005;
  var r = pr;
  for ( var i = 0 ; i < 1 && pr > 13 ; i+=D, D = interp(0.01, 0.02, i) ) {
      r = r * interp(0.98, 1, i);
      var c = cylinder({r1:pr, r2:r, h:D*50+0.01, fn: FN});

      c = c.translate([0,0,i*50]);
      s = s ? s.union(c) : c;
      pr = r;
  }

  s = s.subtract(egg().translate([0,0,25]))
  return s;
}

function egg() {
    var egg  = sphere({r:21/2, fn:60}).scale([1,1,26/21]);

    return egg;
}
