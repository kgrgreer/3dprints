const FN = 18;
const H = 10

function tube(od, id, h) {
    return cylinder({fn: FN, r: od/2, h: h}).subtract(cylinder({fn: FN, r: id/2, h: h}));
}

function main() {
  var s = union(
      tube(100, 40, H)
  );

  for ( var i = 0 ; i < 8 ; i++ ) {
    var hole = cylinder({fn: FN, r: 52/4, h: H}).translate([35,0,i ? 2 : 0]);
    s = s.subtract(hole.rotateZ(360/8*i))
  }

  /*
  var ring1 = tube(100, 98, 3).translate([0,0,15]);
  s = s.subtract(ring1);

  var ring1 = tube(42, 40, 3).translate([0,0,15]);
  s = s.subtract(ring1);
  */

  // Outer ring
  for ( var i = 0 ; i < 8 ; i++ ) {
    var notch = cylinder({fn: FN, r: 2, h: 10}).translate([88/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

  // Inner ring
  for ( var i = 0 ; i < 8 ; i++ ) {
    var notch = cylinder({fn: FN, r: 2, h: 10}).translate([46/2,0,H-5]);
    s = s.subtract(notch.rotateZ(360/8*(i+0.5)))
  }

return s;
  var top = cylinder({r:103/2, h: 5});

  top = top.rotateX(180).translate(150);

  return union(s, top);

}
