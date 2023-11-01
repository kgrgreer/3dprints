const R    = 80;
const H    = 120;
const LEGS = 3;
const FN   = 8;

function interp(x, s, e) {
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
    var s = [];
    var sl = [[0,R],[0.6,90],[1,55]];

    for ( var i = 0 ; i <= 1 ; i += 1/24 ) {
        var [x,y] = spline3(i, sl);

        s.push(sphere({r:y*(1-0.3*i)}).rotateZ(i*360/2).translate([0, 0, x*H-20]))
    }
    s = union(s).translate([0,0,25]);
    s = s.intersect(cube({size:[1000,1000,H+R-42],center:[1,1,0]}));
    s = s.scale([0.8,0.8,0.94])
    s = s.subtract(cylinder({r:5,h:1000}));
    s = s.subtract(s.scale([0.97,0.97,0.97]));

    s = s.subtract(cylinder({r:5, h:1000}).rotateX(90));
    s = s.rotateX(180);
    return s;
}
