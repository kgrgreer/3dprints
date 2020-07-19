const IR = 40;
const OR = 100;
const T = 100

function main () {
    s = cube({size:[2*IR+OR-10,1.25*IR+OR-10,T/2], center:[true,true,false]}).translate([17.5,-15,0]);

    s = s.union(cube({size:[(2*IR+OR+35)/2,OR-40,T/2]}).translate([-5,0,0]));

    for ( var i = 0 ; i < 270 ; i += 1 ) {
        var e = cube({size:[20,IR+(OR-IR)*i/270,T-10],center:[true,false,false]});
        e = e.rotateZ(i);
        e = e.translate([0,0,5]);
        s = s.subtract(e);
    }
    s = s.subtract(cube({size:[IR+OR-40,OR-10,T-10]}).translate([0,0,5]));
    s = s.subtract(cylinder({r:25,h:T}).translate([0,0,-10]))
    s = s.subtract(cylinder({r:4,h:T}).translate([0,0,10]))
    return s;
}
