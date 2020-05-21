const FN = 18;

function f(t) {
  return cube({size:[1+t,1,1], round: true}).translate([3*Math.sqrt(t),4*t*t,2*t*t*t*t*t]);
}

function merge(f, c) {
  var a = [];
  for ( var i = 0 ; i < c ; i++ ) a.push(f(i/(c-1)));
  return union.apply(null, a);
}

function main() {
  var arm = merge(f, 50).translate([-0.5, 0,0]);
  return union(arm, arm.scale([-1,1,1]))
}
