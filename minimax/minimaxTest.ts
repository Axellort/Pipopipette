import { Bord, Tile, Board, miniMax, findExtrem, Identifier } from "./main";
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
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
let n = 3;
let maxDepth = 2;

let bords: Bord[][][] = [Array(), Array()];
let tiles: Tile[][] = Array();
for (let i = 0; i <= n; i++) {
    if (i != n) bords[0][i] = Array();
    bords[1][i] = Array();
    if (i != n) tiles[i] = Array(n);
    for (let j = 0; j <= n; j++) {
        if (i != n) bords[0][i][j] = { appartenance: randSplit(3) - 1, id: { dir: 0, x: i, y: j } };
        if (j != n) bords[1][i][j] = { appartenance: randSplit(3) - 1, id: { dir: 1, x: i, y: j } };
        if (i != n && j != n) tiles[i][j] = { appartenance: -1, x: i, y: j };
    }
}
let board = new Board(n, bords, tiles, false);
for (let tile of board.tiles.flat()) {
    if (board.checkFull(tile)) {
        tile.appartenance = randSplit(2)
    }
}
console.log(JSON.stringify(board, null, 2));
console.log("----------------------------------------------------------------------------")
console.time("minimax")
console.log(JSON.stringify(miniMax(board, maxDepth), null, 2))
console.timeEnd("minimax")

function randSplit(n: number): number {
    const rand = Math.random();
    let dx = 1 / n;
    for (let i = 0; i < n; i++) {
        if (rand < (i + 1) * dx) return i;
    }
    return n;
}