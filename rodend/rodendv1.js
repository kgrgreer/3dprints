const DEPTH = 15;

const OW = 19.7;
const OL = 55/2 + DEPTH -1;

const IW = 14.7;
const IL = 15;

// Make simple IL side 1cm longer

function main() {
var o = cube({size:[OW, OW, OL], center:[true,true,false]});
var i = cube({size:[IW, IW, 2*IL], center:[true,true,false]}).translate([0,0,OL-IL]);
var iLatch = cube({size:[2, 10,10],center:[true,false,false]}).translate([0,-IW,OL-15])
var oLatch = cube({size:[2.3, 10,40],center:[true,false,false]}).translate([0,-IW,OL-30])

i = i.union(iLatch);
//return i;

o = o.subtract(oLatch);
o = o.subtract(i.translate([0,0,-IL]).scale([1.03,1.03,1]));

return i;
return o;
return union(o, i);
}
