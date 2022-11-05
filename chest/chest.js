// TODO:
//  fix slant bolt positions
//  add bolts on sides

// https://www.thingiverse.com/thing:4093446
// https://www.thingiverse.com/thing:1161312

const PREVIEW = false;

const X = 180;

const Y = 180*18/24; const Z = 80*18/24;
// const Y = 30; const Z = 40;

const T = 3.8; // Wall Thickness

const SX = 18; // Strap Width
const SY = 1.5;

const HINGE_H = 15/2;
const HINGE_W = 16.2;

const BAND_W = 24;
const BAND_D = 2.2;

const BOLT_D = 3;
const BOLT_R = 9/2*1.05;

const D = X/4-SX/1.5-2; // TODO: remove

const FLOOR_D = 3; // depth of floor


function apply(s, o) {
    return PREVIEW ? s.union(o) : s.subtract(o);
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


function base() {
  var s = cube({size:[X,Y,Z], center: [true,true,false]});

  // subtract horizontal grooves
  var b = cube({size:[X,Y,2], center: [true,true,false]});
  b = b.subtract(cube({size:[X-2,Y-2,2], center: [true,true,false]}));
  b = b.subtract(bands().subtract(cube({size:[X,Y-3,2], center: [true,true,false]})))
  b = b.setColor([0,0,0]);
  s = s.subtract(b.translate([0,0,Z/3-1]));
  s = s.subtract(b.translate([0,0,2*Z/3-1]));

  // add vertical bands
  s = s.union(s.scale([1,(Y+BAND_D)/Y,1]).intersect(bands()));

  //      b.translate([-BAND_W,0,0]),
//      b.translate([BAND_W/2-X/2,0,0]),


  // side bolts
  for ( var j = -1 ; j <= 1 ; j+=2 )
    s = apply(s, bolt(90*j).translate([j*(X/2+0.5),0,5*Z/6]));

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

  // s = s.subtract(text("Property of Alexey Greer\n\nMfg. by: KGR, Dec. 2022\n\n\nMADE IN CANADA").scale([0.3,0.3,0.3]).rotateZ(0).rotateX(180).translate([-X/3,-Y/4,1.5]));

  s = drillHoles(s, Z-HINGE_H );

  var r = ring();
  s = apply(s, r.translate([(BAND_W-BAND_W/2+X/2)/2,-Y/2,Z/2+8]));
  s = apply(s, r.translate([-(BAND_W-BAND_W/2+X/2)/2,-Y/2,Z/2+8]));

  return s;
}


function bolt(z, x) {
  var s = sphere({r:BOLT_R,fn:7}).rotateZ(360/28).scale([1,1,1]);

  s = s.intersect(cube({size:[20,20,4], center: [1,1,0]}));
  s = s.union(cylinder({r:10/2, fn:7}).rotateZ(360/28).translate([0,0,-1])).translate([0,0,-1]);
  s = s.union(cylinder({r:0.8, h:10}).translate([0,0,-10]))
  s = s.rotateX(90);

  s = s.rotateZ(z || 0);
  s = s.rotateX(x || 0);

  if ( ! PREVIEW ) s = s.scale([1.04,1,1.04]);

  return s.setColor([0.56,0.56,0.56]);
}


function drillHoles(s, depth) {
  var hole = cylinder({r:3.6/2, h:20});
  var bolt = cylinder({r:BOLT_R, h: BOLT_D, fn: 6});
  hole = hole.union(bolt);
  hole = hole.rotateX(-90);
  hole = union(
      hole.translate([HINGE_W/2,0,0]),
      hole.translate([-HINGE_W/2,0,0])
      )
  hole = hole.translate([0,Y/2-T, depth]);

  hole = hole.setColor([0,0,0]);
 // s = s.union(cube({size:[26,2.4,10+5], center:[1,0,1]}).translate([(BAND_W-BAND_W/2+X/2)/2,Y/2,depth-5/2]));
  var plate = cube({size:[30,2.4,10+4], center:[1,0,1]}).translate([0,0,-4/2]);
 plate = plate.subtract(plate.translate([0,0,2]).rotateX(-25).translate([0,0,-10]))
  s = s.union(plate.translate([-(BAND_W-BAND_W/2+X/2)/2,Y/2,depth]));
  s = s.union(plate.translate([(BAND_W-BAND_W/2+X/2)/2,Y/2,depth]));

  s = s.subtract(hole.translate([(BAND_W-BAND_W/2+X/2)/2,0,0]));
  s = s.subtract(hole.translate([-(BAND_W-BAND_W/2+X/2)/2,0,0]));

  return s;
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
 var s = cylinder({r:Y/2+1.65*T, h:X, fn: 8, center:[1,1,1]}).rotateZ(360/16).rotateY(90);
  s = s.subtract(s.scale([(X-2*T)/X,(Y-2*T)/Y,(Z-T)/Z]));

  var bs = bands();
  var c = cube({size:[2,200,200],center:true}).rotateY(-90);
  var star = union(c.rotateX(90), c.rotateX(360/8), c.rotateX(-360/8));

  star = star.subtract(bs);
  star = star.subtract(s.scale([1,0.99,0.99]));
  s = s.subtract(star.setColor([0,0,0]));

  var b = bolt().rotateX(-90).translate([0,0,Y/2+2]);
  var b2 = union(
      b.translate([0,Y/8-4,0]),
      b.translate([0,-Y/8+4,0])
  );
  var b3 = union(
      b2,
      b2.rotateX(360/8),
      b2.rotateX(-360/8),
  )
  var b4 = union(
      b3.translate([BAND_W,0,0]),
      b3.translate([-BAND_W,0,0]),
      b3.translate([BAND_W/2-X/2,0,0]),
      b3.translate([-BAND_W/2+X/2,0,0])
      )
  s = apply(s, b4)

  s = s.union(s.scale([1,(Y+BAND_D)/Y,(Y+BAND_D)/Y]).intersect(bs))

  s = s.translate([0,0,-28+BAND_W-10])
  s = s.subtract(cube({size:[200, 200, -200], center:[1,1,0]}));

  s = drillHoles(s, HINGE_H);

  // side bolts
    for ( var j = -1 ; j <= 1 ; j+=2 )
    s = apply(s, bolt(90*j).translate([j*(X/2+0.5),0,Z/6]));

  s = s.intersect(cube({size:[1000,1000,1000], center: [1,1,0]}))
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


function text(t, opt_scale) {
 var scale = opt_scale || 1.4;
 var o     = [];
 var l     = vector_text(0, 0, t);

 l.forEach(function (s) {
   o.push(rectangular_extrude(s, {w: scale*4, h: scale*1/0.2}));
 });

 return union(o);
}


function tray() {
  const TX = X-1-T, TY = Y-1-T, TZ = 22;

  var s = cube({size:[TX,TY,TZ], center: [true,true,false]});
  s = s.subtract(cube({size:[TX-3,TY-3,TZ-2], center: [true,true,false]}).translate([0,0,2]));

  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([TX/6,0,0]))
  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([-TX/6,0,0]))

  return s;
}


function main() {
    return lid2();
    /*
    return lid2().intersect(
        cube({size:[55,Y,100],center:[0,1,0]}).translate([-90,Y-15,0])
        )*/
        return base().union(lid2().translate([0,0,Z+20]))
    return base().union(lid2().translate([0,0,Z+10]));
    return base();

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
