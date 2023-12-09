const FN = 140;
var MSG = "For \      2023";

function memoize(f) {
  var val;

  return function() {
    if ( ! val ) val = f.call(this);
    return val;
  };
}

function text(t, opt_scale) {
 var scale = opt_scale || 0.8;
 var o     = [];
 var l     = vector_text(0, 0, t);

 l.forEach(function (s) {
   o.push(rectangular_extrude(s, {w: scale*4, h: scale*1/0.2}));
 });

 return union(o);
}


const star = memoize(function () {
 var s = sphere({r:30, fn:FN})
 s = s.scale([1,1,0.3]);

 s = s.union(cylinder({r1:31,r2:30,h:10, fn:FN}).translate([0,0,-10]))
  for ( var i = 0  ; i < 5 ; i++ ) {
    s = s.subtract(cylinder({r:28,h:200,fn:200}).rotateY(-10).translate([0,0,-80]).scale([1,1,1]).translate([63,0,0]).rotateZ(360/5*i))
  }
  return s;
});

function lid() {
    var s = star();
    s = s.intersect(cube({size:[100,100,100], center:[1,1,0]}))
    s = s.subtract(s.scale([0.94,0.94,0.93]))
    s = s.rotateZ(36/2+180);
    return s;
}

function base() {
    var s = star();
    s = s.subtract(cube({size:[100,100,100], center:[1,1,0]}))
    s = s.subtract(s.scale([0.94,0.94,0.93]));
    s = s.rotateZ(36/2+180);
//    s = s.subtract(text(MSG).scale([0.05,0.06,1]).translate([-20,11,-9.5]));
    s = s.subtract(text(MSG).rotateY(180).scale([0.13,0.14,1]).translate([19,10,-9.6]));

    return s;
}

const lip = memoize(function() {
    var s = lid();
    s = s.intersect(cube({size:[100,100,2], center:[1,1,0]}))
    s = s.intersect(s.scale(0.98,0.98,1))
 return s;
});

function main() {
   // return base();
//    return lid().subtract(lip());
//var s =lid().subtract(lip());
 var s = base().union(lip().intersect(lip().scale([0.99,0.99,0.8])));
    s = s.scale([2*1.2,2*1.2,2*1.2])
    return s;
}
