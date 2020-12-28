const HEIGHT = 110;
const RADIUS = 28;
const RAD = 5;

function main2() {
    var s = cylinder({h:HEIGHT,r:RADIUS,fn:120});
    for ( var i = 0 ; i < 6 ; i++ )
      s = s.subtract(
        cylinder({h:HEIGHT,r:1,fn:6}).translate([7,0,0]).rotateZ(360/6*i+360)
      );
    for ( var i = 0 ; i < 6 ; i++ )
      s = s.subtract(
        cylinder({h:HEIGHT,r:9,fn:6}).rotateZ(360/12).translate([17,0,0]).rotateZ(360/6*i+360+360/12)
      );
    s = s.union(cylinder({h:16,r:22/2+2, fn:32}));
    s = s.union(cylinder({h:50,r1:22/2+2, r2: RAD+2, fn:32}).translate([0,0,16]));
    s = s.subtract(cylinder({h:12,r:22/2,fn:32}));
    s = s.subtract(cylinder({h:HEIGHT,r:RAD,fn:120}));
    return s.rotateX(180).translate([0,0,HEIGHT])
}

function main() {
    var s = sphere({h:HEIGHT,r:72/2,fn:40});
    s=s.translate([0,0,23]);
    s = s.intersect(cube({size:[100,100,100],center:[true,true,false]}))
    s = s.subtract(cylinder({h:HEIGHT,r:RAD,fn:120}));
    s = s.subtract(cylinder({h:10,r:20,fn:80}));
    s = s.rotateX(180).translate([0,0,50])
    s = s.intersect(cube({size:[100,100,100],center:[true,true,false]}))
    for ( var i = 0 ; i < 6 ; i++ )
      s = s.subtract(
        cylinder({h:HEIGHT-65,r:7,fn:6}).rotateZ(360/12).translate([17,0,0]).rotateZ(360/6*i+360+360/12)
      );
    return s;
}
