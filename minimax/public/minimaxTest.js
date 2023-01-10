console.log("find extrem test");
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
var n = 3;
var maxDepth = 100;
var bords = [Array(), Array()];
var tiles = Array();
for (var i = 0; i <= n; i++) {
    if (i != n)
        bords[0][i] = Array();
    bords[1][i] = Array();
    if (i != n)
        tiles[i] = Array(n);
    for (var j = 0; j <= n; j++) {
        if (i != n)
            bords[0][i][j] = {
                appartenance: randSplit(3) - 1,
                id: { dir: 0, x: i, y: j }
            };
        if (j != n)
            bords[1][i][j] = {
                appartenance: randSplit(3) - 1,
                id: { dir: 1, x: i, y: j }
            };
        if (i != n && j != n)
            tiles[i][j] = { appartenance: -1, x: i, y: j };
    }
}
var board = new Board(n, bords, tiles, false);
for (var _i = 0, _a = board.tiles.flat(); _i < _a.length; _i++) {
    var tile = _a[_i];
    if (board.checkFull(tile)) {
        tile.appartenance = randSplit(2);
    }
}
console.log(JSON.stringify(board, null, 2));
logDivider();
console.time("minimax");
//console.log(JSON.stringify(board.bordsLibres(), null, 2));
console.log(board.bordsLibres().length);
logDivider();
var path = miniMax(board, maxDepth);
console.log(JSON.stringify(path, null, 2));
console.timeEnd("minimax");
renderBoard(board);
var _b = path.coups, first = _b[0], coups = _b.slice(1);
var newBoard = board;
for (var _c = 0, coups_1 = coups; _c < coups_1.length; _c++) {
    var coup = coups_1[_c];
    console.log(coup);
    newBoard = newBoard.jouer(coup);
}
setTimeout(function () {
    renderBoard(newBoard);
}, 2000);
function randSplit(n) {
    var rand = Math.random();
    var dx = 1 / n;
    for (var i = 0; i < n; i++) {
        if (rand < (i + 1) * dx)
            return i;
    }
    return n;
}
function logDivider() {
    console.log("----------------------------------------------------------------------------");
}
