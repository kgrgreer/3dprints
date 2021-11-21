
var A  = 10;  // Key row slant angle
var FT = 1.5; // Faceplate thickness
var H  = 20;
var RW = 18.5;  // Row Width
var RS = 8.6;     // Row Start

function key(s, x, y) {
    var c = cube({size:[15,15,100]}).rotateZ(-A).translate([x,y,0]);
    s = s.subtract(c);
    return s;
}

function row(s, x, y, opt_rows) {

  for ( var i = 0 ; i < (opt_rows || 4) ; i++ ) {
    var c = cube({size:[13,13,100]}).translate([0, 19*i,0]).rotateZ(-A).translate([x,y,0]);
    s = s.subtract(c);
  }

  return s;
}

function base(keys) {
var p = polygon({ points: [ [3,6],/*[15,82]*/,[13,78], [17, 82], [220,82],[233,0],[140,-10],[90,-10], [8,0] ] });
var base = p.extrude().scale([1,1,FT])
var s = base;

 if ( keys ) {
 s = row(s, RS, 7);
 s = row(s, RS+RW, 7);
 s = row(s, RS+RW*2, 9);
 s = row(s, RS+RW*3, 3);
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

  s = s.union(base(true).setColor([0.5,0.5,0.5]).translate([0,0,H]));
  return s;
}
