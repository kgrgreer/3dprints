// based on: https://shop.keyboard.io/products/keyboardio-atreus?variant=31234605809737


var A  = 10;  // Key row slant angle
var FT = 1.5; // Faceplate thickness
var H  = 15;
var RW = 18.25;  // Row Width
var RS = 8.6;     // Row Start
var SW = 14;      // Switch Width 14
var KW = 17;      // Key Width

function key(s, x, y) {
    var c = cube({size:[15,15,100]}).rotateZ(-A).translate([x,y,0]);
    s = s.subtract(c);
    return s;
}

function row(s, x, y, opt_rows) {

  for ( var i = 0 ; i < (opt_rows || 4) ; i++ ) {
    var c = cube({size:[SW,SW,100], center: true}).translate([7, 19*i+7+y,0]).rotateZ(-A).translate([x,0,0]);
    s = s.subtract(c);
    var key = cube({size:[KW,KW,8], center: [true,true,false]}).translate([7, 19*i+7+y,0]).rotateZ(-A).translate([x,0,6]);
    key = key.setColor(i == 2 && y != -5 ? [1,1,1] : [0.2,0.2,0.2]);
    s = s.union(key);
  }

  return s;
}

function base(keys) {
var p = polygon({ points: [ [3,6],/*[15,82]*/,[16,78], [21, 82], [220,82],[233,0],[140,-10],[90,-10], [8,0] ] });
var base = p.extrude().scale([1,1,FT]).setColor([0.4,0.4,0.4])
var s = base;

 if ( keys ) {
 s = row(s, RS, 7);
 s = row(s, RS+RW, 7);
 s = row(s, RS+RW*2, 8);
 s = row(s, RS+RW*3, 2);
 s = row(s, RS+RW*4, -5);
 s = row(s, RS+RW*5, -4, 2);
 }

 s = s.intersect(cube({size:[122,500,100]}).translate([0,-250,0]));

 s = s.translate([-122,0,0]);
 s = s.union(s.scale([-1,1,1]));

s = s.translate([0,-41,0]);

if ( ! keys ) {
 var base = s.scale([1,1,H/FT]);
 base = base.subtract(base.scale([0.98, 0.95, 1]));
 base = base.subtract(s.scale([1,1,H/FT]).translate([0,0,H-FT]).scale([0.99,0.975,1]));
 return base.union(s);
}

 return s;
}

function main() {
  var s= base(false).setColor([1,1,1]);

  s = s.union(base(true).translate([0,0,H]));
  s = s.rotateZ(10)
  return s;
}