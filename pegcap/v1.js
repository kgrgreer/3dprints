// Process with: http://openjscad.azurewebsites.net/

const R1 = 2.5;  // radius of nail hole
const R2 = 8;    // radius of nail head
const R3 = 40;   // radius of cap
const H  = 12;   // height of cap
const D  = 4;    // depth of nail head well


function main() {
    // Create the main cone shape of the cap
    var c = cylinder({h: H, r1: R3+2, r2: R2, fn: 180});

    // subtract the nail hole
    c = c.subtract(cylinder({h: H, r: R1}));

    // subtract the nail head well
    c = c.subtract(cylinder({h: D, r: R2}).translate([0,0,H-D]));

    // trip the size of the cone to give a slightly flat edge
    c = c.intersect(cylinder({h: H, r: R3, fn: 180}));

    return c;
}
