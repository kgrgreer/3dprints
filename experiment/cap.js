const TEXT    = true;
const PREVIEW = true;

const H  = 9;
const W  = 16;
const W2 = 17;
const R  = 30;

const RED   = [0.9,0.2,0.2];
const BLUE  = [0.2,0.2,0.9];
const GREEN = [0.2,0.65,0.2];
const GREY  = [0.8, 0.8, 0.8];

const CAPS = [
{cLabel: {text: 'Q'}, bLabel: {text: '!'}, col:1, row: 1},
{cLabel: {text: 'A'}, bLabel: {text: '1'}, dLabel: {text: 'sh'}, col:1, row: 2, color: GREEN},
{cLabel: {text: 'Z'}, bLabel: {text: '~'}, col:1, row: 3},

{cLabel: {text: 'W'}, bLabel: {text: '@'}, col:2, row: 1},
{cLabel: {text: 'S'}, bLabel: {text: '2'}, dLabel: {text: 'cm'}, col:2, row: 2, color: GREEN},
{cLabel: {text: 'X'}, bLabel: {text: '`'}, col:2, row: 3},

{cLabel: {text: 'E'}, bLabel: {text: '#'}, col:3, row: 1},
{cLabel: {text: 'D'}, bLabel: {text: '3'}, dLabel: {text: 'op'}, col:3, row: 2, color: GREEN},
{cLabel: {text: 'C'}, bLabel: {text: '\\'}, col:3, row: 3},

{cLabel: {text: 'R'}, bLabel: {text: '$'}, col:4, row: 1},
{cLabel: {text: 'F'}, bLabel: {text: '4'}, dLabel: {text: 'ct'}, col:4, row: 2, color: GREEN},
{cLabel: {text: 'V'}, bLabel: {text: '|'}, col:4, row: 3},

{cLabel: {text: 'T'}, bLabel: {text: '%'}, col:5, row: 1},
{cLabel: {text: 'G'}, bLabel: {text: '5'}, col:5, row: 2},
{cLabel: {text: 'B'}, bLabel: {text: ':'}, col:5, row: 3},



{cLabel: {text: 'Y'}, bLabel: {text: '^'}, col:8, row: 1},
{cLabel: {text: 'H'}, bLabel: {text: '6'}, col:8, row: 2},
{cLabel: {text: 'N'}, bLabel: {text: '_'}, col:8, row: 3},

{cLabel: {text: 'U'}, bLabel: {text: '&'}, col:9, row: 1},
{cLabel: {text: 'J'}, bLabel: {text: '7'}, dLabel: {text: 'ct'}, col:9, row: 2, color: GREEN},
{cLabel: {text: 'M'}, bLabel: {text: '-'}, col:9, row: 3},

{cLabel: {text: 'I'}, bLabel: {text: '*'}, col:10, row: 1, color: GREEN},
{cLabel: {text: 'K'}, bLabel: {text: '8'}, dLabel: {text: 'op'}, col:10, row: 2, color: GREEN},
{cLabel: {text: ','}, bLabel: {text: '+'}, col:10, row: 3},

{cLabel: {text: 'O'}, bLabel: {text: '('}, dLabel: {text: 'f11'}, col:11, row: 1},
{cLabel: {text: 'L'}, bLabel: {text: '9'}, dLabel: {text: 'cm'}, col:11, row: 2, color: GREEN},
{cLabel: {text: '.'}, bLabel: {text: '='}, col:11, row: 3},

{cLabel: {text: 'P'}, bLabel: {text: ')'}, dLabel: {text: 'f12'}, col:12, row: 1},
{cLabel: {text: `'`}, bLabel: {text: '0'}, dLabel: {text: 'sh'}, col:12, row: 2, color: GREEN},
//    {xxxcLabel: {text: 'Enter'}, col:12, row: 2, color: RED},
{cLabel: {text: '?'}, bLabel: {text: ';'}, col:12, row: 3},



{thumb: true, col:6, row: 1, color: BLUE, cLabel: {text: '   num', scale: 0.12} },
{thumb: true, col:6, row: 2, color: BLUE, cLabel: {text: '   sym', scale: 0.12}},
{thumb: true, col:6, row: 3, color: BLUE, cLabel: {text: '   nav', scale: 0.12}},

{thumb: true, col:7, row:1, color: RED, cLabel: {text: '   del', scale: 0.12} },
{thumb: true, col:7, row: 2, xxxcLabel: {text: '    space', scale: 0.12}, color: GREY},
{thumb: true, col:7, row: 3, cLabel: {text: '    enter', scale: 0.12}, color: RED},

];

const LAYERS = {
  num: 'f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 1 2 3 4 5 6 7 8 9 0 f11 f12 esc v- v+ bk - + . pr',
  sym: '@ _ [ ] ^ ! < > = & \\ / { } * ? ( ) - : # $ | ~ ` + % " \' ;',
  nav: [
      null,
      'esc',
      'ins',
      'PrScr',
      'Brk',

      'pu',
      'bk',
      '^',
      'del',
      'pd',

      null,
      null,
      null,
      null,
      null,

      'hm',
      '<',
      'v',
      '>',
      'end',

      null,
      null,
      null,
      null,
      null,

      '<-',
      '->',
      'cut',
      'copy',
      'paste'
  ]
};
/*
Print Instructions:

PLA:
Temp.: 200, 40, 50
.1mm layer height
20mm/s travel speed

PETG:
.1mm layer height

*/
function memoize(f) {
  var val;

  return function() {
    if ( ! val ) val = f.call(this);
    return val;
  };
}

function createText(m) {
  if ( typeof m === 'string' ) m = { text: m };

  return Object.assign({
    text: 'A',
    w: 4,
    h: 6,          // depth
    scale: 0.16,
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


const stem = memoize(function stem() {
  var   sw = 4.8; /*make smaller to reduce friction Was: 5.4+1.5*/
  var   sh = 6;
  const W  = 4.3; // add 0.2 when testing to make easier to put on and remove
  const H  = 1.5;
  var   D  = 8;

  var stem = cube({radius:1.5, fn: 40, roundradius: 0.5,size:[sh,sw, D+4]}).intersect(cube({size:[sh,sw, D]})).translate([-sh/2,-sw/2,-0.8]);
  stem = stem.intersect(cube({size:[20,20,20], center: [true,true,false]}))

  function cross(p, height) {
    var c = cube({size:[W+p,H+p,height], center: [true,true,false]}).union(cube({size:[H+p,W+p,height], center: [true,true,false]}));
  stem = stem.subtract(c);

  }
  cross(0, 4);
  cross(0.4, 0.1);
  cross(0.2, 0.2);

  return stem;
});


function cap(config) {
    var n, e, s, w;

//if ( config.row != 2 ) return null;
//if ( config.col < 9 ) return null;

    if ( config.thumb ) {
      [w, n, e, s] = [
        [4,4,15,14],
        [15,4,15,14],
        [15,4,4,14]
      ][config.row-1];
    } else {
      [w, n, e, s] = [
        [5, 4, 5,14],
        [5, 18,5,16],
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

  var cy = cylinder({r:R, h:100, center: true, fn:360}).rotateX(90).translate([0,0,R+H-2+0.2]);
  c = c.subtract(cy);

  c = c.subtract(c.scale([0.95,0.95,0.77]));
  if ( ! PREVIEW ) c = c.union(stem());
  c = c.subtract(cy);
  c = c.union(cube({size:[3,17,0.5],center:[true,true,false]}).translate([0,0,5.3]))
  c = c.intersect(o);

  c = c.setColor(config.color || [0.4,0.4,0.4]);

  function text(config, x, y) {
    if ( ! TEXT || ! config ) return;
    config.justify = 'C';
    config.w       = 5;
    var t = createText(config).toSolid().translate([x,y,H]);
    t = t.subtract(c);
    t = t.translate([0,0,-1]);
    if ( PREVIEW ) {
      t = t.intersect(c).setColor([1,1,1]);
      c = c.subtract(t).union(t);
    } else {
      c = c.subtract(t);
    }
  }

  text(config.cLabel, -5, 2);
  text(config.sLabel,  4, 2);
  text(config.vLabel,  2, -5);
  text(config.nLabel, -4, -5);

  c = c.translate([config.col*20, -config.row*20, 0]);

  return c;
}


function main () {
  var i = 0;

  LAYERS.num = LAYERS.num.split(' ');
  for ( var i = 0 ; i < LAYERS.num.length ; i++ ) {
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].nLabel ) CAPS[j].nLabel = {};
      CAPS[j].nLabel.text = LAYERS.num[i];
  }

  LAYERS.sym = LAYERS.sym.split(' ');
  for ( var i = 0 ; i < LAYERS.sym.length ; i++ ) {
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].sLabel ) CAPS[j].sLabel = {};
      CAPS[j].sLabel.text = LAYERS.sym[i];
  }

  for ( var i = 0 ; i < LAYERS.nav.length ; i++ ) {
    if ( ! LAYERS.nav[i] ) continue;
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].vLabel ) CAPS[j].vLabel = {};
      CAPS[j].vLabel.text = LAYERS.nav[i];
  }

  return union(CAPS.map(c => cap(c)).filter(c => c)).translate([-100,25,0]);
}
