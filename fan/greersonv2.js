// creates base for: https://www.thingiverse.com/thing:2822533

const BASE_WIDTH = 119;
const BASE_OUTER_WIDTH = 124.5;
const BASE_HEIGHT = 10;

const B_WIDTH = 148;

const H0 = 40; // height of slant
const H1 = 30; // height without holes
const H2 = 60; //90; // height with holes

const HOLDER_R = 80;
const SCREW_D = 6;

const HOLDER_W = 11.7;
const HOLDER_H = 12.7;

const T = 2;

// TOP of screw 1.5mm from top of holder

function rect(h, opt_width) {
    opt_width = opt_width || B_WIDTH;
    return cube({size: [opt_width, opt_width, h], center:[true,true,false]}).subtract(cube({size: [opt_width-2*T, opt_width-2*T, h], center:[true,true,false]}));
}

function pyr0(h, w1, w2) {
  var a = Math.atan2(w1-w2+4, h)/Math.PI*180/2;
  var s = cube({size: [w1, w1, h], center:[true,true,false]});
  var slant = cube({size:[-40,400,400],center:[false,true,true]}).translate([0,0,-200]).rotateY(a).translate([-w2/2+21.5,0,100])

  s = s.subtract(slant);
  s = s.subtract(slant.rotateZ(90));
  s = s.subtract(slant.rotateZ(-90));
  s = s.subtract(slant.rotateZ(180));
  return s;
}

function pyr(h, w1, w2) {
    return pyr0(h, w1, w2).subtract(pyr0(h,w1-2*T,w2-2*T));
}

function main() {
var h2 = rect(H2);
var h1 = rect(H1).setColor([0.5,0.5,0.5]).translate([0,0,H2]);
var h0 = pyr(H0, B_WIDTH, BASE_WIDTH).setColor([1,1,1]).translate([0,0,H2+H1]);
var h  = rect(10, BASE_WIDTH).translate([0,0,H2+H1+H0]);
var s  = union(h2,h1,h0,h);

var clampo = cube({size: [HOLDER_W+12, B_WIDTH-HOLDER_R+5, HOLDER_H+12],center:true}).translate([0,50,15]);
clampo = clampo.intersect(s);

var c = cylinder({r:4, h: 200}).rotateX(90).translate([0,100,0]);
c = c.scale([1,1,1.6]);
for ( var y = 0 ; y < 5 ; y++ ) {
  for ( var x = 0 ; x < ((y % 2) ? 9 : 10) ; x++ ) {
    var c2 = c.translate([B_WIDTH/11*(x-4.5+(y%2?0.5:0)),0,9+H2/5*y]);
    s = s.subtract(c2);
//    s = s.subtract(c2.rotateZ(90));
  }
}


var foot = cylinder({r:10,h:70});
foot = foot.intersect(foot.rotateX(30).translate([0,0,-5]));
foot = foot.rotateZ(-45-180).translate([B_WIDTH/2-7,B_WIDTH/2-7,0])
foot = foot.intersect(cube({size:[B_WIDTH,B_WIDTH,100], center:true}));
s = s.union(foot);
s = s.union(foot.rotateZ(90));
s = s.union(foot.rotateZ(-90));
s = s.union(foot.rotateZ(180));

var clamp = cube({size: [HOLDER_W, B_WIDTH-HOLDER_R+5, HOLDER_H],center:true}).translate([0,50,15]);
s = s.union(clampo);
s = s.subtract(clamp);

return s;
}
