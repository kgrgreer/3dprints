function main() {
    var s = cube({fn: 60, radius:1, size:[70,70,20], center: [true,true,false]});
    s = s.subtract(cylinder({r:45/2, h:100}).translate([0,0,19]));
    s = s.subtract(cylinder({r:1, h:100}).translate([15,0,0]));
    s = s.subtract(cylinder({r:1, h:100}).translate([-15,0,0]));
    return s;
}
