import { Bord, Tile, Board, miniMax, findExtrem } from "./main";

console.log("find extrem test")

/*
let listeCoups = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
let values = [5, 6, 7];
let nouveauxCoups: Bord[] = [{ appartenance: -1, id: { x: 3, y: 3, dir: 0 } }, { appartenance: -1, id: { x: 4, y: 4, dir: 0 } }, { appartenance: -1, id: { x: 5, y: 5, dir: 0 } }];
let map = new Map();
for (let i = 0; i < 3; i++) {
    map.set(nouveauxCoups[i], { coups: listeCoups[i], value: values[i] });
}

console.log(findExtrem(map, false));*/

let n = 5;
let bords: Bord[][][] = [Array(n), Array(n)];
let tiles: Tile[][] = Array(n);
for (let i = 0; i < n; i++) {
    bords[0][i] = Array(n);
    bords[1][i] = Array(n);
    tiles[i] = Array(n);
    for (let j = 0; j < n; j++) {
        bords[0][i][j] = { appartenance: -1, id: { dir: 0, x: i, y: j } };
        bords[1][i][j] = { appartenance: -1, id: { dir: 1, x: i, y: j } };
        tiles[i][j] = { appartenance: -1, x: i, y: j };
    }
}

let board = new Board(n, bords, tiles, true);
console.log(miniMax(board, 2));
