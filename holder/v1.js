
var R = 40;
var S = 44;
var T = 9;

function main() {
   var s = cube({size:[S,S,S], radius:2 });
   s = s.subtract(cube({size:[S-T,100,S-T],radius:8, fn: 36}).translate([T/2,-50,T/2]))
   s = s.subtract(cube({size:[100,S-T,S-T], radius:8, fn: 36}).translate([-50,T/2,T/2]))
   s = s.subtract(sphere({r:20, fn: 36*2}).translate([S/2,S/2,S/2]));
   s = s.subtract(cylinder({r:20, h:R, fn:120}).translate([S/2,S/2,10]));
   //s = s.union(sphere({r:20, fn: 36*2}).translate([S/2,S/2,S/2]));
   return s;
}
