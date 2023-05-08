const R1 = (94)/2+10;
const R2 = (104)/2+16;
const H  = 12;
const FN = 160;

function main() {
  var s = cylinder({h:H, r: R2, fn: FN})

    // handle
    s = s.union(cube({size:[20,160,H], radius: 3, fn:FN}).translate([-10,0,0]))
    s = s.union(cylinder({r:10, h:H, fn: FN}).intersect(sphere({r:10.7,fn:FN}).translate([0,0,5])).translate([0,R2+90,0]))
    s = s.subtract(cylinder({r:2.5, h:H, fn:FN}).translate([0,R2+90,0]))
    s = s.subtract(sphere({r:4,fn:FN}).translate([0,R2+90,H+2]))
    s = s.subtract(sphere({r:4,fn:FN}).translate([0,R2+90,0-2]))
    s = s.union(cube({size:[30,R2+5,H]}).translate([-15,0,0]))

    s = s.subtract(cylinder({h:2*H, r: 10, fn: FN}).translate([20.1,R2+7.025,0]))
    s = s.subtract(cylinder({h:2*H, r: 10, fn: FN}).translate([-20.1,R2+7.025,0]))

    s = s.subtract(cylinder({h:H, r: R1-1.5, fn: FN}));

    for ( var i = 0 ; i < 4 ; i++ ) {
      s = s.union(cube({size:[10,32,H]}).translate([R1-10,0,0]).rotateZ((i+0.5)/4*360));
    }

    return s.rotateZ(90+45);
}
