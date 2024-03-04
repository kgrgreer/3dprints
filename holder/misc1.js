const X = 120;
const Y = 80;
const H = 40;

const LH = 16;
const TH = 20;
const BORDER = 3;
const PEN_R     = 6;
const BIG_PEN_R = 14/2;

/*

knife: 8mm x 20mm
ruler: 4mm x 29mm
ruler2: 6mm x 28mm
Black pen: 13mm

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
  s = rect(s, X-BORDER-LH+5, Y-TH+BORDER, LH+BORDER, -1, 10);

  for ( var i = 0  ; i < 6 ; i++ ) {
      s = tube(s, PEN_R, BORDER + (0.5+i)*15.6, Y-TH/2+1);
  }

  for ( var i = 0  ; i < 1 ; i++ ) {
      s = tube(s, BIG_PEN_R, X - BORDER/4 - 1 - (0.5+i)*18, Y-TH/2+1);
  }

  // Template Holder
  s = rect(s, 200, 1.8, 0, Y, 3);

  // Knife holders
  s = rect(s, 10, 22, LH/2-3, BORDER);

  // Caliper Holder
  s = rect(s, 8, 30, LH/2-5.8, 28);

  // Ruler holder
  s = rect(s, 6, 31, LH/2+3.8, 28);


  return s;
}
