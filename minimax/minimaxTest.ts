import { findExtrem } from "./main";

console.log("find extrem test")

let listeCoups = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
let values = [5, 6, 7];
let nouveauxCoups = [3, 4, 5];
let map = new Map();
for (let i = 0; i < 3; i++) {
    map.set(nouveauxCoups[i], { coups: listeCoups[i], value: values[i] });
}

console.log(findExtrem(map, false));
