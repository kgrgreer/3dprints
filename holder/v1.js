
var R = 40;
var S = 44;
var T = 8;

function main() {
   var s = cube({size:[S,S,S], radius:2 });
   s = s.subtract(cube({size:[S-T,S,S-T]}).translate([T/2,0,T/2]))
   s = s.subtract(cube({size:[S,S-T,S-T]}).translate([0,T/2,T/2]))
   s = s.subtract(sphere({r:20, fn: 60}).translate([S/2,S/2,S/2]));
   s = s.subtract(cylinder({r:20, h:R, fn:120}).translate([S/2,S/2,10]));
 //  s = s.union(sphere({r:20, fn: 60}).translate([S/2,S/2,S/2]));
   return s;
}
