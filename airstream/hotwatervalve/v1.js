// 1" socket for Airstream hotwater heater valve

function main() {
    var s = cylinder({r: 26/2+2, h: 4, fn: 36})

    var s = s.union(cylinder({r: 26/4/2+2, h: 8, fn: 36}))

    s = s.subtract(cylinder({r: 13, h: 3, fn: 6}));

    s = s.subtract(cylinder({r: 26/4/2, h: 10, fn: 4}));

    return s
}
