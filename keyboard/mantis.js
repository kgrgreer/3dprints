/*********************************************************************
 *                                                             CONFIG
 *********************************************************************/

const VERSION = "V14";

const KEYS    = false;     // include key-caps
const PREVIEW = false;
const EXPAND  = true;


// TODO:


var A    = 24;        // Key row slant angle

var SHAPE = [
  [13.5-1,31], // bottom left
  [36.5,85], // top left
  [62-1,90], // top-left corner of ring finger
  [136, 90], // top center
  [145,-31], // bottom center
  [110,-31], // corner of inside thumb key
  [63, 2]
];

var LEDS = [
  [  0, 42],
  [ 18, 42],
  [-18, 42]
];

var POSTS = [
  [74.8,40.8],
  [-74.8,40.8],
  [ 0, -58],
  [ 0, 0],
  [64, -14],
  [-64, -14]
];

var RS   = -120.5;    // Row Start
var FT   = 3;         // Faceplate thickness, should be 1.5
var H    = 15;        // Total height of keyboard
var RW   = 19;        // Row Width
var SW   = 14 + 0.6 ; // Switch Width 14, plus 0.6
var KW   = 17;        // Key Width
var SR   = 1.7;       // screw radius
var LR   = 3.3/2;     // LED radius, 3.3 plus tolerance
var KH   = 6;         // key height above faceplate
var TR   = 119;       // thumb radius

var HOME_COLOR        = [0,0,0];
var DEFAULT_KEY_COLOR = [0.8,0.8,0.8];
var MODIFIER_COLOR    = [0.8,0,0];
var RED               = [1,0,0];




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
  w:           13.8, // use 13.7 for testing, 13.6,    // width of sides of switch
  d:           16,    // depth below surface
  h:           5,    // height above surface
  stem:        4,    // height of stem, 4mm travel

  latchDepth:  1.5,  // from top of lip
  latchWidth:  3.7,
  latchHeight: 1.4,

  holderThickness: 2.6, //2.7,
  holderHeight:    24,

  lipHeight: 1, //6,
  lipWidth: 15.5*1.03+1,

  createHolderOutline: memoize(function() {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({size:[this.w+2*t, this.w+2*t+2.5, h], center:[true,true,false]}).translate([0,0,-h]).setColor([1,1,1]);
    return holder;
  }),
  createLatch: function() {
     return cube({size:[this.latchWidth,17,this.latchHeight], center: [true,true, false]}).translate([0,0,-this.latchDepth-this.latchHeight]);
  },
  createHolder: memoize(function() {
    var h      = this.holderHeight;
    var holder = this.createHolderOutline();
    var top    = cube({size:[this.w, this.w, this.h]}).translate([-this.w/2,-this.w/2,-this.h]);

    return holder.subtract(top);
  }),
  createSwitch: memoize(function() {
    var top    = cube({size:[this.w, this.w, this.h], center:[true,true,false]});
    var lip    = cube({size:[this.lipWidth, this.lipWidth, this.lipHeight + (PREVIEW ? 0 : 6)], center:[true,true,false]});
    var bottom = cube({size:[this.w, this.w, this.d], center:[true,true,false]}).translate([0,0,-this.d]);
    var latch  = this.createLatch();
    lip = lip.setColor([1,0,0]);
    top = top.union(bottom, latch);
    if ( ! PREVIEW ) {
      var capSpace = cube({size:[this.lipWidth+2.6, this.lipWidth+2.6, 10], center:[true,true,false]}).translate([0,0,this.lipHeight+1]);
      top = top.union(capSpace);
    }
    return top;
  }),
  toSolid: memoize(function() {
    var sw   = this.createSwitch()/*.setColor([0,0,0])*/;
    var stem = cube({size:[4, 4, 4], center:[true,true,false]}).translate([0,0,this.h]).setColor([165/256,42/256,42/256]);
    return sw.union(stem);
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
      if ( config.tilt || true ) {
          config.tilt = (config.tilt || 0) * 1.1;
        var t = config.tilt > 0 ? SW/2 : -SW/2;
        var d = (config.tilt || 0 ) < 0 ? -2 : 2;
        s = s.translate([0,t+d,0]).rotateX(config.tilt).translate([0,-t-d,config.height || 0]);
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
    var cap = transform(cc.toSolid().translate([0,0,SWITCH.h]));
    sw = sw.union(cap);
//    h = h.intersect(cap);
//      var key = transform(cube({size:[KW, KW, 8], xxxradius: 1, center: [true,true,false]}));
//      sw = sw.union(key);
    }
    s = s.union(h);
    if ( PREVIEW ) {
      s = s.union(sw);
    } else {
      s = s.subtract(sw);
    }
    return s;
}


function row(s, x, y, height, rows, reverse, home) {
  for ( var i = 0 ; i < rows.length ; i++ ) {
    rows[i].height = height;
    s = key(s, x+12, (RW+0.2)*(i+1)+y-28, reverse, 0, rows[i]);
  }

  return s;
}


function post(lid, bottom, x, y) {
  bottom = bottom.union(cylinder({r:5,h: H-FT}).subtract(cylinder({r:SR,h: 10}).translate([0,0,H-10])).translate([x,y,0]));
  lid = lid.subtract(cylinder({r:SR,h: 100}).translate([x,y,0]));
  lid = lid.subtract(cylinder({r:3.8, h: 20.5}).translate([x,y,H-0.5]));
  // lid = lid.subtract(bottom);
  return [lid, bottom];
}


function base(keys, asBase) {
  var p = polygon({ points: SHAPE });
  if ( EXPAND ) p = p.expand(2, 100);

  var base = p.extrude().scale([1,1,FT]).setColor([0.4,0.4,0.4]).translate([0,0,-FT])
  var s = base;

  // reflect halves
  s = s.intersect(cube({size:[127,500,-FT]}).translate([0,-250,0]));
  s = s.translate([-127,0,0]);
  s = s.union(s.scale([-1,1,1]));

  if ( ! asBase ) {
    s = s.translate([0,-41,0]);
    // Make Lid slightly smaller than base
    s = s.intersect(s.scale([0.9875,0.97,1]));
    s = s.translate([0,41,0]);
  }

  var blankBase = s;

  if ( keys ) {
    s = row(s, RS, 0, 8, [{tilt: -10},{color: HOME_COLOR},{tilt: 14, color: RED}], false, true);
    s = row(s, RS, 0, 8, [{tilt: -10},{xxxcolor: HOME_COLOR},{tilt: 14}], true, true);

    s = row(s, RS+RW, 17, 2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], false, true);
    s = row(s, RS+RW, 17, 2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], true, true);

    s = row(s, RS+RW*2, 23.4, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], false, true);
    s = row(s, RS+RW*2, 23.4, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 14, color: HOME_COLOR}], true, true);

    s = row(s, RS+RW*3, 17, 2.2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], false, true);
    s = row(s, RS+RW*3, 17, 2.2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], true, true);

    s = row(s, RS+RW*4, 12+2, 2.5, [{tilt: -10},{},{tilt: 14}]);
    s = row(s, RS+RW*4, 12+2, 2.5, [{tilt: -10},{},{tilt: 14}], true);

    // thumb key
    function tkey(reverse, a, color, r, x, y, r2, tilt) {
        //tilt = 0;
        r2 = 0;
        r = TR+9.3
        x = -53.75;
        y = -78;
        r = r;
        y -= 66;
        a = a+10;
      s = key(s, r * Math.cos(a/180*Math.PI)+x, r * Math.sin(a/180*Math.PI)+y, reverse, a + (r2 || 0), {tilt: tilt || 0, color: color});
    }

const D = 9;
//   keys: mod, backspace, tab, space, enter, mod
    for ( var i = 0 ; i < 2 ; i++ ) {
      // inside keys
      tkey(i == 1, /*52*/69-D, [0.3,0.9,0.3], TR+18, -53, -77, 18, -7);
      // middle keys
      tkey(i == 1, 69, i == 1 ? MODIFIER_COLOR : HOME_COLOR, TR+9.3, -53.75, -78, 7.8, 0);
      // outside keys
      tkey(i == 1, 69+D/*85.5*/, i == 1 ? MODIFIER_COLOR : HOME_COLOR, TR+7.4, -53, -77, -5, 7);


      // inside keys
   //   tkey(i == 1, 57, [0.3,0.9,0.3], TR+3, -53, -77, 8, -8);
      // outside keys
//      tkey(i == 1, 76, i == 1 ? MODIFIER_COLOR : HOME_COLOR, TR, -53, -77, 0, 0);
      // outside keys
    //  tkey(i == 1, 94.5, i == 1 ? MODIFIER_COLOR : HOME_COLOR, TR+4.4, -53, -77, -12, 8);
    }

    // trim off any holders that fall outside of the lid area
    s = s.intersect(blankBase.scale([1,1,100]).translate([0,0,50]));
  }

  s = s.translate([0,-41,0]);

  if ( asBase ) {
    var base = s.scale([1,1,-H/FT]);
    base = base.subtract(base.scale([0.96, 0.93, 1]));
    base = base.subtract(s.scale([1,1,-H/FT]).translate([0,0,H-FT]).scale([0.99,0.975,1]));
    // add bottom to base
    return base.union(s.scale([1,1,-1/1.5]));
  }

  return s.translate([0,0,FT]);
}

function tilt(bottom) {
    var b = bottom.rotateX(2);

    b = b.translate([0,0,-1.6]);

    var bs = bottom.scale([1,1,100]).rotateX(2).translate([0,0,-1.6]);
    bs = bs.intersect(cube({size:[500,500,1.5], center:[1,1,0]}));
    return b.union(bs).intersect(cube({size:[500,500,100], center:[1,1,0]}));
}

function main() {
//    return SWITCH.toSolid().translate([0,0,20]);
  var bottom = base(false, true).setColor([1,1,1]);
  var lid    = base(true, false);

  lid = lid.translate([0,0,H-FT]);

  // Add screw hold and post
  POSTS.forEach(p => {
    [lid, bottom] = post(lid, bottom, p[0], p[1]);
  });

  // Add LED cutouts
  LEDS.forEach(led  => {
    lid = lid.subtract(cylinder({r:LR,h: H-0.2}).translate([led[0],led[1],0]));
  });

  // Cable hole
  bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-86,100,H-1]));
  bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-86,100,H-1-FT/2]));
  bottom = bottom.subtract(cylinder({r:3, h:100}).rotateX(90).translate([-86,100,H-1-FT]));

  function plate(x, y, w, h, r) {
      var s = cube({size: [w, h, 0.2]}).rotateZ(r|| 0).translate([x,y,H]).setColor([0.5,0.5,0.5]);
      lid = lid.union(s);
      lid = lid.union(s.scale([-1,1,1]));
  }

  plate(-24, 35, 45, 14);
  plate(-10, -51, 20, 40);
  plate(-10, -71, 20, 8);
  plate(-95,-19,33,16,-30);

  // Version Engraving
  lid = lid.subtract(createText({text: VERSION, w:6, scale: 0.25, justify: 'C', h: H+1}).toSolid().translate([0,-40,0]).scale([-1,1,1]));
//return tilt(bottom);
//return lid;
//  return bottom;
//  return bottom.union(lid);

  //lid = lid.subtract(bottom);
  return lid.rotateZ(-15);
}
