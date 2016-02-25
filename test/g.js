/* @flow */
var f = require("./f.js");
function g(a, b) {
    return a + f(b);
}

g(5, "pizza");
g("gorilla", "monkey");
