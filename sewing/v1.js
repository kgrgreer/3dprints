const HEIGHT = 1.8;
const WIDTH = 8;
const LENGTH = 150;
const STEP = 5;

function main() {
    s = cube({size:[WIDTH,LENGTH,HEIGHT]})

    for ( var i = 0 ; i < LENGTH ; i++ ) {
        var l = cube({size:[WIDTH,0.5,0.5]}).translate([0,i*10-0.25,HEIGHT-0.4])
        s = s.subtract(l);
    }
    for ( var i = STEP ; i < LENGTH ; i += STEP ) {
        var l = cylinder({r:1.1, h:100}).translate([(WIDTH+1.1)/2,i,0])
        s = s.subtract(l);
        var l = cylinder({r:1.1, h:100}).translate([0,i,0])
        s = s.subtract(l);
    }

    return s.rotateZ(90);
}
