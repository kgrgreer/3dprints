function dome(i) {
   // var s = cube({size:[10*Math.sqrt(1-i*i),1,1/4], center:1});
    var s = sphere({fn:80, r: 5*Math.sqrt(1-i*i)});
    s = s.translate([0,0,i*10]);
    if ( i > 0.1 ) s = s.union(dome(i-0.1/4));
    return s;
}

function main() {
  return dome(0.9).translate([0,0,5]);
}
