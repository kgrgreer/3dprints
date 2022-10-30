const FN = 140; // 140

// TODO:
// make base thicker
// make base id slightly larger
// make connector inner radius smaller

function tube(od, id, h) {
    return cylinder({fn: FN, r: od/2, h: h}).subtract(cylinder({fn: FN, r: id/2, h: h}));
}

function base() {
    const od = 38.5;
    const id = 32;
  var s = union(
    tube(od,id,50),
    tube(od+2,id,5)
  );

  s = s.subtract(cube({size:[100,100,100], center:[true,true,false]}).rotateX(45).translate([0,0,63.1]));
  return s;
}

function connector() {
  const id = 26
  var s = union(
    tube(35.4, id, 5.1714).translate([0,0,-3]),
    tube(31.5, id, 9),
    tube(30, id, 5).translate([0,0,9]),
    tube(31+0.4, id, 5.3).translate([0,0,9+5])
  ).translate([0,-2.5,0]).rotateX(45);
  return s;
}

function middle() {
    var s = sphere({fn: FN, r: 38/2}).subtract(cube({size:[100,100,100], center:[true,true,false]}).translate([0,0,5]).rotateX(45));

    s = s.subtract(sphere({fn: FN, r: 38/2-2}));
    return s.intersect(cylinder({fn: FN, r:35.5/2, h:200}).translate([0,0,-100]));
}

function main() {
  var s = union(
      base(),
      middle().translate([0,0,56]),
      connector().translate([0,0,60])
  );

  s = s.subtract(cylinder({fn: FN, r: 31/2, h:46}));
  //s = s.subtract(cylinder({fn: FN, r: 28/2, h:46}).translate([0,-2.5,-12]).rotateX(45).translate([0,0,60]));
 // s = s.subtract(cylinder({fn: FN, r: 28/2, h:80}).translate([0,0,-7.7]).rotateX(45).translate([0,0,60]));
  //s = s.intersect(cylinder({fn: FN, r: 38/2, h:100}).translate([0,0,100]));

  return s.setColor([.7,.7,.7]);
}
