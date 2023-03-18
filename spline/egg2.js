function egg(r, d) {
  var s = sphere({r: r});
  return r > 12 ? s.union(egg(r-d, d+1/20).translate([0,0,1])) : s;
}

function main() {
  return egg(20, 0).translate([0,0,20]);
}
