// based on: https://shop.keyboard.io/products/keyboardio-atreus?variant=31234605809737


var A  = 10;  // Key row slant angle
var FT = 1.5; // Faceplate thickness
var H  = 15;
var RW = 18.25;  // Row Width
var RS = 9.5-122;     // Row Start
var SW = 14;      // Switch Width 14
var KW = 17;      // Key Width
var SR = 1.5;       // screw radius

function key(s, x, y) {
    var c = cube({size:[15,15,100]}).rotateZ(-A).translate([x,y,0]);
    s = s.subtract(c);
    return s;
}

function row(s, x, y, rows, reverse) {

  for ( var i = 0 ; i < rows ; i++ ) {
    var c = cube({size:[SW,SW,100], center: true}).translate([7, 19*i+7+y,0]).rotateZ(-A).translate([x,0,0]);
    if ( reverse ) c = c.scale([-1,1,1])
    s = s.subtract(c);
    var key = cube({size:[KW,KW,8], center: [true,true,false]}).translate([7, 19*i+7+y,0]).rotateZ(-A).translate([x,0,6]);
    key = key.setColor(i == 2 && y != -5 ? [1,1,1] : [0.2,0.2,0.2]);
    if ( reverse ) key = key.scale([-1,1,1])
    s = s.union(key);
  }

  return s;
}

function base(keys, asBase) {
var p = polygon({ points: [ [9,19],/*[15,82]*/,[19,78], [21, 82], [220,82],[233,0],[140,-10],[90,-10], [10,2], [8,5] ] });
var base = p.extrude().scale([1,1,FT]).setColor([0.4,0.4,0.4])
var s = base;


 // reflect halves
 s = s.intersect(cube({size:[122,500,100]}).translate([0,-250,0]));
 s = s.translate([-122,0,0]);
 s = s.union(s.scale([-1,1,1]));

 if ( ! asBase ) {
 s = s.translate([0,-41,0]);
  s = s.intersect(s.scale([0.9875,0.97,1]));
 s = s.translate([0,41,0]);
 }

 if ( keys ) {
 s = row(s, RS, 7, 4);
 s = row(s, RS, 7, 4, true);

 s = row(s, RS+RW, 7, 4);
 s = row(s, RS+RW, 7, 4, true);

 s = row(s, RS+RW*2, 8, 4);
 s = row(s, RS+RW*2, 8, 4, true);

 s = row(s, RS+RW*3, 2, 4);
 s = row(s, RS+RW*3, 2, 4, true);

 s = row(s, RS+RW*4, -5, 4);
 s = row(s, RS+RW*4, -5, 4, true);

 s = row(s, RS+RW*5, -4, 2);
 s = row(s, RS+RW*5, -4, 2, true);
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
  bottom = bottom.union(cylinder({r:5,h: H-FT}).subtract(cylinder({r:SR,h: 10}).translate([0,0,H-10])).translate([0,-5,0]));
  lid = lid.subtract(cylinder({r:SR,h: 100}).translate([0,-5,0]));
  lid = lid.subtract(bottom);

  // Add LED cutouts
  for ( var i = 0 ; i < 3 ; i++ )
    lid = lid.subtract(cylinder({r:SR,h: 100}).translate([0,10+10*i,H-0.4]));

  for ( var i = 0 ; i < 11 ; i++ ) {
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-90+i*18,100,H]));
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-90+i*18,100,H-FT]));
  }
  var s = bottom;
  //s = s.union(lid);
   s = bottom;

  s = s.rotateZ(10);
  return s;
}
