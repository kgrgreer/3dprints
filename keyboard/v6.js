
// elongate first-row thumb keys
// design place for lights
// raise front of thumb well
// fix key heights and positions
// BUG: Can't make holderWidth smaller
// adjust height and x based on ROLL
// replace translate: with x and y
// unify use of transformKey
// cut out webbing between sections


// TODO: move middle row up 3mm, t1 3mm up, t1 higher, change angle
const PREVIEW  = false;
const LABELS   = true;
const ROLL     = 15;

const BLUE  = [100/255, 149/255, 237/255]; //corn blue
const RED   = [0.8,0.1,0.1];
const GRAY  = [0.5,0.5,0.5];
const WHITE = [1,1,1];
const BLACK = [0,0,0];


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
  return o.subtract(cube({size:[600,600,200]}).translate([-300,-300,-200]));
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
      })
    };
}


function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 4,
      scale: 0.17,
      justify: 'L',
      a: 0,
      color: BLACK,
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:7})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, -2]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, -bounds[0].y, -2]);
        } else {
          txt = txt.translate([-bounds[0].x, -bounds[0].y, -2]);
        }

        return txt;
      }
    }, m);
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
  s = s.subtract(cube({size:[d, -d, d]}).translate([-r,0,-d]).rotateX(-a2).translate([0,-w,r]));

  return s;
}


/*********************************************************************
 *                                                             SWITCH
 *********************************************************************/

var SWITCH = {
  w:    13.7, // use 13.7 for testing, 13.6,    // width of sides of switch
  d:    8, // depth below surface
  h:    5, // 6.6,     // height above surface
  stem: 4, //3.6,     // height of stem, 4mm travel
  latchDepth: 1.45, // 1.5
  latchWidth: 3.7,
  latchHeight: 1,
  holderThickness: 1,
  holderHeight: 10,
  createHolderOutline: memoize(function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+2*t, this.w+2*t, h]}).translate([-this.w/2-t,-this.w/2-t,-this.h-h]).setColor([1,1,1]);
    return holder;
  }),
  createLatch: function() {
     return cube({size:[this.latchWidth,20,this.latchHeight]}).translate([-this.latchWidth/2,-10,-this.latchDepth-this.h-this.latchHeight]);
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
  return Object.assign(k, {
      toSolid: memoize(function() {
         var w   = wedge(this.f.r-15, 0, -8, 8, -8, 8);
         var key = w.intersect(cube({radius:1, roundradius: 1, size:[18,18,this.capHeight]}).translate([-9,-9,0]));

         if ( this.concave ) key = this.concaveKey(key);

         key = key.setColor(this.color);

         key = this.addLabel(key, -6.2,    2, this.label,   { color: BLACK });
         key = this.addLabel(key, -6.2, -5.4, this.swLabel, { color: BLACK });
         key = this.addLabel(key,  6,   -5.4, this.seLabel, { color: RED, justify: 'R', scale: 0.14});

         return key.translate([0,0,SWITCH.stem]);
      }),
      toProductionSolid: function() {
        const W = 4.1;
        const H = 1.2;
        const D = 4;
        var stem = cylinder({r:5.4/2, h: D});
        var hollow = cube({size:[W,H,3.7]}).translate([-W/2,-H/2,0]).union(cube({size:[H,W,3.7]}).translate([-H/2,-W/2,0]));
        return this.toSolid().union(stem.subtract(hollow));
      },
      concaveKey: function(o) {
        return o.subtract(sphere({r:30}).scale([1,1,1.3]).translate([0,0,41]));
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
          o = o.subtract(txt.toSolid().translate([x, y, 3]));
        }

        return o;
      }
  });
}


/*********************************************************************
 *                                                             KEY
 *********************************************************************/

function createKey(m) {
    m = m || {};
    if ( m.x ) m.a = 16*m.x;
    if ( m.y ) { m.b = 16*m.y-8 } else m.b = -8;

    var keyAngleRadius = 8;

    return Object.assign({
       concave: true,
       color: WHITE,
       capHeight: 5,
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
        height: 77,
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
            var neg = hull(sh).subtract(sh);
            neg = linear_extrude({height:100}, neg).translate([0,0,-50]);
            this.neg = this.neg.union(neg);
            ko = linear_extrude({height:100}, sh).translate([0,0,-50]);
            w = w.union(ko);
          });
          this.neg = this.transform(this.neg.translate(this.translate));
          // this.neg = this.neg.translate([0,0,Math.tan(degToRad(-this.direction*ROLL))*this.translate[0]]);
          w =  w.translate([0,0,-this.height]);
          w = w.subtract(sphere({r:this.r+SWITCH.holderHeight-3.3}));
          return w.setColor(WHITE);
        }),

        transformKey: function(k, o) {
          return o.rotateX(-k.b).rotateY((this.a+k.a+ROLL)*this.direction);
        },
        toNegative: function() { return this.neg; },

        toSolid: function() {
          var base = this.createBase();
          this.keys.forEach(k => {
              var key = k.transform(SWITCH.createHolder());
            key  = key.intersect(sphere({r:this.r+SWITCH.holderHeight-3.1}));
            if ( PREVIEW )   base = base.union(this.transformKey(k, k.toSolid()));
            base = base.union(this.transformKey(k, key));
            if ( ! PREVIEW ) base = base.subtract(this.transformKey(k, k.toNegative()));
          });
          base = base.translate([0,0,this.height]).translate(this.translate);
          base = f.transform(base);
          // Adjust height based on ROLL
          base = base.translate([0,0,Math.tan(degToRad(-this.direction*ROLL))*this.translate[0]]);
          return trimZ(base);
        }
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
    // index finger
    var f1 = createFinger({
        direction: d,
        translate: [d*-23,0,-0],
        r: 75,
        a: 16,
        keys: k1
    });
    var f2 = createFinger({
        direction: d,
        translate: [d*-10.5,0,-0],
        r: 75,
        a: 10,
        keys: k2
    });
    // middle finger, origin
    var f3 = createFinger({
        direction: d,
        translate: [0,5,-0],
        r: 76,
        a: 2,
        keys: k3
    });
    // ring finger
    var f4 = createFinger({
        direction: d,
        translate: [d*16,0,2],
        r: 76,
        keys: k4
    });
    // pinky
    var f5 = createFinger({
        direction: d,
        translate: [d*37,-17,10],
        r: 75,
        keys: k5
    });
    var f6 = createFinger({
        direction: d,
        translate: [d*48,-17,10],
        r: 75,
        a: -8,
        keys: k6
    });

    var t1 = createFinger({
        direction: d,
        r: 75,
        a: 12,
        keys: kt,
        transform: function(o) {
          return o.translate([d*-15,0,0]).rotateZ(d*-35).translate([d*-51,-80,10]);
        }
    });

    var h = createComposite([
      f1, f2, f3, f4, f5, f6, t1
    ]);

//return h.toSolid();
    var sh = hull(shadow(h.toSolid().intersect(cube({size:[500,500,1]}).translate([-250,-250,0])))).contract(8);
    var base = linear_extrude({height:4}, sh);
    base = base.subtract(h.toNegative());
    base = base.setColor(GRAY);
    return h.toSolid().union(base);
}


function right() {
  var h = createHand(1,
      [
            { y:  -2, label: '^', swLabel: '6', color: GRAY, seLabel: 'F6' },
            { y:  -1, label: 'Y' },
            { label: 'H' },
            { y:  1, label: 'N' },
        ],
        [
            { y:  -2, label: '7', color: GRAY, swLabel: '&', seLabel: 'F7' },
            { y:  -1, label: 'U', seLabel: 'PgUp' },
            { label: 'J', seLabel:  { text: '^', a: 90 }, color: BLUE },
            { y:  1, label: 'M', seLabel: 'PgDn' },
        ],
        [
            { y:  -2, label: '*', swLabel: '8', color: GRAY, seLabel: 'F8' },
            { y:  -1, label: 'I' },
            { label: 'K', seLabel: '^', color: BLUE },
            { y:  1, label: '<', swLabel: ',', seLabel: { text: '^', a: 180 }  },
            { y:  2, label: '{', swLabel: '[' }
        ],
        [
            { y:  -2, label: '(', swLabel: '9', color: GRAY, seLabel: 'F9' },
            { y:  -1, label: 'O', seLabel: 'Home' },
            { label: 'L', seLabel:  { text: '^', a: -90 }, color: BLUE },
            { y:  1, label: '>', swLabel: '.', seLabel: 'End' },
            { y:  2, label: '}', swLabel: ']' }
        ],
        [
            { y:  -2, label: ')', swLabel: '0', color: GRAY, seLabel: 'F10' },
            { y:  -1, label: 'P' },
            { color: BLUE, label: ':', swLabel: ';' },
            { y:  1, label: '?', swLabel: '/' },
        ],
        [
            { y:  -2, label: '+', swLabel: '=', color: GRAY },
            { y:  -1, label: '|', swLabel: '\\' },
            { label: '"', swLabel: "'" },
            { y:  1, label: 'Shift', seLabel: 'Caps', color: GRAY, concave: false, capHeight: 7 }
        ],
        [
            { y: -1, label: 'Cmd', color: GRAY, concave: false, capHeight: 8 },
            { y:  0, label: 'Opt', color: GRAY, concave: false, capHeight: 8  },
            { y:  1, label: 'Ctrl', color: GRAY, concave: false, capHeight: 8 },
            {  x: -1.1, y: -1, label: 'Space' },
            {  x: -1.1, y:  0, label: 'Enter', color: RED },
            {  x: -1.1, y:  1, seLabel: 'Func', color: WHITE }
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
            { color: BLUE, label: 'F' },
            { y:  1, label: 'V', seLabel: 'Paste' }
        ],
        [
            { y:  -2, label: '#', swLabel: '3', color: GRAY, seLabel: 'F3' },
            { y:  -1, label: 'E' },
            { label: 'D', color: BLUE },
            { y:  1, label: 'C', seLabel: 'Copy' }
        ],
        [
            { y:  -2, label: '@', swLabel: '2', color: GRAY, seLabel: 'F2' },
            { y:  -1, label: 'W' },
            { label: 'S', color: BLUE },
            { y:  1, label: 'X', seLabel: 'Cut'  }
        ],
        [
            { y:  -2, label: '!', swLabel: '1', color: GRAY, seLabel: 'F1' },
            { y:  -1, label: 'Q' },
            { label: 'A', color: BLUE, seLabel: 'All' },
            { y:  1, label: 'Z' }
        ],
        [
            { y:  -2, label: '~', swLabel: "`", color: GRAY },
            { y:  -1, label: 'Tab' },
            { label: 'Esc', color: RED },
            { y:  1, label: 'Shift', seLabel: 'Caps', color: GRAY, concave: false, capHeight: 7 }
        ],
        [
            { x: 0, y: -1, label: 'Cmd', color: GRAY, concave: false, capHeight: 8 },
            { x: 0, y:  0, label: 'Opt', color: GRAY, concave: false, capHeight: 8  },
            { x: 0, y:  1, label: 'Ctrl', color: GRAY, concave: false, capHeight: 8 },
            { x: 1.1, y: -1, label: 'Bksp', color: RED },
            { x: 1.1, y:  0, label: 'Del', color: RED },
            { x: 1.1, y:  1, seLabel: 'Func', color: WHITE }
        ]
    );

    return h;
}


function main() {
    return createKeyCap(
      createKey({ f: {r:76}, y:  -2, label: '*', swLabel: '8', color: GRAY, seLabel: 'F8' })
    ).toProductionSolid();

//return SWITCH.createHolder();
 //return SWITCH.createHolder().subtract(SWITCH.toSolid());
  //  return SWITCH.toSolid();
   return right().rotateZ(-25);
    return left().rotateZ(-30).translate([-100,0,0]).union(right().rotateZ(30).translate([100,0,0]));
}
