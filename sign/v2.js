const W = 200;
const H = 120;
const T = 1.5;
const WHITE = [1,1,1];
const BLACK = [0,0,0];
const RED = [1,0,0];

function createText(m) {
   if ( typeof m === 'string' ) m = { text: m };

   return Object.assign({
     text: 'A',
     w: 3.4,
     h: 6,          // depth
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


function main() {
 var s = cube({size:[W,H,3],center:[1,1,0]}).setColor(WHITE);

 s = s.subtract(cube({size:[W-T*2,H-T*2,1],center:[1,1,0]}).setColor(BLACK).translate([0,0,2]));
//  s = s.union(cube({size:[W-T*2,(H-T*2)/2,1],center:[1,1,0]}).setColor(WHITE).translate([0,28,3.5]));

 var pp1 = createText({text: 'Private',   justify: 'C', scale: 1.2, color: RED});
 var pp2 = createText({text: 'Property',   justify: 'C', scale: 1.2, color: RED});
 var units = createText({text: 'Units 403 / 404', justify: 'C', w: 4, scale: 0.6, color: WHITE});

//  return pp.toSolid().intersect(cube({size:[1000,1000,1000],center:[1,1,0]}));
//  return units.toSolid().intersect(cube({size:[1000,1000,1000],center:[1,1,0]}));
 s = s.union(units.toSolid().translate([0,29,0]));
 s = s.union(pp1.toSolid().translate([0,-10,0]));
 s = s.union(pp2.toSolid().translate([0,-54,0]));

 s = s.intersect(cube({size:[1000,1000,1000],center:[1,1,0]}))
 return s;
}
