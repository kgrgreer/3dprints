const R = 32/2+.2;
const H = 71;
const SW = 18.5, SH = 28.2;
function main() {
    var s = cylinder({fn:36*4,r:R,h:H}).scale([1,49.2/32,1]);
    s = s.scale([85/70,85/70,1]).subtract(s.translate([0,0,3]))
    s = s.subtract(cube({size:[SW, SH, 10], center: true}))
    s = s.union(cube({size:[12, 11.5, H-6], center: [true,false,false]}).translate([0,14.1,0]))
    return s;
}
