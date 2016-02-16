/* @flow */
function f(x)
{
    var y = 5;
    return x + y;
}

f(5); // ok
f("pizza"); // uh...
f({egg: "plant"}); // no way Jose!
