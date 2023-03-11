
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

function cells() {
  var c = cylinder({fn: 6, r:4, h:10}).rotateZ(360/12);
  var s = [];

  for ( var x = 0 ; x < 14 ; x++ ) {
    for ( var y = 0 ; y < 10 ; y++ ) {
        if ( y % 2 ) {
          s.push(c.translate([(x+0.5)*8,y*7,0]));
        } else {
          s.push(c.translate([x*8,y*7,0]));
        }
    }
  }

  return union(s);
}

function main() {
    var cs = cells();
  var s = [];

  for ( var i = 0 ; i < 40 ; i+=1 ) {
//    var r = bspline(i, [[0,5],[10,10],[15,8],[30,20],[40,5]]);
//    var r = rspline(i, [[0,5],[10,5],[20,10], [30,7], [38,2], [40,5]]);
    var r = Math.max(0, rspline(Math.sqrt(i/40), [[0,40],[0.1,38],[0.5,50], [0.9,52], [1,1]]));
//    r += Math.sin(i/40*Math.PI*12)/3;
    var t = cylinder({fn:6, h: 1, r: r || 1}).translate([0,0,i]);
    s.push(t)
  }


var s = cylinder({fn:6, r1: 38, r2:38, h:34/*40*/}).rotateZ(360/12).intersect(union(s));
// s = s.intersect(cylinder({fn:6, r:40, h:200}));
s = s.scale([1.6,1.6,1.6]).rotateZ(360/12);
  s = s.union(s.translate([30,0,0])).translate([-15,0,0])
  s = s.intersect(cube({size:[120,200,200],center:true}));
s = s.subtract(cs.rotateX(90).translate([-48,-52.5,0]));
  return s;
  s = s.subtract(cube({size:[20,20,200], center:true}).rotateZ(0*45).rotateX(90).translate([0,0,64]));
  return s;
}
