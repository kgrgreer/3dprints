
function interp(s, e, p) {
  return s*(1-p)+e*p;
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

function main() {
  var r = 3;
  var d = 30;
  var s = [];

  for ( var i = 0 ; r > 1 && i < 75 ; i++ ) {
    r = rspline(i/100, [
      [ 0, 50 ],
      [ 0.05, 45 ],
      [ 0.1, 60],
      [ 0.2, 50],
      [ 0.3, 60],
      [1, 0]
        ]);
    var c = cylinder({fn:36, r:r, h:1}).translate([0,0,i*1]);
    s.push(c);
  }

  return s;
}
