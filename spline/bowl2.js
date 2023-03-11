function cells() {
  var c = cylinder({fn: 36, r:2, h:10}).rotateZ(360/12);
  var s = [];

  for ( var x = -6 ; x <= 6 ; x++ ) {
    for ( var y = 0 ; y < 15 ; y++ ) {
        if ( y % 2 ) {
          s.push(c.translate([(x+0.5)*8,y*7,0]));
        } else {
          s.push(c.translate([x*8,y*7,0]));
        }
    }
  }

  return union(s);
}


function main() {
  var wall = cylinder({fn: 6, r:50, h:2}).rotateX(90).rotateY(360/12).translate([0,0,50]);
//  var cs = cells().rotateX(90)
//  wall = wall.subtract(cs);
  var s = [];

  s.push(cylinder({fn:6,r:86,h:130}));

  for ( var i = 0 ; i < 6 ; i++ ) {
    s.push(wall.translate([0,75,0]).rotateZ(360/6*i))
  }

  s = union(s);
  for ( var i = 0 ; i < 6 ; i++ ) {
    s = s.subtract(cylinder({fn: 4, r:54, h:300}).rotateZ(360/8).rotateX(41).translate([0,220,-22]).rotateZ(360/6*(i+0.5)));
  }

  s = s.translate([0,0,-25]);

  s = s.intersect(cylinder({fn:6, r:200,h:200}))
  return s;
}
