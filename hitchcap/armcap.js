const D = 36+1;
const H = 75;
const FN = 130;
const T = 2;

function main () {
    var o = cylinder({r:D/2+T, h:H+T, fn: FN})

    o = o.subtract(cylinder({r:D/2, h:H, fn: FN}))
    o = o.rotateX(180).translate([0,0,H+T]);
    return o;
}
