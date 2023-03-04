
function cs(r, p, e, floor) {
  e = e || 1;
  var c = cylinder({fn:6,r: r*p, h:2, center:[1,1,0]}).scale([e,e,1]);
  var d = r*(1-p);
  var s = union([
      c.translate([d,d,0]),
      c.translate([d,-d,0]),
      c.translate([-d,d,0]),
      c.translate([-d,-d,0])
      ]);
    if ( floor ) {
      s = s.union(cube({size:[0.5,0.5,2], center:[1,1,0]}).translate([d/2.4,r,0]))
      s = s.union(cube({size:[0.5,0.5,2], center:[1,1,0]}).translate([-d/2.4,r,0]))
          s = s.union(cube({size:[2*d,2*r,2], center:[1,1,0]}));
          s = s.union(cube({size:[2*r,2*d,2], center:[1,1,0]}));
    }
      return s;
}

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s = [];

  for ( var i = 0 ; i <= 20 ; i += 1 ) {
    var t = cs(
        interp(62/2, 62/2, i/40),
        interp(0.1, 0.3, i/20),
        interp(1.6, 1, i/20),
        i > 1.5
        ).translate([0,0,i*1.5]);
    s.push(t);
  }

/*
  for ( var i = 0 ; i <= 18 ; i += 1 ) {
    var t = cs(
      interp(62/2, 4/2, i/40),
      interp(0.3, 1, i/19),
      1,
      true
      ).scale([1,1,1.2]).translate([0, 0, 5+ Math.pow((1+i)/20, 0.1)*35]);
    s.push(t.setColor([0.5,0.5,0.5]));
  }
  */


  s = union(s);

  s = s.subtract(cube({size:[54,52,500],center:[1,1,0]}).translate([0,0,5]));

  s = s.scale([1.4,1,1]).scale([2,2,2]);

  return s;
}
