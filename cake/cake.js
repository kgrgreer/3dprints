function cake(i) {
    var s = cube({size: [10,10,3], center:[true,true,false]});
    if ( ! i ) return s;
    var subCake = cake(i-1).scale([0.4,0.4,1]).rotateZ(45).translate([4,4,0]);
    s = s.union(subCake);
    s = s.union(subCake.rotateZ(90));
    s = s.union(subCake.rotateZ(-90));
    s = s.union(subCake.rotateZ(180));
    s = s.union(cake(i-1).scale([0.6,0.6,0.65]).translate([0,0,3]));
    return s;
}

function main() {
  return cake(3).setColor(0.8,0.8,0.8);
}
