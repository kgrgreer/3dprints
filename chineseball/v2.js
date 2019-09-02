// 10 ball, no supports
function interp(d1, d2, r1, r2, v) {
    return r1 + (r2-r1) * (v-d1)/(d2-d1);
}

function cyl0(r) {
      var p = interp(4, 24, .4, .87, r);
      return cylinder({r1:0, r2:r*p, h: r});
}
function cyl(r) {
    return cyl0(r).union(cyl0(r).rotateX(180));
}

function leg(r) {
    var r2 = 0.65*r;
    return cylinder({r:r2, h: 20}).subtract(cylinder({r:r2-0.5, h: 20})).translate([0,0,r*0.72]);
}

function ball(r) {
    return sphere({r: r})
      .subtract(sphere({r:r-1.2}))
      .subtract(cyl(r))
      .subtract(cyl(r).rotateX(90))
      .subtract(cyl(r).rotateY(90))
//      .union(leg(r))
    ;
}

function main () {
    var r = 24;
    var shape = ball(24);
    //r = 10.4+1.7*0;
    while ( r > 9 ) {
        r = r -1.7;
        console.log(r);
        shape = shape.rotateZ(0).union(ball(r));
    }
    return shape;
//    return shape.union(cylinder({r:18}).translate([0,0,0.85*22])).subtract(cube(50).translate([-25,-25,0.85*22.25])).scale(1.8).rotateX(180);
}
