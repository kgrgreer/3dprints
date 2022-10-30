// TODO:
//  fix slant bolt positions

// https://www.thingiverse.com/thing:4093446
// https://www.thingiverse.com/thing:1161312

const PREVIEW = false;

const X = 180;

/*
const Y = 180*18/24;
const Z = 80*18/24;
*/
const Y = 30;
const Z = 40;

const T = 4; // Wall Thickness

const SX = 20; // Strap Width
const SY = 1.5;

const HINGE_H = 15/2;
const HINGE_W = 16.2;

const BAND_W = 26;

const BOLT_D = 3;
const BOLT_R = 9/2*1.05;

const D = X/4-SX/1.5-2; // TODO: remove

const FLOOR_D = 3; // depth of floor

function text(t, opt_scale) {
 var scale = opt_scale || 1;
 var o     = [];
 var l     = vector_text(0, 0, t);

 l.forEach(function (s) {
   o.push(rectangular_extrude(s, {w: scale*4, h: scale*1/0.2}));
 });

 return union(o);
}


function drillHoles(s, depth) {
  var hole = cylinder({r:3.4/2, h:20});
  var bolt = cylinder({r:BOLT_R, h: BOLT_D, fn: 6});
  hole = hole.union(bolt);
  hole = hole.rotateX(-90);
  hole = union(
      hole.translate([HINGE_W/2,0,0]),
      hole.translate([-HINGE_W/2,0,0])
      )
  hole = hole.translate([0,Y/2-T, depth]);

  hole = hole.setColor([0,0,0]);
  s = s.union(cube({size:[26,2.4,10], center:[1,0,1]}).translate([(BAND_W-BAND_W/2+X/2)/2,Y/2,depth]));
  s = s.union(cube({size:[26,2.4,10], center:[1,0,1]}).translate([-(BAND_W-BAND_W/2+X/2)/2,Y/2,depth]));
  s = s.subtract(hole.translate([(BAND_W-BAND_W/2+X/2)/2,0,0]));
  s = s.subtract(hole.translate([-(BAND_W-BAND_W/2+X/2)/2,0,0]));

  return s;
}


function apply(s, o) {
    return PREVIEW ? s.union(o) : s.subtract(o);
}


function base() {
  var s = cube({size:[X,Y,Z], center: [true,true,false]});

  // subtract horizontal grooves
  var b = cube({size:[X,Y,2], center: [true,true,false]});
  b = b.subtract(cube({size:[X,Y-2,2], center: [true,true,false]}));
  b = b.subtract(bands())
  b = b.setColor([0,0,0]);
  s = s.subtract(b.translate([0,0,Z/3-1]));
  s = s.subtract(b.translate([0,0,2*Z/3-1]));

  // add vertical bands
  s = s.union(s.scale([1,1.1,1]).intersect(bands()));

  //      b.translate([-BAND_W,0,0]),
//      b.translate([BAND_W/2-X/2,0,0]),


  for ( var i = 1 ; i <= 2 ; i++ )
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
    s = apply(s, bolt(k == 1 ? 0 : 180).translate([(BAND_W)*j,k*(-Y/2-2), i*Z/3]));
    // inside
    s = apply(s, bolt(k == 1 ? 0 : 180).translate([(BAND_W/2-X/2)*j,k*(-Y/2-2), i*Z/3]));
  }

  // remove insides
  s = s.subtract(cube({size:[X-2*T,Y-2*T,Z], center: [true,true,false]}).translate([0,0,FLOOR_D]));

  // add ledge
  s = s.union(cube({size:[6,Y,Z-14], center:[1,1,0]}).translate([X/2-5,0,0]))
  s = s.union(cube({size:[6,Y,Z-14], center:[1,1,0]}).translate([-(X/2-5),0,0]))

  // s = s.subtract(text("Property of Alexey Greer\n\nMfg. by: KGR, Dec. 2022\n\n\nMADE IN CANADA").scale([0.2,0.2,0.2]).rotateZ(0).rotateX(180).translate([-X/3,-Y/4,1]));

  s = drillHoles(s, Z-HINGE_H );

  var r = ring();
  s = apply(s, r.translate([(BAND_W-BAND_W/2+X/2)/2,-Y/2,Z/2+8]));
  s = apply(s, r.translate([-(BAND_W-BAND_W/2+X/2)/2,-Y/2,Z/2+8]));

  return s;
}


function lid() {
  const LZ = Z-7;
  const A = 50
  var s = cube({size:[X,Y,LZ], center: [true,true,false]});

  // cut out slants in lid
  s = s.subtract(s.scale([1,2,1]).rotateX(A).translate([0,-Y/2,SX/2]));
  s = s.subtract(s.scale([1,2,1]).rotateX(-A).translate([0,Y/2,SX/2]));

  // empty inside
  s = s.subtract(s.scale([(X-T)/X,(Y-T)/Y,LZ/Z]));

  var d = X/4-SX/1.5-1;

  var s2 = s.scale([1,(Y+3)/Y,(Z+1)/Z]); // slightly larger lid
  var s3 = cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([D,0,0]);
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-D,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-X/2+SX/2+1,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([+X/2-SX/2-1,0,0]));

  s2 = s2.intersect(s3);

  s = s.subtract(cube({size:[200,1,100], center: true}).translate([0,0,LZ-1+50]));
  s = s.subtract(cube({size:[200,1,100], center: true}).translate([0,0,LZ-1+59]).rotateX(59));
  s = s.subtract(cube({size:[200,1,100], center: true}).translate([0,0,LZ-1+59]).rotateX(-59));

  s = s.union(s2);

  // side bolts
  for ( var i = -1 ; i <= 1 ; i++ )
    for ( var j = -1 ; j <= 1 ; j+=2 )
    s = apply(s, bolt(90*j).translate([j*(X/2+0.5),i*Y/3,5]));

  // bolts on slopes
  for ( var i = 1 ; i <= 2 ; i++ )
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
      var d = [/*top*/8,/*bottom*/1.7,/*middle*/13];
    // outside bolts
    s = apply(s, bolt(0,k == 1 ? -(90-A) : (90-A)-180).translate([(BAND_W)*j,k*(-Y/2-2+d[i]), i*Z/3]));
    // inside bolts
    s = apply(s, bolt(0,k == 1 ? -(90-A) : (90-A)-180).translate([(BAND_W/2-X/2)*j,k*(-Y/2-2+d[i]), i*Z/3]));
  }

  // bolts on roof
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
    // outside bolts
    s = apply(s, bolt(0,-90).translate([(-X/2+SX/2+1)*j,k*(Y/6), Z-5.6]));
    // inside bolts
    s = apply(s, bolt(0,-90).translate([D*j,k*(Y/6), Z-5.6]));
  }

  /*
  // bolts above rings
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
    s = s.union(bolt().translate([j*(X/3.5),k*(-Y/2-2), Z/8]));
  }
  */

  s = drillHoles(s, HINGE_H);

  return s;
}


function tray() {
  const TX = X-1-T, TY = Y-1-T, TZ = 22;

  var s = cube({size:[TX,TY,TZ], center: [true,true,false]});
  s = s.subtract(cube({size:[TX-3,TY-3,TZ-2], center: [true,true,false]}).translate([0,0,2]));

  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([TX/6,0,0]))
  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([-TX/6,0,0]))

  return s;
}


function ring() {
    var r1 = torus({ri: 3, ro: 20}).translate([0,-20,6]);
    var r2 = torus({ri: 4, ro: 20}).translate([0,-20,6]);

    var s = cylinder({r1:25, r2:15, h:14, fn: 6}).translate([0,1,-2]);

   if ( PREVIEW ) {
    s = s.subtract(r2);

     for ( var i = 0 ;i <= 70 ; i += 4 )
       s = s.subtract(r1.translate([0,5,-6]).rotateX(-i).translate([0,-5,6]))
   }

    s = s.union(r1);

    s = s.rotateX(90).scale(0.4);

    if ( ! PREVIEW ) s = s.scale([1.04,1,1.04]);

   s = s.scale(1.25)
    return s.setColor([0.56,0.56,0.56]);
}


function bolt(z, x) {
  var s = sphere({r:BOLT_R,fn:8}).scale([1,1,1]);

  s = s.intersect(cube({size:[20,20,1.7], center: [1,1,0]}));
  s = s.union(cylinder({r:10/2, fn:8}).translate([0,0,-1])).translate([0,0,-1]);
  s = s.union(cylinder({r:0.7, h:10}).translate([0,0,-10]))
  s = s.rotateX(90);

  s = s.rotateZ(z || 0);
  s = s.rotateX(x || 0);

  if ( ! PREVIEW ) s = s.scale([1.04,1,1.04]);

  return s.setColor([0.56,0.56,0.56]);
}


function foot() {
  var s = cube({size:[25,10,7],center:[true,true,false]}).translate([-2.5,0,0])

  s = s.subtract(s.rotateY(-60).translate([13,0,0]));
  s = s.rotateZ(180);
  s = s.translate([-15,5,0]);
  return s;
}


function lid2() {
  const LZ = Z-2;
 var s = cylinder({r:(Y-T)/2/Math.sqrt(0.75), h:X, fn: 8, center:[1,1,1]}).rotateZ(360/16).rotateY(90);
  s = s.subtract(s.scale([(X-T)/X,(Y-T)/Y,LZ/Z]));
//  s = s.subtract(s.scale([0.98,0.98,0.98]))

  var bs = bands();
  var c = cube({size:[2,200,200],center:true}).rotateY(-90);
  var star = union(c.rotateX(90), c.rotateX(360/8), c.rotateX(-360/8));

  star = star.subtract(bs);
  star = star.subtract(s.scale([1,0.99,0.99]));
  s = s.subtract(star);

  s = s.union(s.scale([1,1.02,1.02]).intersect(bs))

  s = s.translate([0,0,-6])
  s = s.subtract(cube({size:[200, 200, -200], center:[1,1,0]}));

  s = drillHoles(s, HINGE_H);

  return s;
}

function bands() {
  var b = cube({size:[BAND_W, 200, 100], center:[1,1,0]})

  return union(
      b.translate([BAND_W,0,0]),
      b.translate([-BAND_W,0,0]),
      b.translate([BAND_W/2-X/2,0,0]),
      b.translate([-BAND_W/2+X/2,0,0])
      )
}

function main() {
//    return base();

    return base().intersect(
        cube({size:[55,1000,100],center:[0,1,0]}).translate([-90,0,0])
        );
return union(
    base(),
    lid2().translate([0,0,Z+5]));


//    return base();

    // return base();
//    return lid2();
//   return bolt();
   // return ring().rotateX(-90);
  var s = base();
  var t = tray();
  var f = foot();
  var l = lid2();

  t = t.translate([0,0,25]);
  l = l.translate([0,0,50]);

  s = s.union(t.translate([0,0,Z-2*T]));

  s = s.union(l.translate([0,0,Z+1]));

  s = s.translate([0,0,7]);

  s = s.union(f.translate([X/2,Y/2-10,0]))
  s = s.union(f.translate([X/2,-Y/2,0]))
  f = f.rotateZ(180);
  s = s.union(f.translate([-X/2,Y/2,0]))
  s = s.union(f.translate([-X/2,-Y/2+10,0]))

  return s;
}
