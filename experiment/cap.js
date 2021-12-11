const TEXT    = true;
const PREVIEW = false;

const FILTER = (c) => {
//    return true;
return c.col<6;
return c.col == 8 || c.col == 9;
var ret = c.col == 4 || c.col == 9;
if ( c.col == 9 ) c.col = 5;
if ( c.row > 2 ) return false;
return ret;
    return c.col == 12;
    return c.row == 1 && c.col == 1;
};

const TOP_SLOPE = 8;
const H  = 9;
const W  = 16;
const W2 = 17;
const R  = 20; // radius of cylinder carved out of top of caps
const TEXT_DEPTH = 0.6;

const RED   = [0.9,0.2,0.2];
const BLUE  = [0.25,0.25,0.9];
const GREEN = [0.2,0.65,0.2];
const GREY  = [0.8, 0.8, 0.8];

const CAPS = [
{cLabel: {text: 'Q'}, bLabel: {text: '!'}, col:1, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'A'}, bLabel: {text: '1'}, dLabel: {text: 's', color: RED}, col:1, row: 2},
{cLabel: {text: 'Z'}, bLabel: {text: '~'}, col:1, row: 3},

{cLabel: {text: 'W'}, bLabel: {text: '@'}, col:2, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'S'}, bLabel: {text: '2'}, dLabel: {text: '^', color: RED}, col:2, row: 2},
{cLabel: {text: 'X'}, bLabel: {text: '`'}, col:2, row: 3},

{cLabel: {text: 'E'}, bLabel: {text: '#'}, col:3, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'D'}, bLabel: {text: '3'}, dLabel: {text: 'o', color: RED}, col:3, row: 2},
{cLabel: {text: 'C'}, bLabel: {text: '\\'}, col:3, row: 3},

{cLabel: {text: 'R'}, bLabel: {text: '$'}, col:4, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'F'}, bLabel: {text: '4'}, dLabel: {text: 'c', color: RED}, col:4, row: 2, color: BLUE},
{cLabel: {text: 'V'}, bLabel: {text: '|'}, col:4, row: 3},

{cLabel: {text: 'T'}, bLabel: {text: '%'}, col:5, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'G'}, bLabel: {text: '5'}, col:5, row: 2},
{cLabel: {text: 'B'}, bLabel: {text: ':'}, col:5, row: 3},



{cLabel: {text: 'Y'}, bLabel: {text: '^'}, col:8, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'H'}, bLabel: {text: '6'}, col:8, row: 2},
{cLabel: {text: 'N'}, bLabel: {text: '_'}, col:8, row: 3},

{cLabel: {text: 'U'}, bLabel: {text: '&'}, col:9, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'J'}, bLabel: {text: '7'}, dLabel: {text: 'c', color: RED}, col:9, row: 2, color: BLUE},
{cLabel: {text: 'M'}, bLabel: {text: '-'}, col:9, row: 3},

{cLabel: {text: 'I'}, bLabel: {text: '*'}, col:10, row: 1, color: BLUE, slope: TOP_SLOPE},
{cLabel: {text: 'K'}, bLabel: {text: '8'}, dLabel: {text: 'o', color: RED}, col:10, row: 2, color: BLUE},
{cLabel: {text: ',<'}, bLabel: {text: '+'}, col:10, row: 3},

{cLabel: {text: 'O'}, bLabel: {text: '('}, col:11, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'L'}, bLabel: {text: '9'}, dLabel: {text: '^', color: RED}, col:11, row: 2, color: BLUE},
{cLabel: {text: '.>'}, bLabel: {text: '='}, col:11, row: 3},

{cLabel: {text: 'P'}, bLabel: {text: ')'}, col:12, row: 1, slope: TOP_SLOPE},
{cLabel: {text: `'"`}, bLabel: {text: '0'}, dLabel: {text: 's', color: RED}, col:12, row: 2},
{cLabel: {text: '?/'}, bLabel: {text: ';'}, col:12, row: 3},



{thumb: true, col:6, row: 1, color: BLUE },
{thumb: true, col:6, row: 2, color: RED, cLabel: {text: 'del', x: 3, y: -2, scale: 0.14}},
{thumb: true, col:6, row: 3, color: GREY, cLabel: {text: '->', x: 4, y: -2, scale: 0.12} },

{thumb: true, col:7, row:1, color: GREEN },
{thumb: true, col:7, row: 2, xxxcLabel: {text: 'space', scale: 0.12}, color: GREY},
{thumb: true, col:7, row: 3, cLabel: {text: 'enter', x: 1, y:-2, scale: 0.14}, color: RED},

];

const LAYERS = {
  num: 'f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 1 2 3 4 5 6 7 8 9 0 f11 f12 esc v- v+ bk - + . pr',
  sym: '! @ # $ % ^ & * ( ) 1 2 3 4 5 6 7 8 9 ` ~ - + = _ { } [ ] \\|',
  nav: 'f1,11 f2,12 f3 f4 f5 PgUp <- ^ -> PgDn f6 f7 f8 f9 f10 home < v > end esc cut copy paste PrSc v- bk ins del v+',
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
    w: 4.2,
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
  var   sw = 4; /*make smaller to reduce friction Was: 5.4+1.5*/
  var   sh = 5.8;
  const W  = 4.3; // add 0.2 when testing to make easier to put on and remove
  const H  = 1.5;
  var   D  = 8;
  const R  = 5.4/2;

  var s = cube({xxxradius:1.5, fn: 40, xxxroundradius: 0.5,size:[sh,sw, D+4]}).intersect(cube({size:[sh,sw, D]})).translate([-sh/2,-sw/2,-0.8]);
  //var s = cylinder({r: R, h: 20});

  function cross(p, height) {
    var c = cube({size:[W+p,H+p,height], center: [true,true,false]}).union(cube({size:[H+p,W+p,height], center: [true,true,false]}));
  s = s.subtract(c);

  }
  cross(0, 4);
//  cross(0.4, 0.1);
//  cross(0.2, 0.2);

  // shave off top and bottom of stem
  s = s.intersect(cube({center:[true,true,false], size:[7, 4.4, 20]}));

  return s;
});


function cap(config) {
    var n, e, s, w;

    if ( config.thumb ) {
      [w, n, e, s] = [
        [ 4, 4, 15, 14],
        [15, 4, 15, 14],
        [15, 4,  4, 14]
      ][config.row-1];
    } else {
      [w, n, e, s] = [
        [5, 4,  5, 14],
        [5, 16, 5, 16],
        [5, 19, 5,  4]
      ][config.row-1];
    }
  var c = cube({fn:50,size:[W,W2,H+12], center: [true,true,false], radius: PREVIEW ? 0 : 2}).translate([0,0,-8]);
  var o = c.scale([1,1,10]);

  c = c.intersect(o.translate([0,-W2/2,0]).rotateX(n).translate([0,W2/2,0]));
  c = c.intersect(o.translate([-W/2,0,0]).rotateY(-e).translate([W/2,0,0]));
  c = c.intersect(o.translate([0,W2/2,0]).rotateX(-s).translate([0,-W2/2,0]));
  c = c.intersect(o.translate([W/2,0,0]).rotateY(w).translate([-W/2,0,0]));

  c = c.intersect(cube({size:[20,20,30], center: [true, true, false] }))
  o = c;

  var cy;
  if ( ! PREVIEW ) {
    cy = cylinder({r:R, h:20, center: true, fn:200}).rotateX(90).translate([0,0,R+H-2+0.4]);
    // trim off sharp edge
    cy = cy.union(cube({size:[20,20,5], center:[true,true,false]}).translate([0,0,H-0.4]))
    if ( config.slope ) cy = cy.translate([0,10,0]).rotateX(config.slope).translate([0,-10,0]);
    //cy = cy.union(sphere({r:R*4, fn:40}).scale([1,1,1]).translate([0,0,H+R*4-2-0.3]));
    c = c.subtract(cy);
    c = c.subtract(c.scale([0.94,0.94,0.77]));
  }

  if ( ! PREVIEW ) {
    c = c.union(stem());
    c = c.subtract(cy);
  }

  c = c.union(cube({size:[17,17,0.5],center:[true,true,false]}).translate([0,0,5.6]))

  c = c.union(cube({size:[0.2,7,0.5],center:[1,0,0]}).translate([2.8,2,0]))
  c = c.union(cube({size:[0.2,7,0.5],center:[1,0,0]}).translate([-2.8,2,0]))
  c = c.union(cube({size:[0.2,7,0.5],center:[1,0,0]}).translate([2.8,-9,0]))
  c = c.union(cube({size:[0.2,7,0.5],center:[1,0,0]}).translate([-2.8,-9,0]))


  c = c.intersect(o);

  c = c.union(cube({size:[W+0.2,W2+0.2,0.2], center:[true,true,false]}).subtract(cube({size:[W*0.95-0.6,W2*0.95-0.6,0.2], center:[true,true,false]})))

  c = c.setColor(config.color || [0.4,0.4,0.4]);

  function text(config, x, y) {
    if ( ! TEXT || ! config ) return;
    config.justify = 'L';
    config.w       = 5;
    var t = createText(config).toSolid().translate([x + (config.x || 0), y + (config.y ||0), H]);
    t = t.subtract(c);
    t = t.translate([0,0,-TEXT_DEPTH]);
    if ( PREVIEW ) {
      t = t.intersect(c).setColor(config.color || [1,1,1]);
      c = c.subtract(t).union(t);
    } else {
      c = c.subtract(t);
    }
  }

  text(config.cLabel, -6,  1);
  text(config.sLabel, 2.5, 1);
  text(config.vLabel, -6,  -5);
  text(config.dLabel, 3.5, -5);

  // raise the height of the cap by 'add' mm's
  const add = 0.6;
  var area = cube({size:[40,40,2], center: [true, true, false]});
  var base = c.intersect(area).scale([1,1,(2+add)/2]);
  var top  = c.subtract(area).translate([0,0,add]);
  c = base.union(top);
  c = c.translate([config.col*16.25, -config.row*17.25, 0]);

  return c;
}


function main () {
  var i = 0;

/*
  LAYERS.num = LAYERS.num.split(' ');
  for ( var i = 0 ; i < LAYERS.num.length ; i++ ) {
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].nLabel ) CAPS[j].nLabel = {};
      CAPS[j].nLabel.text = LAYERS.num[i];
  }
  */

  LAYERS.sym = LAYERS.sym.split(' ');
  for ( var i = 0 ; i < LAYERS.sym.length ; i++ ) {
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].sLabel ) CAPS[j].sLabel = {color: GREEN, justify: 'R'};
      CAPS[j].sLabel.text = LAYERS.sym[i];
  }

  LAYERS.nav = LAYERS.nav.split(' ');
  for ( var i = 0 ; i < LAYERS.nav.length ; i++ ) {
    if ( ! LAYERS.nav[i] ) continue;
    var j = 3 * ( i % 10 ) + Math.floor(i / 10);
      if ( ! CAPS[j].vLabel ) CAPS[j].vLabel = { color: [0,0,1], justify: 'C', scale: 0.15 };
      CAPS[j].vLabel.text = LAYERS.nav[i];
  }

  return union(CAPS.filter(FILTER).map(c => cap(c))).translate([-100,25,0]);
}