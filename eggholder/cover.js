const FN = 12;

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function egg(s, h) {
    var egg  = sphere({r:21/2+0.25, fn:FN}).scale([1,1,26/21]);
    var egg2 = egg.subtract(cube({size:[100,100,100],center:[1,1,0]}));
    egg2 = egg2.scale([1.2,1.2,1.2]);
    egg2 = egg2.translate([0,0,h]);

    s = s.union(egg2);
    s = s.subtract(egg.translate([0,0,h]));

    return s;
}

function shell() {
    const H = 80;
  var c= cylinder({r:20, h: H, fn: 120});

  c = c.subtract(cylinder({r:20-0.5, h: H-4, fn: 120}));

  c = c.subtract(torus({innerRadius: 20, outerRadius: 120}).rotateX(90).scale([2,5,1]).translate([0,0,H+2]))
  return c;
}
function main() {
    return shell().rotateX(180);
  var s;
  var pr = 20;
  var D  = 0.005;
  var r = pr;
  for ( var i = 0 ; i < 0.275 ; i+=D, D = interp(0.01, 0.02, i) ) {
      r = r * interp(0.9, 1.4, i*1.136);
      var c = cylinder({r1:pr, r2:r, h:D*50+0.01, fn: FN});

      c = c.translate([0,0,i*50]);
      s = s ? s.union(c) : c;
      pr = r;
  }

s = s.scale([1,1,1.5])
  s = egg(s, 32);
  var c = sphere({r:3, fn: FN}).scale([2,1,1.7]).translate([10,0,25])
  for ( var i = 0 ; i < 5 ; i++ ) {
     s = s.subtract(c.rotateZ(i*360/5))
  }

  s = s.subtract(sphere({r:10}))

  s = s.union(shell().translate([50,0,0]));
 return s;
}
