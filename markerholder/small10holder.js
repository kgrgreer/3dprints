// smaller 10 marker holder
function base() {
    return cylinder({r:4, h: 1}).union(sphere({r:5}).translate([0,0,-2.5])).translate([0,0,4])
}

function holder(s) {
  return cylinder({r:0.9, h: 7.5});
}

function tube(s) {
  return cylinder({r:0.7, h:4}).translate([0,0,5.6]);
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
    s = s.union(sym(holder().rotateY(77), 'X', 5));
    s = s.union(sym(holder().rotateY(66), 'X', 5).rotateX(36));
    s = s.subtract(sym(tube().rotateY(77), 'X', 5));
    s = s.subtract(sym(tube().rotateY(66), 'X', 5).rotateX(36));
    s = s.rotateY(-90);
   return s.intersect(cube([20,20,20]).translate([-10,-10,4.6])).scale([14.4,14.4,14.4])
}
