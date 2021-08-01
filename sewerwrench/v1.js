const R1 = 110;
const R2 = 120;
const H  = 12;

function main() {
  var s = cylinder({h:H, r: R2})

    s = s.subtract(cylinder({h:H, r: R1}));

    for ( var i = 0 ; i < 4 ; i++ )
      s = s.union(cube({size:[10,20,H]}).translate([R1-10,0,0]).rotateZ(i/4*360));

    return s;
}
