/* TODO:
- increase height of thumb key well by 6mm?
- add wire trenches
- check size of holes
- elongate first-row thumb keys
- maybe remove two keys on each side and move more symbols to func keys
- maybe round top edge of keys more (with a cone?)
- maybe raise thumb well?

TODO:

Done:
- raise top keys and set tilt angle of keys second from to 20deg
- move pinky row left 1mm
- move first row right 1.25mm
- curve out top of: HJKL:UIOP"N{}: Shift
- curve out bogtom of: HJKL:<>
- add holes to left side
- make all keys concave
- improve label positions
- lower Home and End keys one row
- increase size of "Func"
- increase size of . and ,
- increase size of ' and "
- change shape of home keys
- don't bevel outside cap edges
- fix position of left thumb
- roll all keys down half a key arc
- roll Space key up half key arc
- move 5th row up 9mm and down by 1mm
- change angle of thumb section by 10deg
- increase radius of thumb from 77mm to 80mm
- make Space key blank
- move arrow keys down one row
- increase holder size by 1mm
- lower all keys by 1mm
- make arrow keys gray
- move ring finger row up 1mm
- move 1st row down 1mm
- finalize key layout for left hand
- move pinky row up 3mm, left 2mm
*/

/*
  PRINT INSTRUCTIONS

  Base:
  PLA

  Key Caps:
  ABS
  30% infill
*/

// Show with keys
const PREVIEW   = false;

// Show labels on keys
const LABELS    = false;

// Generate base
const BASE      = true;

// Generate a prototype with looser tolerances for easier (re-)assembly
const PROTOTYPE = true;

const BLUE  = [100/255, 149/255, 237/255]; //corn blue
const RED   = [0.8,0.1,0.1];
const GRAY  = [0.5,0.5,0.5];
const WHITE = [1,1,1];
const BLACK = [0,0,0];

const BASE_COLOR             = WHITE;
const PRIMARY_KEY_COLOR      = WHITE;
const PRIMARY_KEY_TEXT_COLOR = BLACK;
const SECONDARY_KEY_COLOR    = GRAY;
const HOME_KEY_COLOR         = BLUE;
const DEST_KEY_COLOR         = RED;

var caps = [];

/*********************************************************************
 *                                                             UTIL
 *********************************************************************/

function axis() {
  /** Add to scene when developing to keep track of orientation. **/
  return union(
    cube({size:[100,1,1]}).setColor([1,0,0]),
    cube({size:[1,100,1]}).setColor([0,1,0]),
    cube({size:[1,1,100]}).setColor([0,0,1])
  );
}


function trimZ(o) {
  return o.intersect(cube({size:[2000,2000,200], center:[true,true,false]}));
}


function memoize(f) {
  var val;

  return function() {
    if ( ! val ) val = f.call(this);
    return val;
  };
}


function createComposite(a) {
    return {
      array: a || [],
      add: function(c) {
        if ( c ) this.array.push(c)
      },
      toNegative: memoize(function() {
        return union.apply(null, this.array.filter(e => e.toNegative).map(e => e.toNegative()));
      }),
      toSolid: memoize(function() {
        return union.apply(null, this.array.filter(e => e.toSolid).map(e => e.toSolid()));
      }),
      hull: function() {
        return union.apply(null, this.array.filter(e => e.toSolid).map(e => linear_extrude({h: 4}, baseShadow(e.toSolid()))));
      }
    };
}


function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 4,
      h: 7,          // depth
      scale: 0.15,
      justify: 'L',  // justification: R, C or defaults to Left
      a: 0,          // angle of rotation
      color: BLACK,
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h: this.h})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, -2.5]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, -bounds[0].y, -2.5]);
        } else {
//          txt = txt.translate([-bounds[0].x, -bounds[0].y, -2.5]);
          txt = txt.translate([0, -bounds[0].y, -2.5]);
          }

        return txt;
      }
    }, m);
}


function baseShadow(o) {
  return shadow(o.intersect(cube({size:[3000,3000,1], center: true})));
}


function shadow(o) {
  var orthobasis = CSG.OrthoNormalBasis.Z0Plane();
  var cags = [];
  for ( var i = 0 ; i < o.polygons.length ; i++ ) {
    var polygon = o.polygons[i];
    var cag = polygon.projectToOrthoNormalBasis(orthobasis);
    if ( cag.sides.length > 0 ) cags.push(cag);
  }
  return new CAG().union(cags);
}


function degToRad(d) {
  return d/360*Math.PI;
}


function flatWedge(r, a1, a2, b1, b2) {
  var w = 0;
  var s = sphere({r:r});
  var d = 2*r;

  // left
  s = s.subtract(cube({size:[-d, d, d]}).translate([0,-r,-d]).translate([2*r*Math.sin(degToRad(a1)),0,r]));

  // right
  s = s.subtract(cube({size:[d, d, d]}).translate([0,-r,-d]).translate([-2*r*Math.sin(degToRad(-a2)),0,r]));

  // top
 s = s.subtract(cube({size:[d, d, d]}).translate([-r,0,-d]).translate([0,2*r*Math.sin(degToRad(b2)),r]));

  // bottom
 s = s.subtract(cube({size:[d, -d, d]}).translate([-r,0,-d]).translate([0,2*r*Math.sin(degToRad(b1)),r]));

  return s.intersect(cube({size:[2000,2000,1000]}).translate([-1000,-1000,-1000]));
}


function wedge(r, w, a1, a2, b1, b2, flags) {
  var s = sphere({r:r});
  var d = 2*r;
  flags = flags || {};

  //s = s.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));

  // left
  if ( ! flags.left ) s = s.subtract(cube({size:[-d, d, d]}).translate([0,r,-d]).rotateY(b2).translate([-w,-d,r]));

  // right
  if ( ! flags.right ) s = s.subtract(cube({size:[d, d, d]}).translate([0,r,-d]).rotateY(b1).translate([w,-d,r]));

  // top
  if ( ! flags.top ) s = s.subtract(cube({size:[d, d, d]}).translate([-r,0,-d]).rotateX(-a1).translate([0,w,r]));

  // bottom
  s = s.subtract(cube({size:[d, -d, d]}).translate([-r,0,-d]).rotateX(-a2).translate([0,-w,r]));

  return s;
}


/*********************************************************************
 *                                                             SWITCH
 *********************************************************************/

var SWITCH = {
  w:    13.7, // use 13.7 for testing, 13.6,    // width of sides of switch
  d:    6, //8, // depth below surface
  h:    6.6, // 6.6,     // height above surface
  stem: 4, //3.6,     // height of stem, 4mm travel
  latchDepth: 1.45, // 1.5
  latchWidth: 3.7,
  latchHeight: 1,
  holderThickness: 1,
  holderHeight: 8,
  createHolderOutline: memoize(function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+2*t, this.w+2*t, h]}).translate([-this.w/2-t,-this.w/2-t,-this.h-h]).setColor([1,1,1]);
    return holder;
  }),
  createLatch: function() {
     return cube({size:[this.latchWidth,17,this.latchHeight]}).translate([-this.latchWidth/2,-17/2,-this.latchDepth-this.h-this.latchHeight]);
  },
  createHolder: memoize(function() {
    var h      = this.holderHeight;
    var holder = this.createHolderOutline();
    var top    = cube({size:[this.w, this.w, this.h+4]}).translate([-this.w/2,-this.w/2,-this.h-h]);

    return holder.subtract(top);
  }),
  createSwitch: memoize(function() {
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,-this.h]);
    var bottom = cube({size:[this.w, this.w, this.d]}).translate([-this.w/2,-this.w/2, -this.h + -this.d]);
    var latch  = this.createLatch();
    return union(top, bottom, latch);
  }),
  toSolid: memoize(function() {
    var sw   = this.createSwitch().setColor([0,0,0]);
    var stem = cube({size:[4, 4, 4]}).translate([-2,-2,0]).setColor([165/256,42/256,42/256]);
    return sw.union(stem);
  })
};



/*********************************************************************
 *                                                             CAP
 *********************************************************************/

function createKeyCap(k) {
  var cap = Object.assign(k, {
      toSolid: memoize(function() {
         const KEYW = 17;
         const WW   = 7.5;
         var w   = wedge(this.f.r-13, 0, -WW, WW, -WW, WW, k.flags);
         var key = w.intersect(cube({radius:0, size:[KEYW,KEYW,3.6+this.capHeight+11]}).translate([-KEYW/2,-KEYW/2,-4-11]).intersect(cube({size:[100,100,100]}).translate([-50,-50,-4])));

         key = key.intersect(cylinder({r2:0,r1:11.5,h:100}).translate([0,0,-10]));
         key = this.concaveKey(key);
         key = this.edgeKey(key);

         key = key.setColor(this.color);

         key = this.addLabel(key, -5,  1.5, this.label,   { color: BLACK });
         key = this.addLabel(key, -5, -5.4, this.swLabel, { color: BLACK });
         key = this.addLabel(key,  6,   -5.4, this.seLabel, { color: RED, justify: 'R', scale: 0.12});

         return key.translate([0,0,SWITCH.stem]);
      }),
      toProductionSolid: function() {
        const W = 4.6 +0.1; // add 0.2 when testing to make easier to put on and remove
        const H = 1.4 +0.1;
        const D = 5;
        var s = this.toSolid();
        var PAD_W = SWITCH.w+2.25; // was 2.5
        s = s.subtract(cube({radius:3.75, roundradius: 3.75, size:[PAD_W,PAD_W, D+5]}).translate([-PAD_W/2,-PAD_W/2,-5]));
//        var stem = cylinder({r:5.4/2, h: D});
        var stem = cube({radius:0.9, roundradius: 0.9,size:[/*make smaller to reduce friction Was: 5.4+1.5*/5.4+1,5.5, D+2]}).intersect(cube({size:[5.4+1.5,5.5, D]})).translate([-5.4/2-1.5/2,-5.5/2,0]).setColor(WHITE);
        var hollow = cube({size:[W,H,3.8]}).translate([-W/2,-H/2,0]).union(cube({size:[H,W,3.8]}).translate([-H/2,-W/2,0]));
        return s.union(stem.subtract(hollow));
      },
      concaveKey: function(o) {
        var tiltY = Math.cos(degToRad(this.capTilt))*30;
        var tiltZ = Math.sin(degToRad(this.capTilt))*30;
        o = o.subtract(sphere({r:30}).scale([1,k.isHome ? 1 : 3,1.3]).rotateX(this.capTilt/2.5).translate([0,-tiltZ,41-7+this.capHeight]));
        return o;
      },
      edgeKey: function(o) {
        if ( this.flags.edgeTop )    o = o.subtract(cylinder({r:9.5, h:20}).rotateX(40).translate([0,20,0]));
        if ( this.flags.edgeBottom ) o = o.subtract(cylinder({r:9.5, h:20}).rotateX(-40).translate([0,-20,0]));
        return o;
      },
      markAsHomeKey: function(o) {
          /*
          var c = cylinder({r:0.6, h:5}).rotateY(90).translate([f.d/2-2.5, f.d/2+4, -5.6]);
          key = key.union(c);
     */
         return o;
      },
      addLabel: function(o, x, y, label, opt_args) {
        if ( LABELS && label ) {
          if ( typeof label === 'string' ) label = { text: label };
          if ( opt_args ) label = Object.assign(opt_args, label);

          var txt = createText(label);
          o = o.subtract(txt.toSolid().translate([x, y, 4]));
        }

        return o;
      }
  });

  if ( cap.color == WHITE ) caps.push(cap);

  return cap;
}


/*********************************************************************
 *                                                             KEY
 *********************************************************************/

function createKey(m) {
    m = m || {};
    if ( m.x ) m.a = 16*m.x;
    if ( m.y ) { m.b = 16.5*m.y }

    var keyAngleRadius = 8;

    return Object.assign({
       concave: true,
       color: WHITE,
       capHeight: 7,
       capTilt: 0,
       flags: {}, // top, left, right flags
       isHome: false,
       a: 0, a1: -keyAngleRadius, a2: keyAngleRadius,
       b: 0, b1: -keyAngleRadius, b2: keyAngleRadius,
       createCap: function() {
         return createKeyCap(this).toSolid();
       },
       createSwitchAndCap: function () {
           return this.createCap().union(SWITCH.toSolid());
       },
       transform: function(o) {
         return o.translate([0,0,-this.f.r+SWITCH.stem+SWITCH.h-SWITCH.holderThickness]);
       },
       toNegative: memoize(function() {
         return this.transform(SWITCH.toSolid());
       }),
       toSolid: memoize(function() {
           return this.transform(this.createSwitchAndCap());//.union(SWITCH.createHolder()));
       })
    }, m);
}


/*********************************************************************
 *                                                             FINGER
 *********************************************************************/

function createFinger(m) {
    m.r = (m.r || 30 ) * 0.95;
    m = m || {};
    var f = Object.assign({
        direction: 1,
        neg: sphere({r:0}),
        a: 0, b: 0,
        a1: 1000, a2: -1000,
        b1: 1000, b2: -1000,
        height: 78,
        x: 0,
        y: 0,
        translate: [1,1,1],
        r: 30, // radius of finger's sweep
        keys: [],
        transform: function(o) { return o; },
        setKeys: function(keys) {
          keys = keys.map((m) => createKey(m));
          keys.forEach((k) => {
            k.f = f;
            f.a1 = Math.min(f.a1, k.a1+k.a);
            f.a2 = Math.max(f.a2, k.a2+k.a);
            f.b1 = Math.min(f.b1, k.b1+k.b);
            f.b2 = Math.max(f.b2, k.b2+k.b);
          });

          this.keys = keys;
        },
        createBase: memoize(function() {
          var w = this.neg;// flatWedge(this.r+SWITCH.holderHeight-1, this.a1-this.padding[0], this.a2+this.padding[1], -2*this.b2+19, -2*this.b1-23);
          this.neg = flatWedge(this.r+SWITCH.holderHeight-5, this.direction*this.a1-10, this.direction*this.a2+10, -this.b2-10, -this.b1+10);
          this.neg =  this.neg.translate([0,0,83])
          this.keys.forEach(k => {
            var ko = this.transformKey(k, k.transform(SWITCH.createHolder()));
            ko  = ko.subtract(sphere({r:this.r+SWITCH.holderHeight-3.001}));
            ko  = ko.intersect(sphere({r:this.r+SWITCH.holderHeight-3}));
            var sh = shadow(ko);
            var neg = hull(sh).contract(1).subtract(sh);
            neg = linear_extrude({height:100}, neg).translate([0,0,-50]);
            this.neg = this.neg.union(neg);
            ko = linear_extrude({height:100}, sh).translate([0,0,-50]);
            w = w.union(ko);
          });
          w =  w.translate([0,0,-this.height]);
          w = w.subtract(sphere({r:this.r+SWITCH.holderHeight-3.3}));
          return w.setColor(WHITE);
        }),

        transformKey: function(k, o) {
          return o.rotateX(-k.b).rotateY((this.a+k.a)*this.direction);
        },
        toNegative: function() { return this.neg; },

        toSolid: memoize(function() {
          var base = this.createBase();
          this.keys.forEach(k => {
              var key = k.transform(SWITCH.createHolder());
            key  = key.intersect(sphere({r:this.r+SWITCH.holderHeight-3.1}));
            if ( PREVIEW )   base = base.union(this.transformKey(k, k.toSolid()));
            base = base.union(this.transformKey(k, key));
            if ( ! PREVIEW ) base = base.subtract(this.transformKey(k, k.toNegative()));
          });
          base = base.translate([0,0,this.height]).translate(this.translate);
          this.neg = this.neg.translate(this.translate);
          this.neg = this.transform(this.neg);
          base = this.transform(base);
          return trimZ(base);
        })
    }, m);

    f.setKeys(m.keys);

    return f;
}



/*********************************************************************
 *                                                             MAIN
 *********************************************************************/

function island() {
    var c = cube({roundradius: 1, radius: 12, size: [90, 90, 35]});

    c = c.intersect(c.rotateX(-5)).rotateZ(180);
    c = c.translate([70,-80,0]);

    /*
    var old = PREVIEW;
    PREVIEW = true;
    c = c.subtract(right());
    PREVIEW = old;
    */

    return c.setColor([1,1,1]);
}


function createHand(d, k1, k2, k3, k4, k5, k6, kt) {

    k1.forEach((k)=>{ if ( k.flags == undefined ) k.flags = {}; k.flags.left = true; });
    k6.forEach((k)=>{ if ( k.flags == undefined ) k.flags = {}; k.flags.right = true; });
    k1[0].flags.top = true;
    k2[0].flags = { top:true };
    k3[0].flags = { top:true };
    k4[0].flags = { top:true };
    k5[0].flags = { top:true };
    k6[0].flags.top = true;

    // index finger
    var f1 = createFinger({
        direction: d,
        translate: [d*-24.75,-11,3],
        r: 77,
        a: 14,
        keys: k1
    });
    var f2 = createFinger({
        direction: d,
        translate: [d*-15.5,-10,2],
        r: 77,
        a: 5,
        keys: k2
    });
    // middle finger, origin
    var f3 = createFinger({
        direction: d,
        translate: [d*4,0,0],
        r: 77,
        a: 5,
        keys: k3
    });
    // ring finger
    var f4 = createFinger({
        direction: d,
        translate: [d*19,-2.5,4],
        r: 77,
        a: 0,
        keys: k4
    });
    // pinky
    var f5 = createFinger({
        direction: d,
        translate: [d*37,-21,12],
        r: 77,
        a: 0,
        keys: k5
    });
    var f6 = createFinger({
        direction: d,
        translate: [d*48,-24,12],
        r: 77,
        a: -8,
        keys: k6
    });

    var t1 = createFinger({
        direction: d,
        r: 80,
        a: 12,
        keys: kt,
        transform: function(o) {
          return o.translate([d*-15,0,0]).rotateZ(d*-55).translate([d*-64,-92,8]);
        }
    });

    var h = createComposite([
     f1, f2, f3, f4, f5, f6, t1
    ]);

    if ( ! BASE ) return h.toSolid();

    h.toSolid();
    var sh = hull(baseShadow(h.toSolid()));
    var base = linear_extrude({height:5}, sh);
    base = base.subtract(h.toNegative());
    base = base.setColor(GRAY);
    var o = h.toSolid().union(base);
    return o;
}


function right() {
  var h = createHand(1,
      [
            { y:  -2, label: '^', swLabel: '6', color: GRAY, capHeight: 8, capTilt: 45, seLabel: 'F6' },
            { y:  -1, label: 'Y' },
            { label: 'H', flags: {edgeBottom: true, edgeTop: true} },
            { y:  1, label: 'N', capHeight: 7.1, capTilt: -25, flags: {edgeTop: true} },
        ],
        [
            { y:  -2, swLabel: '7', color: GRAY, capHeight: 8.5, capTilt: 40, label: '&', seLabel: 'F7' },
            { y:  -1, label: 'U', seLabel: 'PgUp', flags: {edgeTop: true}, capTilt: 20 },
            { label: 'J', seLabel:  'PgDn', color: BLUE, isHome: true, flags: {edgeBottom: true, edgeTop: true}  },
            { y:  1, label: 'M', seLabel: { text: '^', a: 90 }, capHeight: 7.1, capTilt: -25, color: GRAY },
        ],
        [
            { y:  -2, label: '*', swLabel: '8', color: GRAY, capHeight: 9, capTilt: 40, seLabel: 'F8' },
            { y:  -1, label: 'I', flags: {edgeTop: true}, capTilt: 20 },
            { label: 'K', color: BLUE, isHome: true, flags: {edgeBottom: true, edgeTop: true}  },
            { y:  1, label: '<', swLabel: {text:',', scale: 0.2}, seLabel: '^', color: GRAY, flags: {edgeBottom: true, edgeTop: true}  },
            { y:  2, label: '{', swLabel: '[', seLabel: { text: '^', a: 180 }, capHeight: 7.1, capTilt: -25, color: GRAY, flags: {edgeTop: true} }
        ],
        [
            { y:  -2, label: {text: '(', scale: 0.12}, swLabel: '9', color: GRAY, capHeight: 8.5, capTilt: 40, seLabel: 'F9' },
            { y:  -1, label: 'O', flags: {edgeTop: true}, capTilt: 20 },
            { label: 'L', seLabel: 'Home', color: BLUE, isHome: true, flags: {edgeBottom: true, edgeTop: true}  },
            { y:  1, label: '>', seLabel: 'End', swLabel: {text:'.', scale: 0.2}, flags: {edgeBottom: true} },
            { y:  2, label: '}', swLabel: ']', seLabel:  { text: '^', a: -90 }, capHeight: 7.1, capTilt: -25, color: GRAY, flags: {edgeTop: true} }
        ],
        [
            { y:  -2, label: {text: ')', scale: 0.12}, swLabel: '0', color: GRAY, capHeight: 8.5, capTilt: 40, seLabel: 'F10' },
            { y:  -1, label: 'P', flags: {edgeTop: true}, capTilt: 20 },
            { color: BLUE, isHome: true, label: ':', swLabel: ';', flags: {edgeBottom: true, edgeTop: true}  },
            { y:  1, label: '?', swLabel: '/', capHeight: 7.1, capTilt: -25 },
        ],
        [
            { y:  -2, label: '|', swLabel: '\\', color: GRAY, capHeight: 8.7, capTilt: 40 },
            { y:  -1, label: {text:'"', scale: 0.2}, swLabel: {text:"'", scale: 0.2}, flags: {edgeTop: true}, capTilt: 20 },
            { label: 'Shift', color: GRAY, flags: {edgeTop: true} }
        ],
        [
            { y: -1-0.6, x: 1.2, label: {text: 'Opt', scale: 0.12}, capHeight: 12 },
            { y:  0-0.6, label: {text: 'Enter', scale: 0.12}, color: RED, capHeight: 10  },
            { y: -1-0.6, label: '', color: GRAY, capHeight: 10 },
            {  x: -1.2, y: -2-0.6, label: {text: 'Cmd', scale: 0.12}, color: WHITE },
            {  x: -1.2, y: -1-0.6, label: {text: 'Ctrl', scale: 0.12} },
            {  x: -1.2, y:  0-0.6, seLabel: 'Func' }
        ]
    );

  return h;
}


function left() {
  var h = createHand(-1,
        [
            { y:  -2, label: '%', swLabel: '5', color: GRAY, seLabel: 'F5' },
            { y:  -1, label: 'T' },
            { label: 'G' },
            { y:  1, label: 'B' }
        ],
        [
            { y:  -2, label: '$', swLabel: '4', color: GRAY, seLabel: 'F4' },
            { y:  -1, label: 'R' },
            { color: BLUE, isHome: true, label: 'F' },
            { y:  1, label: 'V' }
        ],
        [
            { y:  -2, label: '#', swLabel: '3', color: GRAY, seLabel: 'F3' },
            { y:  -1, label: 'E' },
            { label: 'D', color: BLUE, isHome: true },
            { y:  1, label: 'C' },
            { y:  2, label: '_', swLabel: '-', seLabel: {text:"`", scale: 0.2}, capHeight: 7.1, capTilt: -25 }
        ],
        [
            { y:  -2, label: '@', swLabel: '2', color: GRAY, seLabel: 'F2' },
            { y:  -1, label: 'W' },
            { label: 'S', color: BLUE, isHome: true },
            { y:  1, label: 'X' },
            { y:  2, label: '+', swLabel: '=', seLabel: '~' }
        ],
        [
            { y:  -2, label: '!', swLabel: '1', color: GRAY, seLabel: 'F1' },
            { y:  -1, label: 'Q' },
            { label: 'A', color: BLUE, isHome: true},
            { y:  1, label: 'Z' }
        ],
        [
            { y: -2, label: 'Esc', color: RED },
            { y: -1, label: 'Tab' },
            { label: 'Shift', seLabel: 'Caps', color: GRAY }
        ],
        [
            { y: -1-0.5, label: 'Cmd', color: GRAY, capHeight: 11 },
            { y:  0-0.5, seLabel: {text: 'Func', scale: 0.15}, color: GRAY, capHeight: 11  },
            { y:  1-0.5, label: 'Ctrl', color: GRAY, capHeight: 11 },
            {  x: -1.1, y: -1-0.5, label: 'Bksp' },
            {  x: -1.1, y:  0-0.5, label: 'Del', color: RED },
            {  x: -1.1, y:  1-0.5, label: 'Opt', color: WHITE }
        ]
    );

    return h;
}


function main() {
    var holes = union(
        cylinder({r:2, h:100}).translate([-10,-59,0]),
        cylinder({r:2, h:100}).translate([-30,-59,0]),
        cylinder({r:2, h:100}).translate([-50,-59,0]),
        cylinder({r:2, h:100}).translate([-70+2,10-2,0]),
        cylinder({r:2, h:100}).translate([-50+2,30-2,0]),
        cylinder({r:2, h:100}).translate([-60+2,20-2,0])
    );
    /*
return union(
    createKeyCap(
      createKey({ f: {r:76}, y:  2, label: {text: '}', scale:.14}, swLabel: {text:']',scale:.14}, capHeight: 7.1, capTilt: -25  })
    ).toProductionSolid().translate([-20,0,0]),

    createKeyCap(
      createKey({ f: {r:76}, y:  -2, label: {text:'&', scale: .15}, swLabel: '7', color: GRAY, capHeight: 8, capTilt: 45, seLabel: 'F7' })
    ).toProductionSolid(),

    createKeyCap(
      createKey({ f: {r:76}, y:  -2, label: {text: '*', scale:.25}, swLabel: '8', color: GRAY, seLabel: {text:'F8', scale:0.16, w:5} })
    ).toProductionSolid().translate([20,0,0]),

    createKeyCap(
      createKey({ f: {r:76}, y:  -2, label: {text: '*', scale:.25}, swLabel: '8', color: GRAY, seLabel: {text:'F8', scale:0.16, w:5} })
    ).toProductionSolid().translate([40,0,0]),

    createKeyCap(
      createKey({ f: {r:76}, y:  -2, label: {text: '*', scale:.25}, swLabel: '8', color: GRAY, seLabel: {text:'F8', scale:0.16, w:5} })
    ).toProductionSolid().translate([60,0,0])
);
*/

//return SWITCH.createHolder();
 //return SWITCH.createHolder().subtract(SWITCH.toSolid());
  //  return SWITCH.toSolid();
  /*
  right();

  var i = 0;
  return union.apply(null,
    caps.map((c) => {
      return c.toProductionSolid().translate([20*i++, 0, 0]);
    })
  );
  */

   return right().rotateZ(-22.5).subtract(holes);

//    return left().rotateZ(-30).translate([-85,0,0]).union(right().rotateZ(30).translate([85,0,0]));
}
