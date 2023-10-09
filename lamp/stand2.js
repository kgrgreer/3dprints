const R = 50;
const H = 150;

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
    var sl = [[0,0],[0.2,100],[1,50]];

    for ( var i = 0 ; i <= 1 ; i += 1/100 ) {
        var [x,y] = [i, i* 50]; //spline3(i, sl);
        console.log(i,x,y);

        s.push(cube({size:[10,10,10]}).translate([y, 0, x*130]))
    }
    for ( var i = 0 ; i <= 1 ; i += 1/100 ) {
        var [x,y] = spline3(i, sl);
        console.log(i,x,y);

        s.push(cube({size:[10,10,10]}).translate([y, 0, x*130]))
    }
/*
    for ( var i = 0 ; i <= 1 ; i+=0.1/20) {
        var c = cube({size:[10,10,10]});
        var x = spline3(i,sl);
        // c = c.rotateX(interp(0,90,i))
        c = c.translate([x,0,i*H])
        s.push(c);
    }
    */
    return union(s);
}
