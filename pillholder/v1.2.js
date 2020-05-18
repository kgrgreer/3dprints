const FN = 30/2;
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


function base() {
  var s = union(
      tube(100, 30, H)
  );

  for ( var i = 0 ; i < 8 ; i++ ) {
    var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([27.5,0,i ? 2 : 0]);
    hole = hole.scale([1.2,0.9,1]);
    s = s.subtract(hole.rotateZ(360/8*i));
  }

  var outerRing = torus({ri:1, ro: 100/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(outerRing);

  var innerRing = torus({ri:1, ro: 30/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(innerRing);

  for ( var i = 0 ; i < 8 ; i++ ) {
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,3,1]).translate([98/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
    s = s.subtract(cylinder({fn: FN, r: 4.5, h: 50}).translate([83.5/2,0,0]).rotateZ(360/8*(i+0.5)))
    s = s.subtract(cylinder({fn: FN, r: 1.8, h: 50}).translate([39.5/2,0,0]).rotateZ(360/8*(i+0.5)))
  }

  for ( var i = 0 ; i < 8 ; i++ ) {
    if ( ! ( i == 0 || i == 5 || i == 3 ) ) continue
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,2,1]).translate([30/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

  s = s.subtract(tube(100,99,1.5));
  return s;
}

function top() {
  var t = union(
    cylinder({fn: FN, r: 102/2, h: 2}),
    tube(32,30.3,10),
    tube(102,100.3,10)
    );

  t = t.subtract(cylinder({fn: FN, r: 30.3/2, h: 2}))

  var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([27.5,0,0]);
  hole = hole.scale([1.2,0.9,1]);

  t = t.subtract(hole);
  return t;
}

function main() {
   //return top();
  return base();
}
