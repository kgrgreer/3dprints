
const W = 132;
const D = 70;
const H = 1.6;
const T = 5;

function hole(x, y) {
    return cylinder({h: 2*H, r: 0.7}).translate([x,y,0]);
}

function main() {
  var s = cube({size:[W,D,H]});

  s = s.subtract(cube({size:[W-T*2,D-T,H]}).translate([T,0,0]));

  var c = cylinder({h:W, r: H/2});
  c = c.rotateY(90).scale([1,0.7,1]).translate([0,D,H/2]);
  s = s.union(c);

  for ( var i = 0 ; i < 11 ; i++ ) {
    s = s.subtract(hole(T/2,(i*1.01+0.5)*D/11));
    s = s.subtract(hole(W-T/2,(i*1.01+0.5)*D/11));
  }

  for ( var i = 0 ; i < 16 ; i++ ) {
    s = s.subtract(hole(T/2+i*1.026*(W)/16, D - T/2));
  }

  return s;
}
