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
exports.findExtrem = void 0;
console.log("Hello from TypeScript");
var Board = /** @class */ (function () {
    function Board(n, bords, isMin) {
        if (n === void 0) { n = 0; }
        if (bords === void 0) { bords = []; }
        if (isMin === void 0) { isMin = false; }
        this.n = n;
        this.tiles = [];
        this.bords = bords;
        this.bordsV = [];
        this.bordsH = [];
        this.isMin = isMin;
    }
    Board.prototype.generateTiles = function () {
        return [];
    };
    Board.prototype.scores = function () {
        return [0, 0];
    };
    Board.prototype.jouer = function (idx) {
        var newBords = this.bords;
        newBords[idx].appartenance = Number(this.isMin);
        return new Board(this.n, newBords, !this.isMin);
    };
    Board.prototype.coordonnes = function (idx) {
        var x = idx % this.n;
        var y = (idx - x) / this.n;
        return { x: x, y: y };
    };
    Board.prototype.bordsLibres = function () {
        return [];
    };
    return Board;
}());
function miniMax(board, depth) {
    var valeurs = new Map();
    for (var _i = 0, _a = board.bordsLibres(); _i < _a.length; _i++) {
        var bordLibre = _a[_i];
        valeurs.set(bordLibre.index, miniMax(board.jouer(bordLibre.index), depth + 1));
    }
    return findExtrem(valeurs, board.isMin);
}
function findExtrem(map, isMin) {
    var signe = 1 - Number(isMin) * 2;
    var meilleurPath = { coups: [], value: -signe * Infinity };
    var meilleurIdx = -1;
    for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
        var _b = _a[_i], idx = _b[0], pathChoisi = _b[1];
        if ((pathChoisi.value - meilleurPath.value) * signe > 0) {
            meilleurPath = pathChoisi;
            meilleurIdx = idx;
        }
    }
    console.log(meilleurIdx);
    return { coups: __spreadArray(__spreadArray([], meilleurPath.coups, true), [meilleurIdx], false), value: meilleurPath.value };
}
exports.findExtrem = findExtrem;
