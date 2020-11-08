// https://www.reddit.com/r/Watches/comments/9ywnfu/seiko_skx007_where_to_find_sinn_656_sword_type/
// https://thetruthaboutwatches.com/2020/02/sinn-556i-full-review/

const HEIGHT = 0.8;
const FN = 200;
const T = 0.1;

function hand() {
  var poly = polygon([
    [0,0],
    [0,2],
    [28,4],
    [42,0],
    [28,-4],
    [0,-2],
    [0, 0]
  ]);

  return linear_extrude({height: HEIGHT}, poly).setColor([1,0,0]).translate([3,0,0]);
}

function minute() {
  var s = hand();
  s = s.union(cylinder({r:8/2, h:1.5, fn: FN}));
  s = s.subtract(cylinder({r:5/2+T, h:1.5, fn: FN}));
  return s;
}

function hour() {
  var s = hand().scale([50/42,0.7,1]);
  s = s.union(cylinder({r:8/2, h:1.5, fn: FN}));
  s = s.subtract(cylinder({r:3/2+T, h:1.5, fn: FN}));
  return s;
}

function main() {
    return minute().union(hour().translate([0,10,0]))

}
