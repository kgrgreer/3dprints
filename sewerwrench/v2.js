const R1 = (94)/2+10;
const R2 = (104)/2+16;
const H  = 12;
const FN = 160;

function main() {
  var s = cylinder({h:H, r: R2, fn: FN})

    // handle
    s = s.union(cube({size:[20,160,H], radius: 5, fn:FN}).translate([-10,0,0]))
    s = s.union(cylinder({r:10, h:H, fn: FN}).intersect(sphere({r:10.7,fn:FN}).translate([0,0,5])).translate([0,R2+90,0]))
    s = s.subtract(cylinder({r:2.5, h:H, fn:FN}).translate([0,R2+90,0]))
    s = s.subtract(sphere({r:4,fn:FN}).translate([0,R2+90,H+2]))
    s = s.subtract(sphere({r:4,fn:FN}).translate([0,R2+90,0-2]))
    s = s.subtract(cylinder({h:H, r: R1-1.5, fn: FN}));

    // transition from handle into ring
    for ( var i = 0 ; i <= 1 ; i += 0.025 ) {
      s = s.union(cube({size:[20 + 12*Math.pow(i,2.5),10,H], center:[1,0,0], radius: (1-i)*5, fn:40-i*20}).translate([0,R1+20*(1-i)-1,0]))
    }

    for ( var i = 0 ; i < 4 ; i++ ) {
      s = s.union(cube({size:[10,32,H]}).translate([R1-10,0,0]).rotateZ((i+0.5)/4*360));
    }

    return s.rotateZ(90+45);
}
