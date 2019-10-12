// extrude column to max height and then remove finger spheres

const LABELS      = true;
const KEY_A       = 21;
const KEY_SPACING = 0.0;
const KEY_HEIGHT  = 14;
const KEY_SLANT   = 1;
const ROLL        = 0; //-20;
const TILT        = 0; //-10;
const HEIGHT      = 60;

const BLUE = [0.1,0.1,0.8];
const GRAY = [0.5,0.5,0.5];
const RED  = [0.8,0.1,0.1];


var base_ = [];

function main() {
    return wedge(80,20, -15, 20, -21, 1).subtract(sphere({r:77})).union(

   keyCap(15, 12, 60, 5, -10, 10, -10, 10).translate([0,0,-71]));
}

function keyCap(h, raised, r, w, a1, a2, b1, b2) {
  var w = wedge(r, w, a1, a2, b1, b2);
  var key  = w.intersect(cube({size:[500,500,h]}).translate([-250,-250,0]));
  var base = linear_extrude({height:-25}, shadow(key));
  return key.union(base).translate([0,0,raised])
}

function main2() {
  var r = right();
  r = r.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));
  return r.union(createBase().intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0])));
}


function wedge(r, w, a1, a2, b1, b2) {
  var s = sphere({r:r});

  //s = s.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));

  var d = 2*r;

  // left
  s = s.subtract(cube({size:[d, d, d]}).translate([0,r,-d]).rotateY(b1).translate([w,-d,r]));

  // right
  s = s.subtract(cube({size:[-d, d, d]}).translate([0,r,-d]).rotateY(b2).translate([-w,-d,r]));

  // top
  s = s.subtract(cube({size:[d, d, d]}).translate([-r,0,-d]).rotateX(-a1).translate([0,w,r]));

  // bottom
  s = s.subtract(cube({size:[d, -d, d]}).translate([-r,0,-d]).rotateX(-a2).translate([-w,-w,r]));

  return s;
}

function createBase() {
    return union.apply(null, base_);
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


function right() {
  return union([
      // index
      forFinger(
        {x: -27, y: -4, r: 70*0.8, b:4 },
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
          { label: '(\n9', fnLabel: 'Home', x: 0, y: -2, t: true },
          { label: 'O',    fnLabel: 'End', x: 0, y: -1 },
          { label: 'L',    x: 0, y:  0, color: BLUE },
          { label: '>',    x: 0, y:  1 },
          { label: '}\n]', x: 0, y:  2, bt: true }
        ]
      ),
      // pinky
      forFinger(
        {x:42, y: -12, r:51*0.95, b: 0, transform: function(o) { return o.translate([0,0,3]); } },
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
      ),
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
  var u = sphere({r:0});

  f.d = aToD(f.r, KEY_A);
  for ( var i = 0 ; i < keys.length ; i++ ) {
    var key = keys[i];
// if ( key.y < -1 ) continue;
    key.a = -key.y * (KEY_A+KEY_SPACING);
    key.b = f.b + key.x * (KEY_A+KEY_SPACING);
    var k = trim(f, key, forKey(f, key));
    k = transformForFinger(k, f);

    createBaseForKey(f, k);

    u = u.union(k);
  }

  return u;
}


function createBaseForKey(f, k) {
  var c = shadow(k)/*.expand(1)*/;
  var bound = k.getBounds();
  var maxZ = bound[1]._z;
  var base = linear_extrude({height: maxZ+1}, c);
  base = base.subtract(transformForFinger(sphere({r:f.r}), f));
  base_.push(base);

  var c = shadow(k).expand(4);
  var bound = k.getBounds();
  var maxZ = bound[1]._z;
  var base = linear_extrude({height: 17}, c);
  base = base.subtract(transformForFinger(sphere({r:f.r}), f));
  base_.push(base);
}


function transformForFinger(k, f) {
    k = k.translate([-f.x, -f.y, 0]);
    if ( f.transform ) k = f.transform(k);
    k = k.rotateY(ROLL).rotateX(TILT);
    k = k.translate([0,0,HEIGHT]);
    return k;
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



function labelKey(f, k, o) {
   o = o.subtract(text(k.label).translate([f.d-3,7,-6]));
   if ( k.fnLabel )
     o = o.subtract(text(k.fnLabel).translate([f.d-3,f.d-4,-6]));
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
    if ( ! k.t || true ) o = o.subtract(cube({size:[200,-10,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a-KEY_A/2+KEY_SLANT));
    // bottom
    if ( ! k.bt || true ) o = o.subtract(cube({size:[200,10,-200]}).translate([-100,0,0]).rotateY(-k.b).rotateX(-k.a+KEY_A/2-KEY_SLANT));

    return o;
}


function aToD(r, a) {
  console.log(2*Math.sin(a/360*Math.PI)*r);
  return 2*Math.sin(a/360*Math.PI)*r;
}


function left() {
  return mirror([1,0,0], right());
}


function keyswitch() {
  return cube({size:[15.6,15.6,/*18.5*/0]});
}


function createKey(f, k) {
 var key = cube({roundradius: 1, radius: 1, size:[f.d+6, f.d+6, -KEY_HEIGHT]});
 //key = key.union(keyswitch().translate([f.d/4+1.5,f.d/4+1.5,-30]));
 key = key.translate([-3, -3, 0]);
 key = concaveKey(f, k, key);
 if ( k.home ) {
     var c = cylinder({r:0.6, h:5}).rotateY(90).translate([f.d/2-2.5, f.d/2+4, -5.6]);
     key = key.union(c);
 }
 if ( LABELS ) key = labelKey(f, k, key);
 key = key.translate([-f.d/2,-f.d/2,-f.r+KEY_HEIGHT]);
 return key;
}
