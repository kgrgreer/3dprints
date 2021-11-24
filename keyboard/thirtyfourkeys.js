// V4
// TODO:
// 1. horizontal and vertical spacing of keys is off because of slant angle
// 2. experiment with 25 degree angle

var A    = 20;        // Key row slant angle
var FT   = 1.49;      // Faceplate thickness
var H    = 15;        // Total height of keyboard
var RW   = 19;        // Row Width
var RS   = -117.5;    // Row Start
var SW   = 14 +1 ;    // Switch Width 14, plus 1, for some reason
var KW   = 17;        // Key Width
var SR   = 1.5;       // screw radius
var KH   = 6;         // key height above faceplate
var TR   = 90;        // thumb radius

var KEYS = false;     // include key-caps


function key(s, x, y, reverse, r, color) {
    var c = cube({size:[SW,SW,100], center: true}).rotateZ(r || 0).translate([x, y, 0]).rotateZ(-A).translate([0, 0, 0]);
    if ( reverse ) c = c.scale([-1,1,1]);
    s = s.subtract(c);
    if ( KEYS ) {
        var key = cube({size:[KW, KW, 8], center: [true,true,false]}).rotateZ(r || 0).translate([x, y,0]).rotateZ(-A).translate([0,0,KH]);
        key = key.setColor(color)
        if ( reverse ) key = key.scale([-1,1,1]);
        s = s.union(key);
    }
    return s;
}

function row(s, x, y, rows, reverse, home) {

  for ( var i = 1 ; i < rows ; i++ ) {
      s = key(s, x+12, RW*i+y-28, reverse, 0, i == 2 && home ? [0.8,0.8,0.8] : [0.2,0.2,0.2]);
  }

  return s;
}

function post(lid, bottom, y) {
  bottom = bottom.union(cylinder({r:5,h: H-FT}).subtract(cylinder({r:SR,h: 10}).translate([0,0,H-10])).translate([0,y,0]));
  lid = lid.subtract(cylinder({r:SR,h: 100}).translate([0,y,0]));
  lid = lid.subtract(bottom);
  return [lid, bottom];
}

function base(keys, asBase) {
var p = polygon({ points: [
    [12.5,20],[12.5,25],
    [31,76],[55,84],
    [145,84],
    [145,-41],
    [95,-41],    [93,-40],  //  [96,-41],
    [65, -1]
] });
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
   function tkey(reverse, a, color) {
      s = key(s, TR/2 * Math.cos(a/180*Math.PI)-52, TR/2 * Math.sin(a/180*Math.PI)-62, reverse, a, color);
   }

   for ( var i = 0 ; i < 2 ; i++ ) {
     tkey(i == 1, 35+5, [0.3,0.3,0.9]);
     tkey(i == 1, 63+5, i == 1 ? [0.8,0,0] : [0.2,0.2,0.2]);
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
  [lid, bottom] = post(lid, bottom, -55);
  [lid, bottom] = post(lid, bottom, 5);

  // Add LED cutouts
  for ( var i = 0 ; i < 3 ; i++ )
    lid = lid.subtract(cylinder({r:SR,h: 100}).translate([-14+14*i,32,H-0.4]));

  for ( var i = 0 ; i < 11 ; i++ ) {
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-78+i*16,100,H]));
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-78+i*16,100,H-FT]));
  }
  var s = bottom;
  s = s.union(lid);
  s = bottom;
  s = lid;
  return s;
}
