// V7
// TODO:
// Make ledge thicker
// make faceplate thicker


/*
var A    = 20;        // Key row slant angle
var SHAPE = [
[12.5,20],[12.5,25], // bottom left
[31,76],[55,84], // top left
[84, 82], [120, 64], [145, 64],
//    [145,84], // top center
[145,-36], // bottom center
[98+1,-36],    [98-1,-36+1],  //  [96,-41],
[65, -1]
];
var LEDS = [
[0,15],
[81,33],
[-81,33]
];

var POSTS = [
[ 0, -65],
[ 0, 5],
[64, -20],
[-64, -20]
];
var RS   = -117.5;    // Row Start
*/

var A    = 24;        // Key row slant angle

var SHAPE = [
  [13,27],[13,32], // bottom left
  [35,83],[60,90], // top left
  [100, 90], [145, 90],
  [145,-32], // bottom center
  [99+1,-32],    [99-1,-32+1],  //  [96,-41],
  [62, 3]
];

var LEDS = [
  [0,38],
  [20,38],
  [-20,38]
];

var POSTS = [
  [ 0, -60],
  [ 0, 18],
  [64, -20],
  [-64, -20]
];
var RS   = -118.25;    // Row Start



var FT   = 2;         // Faceplate thickness
var H    = 13;        // Total height of keyboard
var RW   = 19;        // Row Width
var SW   = 14 + 0.6 ; // Switch Width 14, plus 0.6, for some reason
var KW   = 17;        // Key Width
var SR   = 1.5;       // screw radius
var KH   = 6;         // key height above faceplate
var TR   = 119;       // thumb radius

var KEYS = false;     // include key-caps

function createText(m) {
  if ( typeof m === 'string' ) m = { text: m };

  return Object.assign({
    text: 'A',
    w: 4,
    h: 7,          // depth
    scale: 0.14,
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


function key(s, x, y, reverse, r, color) {
  var c = cube({size:[SW,SW,100], center: true}).rotateZ(r || 0).translate([x, y, 0]).rotateZ(-A).translate([0, 0, 0]);
  if ( reverse ) c = c.scale([-1,1,1]);
  s = s.subtract(c);
  if ( KEYS ) {
    var key = cube({size:[KW, KW, 8], xxxradius: 1, center: [true,true,false]}).rotateZ(r || 0).translate([x, y,0]).rotateZ(-A).translate([0,0,KH]);
    key = key.setColor(color)
    if ( reverse ) key = key.scale([-1,1,1]);
    s = s.union(key);
  }
  return s;
}


function row(s, x, y, rows, reverse, home) {

  for ( var i = 1 ; i < rows ; i++ ) {
    s = key(s, x+12, RW*i+y-28, reverse, 0, i == 2 && home ? [0.2,0.2,0.2] : [0.8,0.8,0.8] );
  }

  return s;
}


function post(lid, bottom, x, y) {
  bottom = bottom.union(cylinder({r:5,h: H-FT}).subtract(cylinder({r:SR,h: 10}).translate([0,0,H-10])).translate([x,y,0]));
  lid = lid.subtract(cylinder({r:SR,h: 100}).translate([x,y,0]));
  lid = lid.subtract(bottom);
  return [lid, bottom];
}


function base(keys, asBase) {
  var p = polygon({ points: SHAPE });
  var base = p.extrude().scale([1,1,FT]).setColor([0.4,0.4,0.4])
  var s = base;

  // reflect halves
  s = s.intersect(cube({size:[127,500,100]}).translate([0,-250,0]));
  s = s.translate([-127,0,0]);
  s = s.union(s.scale([-1,1,1]));

  if ( ! asBase ) {
    s = s.translate([0,-41,0]);
    s = s.intersect(s.scale([0.9875,0.97,1]));
    s = s.translate([0,41,0]);
  }

  if ( keys ) {
    s = row(s, RS, 0, 4, false, true);
    s = row(s, RS, 0, 4, true, true);

    s = row(s, RS+RW, 15, 4, false, true);
    s = row(s, RS+RW, 15, 4, true, true);

    s = row(s, RS+RW*2, 21, 4, false, true);
    s = row(s, RS+RW*2, 21, 4, true, true);

    s = row(s, RS+RW*3, 15, 4, false, true);
    s = row(s, RS+RW*3, 15, 4, true, true);

    s = row(s, RS+RW*4, 11, 4);
    s = row(s, RS+RW*4, 11, 4, true);

    // thumb key
    function tkey(reverse, a, color, r, x, y, r2) {
      s = key(s, r/2 * Math.cos(a/180*Math.PI)+x, r/2 * Math.sin(a/180*Math.PI)+y, reverse, a + (r2 || 0), color);
    }

    for ( var i = 0 ; i < 2 ; i++ ) {
      // inside keys
      tkey(i == 1, 56, [0.3,0.9,0.3], TR+3, -52, -76, 8);
      // outside keys
      tkey(i == 1, 74, i == 0 ? [0.8,0,0] : [0.2,0.2,0.2], TR, -52, -76);
    }
  }

  s = s.translate([0,-41,0]);

  if ( asBase ) {
    var base = s.scale([1,1,H/FT]);
    base = base.subtract(base.scale([0.98, 0.95, 1]));
    base = base.subtract(s.scale([1,1,H/FT]).translate([0,0,H-FT]).scale([0.99,0.975,1]));
    // add bottom to base
    return base.union(s.scale([1,1,1/1.5]));
  }

  return s;
}

function main() {
  var bottom = base(false, true).setColor([1,1,1]);
  var lid    = base(true, false);

  lid = lid.translate([0,0,H-FT]);

  // Add screw hold and post
  POSTS.forEach(p => {
    [lid, bottom] = post(lid, bottom, p[0], p[1]);
  });

  // Add LED cutouts
  LEDS.forEach(led  => {
    lid = lid.subtract(cylinder({r:SR,h: 100}).translate([led[0],led[1],H-0.4]));
  });

  for ( var i = 0 ; i < 11 ; i++ ) {
    if ( i == 5 || i == 1 || i == 9 ) continue;
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-78+i*16,100,H]));
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-78+i*16,100,H-FT]));
  }

  lid = lid.subtract(createText({text: 'V7', justify: 'C', h: H+FT+.2}).toSolid().scale([-1,1,1]));
  var s = bottom;
  s = s.union(lid);
  return lid;
  return s;
}
