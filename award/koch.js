const HEIGHT = 1;

function adobe() {
  var poly = polygon([
    [0,0],
    [48,118],
    [83,118],
    [134,0],
    [95,0],
    [66,74],
    [46,25],
    [69,25],
    [77,0]
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,1,1]).scale([0.05, 0.05, 1]).translate([-3.3,10,0.5]).rotateZ(-120);
}

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



function tri() {
  var a = Math.PI*2/3;
  var poly = polygon([
    [20*Math.sin(0),20*Math.cos(0)],
    [20*Math.sin(a),20*Math.cos(a)],
    [20*Math.sin(2*a),20*Math.cos(2*a)],
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,0,0]);
}

function holder() {
  return cylinder({r1:8, r2: 9, height:5}).translate([0,0,0.5]);
}

function text() {
    return createText({text: 'John         Koch', color: [1,1,1], scale: 0.1}).toSolid().translate([-14.8,-10,0.5]).rotateZ(180+60);
}

function main() {
  return tri().subtract(holder()).subtract(text()).subtract(adobe());
}
