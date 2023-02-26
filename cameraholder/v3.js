function main() {
    var s = cylinder({fn: 120, r1: 70/2, r2: 45/2+1, h:20});
    s =  s.union(cube({fn: 60, radius:1, size:[70,70,4], center: [true,true,false]}));

    s = s.subtract(cylinder({r:1, h:100}).translate([15,0,0]));
    s = s.subtract(cylinder({r:1, h:100}).translate([-15,0,0]));

    return s;
}
