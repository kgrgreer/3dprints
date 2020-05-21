const FN = 130; // 130 for production
const H = 12;
const HOLE_D = 5;

function main() {
  var s = cylinder({fn: FN, r:80/2, h: H}).scale([1.5,1.3,1])
  s = s.union(cube({size:[28,118,H],round:true,radius:1}).translate([-20/2,-118/2,0]));
  s = s.subtract(cylinder({fn: FN, r:60/2, h: H}).scale([1.7,1,1]));
  s = s.subtract(cube({size:[100,200,H]}).translate([-105,-100,0]));

  for ( var i = 0 ; i < 4 ; i++ ) {
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5,34+i*7,-0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([0,34+i*7,-0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5,-34-i*7,-0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([0,-34-i*7,-0.6]));
  }

  for ( var i = 0 ; i < 3 ; i++ ) {
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5/2,34+(0.5+i)*7,-0.6]));
    s = s.subtract(cylinder({fn: FN, r:HOLE_D/2, h: H}).translate([12.5/2,-34-(0.5+i)*7,-0.6]));
  }

  s = s.union(cube({size:[10,40,H],round:true,radius:1}).translate([52,-40/2,0]));

  var hole = cylinder({fn: FN, r:HOLE_D/2, h: H*5}).translate([57,0,0]);
//  s = s.subtract(hole);
  s = s.subtract(hole.translate([0,-11,0]));
  s = s.subtract(hole.translate([0,11,0]));

  return s.rotateX(180);
}
