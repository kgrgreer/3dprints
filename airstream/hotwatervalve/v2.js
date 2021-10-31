// 1" socket for Airstream hotwater heater valve
// final version, tested

var R1 = 30/2;
var R2 = 25.4/2/Math.sqrt(2);

function main() {
    var s = cylinder({r: R1+2, h: 20, fn: 36})

    s = s.subtract(cube({size:[10,10,50], center:true}));

    s = s.subtract(cylinder({r: R1, h: 10, fn: 6}));

    return s.rotateX(180)
}
