console.log("Hello from TypeScript")
const MAX_DEPTH = 3;
let i = 0;
export interface Bord {
    appartenance: number,
    id: Identifier
}
interface Identifier {
    dir: 0 | 1;
    x: number,
    y: number,
}
export interface Tile {
    appartenance: number,
    x: number,
    y: number
}

interface path {
    coups: Identifier[],
    value: number
}

export class Board {
    n: number;
    bords: Bord[][][];
    tiles: Tile[][];
    isMin: boolean;
    scores: [number, number];

    constructor(n: number = 0, bords: Bord[][][] = [], tiles: Tile[][] = [], isMin: boolean = false) {
        console.log(`Constructor new Board ------------------------------------------------------------------ ${i}`);
        i++;
        this.n = n;
        this.bords = bords;
        this.isMin = isMin;
        this.tiles = this.generateTiles(tiles);
        this.scores = this.setScores();
    }
    generateTiles(tiles: Tile[][]): Tile[][] {
        // TODO récupérer la fonction de Pipopipette pour colorier les cases qu'il faut 
        let newTiles: Tile[][] = Array(this.n);
        for (let i = 0; i < this.n; i++) {
            newTiles[i] = Array(this.n)
            for (let j = 0; j < this.n; j++) {
                let tile = tiles[i][j];
                newTiles[i][j] = tile;
                if (this.checkFull(tile) && tile.appartenance == -1) {
                    newTiles[i][j].appartenance = this.getJoueurActu();
                }
            }
        }
        //console.log("new tiles : " + JSON.stringify(newTiles));
        return newTiles;
    }
    // * A tester
    checkFull(tile: Tile): boolean {
        let { x, y, appartenance } = tile;
        if (appartenance != -1) throw "should not have an appartenance";

        return (this.bords[1][x][y].appartenance != -1) && (x < this.n - 1 ? this.bords[1][x + 1][y].appartenance != -1 : true) && (this.bords[0][x][y].appartenance != -1) && (y < this.n - 1 ? this.bords[0][x][y + 1].appartenance != -1 : true);
    }
    getJoueurActu(): number {
        return Number(this.isMin);
    }
    setScores(): [number, number] {
        // TODO récupérer la fonction de Pipopipette pour compter les points
        let points = [0, 0];
        for (let tile of this.tiles.flat()) {
            if (tile.appartenance >= 0) {
                points[tile.appartenance]++;
            }
        }
        return [points[0], points[1]];
    }

    jouer(bord: Bord): Board {
        let newBords = JSON.parse(JSON.stringify(this.bords)) as Bord[][][];
        newBords[bord.id.dir][bord.id.x][bord.id.y].appartenance = this.getJoueurActu();
        return new Board(this.n, newBords, this.tiles, !this.isMin);
    }

    coordonnes(idx: number): Identifier {
        let x = idx % this.n;
        let y = (idx - x) / this.n;
        return { x, y, dir: 0 };
    }
    bordsLibres(): Bord[] {
        return this.bords.flat(2).filter((bord: Bord) => bord.appartenance = -1);
    }
}


export function miniMax(board: Board, depth: number): path {
    let valeurs: Map<Bord, path> = new Map();
    if (depth == MAX_DEPTH) {
        return { coups: [], value: evaluer(board) }
    }
    let score = board.scores;
    if (score[0] > board.n ** 2 / 2) return { coups: [], value: Infinity };
    if (score[1] > board.n ** 2 / 2) return { coups: [], value: -Infinity };
    for (const bordLibre of board.bordsLibres()) {
        valeurs.set(bordLibre, miniMax(board.jouer(bordLibre), depth + 1));
    }

    return findExtrem(valeurs, board.isMin);
}
function evaluer(board: Board): number {
    return board.scores[0] - board.scores[1];
}


// * has been tested, should work
export function findExtrem(map: Map<Bord, path>, isMin: boolean): path {
    let signe = 1 - Number(isMin) * 2;
    let meilleurPath: path = { coups: [], value: - signe * Infinity };
    let meilleurIdentifier: Identifier = { dir: 0, x: -1, y: -1 };
    for (let [bordChoisi, pathChoisi] of Array.from(map.entries())) {
        if ((pathChoisi.value - meilleurPath.value) * signe > 0) {
            meilleurPath = pathChoisi;
            meilleurIdentifier = bordChoisi.id;
        }
    }
    return { coups: [...meilleurPath.coups, meilleurIdentifier], value: meilleurPath.value }
}
