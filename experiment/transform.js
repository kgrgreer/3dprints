
function main () {
    var s = sphere();
  s.polygons.forEach(p => {
     // p.plane.normal._z *= 12;
    p.vertices.forEach(v => {
      var pos = v.pos;
      pos._z = Math.pow(pos._z,20);
    })
  });
  return s;
}
