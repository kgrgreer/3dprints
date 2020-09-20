const N = 20;
const H = 60;
const TWO_PI = Math.PI * 2;

function coord(a, r) {
    return a % N + r * N;
}

function closeRing(r, points, tris) {
    points.push([0,0,r*10]);
    for ( var i = 0 ; i < N ; i++ ) {
      tris.push([points.length-1, coord(i, r), coord(i+1, r)]);
    }
}

function ring(r) {
    var points = [];
    var tris = [];
    for ( var ring = 0 ; ring < H ; ring++ ) {
      for ( var i = 0 ; i < N ; i++ ) {
        var r2 = r * (H-1-ring)/(H-1);
        points.push([
            r2*Math.cos(i*TWO_PI/N),
            r2*Math.sin(i*TWO_PI/N),
            ring
            ]);
        if ( ring < H-1 ) {
          tris.push([coord(i, ring), coord(i+1, ring), coord(i, ring+1)]);
          tris.push([coord(i, ring+1), coord(i+1, ring), coord(i, ring)]);
          tris.push([coord(i, ring+1), coord(i+1, ring+1), coord(i+1, ring)]);
          tris.push([coord(i+1, ring+1), coord(i, ring+1), coord(i+1, ring)]);
        }
      }
    }

    closeRing(0, points, tris);
    closeRing(H-1, points, tris);

    return polyhedron({points: points, triangles: tris}).setColor([1,0,0]);
}


function main() {
    return ring(5);
}
