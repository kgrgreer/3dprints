const D = 139.5;
const T = 1 + 2;
const INDEX_R = 5;
const INDEX_H = 6;
const FN = 20;
const B = 21; // border, measures 16

function shape(x,y,z) {
    x = x - y;
    var s = cube({size:[x,y,z]});
    var c = cylinder({r:y/2,fn: FN, h:z}).translate([0,y/2,0]);
    s = s.union(c);
    s = s.union(c.translate([x,0,0]));
    s = s.setColor([1,1,1]);
    return s.translate([-x/2,-y/2,0]);
}

function shape2(x,y,z) {
    var s = shape(x,y,z);
    s = s.rotateZ(90);
    s = s.translate([0,-y/2,0]);
    s = s.union(s.rotateZ(60).setColor([1,0,0]));
    s = s.rotateZ(-30)
    s = s.union(shape(x,y,z).translate([0,-8.65,0]).setColor([0,0,1]));
    s = s.rotateZ(30).translate([-x/4,y/2,0]);
    return s.setColor([1,1,1]).rotateZ(180)
}

function addIndex(dial, i, opt_degrees) {
  if ( opt_degrees ) i = i.rotateZ(opt_degrees);
  return dial.subtract(i);
 return dial.union(i);
}

function i1() {
  return cylinder({r: INDEX_R, h:INDEX_H, fn: FN});
}

function i2() {
  return shape(4*INDEX_R, 2*INDEX_R, INDEX_H);
}

function i3() {
  return shape2(4*INDEX_R, 2*INDEX_R, INDEX_H);
}

function makeIndex(s) {
    return s.scale([1.2,1.2,0.5]).union(s.scale([0.98,0.98,1.2]));
}

function main() {
   // return makeIndex(i3());
  var dial = cylinder({r: D/2, h:T, fn: FN});
  dial = dial.setColor([0,0,0]);

  dial = dial.subtract(cylinder({r: 10/2, h:T, fn: FN}));

  dial = dial.subtract(cylinder({r: 3/2, h:T, fn: FN}).translate([0,D/2-1.5,0]));
  dial = dial.subtract(cylinder({r: 3/2, h:T, fn: FN}).translate([0,D/2-1.5,0]).rotateZ(120));
  dial = dial.subtract(cylinder({r: 3/2, h:T, fn: FN}).translate([0,D/2-1.5,0]).rotateZ(-120));

  var index = i1();
  index = index.setColor([1,1,1]);
  index = index.translate([0,D/2-B,0])
  for ( var i = 0 ; i < 12 ; i++ )
    dial = addIndex(dial, index, i/12*360);
  var index2 = i2().translate([D/2-INDEX_R*3-B+10,0,0]);
  dial = addIndex(dial, index2);
  dial = addIndex(dial, index2, 180);
  dial = addIndex(dial, index2, -90);
  var index3 = i3().translate([D/2-INDEX_R*3-B+10,0,0]);
  dial = addIndex(dial, index3, 90);

  dial = dial.subtract(cylinder({r:25,h:100,fn:FN}).translate([0,0,1]))
  return dial;

}
