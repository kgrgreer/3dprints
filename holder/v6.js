
var R = 40;
var S = 58;
var D = 23;
var T = 9;
var H = 8;

function main() {
   var s = torus({ ri: 4, ro: 32, fni: 72, fno: 72}).union(torus({ ri: 4, ro: 32/2 }).translate([0,16,0]))
var c = cylinder({r:3, h: 59, fn: 72});
s = s.union(c.translate([D,D,0]))
s = s.union(c.translate([-D,-D,0]))

var sp = sphere({r:8, fn: 72}).scale([1,1,2]);
s = s.union(sp.translate([-D,D,0]))
s = s.union(sp.translate([D,-D,0]))
s = s.union(sp.translate([-D,-D,0]))
s = s.union(sp.translate([D,D,0]))

var c = cylinder({r:3*1.03, h: 60});
s = s.subtract(c.translate([-D,D,0]).translate([0,0,3]))
s = s.subtract(c.translate([D,-D,0]).translate([0,0,3]))

var c = cylinder({r:0.5, h: 600});
s = s.subtract(c.translate([-D,-D,0]))
s = s.subtract(c.translate([D,D,0]))


// pedestal
s = s.union(cylinder({r:12,h:13, fn:72}))
var ds = sphere({r:20}).translate([0,0,30]);
 s = s.subtract(cylinder({r: 3, h:100}))

s = s.subtract(cylinder({r:4,h:50}).translate([0,-12,0]));
s = s.subtract(cylinder({r:4,h:50}).translate([0,12,0]));

s = s.intersect(cube({size:[100,100,100], fn: 36, center: [true,true,false]}));
 s = s.subtract(ds);
  return s;

 s = s.union(s.rotateY(180).translate([0,0,60]))
 return s;
}
