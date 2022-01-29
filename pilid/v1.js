const W = 62.5;
const L = 93.5;
const IW = 58;
const IL = 89;
const H = 2.5;
const R = 3;
const FAN_R = 37.5/2+1;
const HOLE_D = 32.25/2;
const HOLE_R = 2;

function rcube(x,y,z,r) {
  var s = cube({size:[x,y,2*z+4*R], fn: 35, radius: r || R, center:true});
  return s.intersect(cube({size:[x,y,z], center:[1,1,0]}));
}

function main() {
    var s = rcube(IW, IL, H+4);

    s = s.subtract(rcube(IW-2.8, IL-3, H+4));
    s = s.subtract(cube({size:[IW-13,IL,H+4], center:[1,1,0]}));
    s = s.subtract(cube({size:[IW,IL-13,H+4], center:[1,1,0]}));

    s = s.union(rcube(W,L,H, 5));

    s = s.subtract(cylinder({r:FAN_R, h: H}));

    for ( var i = -1 ; i <= 1 ; i += 2 )
        for ( var j = -1 ; j <= 1 ; j += 2 ) {
            s = s.union(cylinder({r:1, h: H+2.1}).translate([i*(IW-1.5)/2,j*(IL-1.5)/2,0]));
            s = s.subtract(cylinder({r:HOLE_R, h: H}).translate([i*HOLE_D,j*HOLE_D,0]));
        }


    var a = Math.PI/4*1.3;
    s = s.subtract(cylinder({r:2.5, h: H}).translate([-Math.cos(a)*FAN_R,Math.sin(a)*FAN_R,0]));

    return s;

}
