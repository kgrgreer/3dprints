// idea: model envelope of each finger and then cut out keys
// add arrow keys to top-right of keyboards

/* problems to fix from v1:
  1. middle finger column should be lower
  2. rotate the whole bowl down so the home row is facing down
  3. angle the pinky column clockwise
  4. raise the handrest and move back
  5. reposition the thumb keys
  6. make thum keys larger
  7. decide on key layout and label keys
  8. add markets to F and J keys to make finding home row easier
  9. add two ring finger keys above pinky columns
  10. move pinky columns to be more to right
  11. low right-most column since it gets in way of moving towards 2nd pinky column
  12. delete space around keys from other keys
  12. delete bottom key from first column and shift whole column down half a key
Don't trim keys out outside edges.
Add labels from perspective of user's eye.

X deeper wells
X more curvature (* 0.8)
X smaller keys (done by decreasing radius)
X pinky higher
X Move index finger 1mm right
X Move index finger 1mm left
_ Wider outside keys

*/

const KEY_A       = 17;
const KEY_SPACING = 0.0;
const KEY_HEIGHT  = 8;
const KEY_SLANT   = 1;
const ROLL        = -25;

const BLUE = [0.4,0.4,0.9];
const GRAY = [0.5,0.5,0.5];
const RED  = [0.8,0.1,0.1];


var fingers = [
    { a:  12, x: -18,  y:  -5, h: 6, diameter: 14, radius: 10, widthM: 1.3 },
    { a:  6, x: 1,  y:  -2, h: 1, diameter: 14, radius: 10 },
    { a:   0, x: 17, y:   2, h: 0, diameter: 15, radius: 10 },
    { a: -10, x: 35, y:   0, h: 1, diameter: 15, radius: 10 },
    { a: -21, x: 49, y: -12, h: 4, diameter: 12, radius: 10 },
    { a: -28, x: 58, y: -16, h: 14, diameter: 12, radius: 10, widthM: 1.35 },
];


function main() {
  return right2().translate([0,0,60]).rotateY(ROLL);
}

function right2() {
  return union([
      // index
      forFinger(
        {x: -18, y: -4, r: 70*0.9, b: -5 },
        [
          { label: '^\n6', x: -1, y: -2, l: true, t: true },
          { label: 'Y',    x: -1, y: -1, l: true },
          { label: 'H',    x: -1, y:  0, l: true },
          { label: 'N',    x: -1, y:  1, l: true, bt: true },

          { label: '&\n7', x: 0, y: -2, t: true, r: true },
          { label: 'U',    x: 0, y: -1, r: true },
          { label: 'J',    x: 0, y: -0, r: true, color: BLUE, home: true },
          { label: 'M',    x: 0, y: +1, r: true, bt: true}
        ]
      ),
      // middle
      forFinger(
        {x: 0, y: 0, r: 75*0.9, b: 0 },
        [
          { label: '*\n8', x: 0, y: -2, l: true, r: true, t: true},
          { label: 'I',    x: 0, y: -1, l: true, r: true },
          { label: 'K',    x: 0, y: -0, l: true, r: true, color: BLUE },
          { label: '<\n,', x: 0, y:  1, l: true, r: true },
          { label: '{\n[', x: 0, y:  2, l: true, r: true, bt: true }
        ]
      ),
      // ring
      forFinger(
        {x:18, y: -4, r: 69*0.9, b: 4 },
        [
          { label: '(\n9', x: 0, y: -2, t: true, l: true, r: true },
          { label: 'O',    x: 0, y: -1, l: true, r: true },
          { label: 'L',    x: 0, y:  0, l: true, r: true, color: BLUE },
          { label: '>',    x: 0, y:  1, l: true, r: true },
          { label: '}\n]', x: 0, y:  2, l: true, r: true, bt: true }
        ]
      ),
      // pinky
      forFinger(
        {x:38, y: -12, r:51*0.9, b: 6 },
        [
          { label: ')\n0', x: 0, y: -2, l: true, t: true },
          { label: 'P',    x: 0, y: -1, l: true },
          { label: ':\n;', x: 0, y:  0, l: true, color: BLUE },
          { label: '?\n/', x: 0, y:  1, l: true },
          { label: 'cmd',  x: 0, y:  2, l: true, bt: true, color: GRAY },

          { label: '-\n_',  x: 1, y: -2, r: true, t: true },
          { label: '\\\n|', x: 1, y: -1, r: true },
          { label: '"\n\'', x: 1, y:  0, r: true },
          { label: 'shift', x: 1, y:  1, r: true, color: GRAY },
          { label: 'opt',   x: 1, y:  2, l: true, bt: true, color: GRAY },
        ]
      ),
      // thumb
      forFinger(
        {x:-42, y: -45, r:50, b: 0 },
        [
          { label: 'Space', x: 0, y: 0, l: true, l: true },
          { label: 'Enter', x: 0, y: 1, l: true, l: true, bt: true },
        ]
      ).translate([-45, -50, -10]).scale([1.6,1,1]).rotateZ(-30).translate([45, 50, 0])
    ]);

//  return union(right(), left()).translate([0,0,45]).subtract(cube({size:[1000,1000,1000]}).translate([-500,-500,-1000]));
}

function forFinger(f, keys) {
  var u = sphere({r:0});

  f.d = aToD(f.r, KEY_A);
  for ( var i = 0 ; i < keys.length ; i++ ) {
    var key = keys[i];
    key.a = -key.y * (KEY_A+KEY_SPACING);
    key.b = f.b + key.x * (KEY_A+KEY_SPACING)
    u = u.union(trim(f, key, forKey(f, key)));
  }
  return u.translate([-f.x, -f.y, 0]);
}


function forKey(f, k) {
  k.color = k.color || [1,1,1];
  return createKey(f, k)
    .setColor(k.color)
    .subtract(text(k.label).translate([f.d-2,5,-7]))
    .translate([-f.d/2,-f.d/2,-f.r])
    .rotateY(k.b)
    .rotateX(-k.a)
}


function text(t) {
  var o = [];
  var l = vector_text(0, 0, t);

  l.forEach(function (s) {
    o.push(rectangular_extrude(s, {w: 5, h:8}));
  });

  return union(o).setColor([0,0,0]).scale([-0.12,-0.12,1]);
}


function createKey(f, k) {
 var key = cube({roundradius: 1, radius: 1, size:[f.d, f.d, -KEY_HEIGHT]});
 key = concaveKey(f, k, key);
 if ( k.home ) {
     var c = cylinder({r:0.6, h:5}).rotateY(90).translate([f.d/2-2.5, f.d/2+4, -3.7]);
     key = key.union(c);
 }
 return key;
}


function concaveKey(f, k, o) {
    return o.subtract(sphere({r:30}).scale([1,1,1.3]).translate([f.d/2,f.d/2,33]));
//  return o.union(sphere({r:40}).translate([f.d/2,f.d/2,36]));
}


function trim(f, k, o) {
    // left
    if ( ! k.l  ) o = o.subtract(cube({size:[5,200,-200]}).translate([0,-100,0]).rotateY(k.b-KEY_A/2+KEY_SLANT).rotateX(-k.a));
    // right
    if ( ! k.r  ) o = o.subtract(cube({size:[-5,200,-200]}).translate([0,-100,0]).rotateY(k.b+KEY_A/2-KEY_SLANT).rotateX(-k.a));
    // top
    if ( ! k.t  ) o = o.subtract(cube({size:[200,-5,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a-KEY_A/2+KEY_SLANT));
    // bottom
    if ( ! k.bt ) o = o.subtract(cube({size:[200,5,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a+KEY_A/2-KEY_SLANT));

    return o;
}

function aToD(r, a) {
  console.log(2*Math.sin(a/360*Math.PI)*r);
  return 2*Math.sin(a/360*Math.PI)*r;
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
