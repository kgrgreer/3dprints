
var R = 40;
var S = 58;
var D = 23;
var T = 9;
var H = 8;

function main() {
   var s = cube({size:[S,S,2*H],radius:5, fn: 36, center: true}).intersect(cube({size:[S,S,2*H], fn: 36, center: [true,true,false]}));
var c = cylinder({r:3, h: 60});
s = s.union(c.translate([D,D,0]))
s = s.union(c.translate([-D,-D,0]))
var c = cylinder({r:3*1.03, h: 60});
s = s.subtract(c.translate([-D,D,0]).translate([0,0,3]))
s = s.subtract(c.translate([D,-D,0]).translate([0,0,3]))

// pedestal
s = s.union(cylinder({r:12,h:13}))
var ds = sphere({r:20}).translate([0,0,30]);
 s = s.subtract(cylinder({r: 3,h:100}))
 s = s.subtract(ds);
  return s;

 s = s.union(s.rotateX(180).translate([0,0,60]))
 return s;
}
