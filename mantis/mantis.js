/*********************************************************************
 *                                                             CONFIG
 *********************************************************************/

/*
  TODO:
*/
const VERSION = "V16";

const KEYS    = false;     // include key-caps
const PREVIEW = false;
const EXPAND  = true;

var SHAPE = [
  [15,30], // bottom left
  [22,47],
  [22,52],
  [(36.5+22)/2-1, (51+85)/2-1.5],
  [(36.5+22)/2-1, (51+85)/2+2.5],
  [35,85], // top left
  [62-1,90], // top-left corner of ring finger
  [136, 90], // top center
  [145,-31], // bottom center
  [110,-31], // corner of inside thumb key
  [63, 2]
];

var POSTS = [
  [ 74.8,  43],
  [-74.8,  43],
  [  0,   -65],
  [  0,    44],
  [ 80,   -25],
  [-80,   -25]
];

var A    = 24;        // Key row slant angle
var RS   = -120.5;    // Row Start

var FT   = 3;         // Faceplate thickness, should be 1.5
var H    = 12.25;     // Total height of keyboard
var RW   = 19;        // Row Width
var SW   = 14 + 0.6 ; // Switch Width 14, plus 0.6
var KW   = 17;        // Key Width
var SR   = 1.7;       // screw radius
var LR   = 3.3/2;     // LED radius, 3.3 plus tolerance
var KH   = 6;         // key height above faceplate
var TR   = 119;       // thumb radius
var TILT = 3;         // tilt of keyboard

var HOME_COLOR        = [0,0,0];
var DEFAULT_KEY_COLOR = [0.8,0.8,0.8];
var MODIFIER_COLOR    = [0.8,0,0];
var RED               = [1,0,0];




/*********************************************************************
 *                                                             LIB
 *********************************************************************/


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


function createTBHolder(m) {
    m = {
      ...m,
      width: 0.7, // wall thickness
      x: 25*1.04,
      y: 16.5*1.04,
      x2: 15.1*1.04, y2: 5.3*1.04,
      switchWidth: 14,
      z: 1.5*1.05,
      h: 10+FT
    };

    return Object.assign({
       transform: function(s) { return s.translate([0,-18,H]); },
       rcube: function(x,y,z) {
         var s = cube({fn:32, radius: 0.5, size: [x,y,z+10], center:[1,1,0]});
         s = s.translate([0,0,-10]);
         return s.intersect(cube({size:[100,100,100], center:[1,1,0]}))
       },
       toNegative: function() {
           var s = cube({size:[this.x, this.y, this.z+FT], center:[1,1,0]}).translate([0,0,-FT-this.z]);
           s = s.union(cube({size:[this.x2, this.y2, 10], center:[1,1,0]}).translate([0,this.y/2+this.y2/2,-10]));
           return s;
       },
       toSolid: function() {
           var w2 = this.width*2;
           var s = this.rcube(this.x+w2, this.y+w2, this.z+this.width);
           s = s.union(this.rcube(this.x+w2+12, this.y+w2-12, this.z+this.width).translate([0,-7,0]));
           s = s.union(this.rcube(this.x+w2+2, this.y+w2-5, this.z+this.width).translate([0,0,0]));
           s = s.union(this.rcube(this.x+w2+9, this.y+w2-5, this.z+this.width).translate([0,-3.3,0]));
           s = s.union(this.rcube(this.x2+w2+5.85, this.y2+5, this.z+this.width).translate([0,(this.y+w2)/2+this.y2/2-2.5,0]));
           s = s.subtract(cube({radius:1, fn: 32, size:[this.switchWidth, this.switchWidth, this.z+7], center:[1,1,-2]}));


           var stand = cube({size:[this.x, this.y, this.h], center: [1,1,0]}).translate([0,0,-this.h]);
           stand = stand.subtract(cube({size:[this.x-6, this.y, this.h], center: [1,1,0]}).translate([0,0,-this.h]));

            s = s.union(stand);

           return s.setColor([1,1,1]);
       },
       toPreview: function() {
         return this.toSolid().subtract(this.toNegative().setColor([0.5,0.5,0.5]));
       },
       install: function(s, opt_t) {
           var t = opt_t || this.transform.bind(this);
           var base = t(this.toSolid());
           var neg  = t(this.toNegative());
           s = s.union(base);
           s = s.subtract(neg);
           return s;
       }
    }, m);
};


function createOLEDHolder(m) {
    m = {
      ...m,
      width: 5, // wall thickness
      x: 28.5*1.02,
      y: 27.5*1.02,
      displayWidth: 26,
      displayHeight: 14.5,
      z: 3.2*1.05,
      h: 10
    };

    return Object.assign({
       transform: function(s) { return s.translate([0,-41.25,H-this.h-FT]); },
       rcube: function(x,y,z) {
         var s = cube({fn:32, radius: 0.5, size: [x,y,z+10], center:[1,1,0]});
         s = s.translate([0,0,-10]);
         return s.intersect(cube({size:[100,100,100], center:[1,1,0]}))
       },
       toNegative: function() {
           var s = cube({size:[this.displayWidth, this.displayHeight, FT], center:[1,0,0]}).translate([0,-5,this.h]);
           s = s.union(cube({size:[this.displayWidth, this.displayHeight, FT+2], center:[1,0,0]}).rotateX(30).translate([0,-5,this.h+0.4]));
           s = s.union(cube({size:[this.x,this.y,this.z],center:[1,1,0]}).translate([0,0,this.h-this.z]))
           return s;
       },
       toSolid: function() {
           var w2 = this.width*2;
           var s = cube({size:[this.x+w2, this.y+w2, this.h], center: [1,1,0]});
           s = s.subtract(cube({size:[this.x-this.width/2,14,15],center:true}))
           s = s.subtract(cube({size:[12,12,100],center:true}).translate([0,15,0]))
           s = s.subtract(cube({size:[20,20,100],center:true}).translate([18,-18,0]))
           s = s.subtract(cube({size:[20,20,100],center:true}).translate([-18,-18,0]))
           return s.setColor([1,1,1]);
       },
       toPreview: function() {
         return this.toSolid().subtract(this.toNegative().setColor([0.5,0.5,0.5]));
       },
       install: function(s, opt_t) {
           var t = opt_t || this.transform.bind(this);
           var base = t(this.toSolid());
           var neg  = t(this.toNegative());
           s = s.union(base);
           s = s.subtract(neg);
           return s;
       }
    }, m);
};



/*********************************************************************
 *                                                             CAP
 *********************************************************************/

function createKeyCap(k) {
  var cap = Object.assign(k, {
      toSolid: memoize(function() {
         const KEYW = 15;
         const WW   = 7.5;
var w = cube({size:[17.6,16.3,3.5], center:[1,1,0]})
var key = w;

         key = this.concaveKey(key);

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
        o = o.subtract(sphere({r:60}).scale([1,1,1]).rotateX(this.capTilt/2.5).translate([0,-tiltZ,42+15+this.capHeight]));
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
  h:           3,    // height above surface
  stem:        2,    // height of stem, 4mm travel

  latchDepth:  1.5,  // from top of lip
  latchWidth:  3.7,
  latchHeight: 1.4,

  holderThickness: 2.6, //2.7,
  holderHeight:    24,

  lipHeight: 1, //6,
  lipWidth: 15.5*1.03+1,

  createHolderOutline: function(vPad) {
    var h = this.holderHeight;
    var t = this.holderThickness;
    var holder = cube({radius:0.5, size:[this.w+2*t+0.2, this.w+2*t+1.5+vPad, h], center:[true,true,false]}).translate([0,-vPad,-h]).setColor([1,1,1]);
    return holder;
  },
  createLatch: function() {
     return cube({size:[this.latchWidth,17,this.latchHeight], center: [true,true, false]}).translate([0,0,-this.latchDepth-this.latchHeight]);
  },
  createHolder: function(vPad) {
    var h      = this.holderHeight;
    var holder = this.createHolderOutline(vPad);
    var top    = cube({size:[this.w, this.w, -this.h], center:[1,1,0]});

    return holder.union(top);
  },
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
    var stem = cube({size:[4, 4, 2.5], center:[true,true,false]}).translate([0,0,this.h]).setColor([165/256,42/256,42/256]);
    var plate = cube({size:[17, 15, 2], center:[true,true,false]}).setColor([165/256,42/256,42/256]);
    var leftPost = cylinder({fn: 10, r:2.25, h:-30}).translate([-5.5,-4,-2]);
    var bottomPost = cylinder({fn: 10, r:2.25, h:-30}).translate([0,-5.5,-2]);
    return union(sw, plate, stem, leftPost, bottomPost);
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
    x += (config.x || 0);
    y += (config.y || 0);

    function transform(s) {
      if ( config.tilt || true ) {
        var tilt = (config.tilt || 0) * 1.1;
        var t = tilt > 0 ? SW/2 : -SW/2;
        var d = tilt < 0 ? -2 : 2;
        s = s.translate([0,t+d,0]).rotateX(tilt).translate([0,-t-d,config.height || 0]);
      }
      s = s.rotateZ(r || 0).translate([x, y, 0]).rotateZ(-A);
     if ( reverse ) s = s.scale([-1,1,1]);
      return s;
    }

    var sw = SWITCH.toSolid(config.switchR);

    if ( config.switchR ) {
      sw = sw.rotateZ(config.switchR + 360);
    }
    if ( reverse ) sw = sw.scale([-1,1,1]);

    sw = transform(sw);
    var h  = transform(SWITCH.createHolder(config.vPad || 0));
    h = h.intersect(cube({size:[500,500,20], center: [true, true, false]}));

    //s = s.subtract(h.translate([0,0,2]));

    if ( PREVIEW ) {
      var cc = createKeyCap({capTilt: 0, capHeight: 5, color: config.color || DEFAULT_KEY_COLOR})
      var cap = transform(cc.toSolid().translate([0,0,SWITCH.h]));
      sw = sw.union(cap);
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
    s = row(s, RS, 0, 8, [{tilt: -10, x: 2},{color: HOME_COLOR, vPad: 1},{tilt: 14, color: RED, x:-2, vPad: 1}], false, true);
    s = row(s, RS, 0, 8, [{tilt: -10, x: 2},{xxxcolor: HOME_COLOR, vPad: 1},{tilt: 14, x:-2, vPad: 1}], true, true);

    s = row(s, RS+RW, 17, 2, [{tilt: -10},{color: HOME_COLOR, dw: 10},{tilt: 14}], false, true);
    s = row(s, RS+RW, 17, 2, [{tilt: -10},{color: HOME_COLOR, dw: 10},{tilt: 14}], true, true);

    s = row(s, RS+RW*3, 17, 2.2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], false, true);
    s = row(s, RS+RW*3, 17, 2.2, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], true, true);

    s = row(s, RS+RW*4, 12+2, 2.5, [{tilt: -10},{},{tilt: 14}]);
    s = row(s, RS+RW*4, 12+2, 2.5, [{tilt: -10},{},{tilt: 14}], true);

    s = row(s, RS+RW*2, 23.4, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 14}], false, true);
    s = row(s, RS+RW*2, 23.4, 0, [{tilt: -10},{color: HOME_COLOR},{tilt: 14, color: HOME_COLOR}], true, true);

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
      s = key(s, r * Math.cos(a/180*Math.PI)+x, r * Math.sin(a/180*Math.PI)+y, reverse, a + (r2 || 0), {switchR: reverse ? 90 : -90, height: 0.4, tilt: tilt || 0, color: color});
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
    return base.union(s.scale([1,1,-0.2]));
  }

  return s.translate([0,0,FT]);
}


function tilt(bottom) {
    var b = bottom.rotateX(TILT);

    b = b.translate([0,0,-1.6]);

    var bs = bottom.scale([1,1,100]).rotateX(2).translate([0,0,-1.6]);
    bs = bs.intersect(cube({size:[500,500,1.5], center:[1,1,0]}));
    return b.union(bs).intersect(cube({size:[500,500,100], center:[1,1,0]}));
}


function cover(lid) {
    var s = lid.intersect(cube({size:[300,300,0.01], center:[1,1,0]}).translate([0,0,H-0.01])).translate([0,0,-H+0.01]).scale([1,1,40]).translate([0,0,H-0.1]);

    var l = lid.translate([0,0,-0.01]);
    for ( var i = -1 ; i <= 1 ; i += 0.5 )
    for ( var j = -1 ; j <= 1 ; j += 0.5 )
    s = s.subtract(l.translate([2*i,2*j,0]));
    return s.setColor([1,0,0]);
}


function cpuHolder(base, d, w, x, hole, opt_y) {
  const D = d*1.03;
  const W = w*1.028; // 1.03 too large, 1.02 too small
  const H2 = H-FT;

  var s = cube({size:[W+8, D+5, H2], center:[1,1,0]});
  s = s.subtract(cube({size:[W-4, D+5, H2], center:[1,1,0]}))
  s = s.subtract(cube({size:[W+8, D-10, H2], center:[1,1,0]}))

  var neg = cube({size:[W, D, H2], center:[1,1,0]});

  s = s.translate([x,-D/2+47.4+(opt_y || 0),0]);
  neg = neg.translate([x,-D/2+47.4+(opt_y || 0),1]);

  base = base.union(s);
  base = base.subtract(neg);

  if ( hole ) {
    var negative = cube({size:[12,20,5], radius: 2, center:[1,0,0]}).translate([0,D/2,2.2]);

    negative = negative.translate([x,20,0]);
    base = base.subtract(negative);
  }

  return base;
}


function main2() {
//return SWITCH.toSolid();
//return base(true, false);

//return createOLEDHolder().toPreview();
//    return createTBHolder().toPreview();
//    return SWITCH.toSolid().translate([0,0,20]);
  var bottom = base(false, true).setColor([1,1,1]);
  var lid    = base(true, false);

  lid = lid.translate([0,0,H-FT]);

  function plate(x, y, w, h, r, height) {
    var s = cube({size: [w, h, height || 0.2]}).rotateZ(r|| 0).translate([x,y,H]).setColor([0.5,0.5,0.5]);
    lid = lid.union(s);
    lid = lid.union(s.scale([-1,1,1]));
  }

  // fill space between pinky and ring finger in top row
  plate(79.5, 16, 5, 22.5, 24, 2);


  // Version Engraving
  lid = lid.subtract(createText({text: VERSION, w:6, scale: 0.25, justify: 'C', h: H+0.6}).toSolid().translate([0,30,0]).scale([-1,1,1]));

  bottom = cpuHolder(bottom, 51.5, 19.2, -45, true, 1.25);

  bottom = cpuHolder(bottom, 48.3, 15.2, 17);
  bottom = cpuHolder(bottom, 48.3, 15.2, 17+22);
  bottom = cpuHolder(bottom, 48.3, 15.2, 17+22*2);

  // extra supports
  bottom = bottom.union(cube({size:[30, 6, H-FT]}).rotateZ(24).translate([62,-25,0]))
  bottom = bottom.union(cube({size:[30, 6, H-FT]}).rotateZ(24).translate([62,-25,0]).scale([-1,1,1]))

 lid = createOLEDHolder().install(lid);
 lid = createTBHolder().install(lid);

//return lid;
  bottom = createTBHolder().install(bottom);
  bottom = createOLEDHolder().install(bottom);

  bottom = bottom.intersect(cube({size:[300,300,H],center:[1,1,0]}))
  var c = cover(lid);
  lid = lid.union(c);

  lid = lid.subtract(cube({size:[200,200,(H-FT)*2],center:true}))

  bottom = bottom.subtract(lid);

  // Add screw hold and post
  POSTS.forEach(p => {
    [lid, bottom] = post(lid, bottom, p[0], p[1]);
  });

bottom = tilt(bottom);

bottom = bottom.subtract(createText({text: VERSION, w:6, scale: 0.25, justify: 'C', h: 3}).toSolid().translate([0,-40,0]).scale([-1,1,1]).setColor([0.5,0.5,0.5]));

//return bottom;

return lid;
return bottom.union(tilt(lid));
//return tilt(bottom);
return lid;
}

function main() {
    return main2().rotateZ(-15);
}
