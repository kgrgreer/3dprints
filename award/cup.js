function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 3,
      scale: 0.13,
      justify: 'L',
      a: 0,
      color: [0,0,0],
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:15})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, 0]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, -bounds[0].y, 0]);
        } else {
          txt = txt.translate([-bounds[0].x, -bounds[0].y, 0]);
        }

        return txt;
      }
    }, m);
}

function text(a, r, h, txt, scale, justify) {
  var t = createText({text: txt, scale: scale, justify: justify}).toSolid();
  t = t.rotateY(0).rotateX(90).translate([0,-r+7,0]).translate([0,0,h]);
  t = t.setColor([1,1,1]);
  return t;
}


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
  var t = trophy([
    [ring, 1, 10.5],
    [null, 10, 10],
    [null, 1, 10.5],
    [null, 10, 10],
    [null, 5, 8],
    [null, 3.5, 6.5],
    [null, 2.5, 5],
    [bowl, 10, 10]
  ]);

  t = t.subtract(text(0, 10, 8.5, "Applewood Coyotes", 0.06, 'C'));
  t = t.subtract(text(0, 10, 6, "MHL Minor Midget A", 0.06, 'C'));
  t = t.subtract(text(0, 10, 3.5, "Season Champions", 0.06, 'C'));
  t = t.subtract(text(0, 10, 1.5, "2019-2020", 0.06, 'C'));

  return t;
}
