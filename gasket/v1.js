/*
 * Create a mold for making a replacement silicon gasket ring for my
 * water bottle.
 * Aug 30, 2019
 **/
function main() {
    var base = cylinder({r:30/2,h:4});

    var c1 = cylinder({r:29/2, h:3.7});
    var c2 = cylinder({r:26/2, h:4});
    var c3 = cylinder({r:26/2-0.4, h:4});
    var c4 = cylinder({r:24/2, h:4});

    base = base.subtract(c1);
    base = base.subtract(c2);
    base = base.union(c3);
    base = base.subtract(c4);
    return base.scale([1,1,-1]);
}
