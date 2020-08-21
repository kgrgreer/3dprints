const R1 = 5.5/2;
const R2 = 9/2;
const R3 = 14/2;
const R4 = 50/2;
const H = 7;

function posts(d, n, r) {
    for ( var i = 0 ; i < n ; i ++ ) {
        var c = cylinder({r:0.8, h: H});
        c = c.union(sphere({r:0.8}).translate([0,0,4]));

        c = c.translate([r, 0, 0]);
        c = c.rotateZ(360/n*i);

        d = d.union(c);
    }
    return d;
}

function main() {
  var d = cylinder({r: R3, h: H});

 d = d.union(cylinder({r:R4/1.15, h:H}));
  d = d.subtract(cylinder({r:R1, h:100}));

  d = d.subtract(cylinder({r:R2, h:H-2}).translate([0,0,2]));
 d = posts(d, 20, 5.1);

 d = d.subtract(sphere({r:R2+2}).translate([0,0,-5]));

 d = d.intersect(cylinder({r:R4, h:H}).translate([11,0,0]))
 d = d.intersect(cylinder({r:R4, h:H}).translate([-11,0,0]))

 return d;
}
