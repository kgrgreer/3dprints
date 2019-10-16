// add switch columns and lower wedge

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



const SHELL = {
    thickness: 1.5
};


/*********************************************************************
 *                                                             SWITCH
 *********************************************************************/

const SWITCH = {
  w:    15.6,    // width of sides of switch
  d:    5+3.3+2, // depth below surface
  h:    6.6,     // height above surface
  stem: 3.6,     // height of stem, 4mm travel
  holderThickness: 2,
  holderHeight: 4,
  createHolder: function() {
    var h      = this.holderHeight;
    var t      = this.holderThickness;
    return cube({size:[this.w+t-1, this.w+t-1, h]}).translate([-this.w/2-t/2+0.5,-this.w/2-t/2+0.5,-this.h-h]).setColor([1,1,1]);
  },
  createSwitch: function() {
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,-this.h]);
    var bottom = cube({size:[this.w-2, this.w-2, this.d]}).translate([-this.w/2+1,-this.w/2+1, -this.h + -this.d]);
    return union(top, bottom);
  },
  toSolid: function() {
    var sw     = this.createSwitch().setColor([0,0,0]);
    var stem   = cube({size:[4, 4, 4]}).translate([-2,-2,0]).setColor([165/256,42/256,42/256]);
    return sw.union(stem);
  }
};


/*********************************************************************
 *                                                             KEY
 *********************************************************************/

function createKey(m) {
    m = m || {};
    if ( m.x ) m.a = 10*m.x;
    if ( m.y ) m.b = 10*m.y;

    var keyAngleRadius = 8.2;

    return Object.assign({
       color: GRAY,
       capHeight: 5,
       a: 0, a1: -keyAngleRadius, a2: keyAngleRadius,
       b: 0, b1: -keyAngleRadius, b2: keyAngleRadius,
       createCap: function() {
         var w   = wedge(this.f.r, 0, this.a1, this.a2, this.b1, this.b2);
         var key = w.intersect(cube({size:[500,500,this.capHeight]}).translate([-250,-250,0]));
         return key.translate([0,0,SWITCH.stem]).setColor(this.color);
       },
       createSwitchAndCap: function () {
           return this.createCap().union(SWITCH.toSolid());
       },
       transform: function(o) {
         return o.translate([0,0,-this.f.r+SWITCH.stem+SWITCH.h-SWITCH.holderThickness]);
       },
       toNegative: function() {
         return this.transform(SWITCH.toSolid());
         // return this.transform(SWITCH.toSolid().union(this.createCap().translate([0,0,-SWITCH.stem])));
       },
       toSolid: function() {
         //  return this.toNegative();
           return this.transform(this.createSwitchAndCap().union(SWITCH.createHolder()));
       }
    }, m);
}


/*********************************************************************
 *                                                             FINGER
 *********************************************************************/

function createFinger(m) {
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
        createWell: function() {
          var w = flatWedge(this.r+4, this.a1-this.padding[0], this.a2+this.padding[1], -2*this.b2+8, -2*this.b1-8);
          return w.subtract(sphere({r:this.r+4 - SHELL.thickness}));
        },
        transformKey: function(k, o) {
          return o.rotateX(-2*k.b);
        },
        sheer: function() {
        var d = 2*r;
        var r = this.r, a1 = this.b1+1, a2 = this.b2-1, b1 = this.a+this.a1-20, b2 = this.a+this.a2+20;
        return cube({size:[200, 100, -1000]}).translate([-r,0,0]).rotateX(-a1).translate([0,0,r]).rotateY(this.a);
        },
        toSolid: function() {
          var w = this.createWell();
          this.keys.forEach(k => {
           w = w.subtract(this.transformKey(k, k.toNegative()));
           //w = w.union(this.transformKey(k, k.toSolid()));
          });

          w = w.rotateY(2*this.a);
          var base = linear_extrude({height:100}, shadow(w)/*.expandedShell(1,1).expand(1)*/).translate([0,0,-100]);
          base = base.subtract(sphere({r:this.r+4 - SHELL.thickness}).rotateY(this.a)).setColor([1,1,1]).union(w);
          base = base.union(w);
          base = base.subtract(this.sheer());
          this.keys.forEach(k => {
//           base = base.subtract(this.transformKey(k, k.toNegative()).rotateY(2*this.a));
           base = base.union(this.transformKey(k, k.toSolid()).rotateY(2*this.a));
          });
          return base;
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
 *                                                             KEY
 *********************************************************************/

function main() {
    // index finger
    var f1 = createFinger({
        padding: [2,0],
        r: 78,
        a: 12,
        keys: [
            { y:  -2 },
            { y:  -1 },
            {  },
            { y:  1 },
          //  { y:  2 }
        ]
    });
    var f2 = createFinger({
        padding: [6, 0],
        r: 84,
        a: 5,
        keys: [
            { y:  -2 },
            { y:  -1 },
            { color: BLUE },
            { y:  1 },
          //  { y:  2 }
        ]
    });
    // middle finger
    var f3 = createFinger({
        padding: [4, 4],
        r: 90,
        a: 1,
        keys: [
            { y:  -2 },
            { y:  -1 },
            { color: BLUE },
            { y:  1 },
         //   { y:  2 }
        ]
    });
    // ring finger
    var f4 = createFinger({
        padding: [0, 4],
        r: 86,
        keys: [
            { y:  -2 },
            { y:  -1 },
            { color: BLUE },
            { y:  1 },
         //   { y:  2 }
        ]
    });
    // pinky
    var f5 = createFinger({
        padding: [0, 5],
        r: 74,
        a: 0,
        keys: [
            { y:  -2 },
            { y:  -1 },
            { color: BLUE },
            { y:  1 },
       //     { y:  2 }
        ]
    });
    var f6 = createFinger({
        r: 70,
        a: -5,
        keys: [
            { y:  -2 },
            { y:  -1 },
            { },
            { y:  1 },
     //       { y:  2 }
        ]
    });
    return union(
        f1.toSolid().translate([-30.5,0,-0]),
        f2.toSolid().translate([-17,0,-0]),
        f3.toSolid().translate([2,5,-0]),
        f4.toSolid().translate([28,0,0]),
        f5.toSolid().translate([53,-10,0]),
        f6.toSolid().translate([68,-10,0]),
        axis()
    );
}


/*********************************************************************
 *                                                             UTIL
 *********************************************************************/

function axis() {
  return union(
      cube({size:[100,1,1]}).setColor([1,0,0]),
      cube({size:[1,100,1]}).setColor([0,1,0]),
      cube({size:[1,1,100]}).setColor([0,0,1])
      );
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
