const R = 20;
const H = 40;
const FN = 100;
const CAP_H = 3;

function main () {
    var handle = cylinder({r:R, h: 5, fn: FN}).rotateX(90).translate([0,2.5,3.35*H]).scale([1,1,0.3])
    var plug = cylinder({r:R, h:H, fn: FN});
    var cap = cylinder({r:R+5, h: CAP_H, fn: FN}).translate([0,0,H-CAP_H]);
    var hole = cylinder({r:3, h: 100}).rotateX(90).translate([0,50,H+2]);
    plug = plug.union(handle);
    plug = plug.union(cap)
    plug = plug.subtract(hole)
    return plug;
}
