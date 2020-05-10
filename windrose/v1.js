function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 4,
      scale: 0.13,
      justify: 'L',
      a: 0,
      color: [0,0,0],
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:7.5})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, 0]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, 0/*-bounds[0].y*/, 0]);
        } else {
          txt = txt.translate([-bounds[0].x, 0/*-bounds[0].y*/, 0]);
        }

        return txt;
      }
    }, m);
}


function baseShadow(o) {
  return shadow(o.intersect(cube({size:[1000,1000,1], center: true})));
}


function shadow(o) {
  var orthobasis = CSG.OrthoNormalBasis.Z0Plane();
  var cags = [];
  for ( var i = 0 ; i < o.polygons.length ; i++ ) {
    var polygon = o.polygons[i];
    var cag = polygon.projectToOrthoNormalBasis(orthobasis);
    if ( cag.sides.length > 0 ) cags.push(cag);
  }
  return new CAG().union(cags);
}

function point() {
  var s = cube().rotateX(45).rotateY(10).translate([0,0,-1.2]);

  s = s.intersect(cube({size:[100,100,100], center: [true,true,false]}));

  return s.translate([-0.2452,0,0]);
}

function cross() {
  return union(
    point(),
    point().rotateZ(180),
    point().rotateZ(90),
    point().rotateZ(-90));
}

function main2() {
  var s = union(
    cross(),
    cross().rotateZ(45).scale(0.825),
    cross().scale(0.6).rotateZ(45/2),
    cross().rotateZ(-45/2).scale(0.6)
    );
  return union(
    s.scale([1,1,0.9]).translate([0,0,0.05]),
    linear_extrude({height: 0.05}, shadow(s)));
}

function ring() {
  return cylinder({r:0.7,h:0.07,fn:100}).subtract(cylinder({r:0.7-0.04,h:0.07,fn:100}));
}

function main() {
  var t = createText({text: 'Made in Canada', w: 5, justify: 'C', depth:1, scale: 0.09}).toSolid().rotateX(180).translate([1,-3,1]);
  return ring().union(main2()).scale(30).subtract(t);
}
