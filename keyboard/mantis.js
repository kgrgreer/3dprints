/*********************************************************************
 *                                                             CONFIG
 *********************************************************************/

const VERSION = "V8";

const KEYS    = false;     // include key-caps
const PREVIEW = false;



// TODO:
//   Make ledge thicker
//   holder height might be too low

var A    = 24;        // Key row slant angle

var SHAPE = [
  [11,27],[11,32], // bottom left
  [35,88],[62,96], // top left
  [145, 96],
  [145,-32], // bottom center
  [99+1,-32],    [99-1,-32+1],  //  [96,-41],
  [62, 3]
];

var LEDS = [
  [  0, 44],
  [ 20, 44],
  [-20, 44]
];

var POSTS = [
  [ 0, -60],
  [ 0, 24],
  [64, -20],
  [-64, -20]
];
var RS   = -119;    // Row Start



var FT   = 3;         // Faceplate thickness
var H    = 13;        // Total height of keyboard
var RW   = 19;        // Row Width
var SW   = 14 + 0.55 ; // Switch Width 14, plus 0.6, for some reason
var KW   = 17;        // Key Width
var SR   = 1.7;       // screw radius
var LR   = 3.3/2;     // LED radius
var KH   = 6;         // key height above faceplate
var TR   = 119;       // thumb radius

var HOME_COLOR        = [0,0,0];
var DEFAULT_KEY_COLOR = [0.8,0.8,0.8];
var MODIFIER_COLOR    = [0.8,0,0];




/*********************************************************************
 *                                                             LIB
 *********************************************************************/

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


function degToRad(d) {
  return d/360*Math.PI;
}


function memoize(f) {
  var val;

  return function() {
    if ( ! val ) val = f.call(this);
    return val;
  };
}




/*********************************************************************
 *                                                             CAP
 *********************************************************************/

function createKeyCap(k) {
  var cap = Object.assign(k, {
      toSolid: memoize(function() {
         const KEYW = 17;
         const WW   = 7.5;
         var w   = wedge(/*this.f.r*/84-13, 0, -WW, WW, -WW, WW, k.flags);
         var key = w.intersect(cube({radius:0, size:[KEYW,KEYW,3.6+this.capHeight+14]}).translate([-KEYW/2,-KEYW/2,-4-11]).intersect(cube({size:[100,100,100]}).translate([-50,-50,-4])));

         key = key.intersect(cylinder({r2:0,r1:11.5,h:100}).translate([0,0,-10]));
         key = this.concaveKey(key);
  //       key = this.edgeKey(key);

       key = key.setColor(this.color);

//         key = this.addLabel(key, -6,  1,   this.label,   { color: BLACK });
//         key = this.addLabel(key, -6, -6, this.swLabel, { color: BLACK });
//         key = this.addLabel(key,  6, -6, this.seLabel, { color: RED, justify: 'R', scale: 0.12});

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
        var sw = 5.4; /*make smaller to reduce friction Was: 5.4+1.5*/
        var sh = 5.4;
        var stem = cube({radius:0.9, roundradius: 0.9,size:[sw,sh, D+2]}).intersect(cube({size:[sw,sh, D]})).translate([-sw/2,-sh/2,0]).setColor(WHITE);
        var hollow = cube({size:[W,H,3.8]}).translate([-W/2,-H/2,0]).union(cube({size:[H,W,3.8]}).translate([-H/2,-W/2,0]));
        return s.union(stem.subtract(hollow));
      },
      concaveKey: function(o) {
        var tiltY = Math.cos(degToRad(this.capTilt))*30;
        var tiltZ = Math.sin(degToRad(this.capTilt))*30;
        if ( k.isHome ) {
          o = o.subtract(sphere({r:45}).scale([1,1,1.3]).rotateX(this.capTilt/2.5).translate([0,-tiltZ,41-7+20+this.capHeight]));
        } else {
          o = o.subtract(sphere({r:45}).scale([1,3,1.3]).rotateX(this.capTilt/2.5).translate([0,-tiltZ,41-7+20+this.capHeight]));
        }
        return o;
      },
      edgeKey: function(o) {
        if ( this.flags.edgeTop )    o = o.subtract(cylinder({r:20, h:40}).rotateX(40).translate([0,33,0]));
        if ( this.flags.edgeBottom ) o = o.subtract(cylinder({r:20, h:40}).rotateX(-40).translate([0,-33,0]));
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
          txt = txt.toSolid().translate([x, y, 4]).subtract(o).translate([0,0,-0.75]);
          o = o.subtract(txt);
        }

        return o;
      }
  });

  return cap;
}



/*********************************************************************
 *                                                             SWITCH
 *********************************************************************/

var SWITCH = {
  w:           13.7, // use 13.7 for testing, 13.6,    // width of sides of switch
  d:           9,    // depth below surface
  h:           6,    // height above surface
  stem:        4,    // height of stem, 4mm travel

  latchDepth:  1.5,  // from top of lip
  latchWidth:  3.7,
  latchHeight: 1.4,

  holderThickness: 2,
  holderHeight:    3,

  lipHeight: 1,
  lipWidth: 15.5*1.03,

  createHolderOutline: memoize(function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+2*t, this.w+2*t, h], center:[true,true,false]}).setColor([1,1,1]);
    return holder;
  }),
  createLatch: function() {
     return cube({size:[this.latchWidth,17,this.latchHeight], center: [true,true, false]}).translate([0,0,-this.latchDepth-this.latchHeight]);
  },
  createHolder: memoize(function() {
    var h      = this.holderHeight;
    var holder = this.createHolderOutline();
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,0]);

    return holder.subtract(top);
  }),
  createSwitch: memoize(function() {
    var top    = cube({size:[this.w, this.w, this.h], center:[true,true,false]});
    var lip    = cube({size:[this.lipWidth, this.lipWidth, this.lipHeight], center:[true,true,false]});
    var bottom = cube({size:[this.w, this.w, this.d], center:[true,true,false]}).translate([0,0,-this.d]);
    var latch  = this.createLatch();
    lip = lip.setColor([1,0,0]);
    return union(top, lip, bottom, latch);
  }),
  toSolid: memoize(function() {
    var sw   = this.createSwitch()/*.setColor([0,0,0])*/;
    var stem = cube({size:[4, 4, 4], center:[true,true,false]}).translate([0,0,this.h]).setColor([165/256,42/256,42/256]);
    return sw.union(stem).translate([0,0,0]);
  })
};


/*********************************************************************
 *                                                             TEXT
 *********************************************************************/

function createText(m) {
  if ( typeof m === 'string' ) m = { text: m };

  return Object.assign({
    text: 'A',
    w: 4,
    h: 7,          // depth
    scale: 0.14,
    justify: 'L',  // justification: R, C or defaults to Left
    a: 0,          // angle of rotation
    color: [1,1,1],
    toSolid: function() {
      var o = [];
      var l = vector_text(0, 0, this.text);

      l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h: this.h})));

      var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

      if ( this.a ) txt = txt.rotateZ(this.a);

      var bounds = txt.getBounds();
      if ( this.justify === 'R' ) {
        txt = txt.translate([-bounds[1].x, -bounds[0].y*0, -2.5]);
      } else if ( this.justify === 'C' ) {
        txt = txt.translate([-bounds[1].x/2, -bounds[0].y*0, -2.5]);
      } else {
        txt = txt.translate([-bounds[0].x, -bounds[0].y*0, -2.5]);
      }

      return txt;
    }
  }, m);
}


function key(s, x, y, reverse, r, config) {
    function transform(s) {
      if ( config.tilt ) {
          config.tilt = config.tilt * 1.1;
        var t = config.tilt > 0 ? SW/2 : -SW/2;
        s = s.translate([0,t,-8]).rotateX(config.tilt).translate([0,-t,8]);
      }
      s = s.rotateZ(r || 0).translate([x, y, 0]).rotateZ(-A);
      if ( reverse ) s = s.scale([-1,1,1]);
      return s;
    }
    var sw = transform(SWITCH.toSolid());
    var h  = transform(SWITCH.createHolder());
    //
    h = h.intersect(cube({size:[500,500,20], center: [true, true, false]}));

    if ( PREVIEW ) {
    var cc = createKeyCap({capTilt: 0, capHeight: 5, color: config.color || DEFAULT_KEY_COLOR})
    var cap = transform(cc.toSolid());
    sw = sw.union(cap);
//    h = h.intersect(cap);
//      var key = transform(cube({size:[KW, KW, 8], xxxradius: 1, center: [true,true,false]}));
//      sw = sw.union(key);
    }
    if ( PREVIEW ) {
      s = s.union(sw);
    } else {
      s = s.subtract(sw);
    }
    return s.union(h);
}


function row(s, x, y, rows, reverse, home) {
  for ( var i = 0 ; i < rows.length ; i++ ) {
    s = key(s, x+12, RW*(i+1)+y-28, reverse, 0, rows[i]);
  }

  return s;
}


function post(lid, bottom, x, y) {
  bottom = bottom.union(cylinder({r:5,h: H-FT}).subtract(cylinder({r:SR,h: 10}).translate([0,0,H-10])).translate([x,y,0]));
  lid = lid.subtract(cylinder({r:SR,h: 100}).translate([x,y,0]));
  lid = lid.subtract(bottom);
  return [lid, bottom];
}


function base(keys, asBase) {
  var p = polygon({ points: SHAPE });
  var base = p.extrude().scale([1,1,FT]).setColor([0.4,0.4,0.4])
  var s = base;

  // reflect halves
  s = s.intersect(cube({size:[127,500,100]}).translate([0,-250,0]));
  s = s.translate([-127,0,0]);
  s = s.union(s.scale([-1,1,1]));

  if ( ! asBase ) {
    s = s.translate([0,-41,0]);
    s = s.intersect(s.scale([0.9875,0.97,1]));
    s = s.translate([0,41,0]);
  }

  if ( keys ) {
    s = row(s, RS, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], false, true);
    s = row(s, RS, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], true, true);

    s = row(s, RS+RW, 17, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], false, true);
    s = row(s, RS+RW, 17, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], true, true);

    s = row(s, RS+RW*2, 23, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], false, true);
    s = row(s, RS+RW*2, 23, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], true, true);

    s = row(s, RS+RW*3, 17, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], false, true);
    s = row(s, RS+RW*3, 17, [{tilt: -10},{color: HOME_COLOR},{tilt: 12}], true, true);

    s = row(s, RS+RW*4, 12, [{tilt: -10},{},{tilt: 12}]);
    s = row(s, RS+RW*4, 12, [{tilt: -10},{},{tilt: 12}], true);

    // thumb key
    function tkey(reverse, a, color, r, x, y, r2, tilt) {
      s = key(s, r/2 * Math.cos(a/180*Math.PI)+x, r/2 * Math.sin(a/180*Math.PI)+y, reverse, a + (r2 || 0), {tilt: tilt || 0, color: color});
    }

    for ( var i = 0 ; i < 2 ; i++ ) {
      // inside keys
      tkey(i == 1, 59, [0.3,0.9,0.3], TR+3, -53, -77, 8, -10);
      // outside keys
      tkey(i == 1, 75, i == 1 ? MODIFIER_COLOR : HOME_COLOR, TR, -53, -77, 0, 4);
    }
  }

  s = s.translate([0,-41,0]);

  if ( asBase ) {
    var base = s.scale([1,1,H/FT]);
    base = base.subtract(base.scale([0.98, 0.95, 1]));
    base = base.subtract(s.scale([1,1,H/FT]).translate([0,0,H-FT]).scale([0.99,0.975,1]));
    // add bottom to base
    return base.union(s.scale([1,1,1/1.5]));
  }

  return s;
}


function main() {

//  return key(cube({size:[1,1,1]}), 0, 0, false, 0, {});
  //return SWITCH.toSolid().union(SWITCH.createHolder());

    const WW = 7.5;
    // return wedge(/*this.f.r*/30-13, 0, -WW, WW, -WW, WW, {});

    // createKeyCap({capHeight: 8, flags:{}, isHome: false}).toSolid();

    /*
    var s = cube({size:[100, 100, 2], center: true});
    s = key(s, 0, 0, false, 0, {tilt: 10});
    s = key(s, 0, -KW, false, 0, {});
    return s;
    */

  var bottom = base(false, true).setColor([1,1,1]);
  var lid    = base(true, false);

  lid = lid.translate([0,0,H-FT]);

  // Add screw hold and post
  POSTS.forEach(p => {
    [lid, bottom] = post(lid, bottom, p[0], p[1]);
  });

  // Add LED cutouts
  LEDS.forEach(led  => {
    lid = lid.subtract(cylinder({r:LR,h: 100}).translate([led[0],led[1],0]));
  });

  for ( var i = 0 ; i < 11 ; i++ ) {
    if ( i == 5 || i == 1 || i == 9 ) continue;
    bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-78+i*16,100,H/2]));
  }

  lid = lid.subtract(createText({text: VERSION, justify: 'C', h: H+.8}).toSolid().translate([0,-50,0]).scale([-1,1,1]));

  //return bottom.union(lid);
  //return bottom;

//  lid = lid.subtract(bottom);
  return lid.rotateZ(-15);
}
