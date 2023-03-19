function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s = [];
  for ( var i = 0 ; i < 100 ; i+=0.25 ) {
      s.push(sphere({fn:36, r:interp(20,12,Math.pow(i/100,2))}).translate([0,0,20+i/5]));
  }
  return s;
}
