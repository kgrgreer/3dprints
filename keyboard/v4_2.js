// add switch columns and lower wedge
// move pinky 1 mm right and down
// right-justify right-labels
// change key sizes
// elongate first-row thumb keys
// design legs
// design place for lights
// design left hand

const PREVIEW  = true;
const LABELS   = true;

const BLUE  = [0.1,0.1,8];
const GRAY  = [0.7,0.7,0.7];
const RED   = [0.8,0.1,0.1];
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


function text(t) {
  var o = [];
  var l = vector_text(0, 0, t);

  l.forEach(function (s) {
    o.push(rectangular_extrude(s, {w: 7, h:5}));
  });

  return union(o).setColor([0,0,0]).scale([0.13,0.13,1]);
}


function shadow(o) {
  var orthobasis = CSG.OrthoNormalBasis.Z0Plane();
  var cags = [];
  o.polygons.map(function(polygon) {
    var cag = polygon.projectToOrthoNormalBasis(orthobasis);
    if ( cag.sides.length > 0 ) cags.push(cag);
  });
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
  w:    15.6,    // width of sides of switch
  d:    5+3.3+3, // depth below surface
  h:    6.6,     // height above surface
  stem: 3.6,     // height of stem, 4mm travel
  holderThickness: 3,
  holderHeight: 10,
  createHolder: function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+t-1, this.w+t-1, h]}).translate([-this.w/2-t/2+0.5,-this.w/2-t/2+0.5,-this.h-h]).setColor([1,1,1]);
    var top    = cube({size:[this.w, this.w, this.h+4]}).translate([-this.w/2,-this.w/2,-this.h-h]);

    return holder.subtract(top);
  },
  createSwitch: function() {
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,-this.h]);
    var bottom = cube({size:[this.w-2, this.w-2, this.d]}).translate([-this.w/2+1,-this.w/2+1, -this.h + -this.d]);
    return union(top, bottom);
  },
  toSolid: function() {
    var sw   = this.createSwitch().setColor([0,0,0]);
    var stem = cube({size:[4, 4, 4]}).translate([-2,-2,0]).setColor([165/256,42/256,42/256]);
    return sw.union(stem);
  }
};

const BLANK_SWITCH = {
  w:    16,    // width of sides of switch
  w2:   15.2,
  d:    5/*+3.3*/, // depth below surface
  h:    5,     // height above surface
  stem: 3.6,     // height of stem, 4mm travel
  holderThickness: 3,
  holderHeight: 10,
  createHolder: function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+t-1, this.w+t-1, h]}).translate([-this.w/2-t/2+0.5,-this.w/2-t/2+0.5,-this.h-h]).setColor([1,1,1]);
    var top    = cube({size:[this.w, this.w, this.h+4]}).translate([-this.w/2,-this.w/2,-this.h-h]);

    return holder.subtract(top);
  },
  createSwitch: function() {
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,-this.h]);
    var bottom = cube({roundradius: 1, radius: 1,size:[this.w2, this.w2, this.d]}).translate([-this.w2/2,-this.w2/2, -this.h + -this.d]);
    return union(top, bottom);
  },
  toSolid: function() {
    var sw   = this.createSwitch().setColor([0,0,0]);
    var stem = cube({size:[this.w, this.w, 4]}).translate([-this.w/2,-this.w/2,0]).setColor([165/256,42/256,42/256]);
    return sw.union(stem);
  }
};

SWITCH = BLANK_SWITCH;


/*********************************************************************
 *                                                             CAP
 *********************************************************************/

function createKeyCap(k) {
  return Object.assign(k, {
      toSolid: function() {
         var w   = wedge(this.f.r-15, 0, -8, 8, -8, 8);
         var key = w.intersect(cube({radius:1, roundradius: 1, size:[20,20,this.capHeight]}).translate([-10,-10,0]));

         key = key.setColor(this.color);

         key = this.addLabel(key, -6.2,  2, this.label,   WHITE);
         key = this.addLabel(key, -6.2, -5, this.swLabel, WHITE);
         key = this.addLabel(key, 3,   -5, this.seLabel, RED, this.seAngle);

         return key.translate([0,0,SWITCH.stem]);

      },
      addLabel: function(o, x, y, label, color, angle) {
        if ( LABELS && label ) {
          var txt = text(label);
          if ( angle ) {
            txt = txt.rotateZ(angle);
            txt = txt.translate([2,2,0]);
          }
          o = o.subtract(txt.setColor(color).translate([x, y, 3]));
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
    if ( m.x ) m.a = 8*m.x;
    if ( m.y ) { m.b = 8*m.y-4 } else m.b = -4;

    var keyAngleRadius = 8;

    return Object.assign({
       color: BLACK,
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
       toNegative: function() {
         return this.transform(SWITCH.toSolid());
       },
       toSolid: function() {
           return this.transform(this.createSwitchAndCap());//.union(SWITCH.createHolder()));
       }
    }, m);
}


/*********************************************************************
 *                                                             FINGER
 *********************************************************************/

function createFinger(m) {
    m.r = (m.r || 30 ) * 0.95;
    m = m || {};
    var f = Object.assign({
        padding: [0, 0],
        a: 0, b: 0,
        a1: 1000, a2: -1000,
        b1: 1000, b2: -1000,
        x: 0,
        y: 0,
        r: 30, // radius of finger's sweep
        keys: [],
        createOutline: function() {
          var w = flatWedge(this.r+SWITCH.holderHeight, this.a1-this.padding[0], this.a2+this.padding[1], -2*this.b2+19, -2*this.b1-23);
          this.keys.forEach(k => {
            w = w.union(this.transformKey(k, k.transform(SWITCH.createHolder())));
            w = w.subtract(this.transformKey(k, k.toNegative()));
          });
          w = w.subtract(sphere({r:this.r+SWITCH.holderHeight-0.5}));
          w = w.rotateY(this.a*2);
          return w;
        },
        transformKey: function(k, o) {
          return o.rotateX(-2*k.b).rotateY(2*k.a);
        },
        toSolid: function() {
          var w = this.createOutline();
          var height = 94;
          var base = linear_extrude({height:height}, shadow(w)).translate([0,0,-height]);
          base = base.subtract(sphere({r:this.r+SWITCH.holderHeight-0.1}).rotateY(2*this.a)).setColor([1,1,1])/*.union(w)*/;
          base = base.setColor([1,1,1]);
          this.keys.forEach(k => {
            if ( ! PREVIEW ) base = base.subtract(this.transformKey(k, k.toNegative()).rotateY(2*this.a));
            if ( PREVIEW )   base = base.union(this.transformKey(k, k.toSolid()).rotateY(2*this.a));
            base = base.union(this.transformKey(k, k.transform(SWITCH.createHolder())).rotateY(2*this.a));
          });
          return base.translate([0,0,height]);
        }
    }, m);

    f.keys = f.keys.map((m) => createKey(m));
    f.keys.forEach((k) => {
      k.f = f;
      f.a1 = Math.min(f.a1, k.a1+k.a);
      f.a2 = Math.max(f.a2, k.a2+k.a);
      f.b1 = Math.min(f.b1, k.b1+k.b);
      f.b2 = Math.max(f.b2, k.b2+k.b);
    });

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


function right() {

    // index finger
    var f1 = createFinger({
        padding: [-7,-2],
        r: 80,
        a: 8,
        keys: [
            { y:  -2, label: '^', swLabel: '6', seLabel: 'F6' },
            { y:  -1, label: 'Y' },
            { label: 'H' },
            { y:  1, label: 'N' },
            //{ y:  2, label: 'Ctrl' },
        ]
    });
    var f2 = createFinger({
        padding: [1, -1],
        r: 84,
        a: 5,
        keys: [
            { y:  -2, label: '7', swLabel: '&', seLabel: 'F7' },
            { y:  -1, label: 'U', seLabel: 'PgUp' },
            { label: 'J', seLabel: 'Left', color: BLUE },
            { y:  1, label: 'M', seLabel: 'PgDn' },
          //  { y:  2, label: 'Cmd' },
        ]
    });
    // middle finger
    var f3 = createFinger({
        padding: [1, 2],
        r: 88,
        a: 1,
        keys: [
            { y:  -2, label: '*', swLabel: '8', seLabel: 'F8' },
            { y:  -1, label: 'I' },
            { label: 'K', seLabel: '^', color: BLUE },
            { y:  1, label: '<', swLabel: ',', seLabel: '^', seAngle: 180  },
            { y:  2, label: '{', swLabel: '[' }
        ]
    });
    // ring finger
    var f4 = createFinger({
        padding: [-3, 0],
        r: 86,
        keys: [
            { y:  -2, label: '(', swLabel: '9', seLabel: 'F9' },
            { y:  -1, label: 'O', seLabel: 'Home' },
            { label: 'L', seLabel: 'Right', color: BLUE },
            { y:  1, label: '>', swLabel: '.', seLabel: 'End' },
            { y:  2, label: '}', swLabel: ']' }
        ]
    });
    // pinky
    var f5 = createFinger({
        padding: [-1.5, -0],
        r: 76,
        a: 0,
        keys: [
            { y:  -2, label: ')', swLabel: '0', seLabel: 'F10' },
            { y:  -1, label: 'P' },
            { label: '', color: BLUE, label: ':', swLabel: ';' },
            { y:  1, label: '?', swLabel: '/' },
        ]
    });
    var f6 = createFinger({
        padding: [0,-7],
        r: 76,
        a: -5,
        keys: [
            { y:  -2, label: '+', swLabel: '=' },
            { y:  -1, label: '|', swLabel: '\\' },
            { label: '"', swLabel: "'" },
            { y:  1, label: 'Shift', seLabel: 'Caps', color: GRAY }
        ]
    });

    var t1 = createFinger({
        padding: [-18,5],
        r: 70,
        a: 8,
        keys: [
            { y: -1, label: 'Cmd', color: GRAY },
            { y:  0, label: 'Opt', color: GRAY  },
            { y:  1, label: 'Ctrl', color: GRAY },
            { x: -1, y: -1, label: 'Space' },
            { x: -1, y:  0, label: 'Enter', color: RED },
            { x: -1, y:  1, label: 'Func', color: RED }
        ]
    });

    var x = 0;
    var keys = f3.keys.map(k => {
       return k.toSolid().translate([20*x++, 0, 0]);
    });
    console.log(keys);
    return union.apply(null, keys).rotateX(180);
return f6.keys[0].toSolid();

    return union(
       // island(),
      f1.toSolid().translate([-33*0.7,0,-0]),
        f2.toSolid().translate([-15*0.7,0,-0]),
        f3.toSolid().translate([2*0.7,5,-0]),
        f4.toSolid().translate([29*0.7,0,0]),
        f5.toSolid().translate([57*0.7,-17,0]),
        f6.toSolid().translate([69*0.7,-17,0]),
        t1.toSolid().translate([-15,0,0]).rotateZ(-35).translate([-30,-80,-15])
    );
}

function trimZ(o) {
  return o.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));
}

function main() {
    return right().rotateX(180);
    return trimZ(right());
//    return union(right(), island());
}
