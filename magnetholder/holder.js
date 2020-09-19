const H = 2.9;
const R = 9.4*1.01/2;
const FN = 200;

function main () {
    var body = cylinder({r:R+1.2,h:H, fn: FN});
    var ring = cylinder({r:1.6*R+1.2,h:1, fn: FN});
    var hole = cylinder({r:R,h:H*2, fn: FN});

    var s = ring.union(body).subtract(hole.translate([0,0,0.5]));

    for ( var i = 0 ; i < 8 ; i++ ) {
        s = s.subtract(cylinder({r:0.5, h:10}).translate([R*1.6-0.2,0,0]).rotateZ(i*360/8));
    }
    return s;
}
