const X = 150;
const Y = 90;
const Z = 40;

const T = 5; // Wall Thickness

const SX = 20; // Strap Width
const SY = 1.5;

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
  var d = X/4-SX/1.5-1;
  s = s.union(t.translate([-d,0,0]));
  s = s.union(t.translate([d,0,0]));

  // remove insides
  s = s.subtract(cube({size:[X-2*T,Y-T,Z], center: [true,true,false]}).translate([0,0,T]));

  // remove ledge
  s = s.subtract(cube({size:[X-T,Y-T,Z], center: [true,true,false]}).translate([0,0,Z-2*T]));

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
  var s3 = cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([d,0,0]);
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-d,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([-X/2+SX/2+1,0,0]));
  s3 = s3.union(cube({size:[SX,2*Y,Z], center: [true,true,false]}).translate([+X/2-SX/2-1,0,0]));

  s2 = s2.intersect(s3);

  s = s.union(s2);
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

function main() {


  var s = base();
  var t = tray();

  s = s.union(t.translate([0,0,Z-2*T]));

  s = s.union(lid().translate([0,0,Z+1]));

  return s;
}
