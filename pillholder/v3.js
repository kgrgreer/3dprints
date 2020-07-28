const FN = 18;
const H = 20;
const OD = 130;
const ID = 50;
const T = 2;

function tube(od, id, bh, h) {
    return cylinder({fn: FN, r: od/2, h: h}).
      subtract(cylinder({fn: FN, r: id/2, h: h}));
}

function main() {
  var b = cylinder({r:OD/2, h: H});

  b = b.subtract(cylinder({r:OD/2-T, h: H}).translate([0,0,T]));

  b = b.union(cylinder({r:ID/2, h: H}));
  b = b.subtract(cylinder({r:ID/2-T, h: H}));

 for ( var i = 0 ; i < 8 ; i ++ ) {
     var wall = cube({size: [(OD-ID)/2, 4, H]}).translate([ID/2-2,-2,0]);
     b = b.union(wall.rotateZ(360/8*i));
 }

  return b;
}
