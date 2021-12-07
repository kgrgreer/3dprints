const TEXT = true;

const H  = 9;
const W  = 16;
const W2 = 17;
const R  = 35;

/*
Print Instructions:

PLA:
Temp.: 200, 40, 50
.1mm layer height
20mm/s travel speed

PETG:
.1mm layer height

*/

function createText(m) {
  if ( typeof m === 'string' ) m = { text: m };

  return Object.assign({
    text: 'A',
    w: 4,
    h: 6,          // depth
    scale: 0.2,
    justify: 'L',  // justification: R, C or defaults to Left
    a: 0,          // angle of rotation
    color: [1,1,1],
    toSolid: function() {
      var o = [];
      var l = vector_text(0, 0, this.text);

      l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h: this.h})));

      var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

      if ( this.a ) txt = txt.rotateZ(this.a);

      var bounds = txt.getBounds();
      if ( this.justify === 'R' ) {
        txt = txt.translate([-bounds[1].x, -bounds[0].y*0, -2.5]);
      } else if ( this.justify === 'C' ) {
        txt = txt.translate([-bounds[1].x/2, -bounds[0].y*0, -2.5]);
      } else {
        txt = txt.translate([-bounds[0].x, -bounds[0].y*0, -2.5]);
      }

      return txt;
    }
  }, m);
}


function stem() {
  var sw = 6; /*make smaller to reduce friction Was: 5.4+1.5*/
  var sh = 4.8;
  const W = 4.3; // add 0.2 when testing to make easier to put on and remove
  const H = 1.5;
  var D = 8;

  var stem = cube({radius:2, fn: 40, roundradius: 0.9,size:[sh,sw, D+4]}).intersect(cube({size:[sh,sw, D]})).translate([-sh/2,-sw/2,-0.8]);
  stem = stem.intersect(cube({size:[20,20,20], center: [true,true,false]}))

  function cross(p, height) {
    var c = cube({size:[W+p,H+p,height], center: [true,true,false]}).union(cube({size:[H+p,W+p,height], center: [true,true,false]}));
  stem = stem.subtract(c);

  }
  cross(0, 4);
  cross(0.4, 0.1);
  cross(0.2, 0.2);

  return stem;
}


function cap(config) {
    var n, e, s, w;

    if ( config.thumb ) {
      [w, n, e, s] = [
        [4,4,15,14],
        [15,4,15,14],
        [15,4,4,14]
      ][config.row-1];
    } else {
      [w, n, e, s] = [
        [5, 4, 5,12],
        [5, 16,5,16],
        [5, 16,5,4]
      ][config.row-1];
    }
  var c = cube({fn:50,size:[W,W2,H], center: [true,true,false], xxxradius: 0.5});
  var o = c.scale([1,1,10]);

  c = c.intersect(o.translate([0,-W2/2,0]).rotateX(n).translate([0,W2/2,0]));
  c = c.intersect(o.translate([-W/2,0,0]).rotateY(-e).translate([W/2,0,0]));
  c = c.intersect(o.translate([0,W2/2,0]).rotateX(-s).translate([0,-W2/2,0]));
  c = c.intersect(o.translate([W/2,0,0]).rotateY(w).translate([-W/2,0,0]));


  c = c.intersect(cube({size:[20,20,20], center: [true, true, false] }))
  o = c;

  var cy = cylinder({r:R, h:100, center: true, fn:360}).rotateX(90).translate([0,0,R+H-2]);
  c = c.subtract(cy);

  c = c.subtract(c.scale([0.95,0.95,0.77]));
  c = c.union(stem());
  c = c.subtract(cy);
  c = c.union(cube({size:[3,17,0.5],center:[true,true,false]}).translate([0,0,5.3]))
  c = c.intersect(o);

  if ( TEXT && config.cLabel ) {
    config.cLabel.justify = 'C';
    config.cLabel.w = 5;
    var t = createText(config.cLabel).toSolid().translate([-4,0,H]);
    t = t.subtract(c);
    t = t.translate([0,0,-1]).setColor([1,1,1]);
    c = c.subtract(t);
  }

  c = c.translate([config.col*20, -config.row*20, 0]);

  return c;
}


function main () {
  return union(
    cap({cLabel: {text: 'Q'}, col:1, row: 1}),
    cap({cLabel: {text: 'A'}, col:1, row: 2}),
    cap({cLabel: {text: 'Z'}, col:1, row: 3}),

    cap({cLabel: {text: 'W'}, col:2, row: 1}),
    cap({cLabel: {text: 'S'}, col:2, row: 2}),
    cap({cLabel: {text: 'X'}, col:2, row: 3}),

    cap({cLabel: {text: 'E'}, col:3, row: 1}),
    cap({cLabel: {text: 'D'}, col:3, row: 2}),
    cap({cLabel: {text: 'C'}, col:3, row: 3}),

    cap({cLabel: {text: 'R'}, col:4, row: 1}),
    cap({cLabel: {text: 'F'}, col:4, row: 2}),
    cap({cLabel: {text: 'V'}, col:4, row: 3}),

    cap({cLabel: {text: 'T'}, col:5, row: 1}),
    cap({cLabel: {text: 'G'}, col:5, row: 2}),
    cap({cLabel: {text: 'B'}, col:5, row: 3}),

    cap({thumb: true, col:6, row:1 }),
    cap({thumb: true, col:6, row: 2, cLabel:{text: '    Del', scale: 0.12}}),
    cap({thumb: true, col:6, row: 3, cLabel: {text: '   Tab', scale: 0.12}}),

    cap({thumb: true, col:7, row:1 }),
    cap({thumb: true, col:7, row: 2, cLabel:{text: '    Space', scale: 0.12}}),
    cap({thumb: true, col:7, row: 3, cLabel: {text: '   Enter', scale: 0.12}}),

    cap({cLabel: {text: 'Y'}, col:8, row: 1}),
    cap({cLabel: {text: 'H'}, col:8, row: 2}),
    cap({cLabel: {text: 'N'}, col:8, row: 3}),

    cap({cLabel: {text: 'U'}, col:9, row: 1}),
    cap({cLabel: {text: 'J'}, col:9, row: 2}),
    cap({cLabel: {text: 'M'}, col:9, row: 3}),

    cap({cLabel: {text: 'O'}, col:10, row: 1}),
    cap({cLabel: {text: 'L'}, col:10, row: 2}),
    cap({cLabel: {text: '<,'}, col:10, row: 3}),

    cap({cLabel: {text: 'P'}, col:11, row: 1}),
    cap({cLabel: {text: ':;'}, col:11, row: 2}),
    cap({cLabel: {text: '?/'}, col:11, row: 3}),


  ).translate([-100,25,0]);
}
