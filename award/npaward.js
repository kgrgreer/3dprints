
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


function bezel(x1,y1,x2,y2) {
  return cube({size:[100,-10,20]}).translate([-10,0,0]).rotateX(-25).rotateZ(Math.atan2(y2-y1,x2-x1)* 180 / Math.PI).translate([x1,y1,0]);
}

function wedge(r, a, b, x, y) {

 var r1 = cylinder({r:r}).translate([-r,0,0]);
 var r2 = cylinder({r}).translate([-r,0,0]).rotateZ(a);

    return r1.subtract(r2).rotateZ(b).translate([x,y,0]);
}

function logo() {
 var l = cylinder({r:10, resolution:180});

 l = l.subtract(wedge(40, 4,54,15,-4));

 l = l.subtract(wedge(15, 20, 9, 3, 3));
 l = l.subtract(wedge(15, 15, 9, -3, -3).mirroredY().mirroredX().translate([-8,-5,0]));

 return l;
}


function base() {
  var W = 27;
  var D = 7;
  var H = 2.3;
  var b = cube({size:[W,D,H], center:[true,true,false]});

  b = b.subtract(bezel(W/2,-D/2,W/2,D/2));
  b = b.subtract(bezel(W/2,-D/2,W/2,D/2).mirroredX());
  b = b.subtract(bezel(-W/2,-D/2,W/2,-D/2));
  b = b.subtract(bezel(-W/2,-D/2,W/2,-D/2).mirroredY());

  return b.rotateX(-86).translate([0,-2,1.5]);
}

function main() {

var poly = polygon([
    [0,0],
    [7,0],
    [12,5],
    [12,13],
    [0,35],
    [-12,13],
    [-12,5],
    [-7,0]
  ]);

  var f = linear_extrude({height: 4}, poly).setColor([1,0,0]);

  f = f.subtract(bezel(12,13,0,35,5));
  f = f.subtract(bezel(12,13,0,35,5).mirroredX());

  f = f.subtract(bezel(7,0,12,5,5));
  f = f.subtract(bezel(7,0,12,5,5).mirroredX());

  const DEPTH = 6;

  var year = createText({text: '2019', justify: 'C', depth:1, scale: 0.07});
  f = f.subtract(year.toSolid().translate([0,22,DEPTH+0.25]));

  var title1 = createText({text: 'Blockchain', w: 2.5, justify: 'C', depth:1, scale: 0.075});
  f = f.subtract(title1.toSolid().translate([0,15.3+.4,DEPTH]));

  var title2 = createText({text: 'Company', w: 2.5, justify: 'C', depth:1, scale: 0.075});
  f = f.subtract(title2.toSolid().translate([0,12.3+.4,DEPTH]));

  var title3 = createText({text: 'of the Year', w: 2.5, justify: 'C', depth:1, scale: 0.075});
  f = f.subtract(title3.toSolid().translate([0,10.3+.4,DEPTH]));

  var np = createText({text: 'nanopay', w: 3.5, justify: 'C', depth:1, scale: 0.1});
  f = f.subtract(np.toSolid().translate([0,5,DEPTH]));

  f = f.subtract(logo().scale([0.2,0.2,1]).translate([0,2.8,3.7]));

  f = f.union(base()).rotateX(-7).intersect(cube({size:[100,100,100],center:[true,true,false]}));

  var name = createText({text: 'Mahimma J.', w: 2.5, justify: 'C', depth:1, scale: 0.075});
  f = f.subtract(name.toSolid().translate([0,-1.4,DEPTH+0.6]));

  return f.scale(3);
}
