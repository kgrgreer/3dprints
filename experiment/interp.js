function interp(s1, e1, s2, e2) {
    return function(v) {
        if ( v < s1 || v > e1 ) return v;
        var p = (v - s1) / (e1 - s1);
        return s2 + p * (e2 - s2);
    }
}

function main () {
  var s = sphere({r:1});
  s.polygons.forEach(p => {
    p.vertices.forEach(v => {
      var pos = v.pos;
        pos._z = interp(0,1,0,5)(pos._z);
    })
  });
  return s;
}
