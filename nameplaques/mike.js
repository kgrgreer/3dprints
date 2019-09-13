var NAME = "Mike Smith", W = 88.7, SCALE = 1.8;

function main1() {
  return text(NAME,0.65).scale(0.4*SCALE).scale([1,1,0.5]);
}

function main() {
  var m = base();

  m = m.subtract(name());
  m = m.subtract(label());

  return m.scale(SCALE).rotateZ(90);
}

function base() {
  var c    = cylinder({h:W, r:10}).rotateX(90).translate([0,0,6]);
  var face = cube({size:[20,W,20]}).rotateY(50).translate([0,-W,16]);
  var back = cube({size:[20,W,20]}).rotateY(-80).translate([-9,-W,0]);
  c = c.subtract(face);
  c = c.subtract(back);
  c = c.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));
  return c.setColor([1,1,1]);
}

function label() {
  return text("Mfr. by KGR, Sept. 2019\nProperty of nanopay\nAll Rights Reserved").rotateZ(-90).rotateX(-180).translate([20,-9.5*W,3.6]).scale([0.1,0.1,0.2]);
}

function name() {
  return text(NAME).translate([-1,-28.8,-3]).rotateZ(90).rotateY(50).scale(0.4).translate([0,-W+3,16]).setColor(0,0,1);
}

function text(t, opt_scale) {
  var scale = opt_scale || 1;
  var o     = [];
  var l     = vector_text(0, 0, t);

  l.forEach(function (s) {
    o.push(rectangular_extrude(s, {w: scale*4, h: scale*1/0.2}));
  });

  return union(o);
}
