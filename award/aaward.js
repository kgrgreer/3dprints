const HEIGHT = 26;
const TITLE  = 'Award Title'; const NAME   = 'Jane Doe';

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

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:5})));

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


function base() {
  var poly = polygon([
    [0,0],
    [48,118],
    [83,118],
    [134,0],
    [95,0],
    [66,74],
    [46,25],
    [69,25],
    [77,0],
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,0,0]);

}

function name() {
  return createText({text: NAME, scale: .5, color: [1,1,1]}).toSolid().rotateZ(-68).translate([68,95,HEIGHT-5]);
}

function title() {
  return createText({text: TITLE, scale: .23, color: [1,1,1]}).toSolid().translate([10,7,HEIGHT-5]);
}

function main() {
    return base().subtract(title()).subtract(name());
}
