const H = 2.5;
const R = 9.4*1.03;
const FN = 120;

function main () {
    var body = cylinder({r:R+2,h:H, fn: FN});
    var ring = cylinder({r:1.4*R,h:1, fn: FN});
    var hole = cylinder({r:R,h:H*2, fn: FN});

    return ring.union(body).subtract(hole.translate([0,0,0.5]));
}
