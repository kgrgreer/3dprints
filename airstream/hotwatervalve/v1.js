// 1" socket for Airstream hotwater heater valve

var R1 = 30/2;
var R2 = 12.5/2;

function main() {
    var s = cylinder({r: R1+2, h: 20, fn: 36})

    s = s.subtract(cylinder({r: R2, h: 10, fn: 6}));

    s = s.subtract(cylinder({r: 26/4/2, h: 10, fn: 4}));

    return s
}
