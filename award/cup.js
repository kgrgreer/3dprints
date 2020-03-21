
function ring(h, r1, r2) {
  return cylinder({r: r1, h: h});
}

function bowl(h, r) {
  var b = sphere({r:h});
  b = b.intersect()
  return b.translate([0,0,h-1]);
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
    [null, 2.5, 5],
    [bowl, 8, 8]
  ]);
}
