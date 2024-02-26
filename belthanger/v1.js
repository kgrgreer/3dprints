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

  s = s.union(cylinder({r:10/2,h:H}).translate([w/2+15,20+9/2,0]));
  s = s.union(cylinder({r:10/2,h:H}).translate([-w/2-15,20+9/2,0]));


  s = s.translate(([0,-y,0]));


  s = s.union(cube({size:[10, 24, H], center:[1,0,0]}).translate([0,-y+Math.min(18,y+5.5),0]));

s = s.union(cylinder({r:14,h:H}).translate([0,6-y,0]));
s = s.subtract(cylinder({r:H*1.5/2,h:H}).translate([0,6-y,0]));
//s = s.union(cube({size:[20,20,H],center:[1,1,0]}).rotateZ(45).scale([1,1.8,1]).translate([0,5,0]));

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

 s = s.union(cylinder({r:9/2, h:H}).translate([23,0,0]));

 var hanger = hook(5, 60).union(hook(105/2, 40)).union(hook(100, 20));

 s = s.translate([-5,68,0]).union(hanger);

s = s.subtract(cube({size:[5,5,H*2]}).translate([0,25,0]));
s = s.union(cylinder({r:5, h: H}).translate([0,24.5,0]));
s = s.rotateZ(90);


 return s;
}
