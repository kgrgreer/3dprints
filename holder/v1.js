
var R = 40;
var S = 42;
var T = 8;

function main() {
   var s = cube({size:[S,S,S]});
   s = s.subtract(cube({size:[S-T,S,S-T]}).translate([T/2,0,T/2]))
   s = s.subtract(cube({size:[S,S-T,S-T]}).translate([0,T/2,T/2]))
   s = s.subtract(sphere({r:20, fn: 120}).translate([20,20,20]));
   s = s.subtract(cylinder({r:20, h:R, fn:120}).translate([S/2,S/2,10]));
   s = s.union(sphere({r:20, fn: 120}).translate([20,20,20]));
   return s;
}
