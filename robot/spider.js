
function ant() {
    var a = cylinder({h:15})
    a = a.union(sphere({r:1.5}).translate([0,0,15]));
    a = a.translate([4,0,42])
    return a;
}

function head() {
  var h = sphere({fn:12,r:13}).setColor([0.8,0.8,0.8])
  var eye = sphere({r:3}).setColor([1,0,0]).translate([0,9.5,7])
  h = h.union(eye)
  h = h.translate([0,0,33])
  return h;
}

function arm() {
  var u = cylinder({r:2,h:15})
  var e = sphere({r:3}).translate([0,0,15])
  var l = cylinder({r:1.5,h:25});
  var h = cube({size:[5,5,5],center:true})
  l = l.union(h.translate([0,0,25]));
  l = l.rotateY(45).translate([0,0,15])
  var arm = union(u,e,l,h)
  return arm;
}

function leg() {
  var u = cylinder({r:2,h:15})
  var e = sphere({r:3}).translate([0,0,15])
  var l = cylinder({r:1.5,h:25});
  var h = cube({size:[5,5,5],center:true})
  l = l.union(h.translate([0,0,25]));
  l = l.rotateY(45).translate([0,0,15])
  var leg = union(u,e,l,h)
  return leg;
}


function bb8() {
    var b = sphere({fn:10,r:20}).translate([0,0,20]).setColor([0.8,0.8,0.8])
    var m = head();
    var a = ant().setColor([0.8,0.8,0.8])
    var r = arm();
    r = r.rotateY(270).rotateX(-45).translate([-20,0,25])
    var l = leg();
    l = l.rotateY(200).rotateX(-45).translate([-20,0,25])
    var l2 = leg();
    l2 = l2.rotateY(-30).rotateX(-45).translate([-20,0,25])
    return union([
      b,
      m,
      a,
      r,
      l,
      l2,
      mirror([1,0,0], l),
      mirror([1,0,0], l2),
      mirror([1,0,0], r)
    ])
}


function engine() {
    var j = sphere({fn:6,r:10}).setColor([0,0,0])
    var j1 = cylinder({h:12,r:1.5}).translate([5,-6.5,-11]).setColor([0,0,0])
    var j2 = cylinder({h:12,r:1.5}).translate([-5,-6.5,-11]).setColor([0,0,0])
    j = j.union(j1).union(j2)
    j = j.translate([0,-15,25]);
    return j
}

function main() {

    var b = bb8();

    b = b.union(engine());
    /*
    for ( var i = 0 ; i < 4 ; i = i+1 ) {
        b = b.translate([40,40,0]).union(bb8())
    }
    */

    return b;
}
