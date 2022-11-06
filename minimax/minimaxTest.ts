import { Bord, Tile, Board, miniMax, findExtrem } from "./main";

console.log("find extrem test")

/*
let listeCoups = [[{ dir: 0, x: 0, y: 1 },
{ dir: 0, x: 0, y: 2 },
{ dir: 0, x: 0, y: 3 }], [{ dir: 0, x: 1, y: 0 },
{ dir: 0, x: 2, y: 0 },
{ dir: 0, x: 3, y: 0 }]];

let values = [5, 6];
let nouveauxCoups: Bord[] = [{ appartenance: -1, id: { x: 3, y: 3, dir: 0 } }, { appartenance: -1, id: { x: 4, y: 4, dir: 0 } }];
let map = new Map();
for (let i = 0; i < 2; i++) {
    map.set(nouveauxCoups[i], { coups: listeCoups[i], value: values[i] });
}

console.log(findExtrem(map, true)); WORKS ( I THINK )
*/
let n = 1;
let maxDepth = 4;
let bords: Bord[][][] = [Array(), Array()];
let tiles: Tile[][] = Array();
for (let i = 0; i <= n; i++) {
    if (i != n) bords[0][i] = Array();
    bords[1][i] = Array();
    if (i != n) tiles[i] = Array(n);
    for (let j = 0; j <= n; j++) {
        if (i != n) bords[0][i][j] = { appartenance: -1, id: { dir: 0, x: i, y: j } };
        if (j != n) bords[1][i][j] = { appartenance: -1, id: { dir: 1, x: i, y: j } };
        if (i != n && j != n) tiles[i][j] = { appartenance: -1, x: i, y: j };
    }
}
console.log(JSON.stringify(bords, null, 2));

let board = new Board(n, bords, tiles, false);
//console.log(JSON.stringify(board.jouer({ dir: 0, x: 0, y: 4 })))
//console.log(board.playerNb)
console.log(miniMax(board, 4));
