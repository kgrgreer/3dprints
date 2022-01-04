// TODO: customze size of humb keys to make narrower but longer
// experiment with making first row shorter and last row higher, which should reduce top slop on bottom keys

const TEXT    = true;
const PREVIEW = false;

const PLA = {
    STEM_GUIDES: false,
    STEM_TOLERANCE: 0
};

const PETG = {
    STEM_GUIDES: true,
    STEM_TOLERANCE: 0.2
};

const MATERIAL = PLA;

const FILTER = (c) => {
    return c.col == 2;
};

const TOP_SLOPE = 8;
const H  = PREVIEW ? 7 : 9;
const W  = 16.6;
const W2 = 17;
const R  = 20; // radius of cylinder carved out of top of caps
const TEXT_DEPTH = 0.8;

const RED   = [0.9,  0.2,  0.2];
const BLUE  = [0.25, 0.25, 0.9];
const GREEN = [0.2,  0.65, 0.2];
const GREY  = [0.8,  0.8,  0.8];

const THUMBS = [
      // w n   e   s
      [ 2, 4, 18, 14],
      [15, 4, 15, 14],
      [18, 4,  2, 14],

      [2,  4, 18, 14],
      [15, 4, 15, 14],
      [18, 4,  2, 14]
];

const FINGERS = [
    // w  n   e   s  dh
      [5, 5,  5, 14, 0.3],
      [5, 16, 5,  5, 0.4],
      [5, 22, 5,  0, -1]
];


const CAPS = [
{cLabel: {text: 'Q'}, col:1, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'A'}, dLabel: {text: 's', color: RED}, col:1, row: 2, color: BLUE},
{cLabel: {text: 'Z'}, color: RED, col:1, row: 3},

{cLabel: {text: 'W'}, col:2, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'S'}, dLabel: {text: '^', color: RED}, col:2, row: 2, color: BLUE},
{cLabel: {text: 'X'}, col:2, row: 3},

{cLabel: {text: 'E'}, col:3, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'D'}, dLabel: {text: 'o', color: RED}, col:3, row: 2, color: BLUE},
{cLabel: {text: 'C'}, col:3, row: 3},

{cLabel: {text: 'R'}, col:4, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'F'}, pip: true, dLabel: {text: 'c', color: RED}, col:4, row: 2, color: BLUE},
{cLabel: {text: 'V'}, col:4, row: 3},

{cLabel: {text: 'T'}, col:5, row: 1, slope: TOP_SLOPE, style: 'i2', h: 1},
{cLabel: {text: 'G'}, col:5, row: 2, style: 'i2', h: 1},
{cLabel: {text: 'B'}, col:5, row: 3, style: 'i2', h: 1},



{cLabel: {text: 'Y'}, col:6, row: 1, style: 'i1', slope: TOP_SLOPE, h: 1.75},
{cLabel: {text: 'H'}, col:6, row: 2, style: 'i1', h: 1.75},
{cLabel: {text: 'N'}, col:6, row: 3, style: 'i1', h: 1.75},

{cLabel: {text: 'U'}, col:7, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'J'}, pip: true, dLabel: {text: 'c', color: RED}, col:7, row: 2, color: BLUE},
{cLabel: {text: 'M'}, col:7, row: 3},

{cLabel: {text: 'I'}, col:8, row: 1, color: BLUE, slope: TOP_SLOPE},
{cLabel: {text: 'K'}, dLabel: {text: 'o', color: RED}, col:8 , row: 2, color: BLUE},
{cLabel: {text: ',<'}, col:8, row: 3},

{cLabel: {text: 'O'}, col:9, row: 1, slope: TOP_SLOPE},
{cLabel: {text: 'L'}, dLabel: {text: '^', color: RED}, col:9, row: 2, color: BLUE},
{cLabel: {text: '.>'}, col:9, row: 3},

{cLabel: {text: 'P'}, col:10, row: 1, slope: TOP_SLOPE},
{cLabel: {text: `'"`}, dLabel: {text: 's', color: RED}, col:10, row: 2},
{cLabel: {text: '?/'}, col:10, row: 3},



{thumb: true, col:3, row: 4, color: RED, style: 'i1', slope: TOP_SLOPE, cLabel: {text: 'del', x: 4, y: -2, scale: 0.12} },
{thumb: true, col:4, row: 4, color: GREY, slope: TOP_SLOPE, cLabel: {text: '->', x: 3, y: -2, scale: 0.14}, h: -1},
{thumb: true, col:5, row: 4, color: BLUE, style: 'i2', slope: TOP_SLOPE },

{thumb: true, col:6, row: 4, color: GREEN, style: 'i1', slope: TOP_SLOPE },
{thumb: true, col:7, row: 4, color: GREY, slope: TOP_SLOPE, h: -1},
{thumb: true, col:8, row: 4, color: RED, style: 'i2', slope: TOP_SLOPE, cLabel: {text: 'enter', x: 1, y:-2, scale: 0.14}},

];

const LAYERS = {
  // num: 'f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 1 2 3 4 5 6 7 8 9 0 f11 f12 Esc v- v+ bk - + . pr',
  sym: '! @ # $ % ^ & * ( ) 1 2 3 4 5 6 7 8 9 ` ~ - + = _ { } [ ] \\|',
  nav: 'f1 f2 f3 f4 f5 home <- ^ -> PgU f6 f7 f8 f9 f10 end < v > PgD ESC cut copy paste PrSc v- bk ins del v+',
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
    w: 4.5,
    h: 12,          // depth
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
  var   sh = 2.8+0.2; // 3.4 /*make smaller to reduce friction Was: 5.4+1.5*/
  var   sw = 5.8+0.2; // 6.2
  const W  = 4.3 + MATERIAL.STEM_TOLERANCE; // add 0.2 when testing to make easier to put on and remove
  const H  = 1.3 + MATERIAL.STEM_TOLERANCE; // 1.5 with green metalic filament
  var   D  = 8;
  const R  = 5.4/2;

  var s = cube({radius:0.5, fn: 40, roundradius: 0.25,size:[sw,sh, D+4]}).intersect(cube({size:[sw,sh, D]})).translate([-sw/2,-sh/2,-0.8]);
  //var s = cylinder({r: R, h: 20});

  function cross(p, height) {
    var c = cube({size:[W+p,H+p,height], center: [true,true,false]}).union(cube({size:[H+p,W+p,height], center: [true,true,false]}));
  s = s.subtract(c);

  }
  cross(0, 4);

  // shave off top and bottom of stem
  s = s.intersect(cube({center:[true,true,false], size:[7, 4.4, 20]}));

  // ramp out on top of stem
  for ( var i = 0.1 ; i < 4 ; i += 0.1 )
    s = s.union(cube({size:[sw+i*1.5,sh+i*1.5,1], center:[1,1,0]}).translate([0,0,4+i]));

  return s;
});


function cap(config) {
    var n, e, s, w;

    config.h = config.h || 0;

    if ( config.thumb ) {
      [w, n, e, s] = THUMBS[config.col-3];
    } else {
      var dh;
      [w, n, e, s, dh] = FINGERS[config.row-1];
      if ( config.col == 1 || config.col == 10 ) {
          dh += config.row == 1 ? 1 : 3;
          if ( config.row == 1 ) s -= 5;
          if ( config.row == 3 ) n -= 5;
      }
      config.h += dh;
      if ( config.row == 6 ) {
          e += 4;
          w -= 4;
      }
      if ( config.row == 7 ) w += 3;
      if ( config.row == 5 ) {
          w += 4;
          e -= 4;
      }
      if ( config.col == 3 || config.col == 8 ) {
          if ( config.row <= 3 )
              dh--;
      }
      if ( config.row == 4 ) e += 3;
      if ( config.row == 2 || config.row == 3 ) config.slope = -5;
    }


  var c = cube({fn:50,size:[W,W2,H+20], center: [true,true,false], radius: PREVIEW ? 0 : 4}).translate([0,0,-8]);
  var o = c.scale([1,1,10]);

  c = c.intersect(o.translate([0,-W2/2,0]).rotateX(n).translate([0,W2/2,0]));
  c = c.intersect(o.translate([-W/2,0,0]).rotateY(-e).translate([W/2,0,0]));
  c = c.intersect(o.translate([0,W2/2,0]).rotateX(-s).translate([0,-W2/2,0]));
  c = c.intersect(o.translate([W/2,0,0]).rotateY(w).translate([-W/2,0,0]));

  c = c.intersect(cube({size:[20,20,30], center: [true, true, false] }))
  o = c;

  // ********************************************* CONTOUR CAP
  if ( ! PREVIEW ) {
    const h = H + (config.h || 0);
    var cy = cylinder({r:R, h:20, center: true, fn:120}).rotateX(90).translate([0,0,R+h-2+0.4]);
    // trim off sharp edge
    cy = cy.union(cube({size:[20,20,5], center:[true,true,false]}).translate([0,0,h-0.4]))

    if (config.pip )
      cy = cy.subtract(cylinder({roundRadius: 0.25, round: true, r:1.5, h:4}).rotateY(90).translate([-1.5,-1.6,h-2.1]));


    if ( config.style == 'i1' ) {
      cy = cy.union(cube({size:[20,20,10], center:[false,true,false]}).translate([0,0,h-2+0.4]))
    } else if ( config.style == 'i2' ) {
      cy = cy.union(cube({size:[-20,20,10], center:[false,true,false]}).translate([0,0,h-2+0.4]))
    }

    if ( config.slope ) cy = cy.translate([0,10,0]).rotateX(config.slope).translate([0,-10,0]);
    //cy = cy.union(sphere({r:R*4, fn:40}).scale([1,1,1]).translate([0,0,H+R*4-2-0.3]));
    c = c.subtract(cy);
    c = c.subtract(c.scale([0.94,0.94,0.7]));

    c = c.union(stem());
    c = c.subtract(cy);

    //c = c.union(cube({size:[17,17,0.5],center:[true,true,false]}).translate([0,0,5.6]))

    // add internal bridging,
    c = c.union(cube({size:[W,0.6,1.2], center:[1,1,0]}).translate([0,1.4,h-4.1]))
    c = c.union(cube({size:[W,0.6,1.2], center:[1,1,0]}).translate([0,-1.4,h-4.1]))
    c = c.union(cube({size:[0.6,W,1.2], center:[1,1,0]}).translate([2.8,0,h-4.1]))
    c = c.union(cube({size:[0.6,W,1.2], center:[1,1,0]}).translate([-2.8,0,h-4.1]))


//    c = c.union(cube({size:[W,0.5,h-2.6], center:[1,1,0]}).translate([0,1.98,0]))
//    c = c.union(cube({size:[0.1,W,h-2.6], center:[1,1,0]}).translate([-2.8,0,0]))
  }


  if ( MATERIAL.STEM_GUIDES ) {
    c = c.union(cube({size:[0.5,7,.64],center:[1,0,0]}).translate([2,1,0]))
    c = c.union(cube({size:[0.5,7,.64],center:[1,0,0]}).translate([-2,1,0]))
    c = c.union(cube({size:[0.5,7,.64],center:[1,0,0]}).translate([2,-8,0]))
    c = c.union(cube({size:[0.5,7,.64],center:[1,0,0]}).translate([-2,-8,0]))

    c = c.union(cube({size:[11,0.5,.64],center:[1,1,0]}).translate([8,0,0]))
    c = c.union(cube({size:[11,0.5,.64],center:[1,1,0]}).translate([-8,0,0]))
  }
  c = c.intersect(o);

  // add a small lip around the outside of the key for better plate adhesion
  // c = c.union(cube({size:[W+0.2,W2+0.2,0.2], center:[true,true,false]}).subtract(cube({size:[W*0.95-1.5,W2*0.95-1.5,0.2], center:[true,true,false]})))

  c = c.setColor(config.color || [0.4,0.4,0.4]);

  function text(config, x, y) {
    if ( ! TEXT || ! config ) return;
    config.justify = 'L';
    config.w       = 5;
    var t = createText(config).toSolid().translate([x + (config.x || 0), y + (config.y ||0), H-2]);
    t = t.subtract(c);
    t = t.translate([0,0,-TEXT_DEPTH]);
    if ( PREVIEW ) {
      t = t.intersect(c).setColor(config.color || [1,1,1]);
      c = c.subtract(t).union(t);
    } else {
      c = c.subtract(t);
    }
  }

  text(config.cLabel, -6.1,  1);
  text(config.sLabel, 2.6, 1);
  text(config.vLabel, -6.1,  -5);
  text(config.dLabel, 3.6, -5);

  // raise the height of the cap by 'add' mm's
  const add = 0.6;
  var area = cube({size:[40,40,2], center: [true, true, false]});
  var base = c.intersect(area).scale([1,1,(2+add)/2]);
  var top  = c.subtract(area).translate([0,0,add]);
  c = base.union(top);
  c = c.translate([config.col*(W+0.25), -config.row*17.25, 0]);

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

/*

Print Instructions:

PETG:
2mm retraction distance
0.12mm layer height
50% infill
shortest z seam alignment
30 mm/s print speed
60 mm/s travel speed
Temp: 240/55/55
Print Cooling: 25%
z offset 0.1mm

PLA:
1.5mm retraction distance
0.12mm layer height
50% infill
shortest z seam alignment
30 mm/s print speed
80 mm/s travel speed
Temp: 205/60/50
Print Cooling: 100%
z offset 0.1mm

*/
