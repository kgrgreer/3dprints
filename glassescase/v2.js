const X = 155;
const Y = 55;
const H = 35;
const T = 3;
const FN = 20;


function shape(x,y,z) {
    x = x - y;
    var s = cube({size:[x,y,z]});
    var c = cylinder({r:y/2,fn: FN, h:z}).translate([0,y/2,0]);
    s = s.union(c);
    s = s.union(c.translate([x,0,0]));
    return s.translate([-x/2,-y/2,0]);
}

function main() {
    var s = shape(X,Y,H);
    var t = s.translate([0,0,1/5]);

    for ( var i = 0 ; i < 40 ; i++ ) {
        var j = Math.sqrt(i/40);
      t = t.union(s.scale(0.96+0.04*j).translate([0,0,i/40/5]))
    }

    t = t.subtract(shape(X-T*2,Y-T*2,H).translate([0,0,2]));
    return t;
}
