var fingers = [
    { a:  16, x: -20,  y:  -5, h: 5, diameter: 14, radius: 10, widthM: 1.3 },
    { a:  11, x: 0,  y:  -2, h: 1, diameter: 14, radius: 10 },
    { a:   0, x: 17, y:   2, h: 0, diameter: 15, radius: 10 },
    { a: -10, x: 36, y:   0, h: 1, diameter: 15, radius: 10 },
    { a: -21, x: 53, y: -12, h: 4, diameter: 12, radius: 10 },
    { a: -28, x: 64, y: -16, h: 14, diameter: 12, radius: 10, widthM: 1.35 },
];

function main() {
  return union(right(), left()).translate([0,0,40]);
}

function right() {
  return hand().union(tboard()).translate([36,0,0]).rotateZ(26).rotateY(25);
}

function left() {
  return mirror([1,0,0], right());
}

function tboard() {
    return union(
      tkey().rotateZ(15).translate([-12,-41,0]),
      tkey().rotateZ(30).translate([-23,-47,0]),
      tkey().rotateZ(40).translate([-32,-54,0])
    );
}

function tkey() {
  return cube({size:[10,18,2], round: true, roundradius:.5, radius:1});
}

function keycap2(r) {
    return cylinder({r:r, h:2})
}

function keycap(r, w) {
    return cube({size:[r*2*w,r*2,5], round: true, roundradius:0.5, radius:1});
}

function key(f, i) {
    i--;
    f.widthM = f.widthM || 1;
    return keycap(f.diameter/2-0.25, f.widthM)
      .setColor(i == 0 && f.widthM == 1 ? [0,0,1] : [1,1,1])
      .rotateX(i*10)
      .translate([0, i*(f.diameter+1), 0])
      .rotateX(i*10)
      .rotateY(f.a*2)
      .rotateZ(f.a)
      .translate([f.x, f.y, f.h]);
}

function hand() {
    var keys = [];
    for ( var i = 0 ; i < fingers.length ; i++ ) {
        keys.push(column(fingers[i]));
    }
    return union.apply(null, keys);
}

function column(f) {
    var keys = [];
    for ( var i = 0 ; i < 4 ; i++ ) {
        keys.push(key(f, i));
    }
    return union.apply(null, keys);
}
