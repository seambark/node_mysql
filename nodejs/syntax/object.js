var f = function () {
    console.log(1 + 1);
    console.log(1 + 2);
}
var a = [f];
a[0];

var o = {
    func: f
}
o.func();

var group = {
    v1: 'v1',
    v2: 'v2',
    f1: function () {
        console.log(this.v1);
    },
    f2: function () {
        console.log(this.v2);
    }
}

group.f1();
group.f2();