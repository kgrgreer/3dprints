const R = 29/2/1.02+1.5;
const H = 25; // 40
const FN = 120;
const CAP_H = 3;

function main () {
    var handle = cylinder({r:R*1.3, h: 5, fn: FN}).rotateX(90).translate([0,2.5,3.1*H]).scale([0.5,1,0.32])
    var plug = cylinder({r:R-2, h:H, fn: FN});
    for ( var i = 1 ; i < 10 ; i++ ) {
        var p = i/9;
        plug = plug.union(cylinder({r:R-1.5*p, h:H*p, fn: FN}));
    }
    plug = plug.scale([1,1,-1]).translate([0,0,H]);
    var cap = cylinder({r:R+0.2, h: CAP_H, fn: FN}).translate([0,0,H-CAP_H]);
    var hole = cylinder({r:2.5, h: 100}).rotateX(90).translate([0,50,H+2]);
    plug = plug.union(handle);
    plug = plug.union(cap)
    plug = plug.subtract(hole)
    return plug;
}
