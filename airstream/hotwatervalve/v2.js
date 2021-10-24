// 1" socket for Airstream hotwater heater valve

var R1 = 30/2;
var R2 = 12.5/2;

function main() {
    var s = cylinder({r: R1+2, h: 20, fn: 36})

    s = s.subtract(cylinder({r: R2, h: 30, fn: 4}));

    s = s.subtract(cylinder({r: R1, h: 10, fn: 6}));

    return s.rotateX(180)
}
