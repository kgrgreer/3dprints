// TODO:
// make wholes larger
// make headband trench wider

const e  = 0.5
const RO = 3+e;
const RI = 2+e/2;
const H1 = 5.2;
const H2 = 2-e;
const H3 = 1.5+2*e;
const FN = 60;
const RS = 4.5+e;
const HR = 3.5/2;

const BLACK = [0,0,0];
// 7.5 exposed band

function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 5,
      h: 8,          // depth
      scale: 0.15,
      justify: 'L',  // justification: R, C or defaults to Left
      a: 0,          // angle of rotation
      color: BLACK,
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
//          txt = txt.translate([-bounds[0].x, -bounds[0].y, -2.5]);
          txt = txt.translate([0, -bounds[0].y, -2.5]);
          }

        return txt;
      }
    }, m);
}


function createArm() {
  var a = [];
  for ( var i = 0 ; i < 1.2 ; i+= 0.01 ) {
     var s = cube({size:[11,8-2*i,0.5], radius:0.25});
     if ( i > 0.15 ) {
         s = s.subtract(cube({size:[6,1,3]}).translate([2.5,2.5+(1-i),0]));
     }
     s = s.translate([0,-1,45*i]).rotateX(18*i);
     a.push(s);
  }

  var arm = union.apply(null, a);

  var r = createText({text:'R', justify:'C'}).toSolid();
  r = r.rotateX(90).rotateZ(180).translate([5.5,7.5,5]);

  arm = arm.subtract(r);
  return arm;
}

function main() {

  var s = cylinder({r:RI, h:H1+H2+H3, fn: FN})

  s = s.union(cylinder({r:RO, h:H1, fn: FN}) )
  s = s.union(cylinder({r:RO, h:H3, fn: FN}).translate([0,0,H1+H2]) )

  s = s.union(
      cube({size:[RS,RS,3]}).translate([0,0,0.8]).intersect(
      cylinder({r:RS, h:H1+H2+H3, fn: FN})
      ));

  s = s.union(s.rotateZ(90)).rotateZ(-90);
  //return s;

  var b = cube({size:[11,12,12], radius:0.5, center:[true,true,false]});

  b = b.subtract(s);

  var arm = createArm();
  b = b.union(arm.translate([-5.5,-3,8.5]))
  //return b;

  b = b.union(cylinder({r:4.8/2,h:11, fn: FN}).rotateY(90).translate([-5.5,4,10.6]))
  b = b.subtract(cylinder({r:HR,h:100, fn: FN}).rotateY(90).translate([-50,4,10.6]))
  b = b.union(cylinder({r:4.8/2,h:11, fn: FN}).rotateY(90).translate([-5.5,-4,10.6]))
  b = b.subtract(cylinder({r:HR,h:100, fn: FN}).rotateY(90).translate([-50,-4,10.6]))

  b = b.union(cylinder({r:4.8/2,h:11, fn: FN}).rotateY(90).translate([-5.5,-12.5,55]))
  b = b.subtract(cylinder({r:HR,h:100, fn: FN}).rotateY(90).translate([-5.5,-12.5,55]))

  var b2 = b.subtract(cube({size:[100,100,100]}).translate([0,-50,0]))
  var b3 = b.intersect(cube({size:[100,100,100]}).translate([0,-50,0]))

  b2 = b2.rotateY(-90);
  b3 = b3.rotateY(-90);

  return b2.union(b3.translate([50,30,0]).rotateY(180))
}
