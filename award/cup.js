// Print instructions: PLA, wall side bottom count: 2 3 3, 8% infill gyroid, 0.2mm

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

function text(trophy, a, r, h, txt, scale, justify) {
  var t = createText({text: txt, scale: scale, justify: justify}).toSolid();
  t = t.rotateY(0).rotateX(90).translate([0,-r+5,h]);
  t = t.rotateZ(a)
  t = t.subtract(trophy);
  t = t.setColor([1,1,1]);
  t = t.rotateZ(-a)
  t = t.translate([0,0.25,0]);
  t = t.rotateZ(a)
  return trophy.subtract(t);
}


function ring(h, r1, r2) {
  return cylinder({r: r1, h: h});
}

function bowl(h, r) {
  var b = sphere({r:h});
  b = b.subtract(sphere({r:h-0.5}));
  b = b.intersect(cube({size:[2*h,2*h,h+5],center:true}).translate([0,0,-h+1]));
  return b.translate([0,0,h-1.5]);
}

function trophy(p) {
  var parts = [];
  var height = 0;

  p.forEach(function(s) {
    var f  = s[0] || ring;
    var r1 = s[2], h = s[1];
    var r2 = s[3] || r1;
    var shape = f(h, r1, r2).translate([0,0,height]);
    shape = shape.setColor([0.8,0.8,0.8]);
    parts.push(shape);
    height += h;
  });

  return union.apply(null, parts);
}

//  'Alexander Kambourov',

const PLAYERS = [
  'Alec Huyghebaert',
  'Alessio Di Cintio',
  'Alex Kambourov',
  'Carter Wong',
  'Chayse Fielding',
  'David Harry',
  'Griffin Marks',
  'Jack Toffey',
  'Justin Chu',
  'Kyle Andrade',
  'Luca Vessio',
  'Matteo Jadis',
  'Ricky Bolla',
  'Ryan  Murphy',
  'Sebastian Greer',
  'Tim Han'
];

const COACHES = [
  'Chris Stamopoulos',
  'Yann Jadis',
  'Tony Andrade',
  'Andrew Farrugia',
  'Ken Webb'
];

function names(trophy, names, cols, a, h, w) {
  for ( var i = 0 ; i < names.length ; i++ ) {
    var p = names[i];
    trophy = text(trophy, (i % cols) * a, 10, h - Math.floor(i/cols) * 1.8, p, w, 'C');
  }

  return trophy;
}

function main() {
  var t = trophy([
    [ring, 1, 11],
    [null, 10, 10],
    [null, 0.5, 10.25],
    [null, 10, 10],
    [null, 4.5, 8],
    [null, 3.5, 6.5],
    [null, 2.5, 5],
    [bowl, 10, 10]
  ]);

  t = text(t, 0, 4.5, 27.2, "MHL",          0.055, 'C');
  t = text(t, 0, 10, 23.2, "2019-2020",          0.055, 'C');

  t = text(t, 0, 10, 8.5, "Applewood Coyotes",  0.057, 'C');

  t = text(t, 0, 10, 6,   "Minor Midget A", 0.055, 'C');
  t = text(t, 0, 10, 3.7, "Season Champions",   0.055, 'C');
//  t = text(t, 0, 10, 1.5, "2019-2020",          0.055, 'C');

  t = text(t, 150, 10, 9,   "CHAMPIONSHIPS",        0.055, 'C');
  t = text(t, 150, 10, 6.5, "West Mall Early Bird", 0.048, 'C');
  t = text(t, 150, 10, 4.3, "Ottawa River Cup",     0.048, 'C');
  t = text(t, 150, 10, 2,   "North York Knights",   0.048, 'C');

  t = names(t, PLAYERS, 4, 360/4, 19.9, 0.046);
  t = names(t, COACHES, 5, 360/5, 12.25, 0.045);

  t = text(t, -110, 10, 9,   "STATS",  0.055, 'C');
  t = text(t, -110, 10, 6.5, "28-6-2", 0.054, 'C');
  t = text(t, -110, 10, 4.3, "3-0-1",  0.054, 'C');

  var mf = createText({text: 'Made in Canada', w: 5, justify: 'C', depth:1, scale: 0.06});
  t = t.subtract(mf.toSolid().rotateX(180).translate([0,0,0.2]));
  // var mf = createText({text: 'Hat Tricks\nDec. 11 6-0 vs PC\nFeb. 1  7-1 vs LPC', w: 5, justify: 'C', depth:1, scale: 0.06});
  // t = t.subtract(mf.toSolid().rotateX(180).translate([0,-1,0.2]));

  return t;
}
