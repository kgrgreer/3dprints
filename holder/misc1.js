const X = 120;
const Y = 80;
const H = 40;

const LH = 8;
const TH = 20;
const BORDER = 3;
const PEN_R     = 6;
const BIG_PEN_R = 14/2;

/*

caliper 2 x 25
ruler 25 x < 1
knife 7 x 18
sharpie 10

*/

function tube(s, r, x, y) {
  s = s.subtract(cylinder({r: r, h: H}).translate([x, y, 2]));
  s = s.subtract(sphere({r: r+0.75}).scale([1,1,0.4]).translate([x, y, H]));

  return s;
}

function rect(s, w, h, x, y, z) {
  z = z || 2;
  s = s.subtract(cube({size: [w, h, H], radius:0.5}).translate([x, y, z]));
  return s;
}

function main() {
  var s = cube({size:[X,Y+4,H], radius:1.5});

  // tray
  s = rect(s, X-BORDER*2-LH, Y-BORDER-TH+2, LH+BORDER, BORDER);
  s = rect(s, X-BORDER-LH+5, Y-TH+BORDER, LH+BORDER, -1, 5);

  for ( var i = 0  ; i < 5 ; i++ ) {
      s = tube(s, PEN_R, BORDER + (0.5+i)*15.6, Y-TH/2+1);
  }

  for ( var i = 0  ; i < 2 ; i++ ) {
      s = tube(s, BIG_PEN_R, X - BORDER/4 - 1 - (0.5+i)*18, Y-TH/2+1);
  }

  // Template Holder
  s = rect(s, 200, 1.8, 0, Y, 3);

  // Knife holders
  s = rect(s, 8, 19, LH/2-2.2, 37);

  // Caliper Holder
  s = rect(s, 2.4, 26, LH/2-2.2, BORDER);

  // Ruler holder
  s = rect(s, 2, 26, LH/2+3, BORDER);


  return s;
}
