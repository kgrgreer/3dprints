const NAME = "Sebastian", W = 39.5;
//const NAME = "Kevin", W = 18;
//const NAME = "Julia", W = 13;
//const NAME = "David", W = 18;
const R = 10;
const ORANGE = [1, 165/256, 0];


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
          txt = txt.translate([-bounds[1].x, -bounds[0].y, -2.5]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, -bounds[0].y, -2.5]);
        } else {
          txt = txt.translate([-bounds[0].x, -bounds[0].y, -2.5]);
        }

        return txt;
      }
    }, m);
}


function base() {
   var b = cylinder({r:R,h:W});

   b = b.union(sphere({r:R}));
   b = b.union(sphere({r:R}).translate([0,0,W]));
   b = b.rotateX(90).intersect(cube({size:[200,200,200], center:[true,true,false]}));
   b = b.union(linear_extrude({height:2}, shadow(b).expand(2)));

   return b;
}


function name() {
 var n = createText({text: NAME, justify: 'C', scale:0.3}).toSolid().translate([0,-1,0]).rotateZ(90).rotateY(60).translate([10,-W/2,4.2]);
 n = n.subtract(base()).translate([-0.25,0,-0.25]);
 return n;
}


function main() {
    var o = base();

    o = o.subtract(o.translate([0,0,-1.75]));
    o = o.subtract(name());
    o = o.subtract(cube({radius:1.9,size:[7,W+6,100]}).translate([-3.5,-W-3,0]));
    o = o.setColor(ORANGE);

    return o.scale(1.5*1.5).scale([1,1,1]).rotateZ(90);
}
