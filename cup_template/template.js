// 89mm and 82mm

const R = 40;
const FN = 200;
const H = 0.4
const L = 3;

function main () {
    var o = cylinder({r:R, h:H, fn: FN})

var curve = cube({size:[18,10,H]}).translate([-17,-20,0]);
curve = curve.subtract(cylinder({r:20, h: H, fn: FN}));
curve = curve.translate([R+12,R/2+10,0]);
o = o.union(curve);
o = o.union(curve.scale([1,-1,1]));

    var handle = cube({size:[1.3*R-10,20,H],center:[true,true,false]});
    handle = handle.union(cylinder({r:10, h:H, fn: FN}).translate([20,0,0]));
    handle = handle.translate([1.6*R-7,0,0]);


    o = o.union(handle)

    o = o.subtract(cylinder({r:R-L, h:H, fn: FN}));

    o = o.subtract(cylinder({r:2, h:H, fn: FN}).translate([80,0,0]));

    return o.scale(89/(R*2));
}
