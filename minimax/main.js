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
var lodash_1 = require("lodash");
// TODO prendre en compte qu'on rejoue... 
var MAX_NUMBER = 100000;
console.log("Hello from TypeScript");
var MAX_DEPTH = 3;
var i = 0;
var noLog = true;
var Board = /** @class */ (function () {
    function Board(n, bords, tiles, playerNb, scores, depth) {
        if (n === void 0) { n = 0; }
        if (bords === void 0) { bords = []; }
        if (tiles === void 0) { tiles = []; }
        if (playerNb === void 0) { playerNb = false; }
        if (scores === void 0) { scores = [0, 0]; }
        if (depth === void 0) { depth = 0; }
        i++;
        this.index = i;
        this.n = n;
        this.bords = bords;
        this.playerNb = playerNb;
        this.depth = depth;
        // on regénère les tiles pour remplir les cases complétées par l'adversaire (d'où le !playerNb)
        this.tiles = this.generateTiles(tiles, playerNb);
        this.scores = this.getScores();
        if (this.scores[0] == scores[0] && this.scores[1] == scores[1])
            this.playerNb = !this.playerNb;
        this.log("Constructor new Board ---------------------------------- ".concat(this.index, " depth ").concat(this.depth));
        this.log(JSON.stringify(this, null, 2));
    }
    Board.prototype.log = function (str) {
        if (noLog)
            return;
        if (this.index % 10 == 0)
            console.log(str);
    };
    Board.prototype.generateTiles = function (tiles, player) {
        // TODO récupérer la fonction de Pipopipette pour colorier les cases qu'il faut 
        var newTiles = Array(this.n);
        for (var i_1 = 0; i_1 < this.n; i_1++) {
            newTiles[i_1] = Array(this.n);
            for (var j = 0; j < this.n; j++) {
                var tile = tiles[i_1][j];
                newTiles[i_1][j] = tile;
                if (tile.appartenance == -1 && this.checkFull(tile)) {
                    //console.log("change appartenance depth + " + this.depth)
                    newTiles[i_1][j].appartenance = Number(player);
                }
            }
        }
        //console.log("new tiles : " + JSON.stringify(newTiles));
        return newTiles;
    };
    // * A tester
    Board.prototype.checkFull = function (tile) {
        var x = tile.x, y = tile.y, appartenance = tile.appartenance;
        //if (appartenance != -1) throw "should not have an appartenance";
        return (this.bords[1][x][y].appartenance != -1) && (x < this.n ? this.bords[1][x + 1][y].appartenance != -1 : true) && (this.bords[0][x][y].appartenance != -1) && (y < this.n ? this.bords[0][x][y + 1].appartenance != -1 : true);
    };
    Board.prototype.getJoueurActu = function () {
        return Number(this.playerNb);
    };
    Board.prototype.getScores = function () {
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
        var newBords = (0, lodash_1.cloneDeep)(this.bords);
        newBords[bordId.dir][bordId.x][bordId.y].appartenance = this.getJoueurActu();
        return new Board(this.n, newBords, (0, lodash_1.cloneDeep)(this.tiles), this.playerNb, this.scores, this.depth + 1);
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
    if (depth == maxDepth || board.bordsLibres().length == 0) {
        //console.log(`evaluation : ${evaluer(board)}`)
        return { coups: [{ dir: 0, x: 100, y: 100 }], value: evaluer(board) };
    }
    var score = board.scores;
    //console.log(score)
    if (score[0] > Math.pow(board.n, 2) / 2) {
        return { coups: [{ dir: 0, x: 69, y: 69 }], value: MAX_NUMBER };
    }
    ;
    if (score[1] > Math.pow(board.n, 2) / 2) { /*console.log(score)*/
        ;
        return { coups: [{ dir: 1, x: 69, y: 69 }], value: -MAX_NUMBER };
    }
    ;
    //if (depth == 1) console.log(depth, board.bords.flat(2).map((bord) => bord.appartenance));
    for (var _i = 0, _a = board.bordsLibres(); _i < _a.length; _i++) {
        var bordLibre = _a[_i];
        valeurs.set(bordLibre, miniMax(board.jouer(bordLibre.id), maxDepth, depth + 1));
    }
    var findExtreme = findExtrem(valeurs, board.playerNb);
    //console.log(`minimax of depth ${depth} return value ${findExtreme.value} -------------------------`)
    return findExtreme;
}
exports.miniMax = miniMax;
function evaluer(board) {
    //if (i == 160000) { console.log(JSON.stringify(board.tiles.flat().map((ti) => ti.appartenance))); console.log(JSON.stringify(board.bords.map((l) => (l.map((ll) => (ll.map((lll) => lll.appartenance))))), null, 4)) }
    //console.log(board.scores[0], board.scores[1])
    return board.scores[0] - board.scores[1];
}
// * has been tested, should work
function findExtrem(map, playerNb) {
    var signe = -(Number(playerNb) * 2 - 1); // si 0->1; 1->-1
    //console.log(signe);
    var meilleurPath = { coups: [{ dir: 0, x: 42, y: 42 }], value: -signe * MAX_NUMBER };
    var meilleurIdentifier = { dir: 0, x: -1, y: -1 };
    for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
        var _b = _a[_i], bordChoisi = _b[0], pathChoisi = _b[1];
        if ((pathChoisi.value - meilleurPath.value) * signe >= 0) {
            meilleurPath = pathChoisi;
            meilleurIdentifier = bordChoisi.id;
        }
    }
    //console.log(meilleurPath.value + " MEILLEUR PATH VALUE -----------")
    return { coups: __spreadArray(__spreadArray([], meilleurPath.coups, true), [meilleurIdentifier], false), value: meilleurPath.value };
}
exports.findExtrem = findExtrem;
