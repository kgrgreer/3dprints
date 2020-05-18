const FN = 130;
const H = 20;

function tube(od, id, h) {
    return cylinder({fn: FN, r: od/2, h: h}).subtract(cylinder({fn: FN, r: id/2, h: h}));
}

function tube2(od, id, h) {
    return cylinder({r2: od/2, r1: id/2, h: h}).subtract(cylinder({fn2: FN, r: id/2, h: h}));
}

function tube3(od, id, h) {
    return cylinder({r1: od/2, r2: id/2, h: h}).subtract(cylinder({fn2: FN, r: id/2, h: h}));
}
function main() {
  var s = union(
      tube(100, 40, H)
  );

  for ( var i = 0 ; i < 8 ; i++ ) {
    var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([35,0,i ? 2 : 0]);
    s = s.subtract(hole.rotateZ(360/8*i))
  }

  var outerRing = torus({ri:1, ro: 100/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(outerRing);

  var innerRing = torus({ri:1, ro: 40/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(innerRing);

  for ( var i = 0 ; i < 8 ; i++ ) {
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,3,1]).translate([98/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

  for ( var i = 0 ; i < 8 ; i++ ) {
    if ( ! ( i == 0 || i == 5 || i == 3 ) ) continue
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,2,1]).translate([40/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

  s = s.subtract(tube(100,99,1.5));
return s;
  var top = cylinder({r:103/2, h: 5});

  top = top.rotateX(180).translate(150);

  return union(s, top);

}
