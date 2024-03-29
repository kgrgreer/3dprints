const HEIGHT = 105;
const RADIUS = 28;
const RAD = 5;

function main() {
    var s = cylinder({h:HEIGHT,r:RADIUS,fn:120});
    s = s.subtract(cylinder({h:HEIGHT,r:RAD,fn:120}));
    s = s.subtract(cylinder({h:27,r:8.1,fn:6}));
    for ( var i = 0 ; i < 6 ; i++ )
      s = s.subtract(
        cylinder({h:HEIGHT,r:9,fn:6}).rotateZ(360/12).translate([17,0,0]).rotateZ(360/6*i+360+360/12)
      );
    return s.rotateX(180).translate([0,0,HEIGHT])
}

function main2() {
    var s = sphere({h:HEIGHT,r:72/2,fn:200});
    s=s.translate([0,0,25]);
    s = s.intersect(cube({size:[100,100,100],center:[true,true,false]}))
    s = s.subtract(cylinder({h:HEIGHT,r:RAD,fn:120}));
    s = s.subtract(cylinder({h:8,r:8,fn:6}));
    return s;
}
