const e  = 0.5
const RO = 3;
const RI = 2;
const H1 = 5.2;
const H2 = 2;
const H3 = 1.5;
const FN = 30;
const RS = 4.5+e;

// 7.5 exposed band

function main() {
  var s = cylinder({r:RI, h:H1+H2+H3, fn: FN})

  s = s.union(cylinder({r:RO, h:H1, fn: FN}) )
  s = s.union(cylinder({r:RO, h:H3, fn: FN}).translate([0,0,H1+H2]) )

  s = s.union(
      cube({size:[RS,RS,3]}).translate([0,0,0.8]).intersect(
      cylinder({r:RS, h:H1+H2+H3, fn: FN})
      ));

  s = s.union(s.rotateZ(90)).rotateZ(90);
  // return s;

  var b = cube({size:[11,12,12], radius:0.5, center:[true,true,false]});

  b = b.subtract(cylinder({r:1,h:100, fn: FN}).rotateY(90).translate([-50,4,10]))
  b = b.subtract(cylinder({r:1,h:100, fn: FN}).rotateY(90).translate([-50,-4,10]))

  b = b.subtract(s);

  var arm = cube({size:[11,6,50], radius:1});
  arm = arm.subtract(cube({size:[6,1,40]}).translate([2.5,2.5,10]));
  b = b.union(arm.rotateX(22).translate([-5.5,-3,8.5]))
  // return b;

  b = b.subtract(cylinder({r:1,h:100, fn: FN}).rotateY(90).translate([-50,4,10]))
  b = b.subtract(cylinder({r:1,h:100, fn: FN}).rotateY(90).translate([-50,-4,10]))


  b = b.subtract(cube({size:[100,100,100]}).translate([0,-50,0]))
//  return b;
  return b.rotateY(-90);
}
