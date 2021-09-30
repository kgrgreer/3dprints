var H = 20;
var R = 11.2/2;
var R2 = 9/2;

function main() {
    var s = cylinder({r:R+3, h: H+3, fn: 6});
    s = s.subtract(cylinder({r:R, h: H, fn: 6}));
    s = s.union(cylinder({r:R2, h: H, fn: 6}).translate([0,0,H+3]));
    return s.rotateX(90)
}
