const X = 155;
const Y = 55;
const H = 35;
const T = 2.8; // thickness
const L = 9; // lid height
const BH = 4; // bevel height
const TOLERANCE = .4;
const FN = 200;

function createText(m) {
    if ( typeof m === 'string' ) m = { text: m };

    return Object.assign({
      text: 'A',
      w: 3,
      scale: 0.13,
      justify: 'L',
      a: 0,
      h: 5,
      color: [0,0,0],
      toSolid: function() {
        var o = [];
        var l = vector_text(0, 0, this.text);

        l.forEach(s => o.push(rectangular_extrude(s, {w: this.w, h:this.h})));

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

function shape(x,y,z) {
    x = x - y;
    var s = cube({size:[x,y,z]});
    var c = cylinder({r:y/2,fn: FN, h:z}).translate([0,y/2,0]);
    s = s.union(c);
    s = s.union(c.translate([x,0,0]));
    return s.translate([-x/2,-y/2,0]);
}

function bevel(s) {
    var t = s.translate([0,0,BH]);

    for ( var i = 0 ; i < 40 ; i++ ) {
        var j = Math.sqrt(i/40*2);
      t = t.union(s.scale([0.98+0.02*j,0.95+0.05*j,1]).translate([0,0,i/40*BH]))
    }

  return t;
}


function lid() {
    var s = shape(X,Y,L);
    s = bevel(s);
    s = s.subtract(shape(X-T*2,Y-T*2,H).translate([0,0,T/2]));
    s = s.subtract(shape(X-T+TOLERANCE,Y-T+TOLERANCE,H).translate([0,0,T+0.8]));
    s = s.subtract(shape(X-T*2,Y-T*2,H).translate([0,0,T]));

    var g = cylinder({r:3,h:X,fn: FN}).rotateY(90).translate([-X/2,Y/2+3.5-0.75,L/2+2])
    s = s.subtract(g);
    s = s.subtract(g.translate([0,-Y-5.5,0]))

    return s;
}

function name() {
  return createText({text: 'Vesna', h:0.25, scale:1,justify:'C'}).toSolid().translate([0,-10,0]).scale([-1,1,1]);

}

function main() {
    return lid().subtract(name());
    var s = shape(X,Y,H-L-BH);
    s = bevel(s);
    s = s.union(shape(X-T*2/2,Y-T*2/2,H-T-2).translate([0,0,T/2]));

    s = s.subtract(shape(X-T*2,Y-T*2,H).translate([0,0,T/2]));
    var g = cylinder({r:3,h:X,fn: FN}).rotateY(90).translate([-X/2,Y/2+3.5-0.75,L/3])
    s = s.subtract(g);
    s = s.subtract(g.translate([0,-Y-5.5,0]))
    return s;
}
