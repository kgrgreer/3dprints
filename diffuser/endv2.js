const R = 6.45;
const H = 1.3;
const CH = 0.5;

function clip() {
    return cube({size:[0.4,1,0.4]}).translate([0,-1,0]).rotateY(-20).translate([-R,CH,CH]);
}

function ring(d, n, r) {
    for ( var i = 0 ; i < n ; i ++ ) {
        var c = cylinder({r:1, h: 10});
        c = c.translate([r, 0, 0]);
        c = c.rotateZ(360/n*i);

        d = d.subtract(c);
    }
    return d;
}

function posts(d, n, r) {
    for ( var i = 0 ; i < n ; i ++ ) {
        var c = cylinder({r:0.8, h: 4});
        c = c.union(sphere({r:0.8}).translate([0,0,4]));

        c = c.translate([r, 0, 0]);
        c = c.rotateZ(360/n*i);

        d = d.union(c);
    }
    return d;
}

function main() {
  var d = cylinder({r: R, h: H});

  d = d.subtract(sphere({r:R*3}).scale([1.2,1.2,1]).translate([0,0,R*3+0.55]));
  d = d.union(clip());
  d = d.union(clip().rotateZ(180));
  d = d.union(clip().rotateZ(-90));
  d = d.union(clip().rotateZ(90));

  d = ring(d, 1, 0);
  d = ring(d, 5, 2.5);
  d = d.rotateZ(360/10);
  d = posts(d, 5, 7.5/2-0.3);
  d = d.rotateZ(360/20);
  d = ring(d, 10, 5);


  return d.scale(5.03);
}
