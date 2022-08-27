// TODO: grooves in lid

const X = 150;
const Y = 90;
const Z = 40;

const T = 5; // Wall Thickness

const SX = 20; // Strap Width
const SY = 1.5;

const D = X/4-SX/1.5-2;

function text(t, opt_scale) {
 var scale = opt_scale || 1;
 var o     = [];
 var l     = vector_text(0, 0, t);

 l.forEach(function (s) {
   o.push(rectangular_extrude(s, {w: scale*4, h: scale*1/0.2}));
 });

 return union(o);
}

function base() {
  var s = cube({size:[X,Y,Z], center: [true,true,false]});

  // subtract horizontal grooves
  var b = cube({size:[X,Y,1], center: [true,true,false]});
  b = b.subtract(cube({size:[X-1,Y-1,1], center: [true,true,false]}));

  s = s.subtract(b.translate([0,0,Z/3]));
  s = s.subtract(b.translate([0,0,2*Z/3]));

  // add vertical strips

  var t = cube({size:[SX,Y+2*SY,Z], center: [true,true,false]});

  s = s.union(t.translate([-X/2+SX/2+1,0,0]));
  s = s.union(t.translate([X/2-SX/2-1,0,0]));
  s = s.union(t.translate([-D,0,0]));
  s = s.union(t.translate([D,0,0]));

  for ( var i = 1 ; i <= 2 ; i++ )
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
    s = s.union(bolt().translate([(-X/2+SX/2+1)*j,k*(-Y/2-2), i*Z/3]));
    s = s.union(bolt().translate([D*j,k*(-Y/2-2), i*Z/3]));
  }

  // remove insides
  s = s.subtract(cube({size:[X-2*T,Y-T,Z], center: [true,true,false]}).translate([0,0,T]));

  // remove ledge
  s = s.subtract(cube({size:[X-T,Y-T,Z], center: [true,true,false]}).translate([0,0,Z-2*T]));

  // s = s.subtract(text("Property of Alexey Greer\n\nMfg. by: KGR, Dec. 2022\n\n\nMADE IN CANADA").scale([0.2,0.2,0.2]).rotateZ(0).rotateX(180).translate([-X/3,-Y/4,1]));

  return s;
}


function lid() {
  const LZ = Z-7;
  var s = cube({size:[X,Y,LZ], center: [true,true,false]});

  s = s.subtract(s.scale([1,2,1]).rotateX(50).translate([0,-Y/2,SX/2]));
  s = s.subtract(s.scale([1,2,1]).rotateX(-50).translate([0,Y/2,SX/2]));

  // empty inside
  s = s.subtract(s.scale([(X-T)/X,(Y-T)/Y,LZ/Z]));

  var d = X/4-SX/1.5-1;

  var s2 = s.scale([1,(Y+3)/Y,(Z+1)/Z]);
  var s3 = cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([D,0,0]);
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-D,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-X/2+SX/2+1,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([+X/2-SX/2-1,0,0]));

  s2 = s2.intersect(s3);

  s = s.union(s2);

  for ( var i = -1 ; i <= 1 ; i++ )
    for ( var j = -1 ; j <= 1 ; j+=2 )
    s = s.union(bolt().translate([j*X/2,i*Y/3,5]));

  for ( var i = 1 ; i <= 2 ; i++ )
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
      var d = [0,3,14];
    // outside bolts
    s = s.union(bolt().translate([(-X/2+SX/2+1)*j,k*(-Y/2-2+d[i]), i*Z/3]));
    // inside bolts
    s = s.union(bolt().translate([D*j,k*(-Y/2-2+d[i]), i*Z/3]));
  }

  // bolts above rings
  for ( var j = -1 ; j <= 1 ; j += 2 )
  for ( var k = -1 ; k <= 1 ; k += 2 ) {
    // s = s.union(bolt().translate([j*(X/3.5),k*(-Y/2-2), Z/8]));
  }

  return s;
}


function tray() {
  const TX = X-1-T, TY = Y-1-T, TZ = 2*T;

  var s = cube({size:[TX,TY,TZ], center: [true,true,false]});
  s = s.subtract(cube({size:[TX-3,TY-3,TZ-2], center: [true,true,false]}).translate([0,0,2]));

  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([TX/6,0,0]))
  s = s.union(cube({size:[1.5,TY,TZ], center: [true,true,false]}).translate([-TX/6,0,0]))

  return s;
}


function ring() {
    var r1 = torus({ri: 3, ro: 20}).translate([0,-20,6]);
    var r2 = torus({ri: 4, ro: 20}).translate([0,-20,6]);

    var s = cylinder({r1:25, r2:15, h:12});

    s = s.subtract(r2);

    for ( var i = 0 ;i <= 70 ; i += 4 )
    s = s.subtract(r1.translate([0,5,-6]).rotateX(-i).translate([0,-5,6]))

    s = s.union(r1);

    s = s.rotateX(90).scale(0.4);
    return s.setColor([0.56,0.56,0.56]);
}


function bolt() {
  return sphere({r:2,fn:10}).scale([1,1,1]).setColor([0.8,0.8,0]);
}

function foot() {
  var s = cube({size:[30,10,7],center:[true,true,false]})

  s = s.subtract(s.rotateY(-45).translate([18,0,0]));
  s = s.rotateZ(180);
  s = s.translate([-15,5,0]);
  return s;
}

function main() {

  var r = ring();
  var s = base();
  var t = tray();
  var f = foot();
  var l = lid();

  t = t.translate([0,0,25]);
  l = l.translate([0,0,40]);

  s = s.union(t.translate([0,0,Z-2*T]));

  s = s.union(l.translate([0,0,Z+1]));

  s = s.union(r.translate([X/4+5.5,-Y/2,Z/2+8]));
  s = s.union(r.translate([-(X/4+5.5),-Y/2,Z/2+8]));

  s = s.translate([0,0,7]);

  s = s.union(f.translate([X/2,Y/2-10,0]))
  s = s.union(f.translate([X/2,-Y/2,0]))
  f = f.rotateZ(180);
  s = s.union(f.translate([-X/2,Y/2,0]))
  s = s.union(f.translate([-X/2,-Y/2+10,0]))

  return s;
}
