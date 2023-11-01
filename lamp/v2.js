const R    = 75;
const R2   = 15;
const H    = 145;
const FN   = 80;

function interp(x, s, e) {
  if ( x <= 0 ) return s;
  if ( x >= 1 ) return e;
  return s*(1-x)+e*x;
}

function lspline(v, pairs) {
    if ( v < pairs[0][0] ) return pairs[0][1];

  for ( var i = 0 ; i < pairs.length - 1 ; i++ ) {
      if ( v >= pairs[i][0] && v <= pairs[i+1][0] )
        return interp(
            (v-pairs[i][0])/(pairs[i+1][0]-pairs[i][0]),
            pairs[i][1], pairs[i+1][1]);
  }
  return pairs[pairs.length-1][1];
}

function spline3(x, a) {
    var x1 = interp(x, a[0][0], a[1][0]);
    var x2 = interp(x, a[1][0], a[2][0]);
    var sx = interp(x, x1, x2);
    var y1 = interp(x, a[0][1], a[1][1]);
    var y2 = interp(x, a[1][1], a[2][1]);
    var sy = interp(x, y1, y2);
    return [ sx, sy ];
}

function main() {
    var s  = [];
    var sl = [[0,R],[0.35,R2],[1,R2]];

    const STEP = 1/50;
    for ( var i = 0 ; i < 1 - STEP ; i += STEP ) {
        var [x,y] = spline3(i, sl);
        var [x2,y2] = spline3(i + STEP, sl);
        var ring = cylinder({r1:y, r2: y2, h: 0.1/50+ (x2-x)*H, fn: FN});
        if ( i < 0.95 )
          ring = ring.subtract(cylinder({r1:Math.min(R-7, y-1.6), r2: Math.min(R-7, y2-1.6), h: 0.1/50+(x2-x)*H, fn: FN}))

         s.push(ring.translate([0, 0, x*H]));
    }
    s = union(s);
    s = s.intersect(cylinder({r: R-4, h:1000, fn: FN}));
    s = s.subtract(cylinder({r:5,h:1000}));
    s = s.subtract(cylinder({r:5, h:1000}).rotateX(90));

    return s;
}
