function tri(d) {
  var s = cylinder({r:0.03,h:1});

  s = s.rotateX(90).union(s.rotateX(30)).union(s.rotateX(-30).translate([0,-1,0])).translate([0,0.5,0]);

  if ( d ) {
      var s2 = tri(d-1).scale([1,0.5,0.5]);
      s2 = s2.rotateX(60);
      s2 = s2.translate([0,1/8,1/4.5]);
      s = s.union(s2);
  }
  return s;
}

function ring(n, r, a) {
    var s = [];
    var t = tri(1).rotateX(0).rotateY(-90/n*a);
    for ( var i = 0 ; i < n ; i++ ) {
      s.push(t.translate([r,0,0]).rotateZ(360/n*i));
    }

    return union.apply(null, s);
}
function main() {
   // return tri(1).scale(10);
    var s1 = ring(5,0.68,-0.55);
    var s2 = s1.rotateZ(360/5).rotateY(180).translate([0,0,0.85]);
    var s3 = ring(5,0.68,2.8).translate([0,0,0.85]).rotateZ(360/10);
    return union(s1, s2, s3).scale(10);
}
