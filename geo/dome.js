function tri() {
  var s = cylinder({r:0.03,h:1});

  return s.rotateX(90).union(s.rotateX(30)).union(s.rotateX(-30).translate([0,-1,0])).translate([0,0.5,0]);
}

function ring(n, r, a) {
    var s = [];
    var t = tri().rotateX(0).rotateY(-90/n*a);
    for ( var i = 0 ; i < n ; i++ ) {
      s.push(t.translate([r,0,0]).rotateZ(360/n*i));
    }
    return union.apply(null, s);
}
function main() {
    var s1 = ring(8,1.2,1);
    var s2 = ring(8,0.95,1.5).translate([0,0,0.85]).rotateZ(360/16);
    var s3 = ring(4,0.47,1.5).translate([0,0,0.9+0.8]);
    return union(s1, s2, s3);
}
