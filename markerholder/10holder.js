
// 5 arm version
function base() {
    return cylinder({r:4.3, h: 0.4}).union(sphere({r:5}).translate([0,0,-2.5])).translate([0,0,4])
}

function arm() {
    var s = base();

    for ( var i = 1 ; i < 3 ; i++ ) {
      s = s.union(cylinder({r:0.9, h: 8}).subtract(cylinder({r:0.7, h:8}))
        .rotateX(16*i)
        .rotateY(0)
        );
    }

    return s;
}

function main() {
    var s = base();
    for ( var i = 0 ; i < 5 ; i++ ) {
        s = s.union(arm().rotateZ(360/5*i));
    }
    return s.intersect(cube([20,20,20]).translate([-10,-10,4]))
}
