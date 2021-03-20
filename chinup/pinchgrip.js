const W = 110, H = 100, D = 40;
const CR = 5, CH = 100;

function hive(x,y,r, h) {
  var s = [];
  var c = cylinder({r: r, h: h, fn:6});

  for ( var i = -x ; i < x ; i++ ) {
      for ( var j = -y ; j < y ; j++ ) {
          s.push(c.translate([i*1.75*r*0.925, (j+i%2/2)*2*r*0.925,0]));
      }
  }

  return union.apply(null, s);
}

function main() {
    var hv = hive(6,7,6,H);
    hv = hv.intersect(cube({size:[D-0.3*8,W-0.3*8,H-0.3*6], round: true, radius: 2, center:[true,true,false]}));
    var s = cube({size:[D,W,H], round: true, radius: 2, center:[true,true,false]});
    var c = cylinder({r: CR-0.15, h: CH, fn:120});
    var b = cylinder({r: 8.5, h: 20, fn:6});

    s = s.subtract(hv);
    s = s.subtract(c);
    s = s.union(cylinder({r: 11, h: 100, fn:6}));
    s = s.subtract(c);
    s = s.union(cylinder({r: 12, h: 12, fn:120}).translate([0,0,H-12]));
    s = s.subtract(cylinder({r: 10, h: 20, fn:120}).translate([0,0,H-10]));
    s = s.subtract(b.translate([0,0,H-20]));

    s = s.rotateX(180);
    return s;
}
