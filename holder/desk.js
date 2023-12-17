function fivePens() {
    var s = cylinder({r:7.5, h:20, fn:140})
    s = s.subtract(cylinder({r:6, h:20}).translate([0,0,4]))
    var leg = cube({size:[17,15,10], center:[1,0,0]}).translate([0,0,0]);
    s = union(
      s,
      s.translate([-16,0,0]),
      s.translate([16,0,0]),
      s.translate([-32,0,0]),
      s.translate([32,0,0]),
    );
    s = s.union(cube({size:[64,15,20], center:[1,1,0]}))
    s = s.subtract(cylinder({r:6, h:20}).translate([0,0,4]))
    s = s.subtract(cylinder({r:6, h:20}).translate([-16,0,4]))
    s = s.subtract(cylinder({r:6, h:20}).translate([16,0,4]))
    s = s.subtract(cylinder({r:6, h:20}).translate([-32,0,4]))
    s = s.subtract(cylinder({r:6, h:20}).translate([32,0,4]))
    s = s.intersect(cube({size:[1000,34,16], center:[1,1,0]}))
    return s;

}

function templateHolder() {
  var s = cube({size:[132, 8, 50], center: [1,1,0], radius:1});

  s = s.subtract(cube({size:[128,3,50], center: [1,1,0]}).translate([0,0,10]))

  return s;
}

function walletHolder() {
    const X = 112, Y = 64, T = 4;
  var s = cube({size:[X+T, Y+T, 10], center: [1,1,0], radius:1});
  s = s.subtract(cube({size:[X, Y, 10], center: [1,1,0], radius:1}).translate([0,0,3]))
  return s;
}

function tube(r, h) {
    var s = cylinder({r:r,h:h})

    s = s.subtract(s.scale([0.9,0.9,0.9]).translate([0,0,3]))

    return s;
}

function gelHolder() {
    return tube(12,20);
}

function flashlightHolder() {
    return tube(10,25);
}

function main() {
    var s = templateHolder();

    s = s.translate([0,11,0]).union(fivePens());
    s = s.translate([0,22,0]).union(walletHolder().translate([-10,0,0]));
    s = s.union(gelHolder().translate([21,3,0]));
    s = s.union(flashlightHolder().translate([-40,0]))
    return s;
}
