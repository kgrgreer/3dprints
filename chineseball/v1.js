/*
 * Model for a Chinese Ball, which is many spheres embedded inside of each
 * other.
 * Aug 30, 2019
 **/
 
// 10 ball, no supports
function interp(d1, d2, r1, r2, v) {
    return r1 + (r2-r1) * (v-d1)/(d2-d1);
}

function cyl0(r) {
      var p = interp(4, 19, .5, .88, r);
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
      .subtract(sphere({r:r-0.8}))
      .subtract(cyl(r))
      .subtract(cyl(r).rotateX(90))
      .subtract(cyl(r).rotateY(90))
//      .union(leg(r))
    ;
}

function main () {
    var r = 19;
    var shape = ball(19);
    //r = 10.4+1.7*0;
    while ( r > 7 ) {
        r = r -1.9;
        console.log(r);
        shape = shape.rotateZ(45).union(ball(r));
    }
    return shape.scale(1.8);
//    return shape.union(cylinder({r:18}).translate([0,0,0.85*22])).subtract(cube(50).translate([-25,-25,0.85*22.25])).scale(1.8).rotateX(180);
}
