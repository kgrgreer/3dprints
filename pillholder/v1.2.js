const FN = 130; // 130 for production
const H = 40;
const R = 100;

// 0.6mm bottom, so 3 layers at 0.2mm
// print: 0.2mm, 3 layers top and bottom, 2 or 3 sides

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
      tube(R, 30, H)
  );

  for ( var i = 0 ; i < 8 ; i++ ) {
    var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([27.5,0,i ? 0.6 : 0]);
    hole = hole.scale([1.2,0.9,1]);
    s = s.subtract(hole.rotateZ(360/8*i));
  }

  var outerRing = torus({ri:1, ro: R/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(outerRing);

  var innerRing = torus({ri:1, ro: 30/2, h: 3}).scale([1,1,1.5]).translate([0,0,H-3]);
  s = s.subtract(innerRing);

  for ( var i = 0 ; i < 8 ; i++ ) {
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,3,1]).translate([(R-2)/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
    s = s.subtract(cylinder({fn: FN, r: 4.5, h: 50}).translate([83.5/2,0,0]).rotateZ(360/8*(i+0.5)))
   // s = s.subtract(cylinder({fn: FN, r: 1.8, h: 50}).translate([39.5/2,0,0]).rotateZ(360/8*(i+0.5)))
  }

  for ( var i = 0 ; i < 8 ; i++ ) {
    if ( ! ( i == 0 || i == 5 || i == 3 ) ) continue
    var notch = cylinder({fn: FN, r: 2.5, h: 10}).scale([1,2,1]).translate([30/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

  s = s.subtract(tube(R,R-1,1.5));
  return s;
}

function top() {
  var t = union(
    cylinder({fn: FN, r: (R+3)/2, h: 0.6}),
    tube(28.5,27.5,10),
    tube(R+3,R+1,10)
    );

  t = t.subtract(cylinder({fn: FN, r: 28/2, h: 2}))

  var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([27.5,0,0]);
  hole = hole.scale([1.2,0.9,1]);

  t = t.subtract(hole);
  return t;
}

function main() {
  return top();
  return base();
}
