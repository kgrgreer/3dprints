const FN = 60;

function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 5,
      scale: 0.18,
      justify: 'L',
      a: 0,
      color: [0,0,0],
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:7.5})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, 0]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, 0/*-bounds[0].y*/, 0]);
        } else {
          txt = txt.translate([-bounds[0].x, 0/*-bounds[0].y*/, 0]);
        }

        return txt;
      }
    }, m);
}

function bead(l) {
  var s = sphere({r: 8, fn:FN});
  s = s.subtract(cube({size:[20,20,20], center:[true,true,false]}).translate([0,0,5]))
  s = s.subtract(cube({size:[20,20,-20], center:[true,true,false]}).translate([0,0,-5]))
  s = s.translate([0,0,8]).subtract(cylinder({r:4, h:20, fn:FN})).scale([1,1,1])

  s = s.scale(0.78);
  s = addText(s, l);
  s = s.subtract(cube({size:[10,10,20],center:true}).translate([0,-10,10]));
  return s;
}

function addText(s, txt) {
  var t = createText({text:txt, justify:'C'}).toSolid();
  t = t.rotateX(90).translate([0,-4,4.5])
  t = t.intersect(s);
  t = t.translate([0,-0.6,0]);
  s = s.subtract(t);
  return s;
}

function main() {
    var s = bead('R');
    s = s.translate([15,0,0])
    s = s.union(bead('G'));
    s = s.translate([15,0,0])
    s = s.union(bead('K'));
    return s.scale(0.95);
}
