"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.findExtrem = exports.miniMax = exports.Board = void 0;
console.log("Hello from TypeScript");
var MAX_DEPTH = 3;
var i = 0;
var Board = /** @class */ (function () {
    function Board(n, bords, tiles, playerNb) {
        if (n === void 0) { n = 0; }
        if (bords === void 0) { bords = []; }
        if (tiles === void 0) { tiles = []; }
        if (playerNb === void 0) { playerNb = false; }
        if (i % 1 == 0)
            console.log("Constructor new Board ------------------------------------------------------------------ ".concat(i));
        i++;
        this.n = n;
        this.bords = bords;
        this.playerNb = playerNb;
        this.tiles = this.generateTiles(tiles);
        this.scores = this.setScores();
    }
    Board.prototype.generateTiles = function (tiles) {
        // TODO récupérer la fonction de Pipopipette pour colorier les cases qu'il faut 
        var newTiles = Array(this.n);
        for (var i_1 = 0; i_1 < this.n; i_1++) {
            newTiles[i_1] = Array(this.n);
            for (var j = 0; j < this.n; j++) {
                var tile = tiles[i_1][j];
                newTiles[i_1][j] = tile;
                if (tile.appartenance == -1 && this.checkFull(tile)) {
                    newTiles[i_1][j].appartenance = this.getJoueurActu();
                }
            }
        }
        //console.log("new tiles : " + JSON.stringify(newTiles));
        return newTiles;
    };
    // * A tester
    Board.prototype.checkFull = function (tile) {
        var x = tile.x, y = tile.y, appartenance = tile.appartenance;
        if (appartenance != -1)
            throw "should not have an appartenance";
        return (this.bords[1][x][y].appartenance != -1) && (x < this.n ? this.bords[1][x + 1][y].appartenance != -1 : true) && (this.bords[0][x][y].appartenance != -1) && (y < this.n ? this.bords[0][x][y + 1].appartenance != -1 : true);
    };
    Board.prototype.getJoueurActu = function () {
        return Number(this.playerNb);
    };
    Board.prototype.setScores = function () {
        // TODO récupérer la fonction de Pipopipette pour compter les points
        var points = [0, 0];
        for (var _i = 0, _a = this.tiles.flat(); _i < _a.length; _i++) {
            var tile = _a[_i];
            if (tile.appartenance >= 0) {
                points[tile.appartenance]++;
            }
        }
        return [points[0], points[1]];
    };
    Board.prototype.jouer = function (bordId) {
        var newBords = JSON.parse(JSON.stringify(this.bords));
        newBords[bordId.dir][bordId.x][bordId.y].appartenance = this.getJoueurActu();
        return new Board(this.n, newBords, this.tiles, !this.playerNb);
    };
    Board.prototype.coordonnes = function (idx) {
        var x = idx % this.n;
        var y = (idx - x) / this.n;
        return { x: x, y: y, dir: 0 };
    };
    Board.prototype.bordsLibres = function () {
        return this.bords.flat(2).filter(function (bord) { return bord.appartenance == -1; });
    };
    return Board;
}());
exports.Board = Board;
function miniMax(board, maxDepth, depth) {
    if (depth === void 0) { depth = 0; }
    var valeurs = new Map();
    if (depth == maxDepth) {
        return { coups: [], value: evaluer(board) };
    }
    var score = board.scores;
    console.log(score);
    if (score[0] > Math.pow(board.n, 2) / 2)
        return { coups: [], value: Infinity };
    if (score[1] > Math.pow(board.n, 2) / 2)
        return { coups: [], value: -Infinity };
    //if (depth == 1) console.log(depth, board.bords.flat(2).map((bord) => bord.appartenance));
    for (var _i = 0, _a = board.bordsLibres(); _i < _a.length; _i++) {
        var bordLibre = _a[_i];
        valeurs.set(bordLibre, miniMax(board.jouer(bordLibre.id), maxDepth, depth + 1));
    }
    return findExtrem(valeurs, board.playerNb);
}
exports.miniMax = miniMax;
function evaluer(board) {
    //if (i == 160000) { console.log(JSON.stringify(board.tiles.flat().map((ti) => ti.appartenance))); console.log(JSON.stringify(board.bords.map((l) => (l.map((ll) => (ll.map((lll) => lll.appartenance))))), null, 4)) }
    console.log(board.scores[0], board.scores[1]);
    return board.scores[0] - board.scores[1];
}
// * has been tested, should work
function findExtrem(map, playerNb) {
    var signe = -(Number(playerNb) * 2 - 1); // si 0->1; 1->-1
    //console.log(signe);
    var meilleurPath = { coups: [], value: -signe * Infinity };
    //console.log(meilleurPath);
    var meilleurIdentifier = { dir: 0, x: -1, y: -1 };
    for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
        var _b = _a[_i], bordChoisi = _b[0], pathChoisi = _b[1];
        if ((pathChoisi.value - meilleurPath.value) * signe > 0) {
            meilleurPath = pathChoisi;
            meilleurIdentifier = bordChoisi.id;
        }
    }
    return { coups: __spreadArray(__spreadArray([], meilleurPath.coups, true), [meilleurIdentifier], false), value: meilleurPath.value };
}
exports.findExtrem = findExtrem;
