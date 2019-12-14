const PUCK_R = 38;
function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 3,
      scale: 0.13,
      justify: 'L',
      a: 0,
      color: [0,0,0],
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:5})));

        var txt = union(o).setColor(this.color).scale([this.scale, this.scale, 1]);

        if ( this.a ) txt = txt.rotateZ(this.a);

        var bounds = txt.getBounds();
        if ( this.justify === 'R' ) {
          txt = txt.translate([-bounds[1].x, -bounds[0].y, 0]);
        } else if ( this.justify === 'C' ) {
          txt = txt.translate([-bounds[1].x/2, -bounds[0].y, 0]);
        } else {
          txt = txt.translate([-bounds[0].x, -bounds[0].y, 0]);
        }

        return txt;
      }
    }, m);
}

function text() {
  var t1 = createText({justify: 'C', text: 'Sebastian Greer', scale:0.2}).toSolid().translate([0,13.5,0]);
  var t2 = createText({justify: 'C', text: 'Hat Trick', scale:0.2}).toSolid().translate([0,7.20,0]);
  var t3 = createText({justify: 'C', text: 'Dec. 11, 2019 6-0 Applewood vs. Port Credit', scale:0.12}).toSolid().translate([0,1.5,0]);

  return union(t1,t2,t3).translate([50,0,0]).rotateX(-20+90);
}

function base() {
    var b = cube({radius:1,size:[100,50,20]});
    b = b.union(cube({radius:1,size:[100,65,22]}).translate([0,0,0]));
    b = b.rotateX(-20);
    b = b.intersect(cube({size:[200,72,20]}));
return b;
}



function negativePuckHolder() {
  var h = cylinder({r:PUCK_R-2, h: 60});
  h = h.rotateX(-90-20);
  h = h.translate([50,26,56])
  return h;
}

function puckHolder() {
  var h = cylinder({r:PUCK_R+7, h: 60}).subtract(cylinder({r:PUCK_R+0.2, h: 15}));
  h = h.rotateX(-90-20);
  h = h.translate([50,26,56])
  return h;
}

function main() {
//    return puckHolder().rotateX(-90+20)
    return base().union(puckHolder()).subtract(negativePuckHolder()).subtract(text().translate([0,1,0])).rotateX(-90).translate([0,0,54]).intersect(cube({size:[1000,1000,1000], center: [true,false,false]}));

}
