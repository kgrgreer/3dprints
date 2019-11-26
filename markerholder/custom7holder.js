// custom holder to hold three lare dry-erase markers, three small ones, and
// my flashlight
function base() {
    return sphere({r:3}).scale([1,1,0.6]).translate([0,0,4.3]);
//    return sphere({r:11}).scale([0.5,0.5,0.5]).translate([0,0,-2.5]).translate([0,0,4])
}

function holder(s) {
  return cylinder({r:0.9, h: 7.5});
}

function tube(s) {
  return cylinder({r:0.7, h:4}).translate([0,0,5]);
}

function sym(s, axis, n) {
    var ret = s;
    for ( var i = 1 ; i < n ; i++ ) {
        s = s.union(s['rotate' + axis].call(s, 360/n));
    }
    return s;
}

function arm() {
    var s = base();

    for ( var i = 1 ; i < 3 ; i++ ) {
      s = holder(s)
        .rotateX(-14.5*i)
        .rotateZ(260/5*(i))
        .rotateY(0)
        ;
    }

    return s;
}

function main() {
    var s = base().rotateY(90);
    s = s.union(sym(holder().scale([1.3,1.3,0.9]).rotateY(90), 'X', 1));
    s = s.union(sym(holder().rotateY(71), 'X', 3));
    s = s.union(sym(holder().scale([0.6,0.6,0.9]).rotateY(69).rotateX(360/6), 'X', 3));
    //s = s.subtract(sym(tube().rotateY(90), 'X', 1));
    s = s.subtract(sym(tube().scale([1.3,1.3,0.9]).rotateY(90), 'X', 1));
    s = s.subtract(sym(tube().rotateY(71), 'X', 3));
    s = s.subtract(sym(tube().scale([0.6,0.6,1]).rotateY(69).rotateX(360/6), 'X', 3));
    s = s.rotateY(-90);
    //return s.scale(14);
   return s.intersect(cube([20,20,20]).translate([-10,-10,4.5])).scale([14.4,14.4,14.4])
}
