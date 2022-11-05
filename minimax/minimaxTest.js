"use strict";
exports.__esModule = true;
var main_1 = require("./main");
console.log("find extrem test");
var listeCoups = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
var values = [5, 6, 7];
var nouveauxCoups = [3, 4, 5];
var map = new Map();
for (var i = 0; i < 3; i++) {
    map.set(nouveauxCoups[i], { coups: listeCoups[i], value: values[i] });
}
console.log((0, main_1.findExtrem)(map, false));
