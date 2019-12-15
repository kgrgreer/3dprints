const NAME = "Ivan Urosev", W = 90;
const SCALE = 1.8;
const HEIGHT = 2;

function main1() {
return text(NAME,0.65).scale(0.4*SCALE).scale([1,1,0.5]);
}


function leaf() {
  // data from Vesna's program
  var poly = polygon([
      [0,400],
      [78,275],
      [150,302],
      [121,89],
      [216,171],
      [248,126],
      [360,137],
      [335,18],
      [372,-13],
      [191,-175],
      [203,-244],
      [28,-232],
//      [18,-406],
//      [0,-406],

//      [-18,-406],
      [-28,-232],
      [-203,-244],
      [-191,-175],
      [-372,-13],
      [-335,18],
      [-360,137],
      [-248,126],
      [-216,171],
      [-121,89],
      [-150,302],
      [-78,275]
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,0,0]).scale([0.011,0.011,1]).translate([-82.5,3.2,10]).rotateZ(90).rotateY(45);
}

function main() {
  var m = base();

  m = m.subtract(leaf());
  m = m.subtract(name());
  m = m.subtract(label());

  return m.scale(SCALE).rotateZ(90);
}

function base() {
  var c = cylinder({h:W, r:10}).rotateX(90).translate([0,0,6]);
  var face = cube({size:[20,W,20]}).rotateY(50).translate([0,-W,16]);
 // var back = cube({size:[20,W,20]}).rotateY(-65).translate([-9,-W,0]);
  var back = cylinder({h:W, r:12}).rotateX(90).translate([-13,0,13]);
  c = c.subtract(face);
  c = c.subtract(back);
  return c.intersect(cube({size:[1000,1000,1000]}).translate([-500,-500,0]));
}

function label() {
    return text("Mfg. by: Kevin Greer, Dec. 2019").rotateZ(-90).rotateX(-180).translate([38,-9.8*W,3.6]).scale([0.1,0.1,0.2]);
}

function name() {
  return text(NAME).translate([33,-28.8,-3]).rotateZ(90).rotateY(50).scale(0.38).translate([0,-W+3,16]).setColor(1,1,1);
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
