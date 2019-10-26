// hold 9 dry-erase markers

function base() {
    return cylinder({r:4, h: 1}).translate([0,0,4]);
}

function arm() {
    var s = base();

    for ( var i = -2 ; i < 3 ; i++ ) {
      s = s.union(cylinder({r:0.9, h: 8}).subtract(cylinder({r:0.7, h:8}))
        .rotateX(16*i)
        .rotateY(0)
        );
    }

    return s;
}

function main() {
    return arm().union(arm().rotateZ(90)).intersect(cube([20,20,20]).translate([-10,-10,4]))
}
