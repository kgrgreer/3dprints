const R = 65;
const H = 50;

function duct(p) {
  var s = cube({size:[R-3-8, 10, H]});
  s = s.translate([8, -R-2, 1]);
  s = s.translate([0, R*Math.min(2*p,1),0]);
  if ( p > 0.5 ) {
      var p2 = Math.pow((p-0.5)*2,4)/2+0.5;
      s = s.rotateX(50*(p2-0.5));
      s = s.translate([0,0,1.9*(p2-0.5)*H]);
      s = s.rotateZ(170*(p-0.5)*1.075);
  }
  return s;
}

function main () {
  var s = cylinder({r:R, h:H-2, fn: 36*4});
  for ( var i = 0 ; i <= 1 ; i += 0.005 ) {
    var j = Math.sqrt(i);
    if ( j > 0.5 ) j = Math.sqrt((j-0.5)*2)/2+0.5;
    var d = duct(j);
    s = s.subtract(d);
    s = s.subtract(d.rotateZ(180));
  }
  s = s.subtract(cylinder({r:6/2,h:14,fi:36}));
  return s;
}
