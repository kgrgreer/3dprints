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

  return linear_extrude({height: HEIGHT}, poly).setColor([1,1,1]).scale([0.05, 0.05, 1]).translate([-3.3,13,0.6]).rotateZ(-126);
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
  // data from Vesna's program
  var poly = polygon([
      [0,400],
      [78,275],
      [150,302],
      [121,89],
      [216,171],
      [248,126],
      [360,137],
      [335,18],
      [372,-13],
      [191,-175],
      [203,-244],
      [28,-232],
//      [18,-406],
//      [0,-406],

//      [-18,-406],
      [-28,-232],
      [-203,-244],
      [-191,-175],
      [-372,-13],
      [-335,18],
      [-360,137],
      [-248,126],
      [-216,171],
      [-121,89],
      [-150,302],
      [-78,275]
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,0,0]).scale([0.064,0.064,1]).translate([0,1.4,0]).rotateZ(235);
}

function holder() {
  return cylinder({r1:9, r2: 9.9, height:5}).translate([0,0,0.5]);
}

function text() {
    return createText({text: 'Ivan', justify: 'C', color: [1,1,1], scale: 0.2}).toSolid().translate([0,-13.1,0.6]).rotateZ(-126);
}

function main() {
  return tri().subtract(holder()).subtract(text()).subtract(adobe()).scale(2*77/35).scale([0.95,0.95,1.1]);
}
