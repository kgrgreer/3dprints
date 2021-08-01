const R1 = 94/2;
const R2 = 104/2;
const H  = 12;

function main() {
  var s = cylinder({h:H, r: R2, fn: 100})
    s = s.union(cube({size:[20,140,H]}).translate([-10,0,0]))

    s = s.subtract(cylinder({h:H, r: R1, fn: 100}));

    for ( var i = 0 ; i < 4 ; i++ )
      s = s.union(cube({size:[10,22,H]}).translate([R1-10,0,0]).rotateZ(i/4*360));

    return s;
}
