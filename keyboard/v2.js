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

X Move all keys up
X raise pinkey keys and make larger, angle in, move closer
X ring finger tilt in, slightly closer
X index finger tilt out, slightly closer
X KEY_A from 17 to 20, radius from 0.9 to 0.8
_ Make text bigger
- set sizes of keys
- set font size
- move shift up one row and move cmd and opt to outside
- make outside keys larger
- Add fnLable to keys
*/

const LABELS      = false;
const KEY_A       = 21;
const KEY_SPACING = 0.0;
const KEY_HEIGHT  = 8;
const KEY_SLANT   = 1;
const ROLL        = -25;
const TILT        = 0; //-10;

const BLUE = [0.1,0.1,0.8];
const GRAY = [0.5,0.5,0.5];
const RED  = [0.8,0.1,0.1];

var fingers = [];

function main() {

   var r = right2();
   var kb = r/*.union(createBase())*/.translate([0,0,80]).rotateY(ROLL).rotateX(TILT).subtract(cube({size:[2000,2000,1000]}).translate(-1000,-1000,-1000));

   var col = shadow(r.translate([0,0,80]).rotateY(ROLL)).expand(5);
    kb = kb.intersect(linear_extrude({height:200}, col));
    return kb;
}

function createBase() {
    var c = cube({size:[-550,-200,130]}).translate([70,100,-155]);
/*    var b = [];
    for ( var i = 0 ; i < fingers.length ; i++ ) {
      var f = fingers[i];
      //b.push(sphere({r:f.r+5}).translate([-f.x, -f.y, 0]));
      s = cylinder({r:f.r, h:300, center: true}).translate([-f.x, -f.y, 0]).rotateY(-ROLL)
      if ( f.transform ) s = f.transform(s);
      b.push(s);
    }
    b = union.apply(null, b);*/
    b = c;
    for ( var i = 0 ; i < fingers.length ; i++ ) {
      var f = fingers[i];
      var s = sphere({r:f.r}).translate([-f.x, -f.y, 0]);
      if ( f.transform ) s = f.transform(s);
      b = b.subtract(s);
    }
    b = b.intersect(c).intersect(cube({size:[-300, -200, 80]}).translate([175,120,-80]).rotateY(-ROLL));
    return b;
}

function shadow(o) {
  var orthobasis = CSG.OrthoNormalBasis.Z0Plane();
  var cags = [];
  o.polygons.map(function(polygon) {
    var cag = polygon.projectToOrthoNormalBasis(orthobasis);
    if (cag.sides.length > 0) {
      cags.push(cag);
    }
  });
  var result = new CAG().union(cags);
  return result;
}


function right2() {
  return union([
      // index
      forFinger(
        {x: -25, y: -4, r: 70*0.8, b:4 },
        [
          { label: '^\n6', x: -1, y: -2, l: true, t: true },
          { label: 'Y',    x: -1, y: -1, l: true },
          { label: 'H',    x: -1, y:  0, l: true },
          { label: 'N',    x: -1, y:  1, l: true, bt: true },

          { label: '&\n7', fnLabel: 'pgUp', x: 0, y: -2, t: true},
          { label: 'U',    fnLabel: 'pgDown', x: 0, y: -1 },
          { label: 'J',    x: 0, y: -0, color: BLUE, home: true },
          { label: 'M',    x: 0, y: +1, bt: true}
        ]
      ),
      // middle
      forFinger(
        {x: 0, y: 0, r: 75*0.8, b: 0 },
        [
          { label: '*\n8', x: 0, y: -2, t: true},
          { label: 'I',    x: 0, y: -1, },
          { label: 'K', x: 0, y: -0, color: BLUE },
          { label: '<\n,', x: 0, y:  1 },
          { label: '{\n[', x: 0, y:  2, bt: true }
        ]
      ),
      // ring
      forFinger(
        {x:21, y: -4, r: 69*0.8, b: 0 },
        [
          { label: '(\n9', fnLabel: 'Home', x: 0, y: -2, t: true, r: true },
          { label: 'O',    fnLabel: 'End', x: 0, y: -1, r: true },
          { label: 'L',    x: 0, y:  0, r: true, color: BLUE },
          { label: '>',    x: 0, y:  1, r: true },
          { label: '}\n]', x: 0, y:  2, r: true, bt: true }
        ]
      ),
      // pinky
      forFinger(
        {x:42, y: -12, r:51*0.8+5, b: 0 },
        [
          { label: ')\n0', x: 0, y: -2, t: true },
          { label: 'P',    x: 0, y: -1 },
          { label: ':\n;', x: 0, y:  0, color: BLUE },
          { label: '?\n/', x: 0, y:  1, bt: true },

          { label: '-\n_',  x: 1, y: -2, r: true, t: true },
          { label: '\\\n|', x: 1, y: -1, r: true, },
          { label: '"\n\'', x: 1, y:  0, r: true },
          { label: 'shift', x: 1, y:  1, r: true, bt: true, color: GRAY },
        ]
      ).translate([0,0,3]),
      // thumb
      forFinger(
        {x:-42, y: -40, r:52, b: 0, transform: function(o) { return o.translate([-50, -45, -8]).rotateZ(-60).translate([45, 50, 0])} },
        [
          { label: 'Space', x: 0, y: 0, l: true, l: true },
          { label: 'Enter', x: 0, y: 1, l: true, l: true, bt: true, color: RED },

          { label: 'Cmd', x: 1, y: 0, color: GRAY },
          { label: 'Opt', x: 1, y: 1, bt: true, color: GRAY },
        ]
      )
    ]);

//  return union(right(), left()).translate([0,0,45]).subtract(cube({size:[1000,1000,1000]}).translate([-500,-500,-1000]));
}


function forFinger(f, keys) {
  fingers.push(f);
  var u = sphere({r:0});

  f.d = aToD(f.r, KEY_A);
  for ( var i = 0 ; i < keys.length ; i++ ) {
    var key = keys[i];
if ( key.y < -1 ) continue;
    key.a = -key.y * (KEY_A+KEY_SPACING);
    key.b = f.b + key.x * (KEY_A+KEY_SPACING);
    u = u.union(trim(f, key, forKey(f, key)));
  }
  u = u.translate([-f.x, -f.y, 0]);
  if ( f.transform ) u = f.transform(u);
  return u;
}


function forKey(f, k) {
  k.color = k.color || [1,1,1];
  return createKey(f, k)
    .setColor(k.color)
    .rotateY(k.b)
    .rotateX(-k.a);
}


function text(t) {
  var o = [];
  var l = vector_text(0, 0, t);

  l.forEach(function (s) {
    o.push(rectangular_extrude(s, {w: 5, h:8}));
  });

  return union(o).setColor([0,0,0]).scale([-0.12,-0.12,1]);
}


function keyswitch() {
  return cube({size:[15.6,15.6,18.5]});
}


function createKey(f, k) {
 var key = cube({roundradius: 1, radius: 1, size:[f.d+6, f.d+6, -KEY_HEIGHT]});
key = key.union(keyswitch().translate([f.d/4+1.5,f.d/4+1.5,-20]));
key = key.translate([-3, -3, 0]);
 key = concaveKey(f, k, key);
 if ( k.home ) {
     var c = cylinder({r:0.6, h:5}).rotateY(90).translate([f.d/2-2.5, f.d/2+4, -5.6]);
     key = key.union(c);
 }
 if ( LABELS ) key = labelKey(f, k, key);
 return key.translate([-f.d/2,-f.d/2,-f.r+KEY_HEIGHT]);
}


function labelKey(f, k, o) {
   o = o.subtract(text(k.label).translate([f.d-2.5,6,-7]));
   if ( k.fnLabel )
     o = o.subtract(text(k.fnLabel).translate([f.d-2.5,f.d-4,-7]));
   return o;
}


function concaveKey(f, k, o) {
    return o.subtract(sphere({r:30}).scale([1,1,1.3]).translate([f.d/2,f.d/2,33]));
//  return o.union(sphere({r:40}).translate([f.d/2,f.d/2,36]));
}


function trim(f, k, o) {
    // left
    if ( ! k.l  ) o = o.subtract(cube({size:[10,200,-200]}).translate([0,-100,0]).rotateY(k.b-KEY_A/2+KEY_SLANT).rotateX(-k.a));
    // right
    if ( ! k.r  ) o = o.subtract(cube({size:[-10,200,-200]}).translate([0,-100,0]).rotateY(k.b+KEY_A/2-KEY_SLANT).rotateX(-k.a));
    // top
    if ( ! k.t  ) o = o.subtract(cube({size:[200,-10,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a-KEY_A/2+KEY_SLANT));
    // bottom
    if ( ! k.bt ) o = o.subtract(cube({size:[200,10,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a+KEY_A/2-KEY_SLANT));

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
