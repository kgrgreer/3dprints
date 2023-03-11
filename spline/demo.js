
function lspline(v, pairs) {
    if ( v < pairs[0][0] ) return pairs[0][1];

  for ( var i = 0 ; i < pairs.length - 1 ; i++ ) {
      if ( v >= pairs[i][0] && v <= pairs[i+1][0] )
        return interp(pairs[i][1], pairs[i+1][1], (v-pairs[i][0])/(pairs[i+1][0]-pairs[i][0]));
  }
  return pairs[pairs.length-1][1];
}

function rspline(t, pairs) {
    if ( pairs.length == 1 ) {
      return pairs[0][1];
    }
    return interp(
      rspline(t, pairs.slice(0, pairs.length-1)),
      rspline(t, pairs.slice(1)),
      t);
}

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s = [];

  for ( var i = 0 ; i < 40 ; i+=1) {
//    var r = bspline(i, [[0,5],[10,10],[15,8],[30,20],[40,5]]);
//    var r = rspline(i, [[0,5],[10,5],[20,10], [30,7], [38,2], [40,5]]);
    var r = Math.max(0, rspline(Math.sqrt(i/40), [[0,38],[0.1,36],[0.3,50], [0.7,55], [1,0.1]]));
//    r += Math.sin(i/40*Math.PI*12)/3;
    var t = cylinder({fn:8, h: 1, r: r || 1}).translate([0,0,i]);
    s.push(t)
  }

s = union(s);
s = s.scale([1.2,1,1])
  return s.intersect(cube({size:[80,52,100],center:true}))
}
