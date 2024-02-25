const H = 10;

function hook(y, w) {
    var s = cube({size:[w,10,H], center:[1,0,0]});

  var ring = cylinder({h: H, r: 20}).subtract(cylinder({h: H, r: 10}));
  ring = ring.subtract(cube({size:[40,20,H], center:[1,0,0]}))
  ring = ring.translate([0,14,0]);

  var half = cube({size:[100,100,100], center:[0,1,0]});
  var right = ring.intersect(half).translate([w/2,6,0]);
  var left = ring.subtract(half).translate([-w/2,6,0])

  s = s.union(right).union(left);

  s = s.union(cube({size:[10,5,H]}).translate([w/2+10,20,0]));
  s = s.union(cube({size:[10,5,H]}).translate([-w/2-20,20,0]));

  s = s.union(cube({size:[25,25,H]}).rotateZ(45).translate([0,-12.5,0]));

  s = s.translate(([0,-y,0]));


  if ( y ) s = s.union(cube({size:[10, -y, H], center:[1,0,0]}));

  return s;
}

function main() {
  var s = cylinder({h: H, r: 55/2});
 s = s.subtract(cylinder({h: H, r: 37/2}));

 s = s.subtract(cube({size:[50,50,50]}).translate([0,-50,0]));

 var bottom = s.intersect(cube({size:[100,50,50], center:[1,0,0]}).translate([0,-50,0]));

 var top = s.subtract(bottom);
 bottom = bottom.translate([0,-20,0]);

 s = top.union(bottom).union(cube({size:[9,20,H]}).translate([-55/2,-20,0]))

 var stem =  cube({size:[9,30,H]});

 var c = cylinder({r:9/2, h: H}).translate([9-9/2,30-9/2,0])
 stem = stem.subtract(cube({size:[9/2,9/2,3*H]}).translate([9/2,30-9/2,0]));

stem = stem.union(c);

 stem = stem.translate([0,-68.5,0]);
 s = s.union(stem);

 var hanger = hook(5, 60).union(hook(105/2, 40)).union(hook(100, 20));

 s = s.translate([-5,68,0]).union(hanger).rotateZ(90);

 s = s.intersect(cube({size:[200,200,2*H], center:[1,1,0]}));
 return s;
}
