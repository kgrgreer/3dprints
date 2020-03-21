
function ring(h, r1, r2) {
  return cylinder({r: r1, h: h});
}

function bowl(h, r) {
  var b = sphere({r:h});
  b = b.subtract(sphere({r:h-1}));
  b = b.intersect(cube({size:[2*h,2*h,h+5],center:true}).translate([0,0,-h+1]));
  return b.translate([0,0,h-1.5]);
}

function trophy(p) {
  var parts = [];
  var height = 0;

  p.forEach(function(s) {
    var f  = s[0] || ring;
    var r1 = s[2], h = s[1];
    var r2 = s[3] || r1;
    var shape = f(h, r1, r2).translate([0,0,height]);
    parts.push(shape);
    height += h;
  });

  return union.apply(null, parts);
}

function main() {
  return trophy([
    [ring, 1, 10.5],
    [null, 10, 10],
    [null, 1, 10.5],
    [null, 10, 10],
    [null, 5, 8],
    [null, 3.5, 6.5],
    [null, 2.5, 5],
    [bowl, 10, 10]
  ]);
}
