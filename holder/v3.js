
var R = 40;
var S = 44;
var T = 9;

function main() {
   var s = sphere({r:0.7*S}).translate([S/2,S/2,S/2]);
   s = s.intersect(cube({size:[S-1,S-1,S],radius:1}));
   s = s.union(cube({size:[S+8,S+8,8],radius:4}).translate([-4,-4,-4]));
   s = s.subtract(cube({size:[S-T,200,S-T],radius:8, fn: 36}).translate([T/2,-100,T/2]))
   s = s.subtract(cube({size:[200,S-T,S-T], radius:8, fn: 36}).translate([-100,T/2,T/2]))
   s = s.subtract(sphere({r:20, fn: 36*2}).translate([S/2,S/2,S/2]));
   s = s.subtract(cylinder({r:20, h:R, fn:120}).translate([S/2,S/2,10]));
   s = s.union(sphere({r:20, fn: 36*2}).translate([S/2,S/2,S/2]));
s = s.intersect(cube({size:[100,100,S-2], center:[true,true,false]}));
   return s;
}
