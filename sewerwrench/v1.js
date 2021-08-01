const R1 = 110/2;
const R2 = 120/2;
const H  = 12;

function main() {
  var s = cylinder({h:H, r: R2})
    s = s.union(cube({size:[20,140,H]}).translate([-10,0,0]))

    s = s.subtract(cylinder({h:H, r: R1}));

    for ( var i = 0 ; i < 4 ; i++ )
      s = s.union(cube({size:[10,24,H]}).translate([R1-10,0,0]).rotateZ(i/4*360));

    return s;
}
