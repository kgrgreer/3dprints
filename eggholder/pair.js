const FN = 100;

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function egg(s, h, w) {
    var egg  = sphere({r:21/2+0.25, fn:FN}).scale([1,1,26/21]);
    var egg2 = egg.subtract(cube({size:[100,100,100],center:[1,1,0]}));
    egg2 = egg2.scale([1.2,1.2,1.2]);
    egg2 = egg2.translate([w,0,h]);

    s = s.union(egg2);

    s = s.subtract(egg.translate([w,0,h]));

  var c = sphere({r:3, fn: FN}).scale([2,0.8,1.5]).translate([10,0,h-7])
  for ( var i = 0 ; i < 4 ; i++ ) {
      if ( w > 0 && i == 2 || w < 0 && i == 0 ) continue
     s = s.subtract(c.rotateZ(i*360/4).translate([w,0,0]))
  }

    return s;
}

function main() {
  var s;
  var pr = 20;
  var D  = 0.005;
  var r = pr;
  for ( var i = 0 ; i < 0.42 ; i+=D, D = interp(0.01, 0.02, i) ) {
      r = r * interp(0.93, 1.08, i);
      var c = cylinder({r1:pr, r2:r, h:D*50+0.01, fn: FN});

      c = c.translate([0,0,i*50]);
      s = s ? s.union(c) : c;
      pr = r;
  }

s = s.scale([1,1,2])

const W = 24;
var l = s.intersect(cube({size:[-100,100,100],center:[0,1,0]})).translate([-W/2,0,0]);
var r = s.intersect(cube({size:[100,100,100],center:[0,1,0]})).translate([W/2,0,0]);
s = s.intersect(cube({size:[1,100,100],center:[1,1,0]})).scale([W,1,1]);

s = s.union(l);
s = s.union(r);

s = egg(s, 43, W/2);

s = egg(s, 43, -W/2);

  s = s.subtract(sphere({r:11}).scale([2.2,1,1.6]))
 return s;
}
