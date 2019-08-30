/*
 * Hair dryer diffuers end only.
 * Aug 30, 2019
 **/

function main() {
    var t = torus({ri:0.5,ro:7.3}).translate([0,0,3.4]).scale([1,1,3.5]);
    var d = dome();
    d = d.subtract(holes(6,1.2));
    d = d.subtract(holes(10,2.2));
    d = d.subtract(holes(12,3.2));
    d = d.subtract(holes(14,4.2));
    d = d.subtract(holes(16,5.2));
    d = d.subtract(holes(10*2,6.8,0,0.92));
    d = d.union(holes(8,5.2,Math.PI/16,0.44));
    d = d.union(holes(6,3.2,Math.PI/12,0.44));
    d = d.intersect(sphere({r:14}));
    return d.union(t).scale(-65/15.5);
}

function peg(r) {
  return cylinder({r:r, h:14}).union(sphere({r:r}));
}

function holes(n, r, p, R) {
  p = p || 0;
  R = R || 0.4;
  var s = sphere({r:0});
  var pg = peg(R).translate([0,0,9]);
  for ( var i = 0 ; i < n ; i++ ) {
    var c = pg;
    var a = Math.PI*i/n*2 + p;
    c = c.translate([r*Math.cos(a), r*Math.sin(a), 0]);
    s = s.union(c);
  }
  return s;
}

function dome() {
    var s=sphere({r:14});
    return s.intersect(cylinder({r:7,h:100})).subtract(s.translate([0,0,-0.8]));

}
