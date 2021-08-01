const R1 = (94)/2;
const R2 = (104+10)/2;
const H  = 1;

function main() {
  var s = cylinder({h:H, r: R2, fn: 100})
    s = s.union(cube({size:[20,140,H]}).translate([-10,0,0]))

    s = s.union(cube({size:[30,R2+5,H]}).translate([-15,0,0]))

//    s = s.subtract(cylinder({h:2*H, r: 10, fn: 100}).translate([20,R2+8,0]))
//    s = s.subtract(cylinder({h:2*H, r: 10, fn: 100}).translate([-20,R2+8,0]))

    s = s.subtract(cylinder({h:H, r: R1, fn: 100}));

    for ( var i = 0 ; i < 4 ; i++ )
      s = s.union(cube({size:[10,29,H]}).translate([R1-10,0,0]).rotateZ(i/4*360));

    return s.rotateZ(90);
}
