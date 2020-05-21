const FN = 30; // 130 for production
const H = 12;
const HOLE_D = 4.8;

function main() {
  var s = cylinder({fn: FN, r:80/2, h: H}).scale([1.5,1.3,1])

  // crossbar
  s = s.union(cube({size:[28,125,2*H],round:true,radius:1}).translate([-20/2,-125/2,0]));

  s = s.subtract(cylinder({fn: FN, r:60/2, h: H}).scale([1.7,1,2]));

  s = s.subtract(cube({size:[100,200,2*H]}).translate([-105,-100,0]));

  for ( var i = 0 ; i < 4 ; i++ ) {
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5,37+i*7,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([0,37+i*7, H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5,-37-i*7,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([0,-37-i*7,H+0.6]));
  }

  for ( var i = 0 ; i < 4 ; i++ ) {
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5/2,37+(-0.5+i)*7,H+0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5/2,-37-(-0.5+i)*7,H+0.6]));
  }

  // real attachment
  s = s.union(cube({size:[12,50,H],round:true,radius:1}).translate([52,-50/2,0]));

  var hole = cylinder({fn: FN, r:HOLE_D/2, h: H*5}).translate([58,0,0]);
//  s = s.subtract(hole);
  s = s.subtract(hole.translate([0,-11,0]));
  s = s.subtract(hole.translate([0,11,0]));

  return s.rotateX(180);
}
