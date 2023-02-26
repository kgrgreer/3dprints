function main() {
    var s = cylinder({fn: 120, r1: 70/2, r2: 45/2+1, h:20});
    s = s.subtract(cylinder({r:1, h:100}).translate([15,0,0]));
    s = s.subtract(cylinder({r:1, h:100}).translate([-15,0,0]));

    return s;
}
