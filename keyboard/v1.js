// idea: model envelope of each finger and then cut out keys
// add arrow keys to top-right of keyboards

var fingers = [
    { a:  12, x: -18,  y:  -5, h: 6, diameter: 14, radius: 10, widthM: 1.3 },
    { a:  6, x: 1,  y:  -2, h: 1, diameter: 14, radius: 10 },
    { a:   0, x: 17, y:   2, h: 0, diameter: 15, radius: 10 },
    { a: -10, x: 35, y:   0, h: 1, diameter: 15, radius: 10 },
    { a: -21, x: 49, y: -12, h: 4, diameter: 12, radius: 10 },
    { a: -28, x: 58, y: -16, h: 14, diameter: 12, radius: 10, widthM: 1.35 },
];


function main() {
  return union(right(), left()).translate([0,0,45]).subtract(cube({size:[1000,1000,1000]}).translate([-500,-500,-1000]));
}

function right() {
  return hand().union(tboard()).union(palmRest()).translate([50,0,0]).rotateZ(36).rotateY(25);
}

function left() {
  return mirror([1,0,0], right());
}

function palmRest() {
  return cube({size:[60,60,-80], roundradius:1, radius:5}).translate([0,-90,10]).setColor([0.3,0.3,0.3]);
}

function tboard() {
    var keys = [];
    for ( var i = 0 ; i < 3 ; i++ ) {
        keys.push(tkey(40 + 12.5*i, 48-i,20));
        keys.push(tkey(40 + 12.5*i, 70-i, 10));
    }

    return union.apply(null, keys).translate([20,-80, 7]).setColor([0.9,0.3,0.3]);
}

function tkey(a, r, h) {
  return cube({size:[9.5,h,4], round: true, roundradius:.5, radius:1})
    .translate([0,r,0])
    .rotateZ(a)
}

function keycap2(r) {
    return cylinder({r:r, h:2})
}

function keycap(r, w) {
    return cube({size:[r*2*w,r*2,-5], round: true, roundradius:0.5, radius:1});
}

function key(f, i) {
    i--;
    f.widthM = f.widthM || 1;
    return keycap(f.diameter/2-0.25, f.widthM)
      .setColor(i == 1 && f.widthM == 1 ? [0.4,0.4,1] : [1,1,1])
      .rotateX(i*10)
      .translate([0, i*(f.diameter), 0])
      .rotateX(i*7)
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
    for ( var i = 0 ; i < 5 ; i++ ) {
        keys.push(key(f, i));
    }
    return union.apply(null, keys);
}
