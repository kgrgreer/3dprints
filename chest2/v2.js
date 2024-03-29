
function cs(r, p, e, floor, bottom) {
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
        if ( ! bottom ) {
          s = s.union(cube({size:[0.5,0.5,2], center:[1,1,0]}).translate([d/2.4,r,0]))
          s = s.union(cube({size:[0.5,0.5,2], center:[1,1,0]}).translate([-d/2.4,r,0]))
        }
      s = s.union(cube({size:[2*d,2*r,2], center:[1,1,0]}));
      s = s.union(cube({size:[2*r,2*d,2], center:[1,1,0]}));
    }
    if ( ! bottom ) {
      s = s.subtract(cs(r-1, p, 0, true, true));
    }
    return s;
}

function spline(v, pairs) {
    if ( v < pairs[0][0] ) return pairs[0][1];

  for ( var i = 0 ; i < pairs.length - 1 ; i++ ) {
      if ( v >= pairs[i][0] && v <= pairs[i+1][0] )
        return interp(pairs[i][1], pairs[i+1][1], (v-pairs[i][0])/(pairs[i+1][0]-pairs[i][0]));
  }
  return pairs[pairs.length-1][1];
}

function interp(s, e, p) {
  return s*(1-p)+e*p;
}

function main() {
  var s = [];

  for ( var i = 0 ; i <= 20 ; i += interp(0.1,1.25,i/20)) {
    var t = cs(
        spline(i/20, [[0,60/2],[0.2,58/2],[0.5,60/2],[0.8,62/2],[1,64/2]]),
//        interp(62/2, 62/2, i/40),
        interp(0.1, 0.5, i/20),
  //      spline(i/20, [[0,4], [0.3,2], [1, 1]]),
         interp(1.6, 1, Math.pow(i/20,1)),
        i > 1,
        i < 2
        ).translate([0,0,i*1.5]);
    s.push(t);
  }



  for ( var i = 0 ; i <= 18 ; i += interp(i/18,0.2,0.2) ) {
    var t = cs(
      interp(64/2, 0, i/35),
      interp(0.5, 1, i/19),
      1,
      true,
      i >= 17.5
      ).scale([1,1,1.2]).translate([0, 0,34 + Math.pow((i)/18, 0.5)*20]);

    s.push(t.setColor([0.5,0.5,0.5]));
  }
  var r = cs(64/2,0.5,1,true,false).scale([1,1,3]).translate([0,0,32]).setColor([0.5,0.5,0.5]);
  s.push(r);

  s = union(s);

//  s = s.subtract(cube({size:[54,52,500],center:[1,1,0]}).translate([0,0,5]));

  s = s.scale([1.4,1,1]).scale([2,2,2]);

  return s;
}
