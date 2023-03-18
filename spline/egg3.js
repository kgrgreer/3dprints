function egg(i) {
  if ( i < 0.1 ) return sphere();
  return sphere().union(egg(i*0.98).translate([0,0,i*i*i/10]).scale(0.98));
}

function main() {
  return egg(1).translate([0,0,1]);
}
