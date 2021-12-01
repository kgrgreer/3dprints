function interp(d1, d2, r1, r2, v) {
    return r1 + (r2-r1) * (v-d1)/(d2-d1);
}

const H = 10;
const W = 17;
const R = 35;

function createText(m) {
  if ( typeof m === 'string' ) m = { text: m };

  return Object.assign({
    text: 'A',
    w: 4,
    h: 7,          // depth
    scale: 0.14,
    justify: 'L',  // justification: R, C or defaults to Left
    a: 0,          // angle of rotation
    color: [1,1,1],
    toSolid: function() {
      var o = [];
      var l = vector_text(0, 0, this.text);

      l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h: this.h})));

      var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

      if ( this.a ) txt = txt.rotateZ(this.a);

      var bounds = txt.getBounds();
      if ( this.justify === 'R' ) {
        txt = txt.translate([-bounds[1].x, -bounds[0].y*0, -2.5]);
      } else if ( this.justify === 'C' ) {
        txt = txt.translate([-bounds[1].x/2, -bounds[0].y*0, -2.5]);
      } else {
        txt = txt.translate([-bounds[0].x, -bounds[0].y*0, -2.5]);
      }

      return txt;
    }
  }, m);
}


function stem() {
        var sw = 6.2; /*make smaller to reduce friction Was: 5.4+1.5*/
        var sh = 4.4;
        const W = 4.3; // add 0.2 when testing to make easier to put on and remove
        const H = 1.4;
        var D = 8;
        var stem = cube({radius:0.9, roundradius: 0.9,size:[sh,sw, D+4]}).intersect(cube({size:[sh,sw, D]})).translate([-sh/2,-sw/2,-2]);
        stem = stem.intersect(cube({size:[20,20,20], center: [true,true,false]}))
        var hollow = cube({size:[W,H,4]}).translate([-W/2,-H/2,0]).union(cube({size:[H,W,4]}).translate([-H/2,-W/2,0]));
        return stem.subtract(hollow);
}

function cap(n, e, s, w, config) {
const W2 = W + 2;
    var c = cube({fn:50,size:[W,W2,H], center: [true,true,false], xxxradius: 0.5});
    var o = c.scale([1,1,10]);

/*
    c = c.intersect(o.rotateZ(45).rotateX(20).rotateZ(-45));
    c = c.intersect(o.rotateZ(-45).rotateX(20).rotateZ(45));
    c = c.intersect(o.rotateZ(45+90).rotateX(20).rotateZ(-45-90));
    c = c.intersect(o.rotateZ(-45-90).rotateX(20).rotateZ(45+90));

    c = c.intersect(o.translate([-W/2, -W/2, 0]).rotateX(n).rotateY(-e).translate([W/2, W/2,0]));
    c = c.intersect(o.translate([-W/2,  W/2, 0]).rotateX(n).rotateY(w).translate([W/2, -W/2,0]));
    c = c.intersect(o.translate([ W/2, -W/2, 0]).rotateX(-s).rotateY(-e).translate([-W/2, W/2,0]));
    c = c.intersect(o.translate([ W/2,  W/2, 0]).rotateX(-s).rotateY(w).translate([-W/2, -W/2,0]));
*/

    c = c.intersect(o.translate([0,-W2/2,0]).rotateX(n).translate([0,W2/2,0]));
    c = c.intersect(o.translate([-W/2,0,0]).rotateY(-e).translate([W/2,0,0]));
    c = c.intersect(o.translate([0,W2/2,0]).rotateX(-s).translate([0,-W2/2,0]));
    c = c.intersect(o.translate([W/2,0,0]).rotateY(w).translate([-W/2,0,0]));


    c = c.intersect(cube({size:[20,20,20], center: [true, true, false] }))

//    c = c.subtract(c.scale([0.97,0.97,.5]));

   // c = c.subtract(cube({size:[20,20,5], center: [true, true, false] }))

    var cy = cylinder({r:R, h:100, center: true, fn:360}).rotateY(90).translate([0,0,R+H-2]);
    c = c.subtract(cy);

/*    c = c.expand(0.4,4)
    c = c.intersect(cube({size:[20,20,20], center: [true, true, false] }))
*/
//    c = c.subtract(c.translate([0,0,-2]));
    c = c.subtract(c.scale([0.95,0.95,0.77]));
    c = c.union(stem());
    c = c.subtract(cy);
    c = c.union(cube({size:[3,16,0.5],center:[true,true,false]}).translate([0,0,6.3]))

    if ( config.cLabel ) {
        config.cLabel.justify = 'C';
        config.cLabel.scale = 0.2;
        config.cLabel.w = 5;
      var t = createText(config.cLabel).toSolid().rotateZ(-90).translate([1.5,5,H]);
      t = t.subtract(c);
      t = t.translate([0,0,-1]).setColor([1,1,1]);
      c = c.subtract(t);
    }
    return c;
}

function main () {
  //  return stem();
   // return cap(5,5,5,5);
    return union(
//      cap(4,12,4,12,{cLabel:{text: 'K'}}).translate([0,0,0]),
      cap(4,0,4,14,{cLabel:{text: 'Y'}}).translate([20,-20,0]),
      cap(4,4,4,10,{cLabel:{text: 'H'}}).translate([0,-20,0]),
      cap(4,10,4,0,{cLabel:{text: 'N'}}).translate([-20,-20,0])
    )
}
