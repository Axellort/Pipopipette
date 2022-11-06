import { SocketAddress } from "net";

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
    playerNb: boolean;
    scores: [number, number];

    constructor(n: number = 0, bords: Bord[][][] = [], tiles: Tile[][] = [], playerNb: boolean = false) {
        if (i % 1 == 0) console.log(`Constructor new Board ------------------------------------------------------------------ ${i}`);
        i++;
        this.n = n;
        this.bords = bords;
        this.playerNb = playerNb;
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
                if (tile.appartenance == -1 && this.checkFull(tile)) {
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

        return (this.bords[1][x][y].appartenance != -1) && (x < this.n ? this.bords[1][x + 1][y].appartenance != -1 : true) && (this.bords[0][x][y].appartenance != -1) && (y < this.n ? this.bords[0][x][y + 1].appartenance != -1 : true);
    }
    getJoueurActu(): number {
        return Number(this.playerNb);
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

    jouer(bordId: Identifier): Board {
        let newBords = JSON.parse(JSON.stringify(this.bords)) as Bord[][][];
        newBords[bordId.dir][bordId.x][bordId.y].appartenance = this.getJoueurActu();
        return new Board(this.n, newBords, this.tiles, !this.playerNb);
    }

    coordonnes(idx: number): Identifier {
        let x = idx % this.n;
        let y = (idx - x) / this.n;
        return { x, y, dir: 0 };
    }
    bordsLibres(): Bord[] {
        return this.bords.flat(2).filter((bord: Bord) => bord.appartenance == -1);
    }
}


export function miniMax(board: Board, maxDepth: number, depth: number = 0): path {
    let valeurs: Map<Bord, path> = new Map();
    if (depth == maxDepth) {
        return { coups: [], value: evaluer(board) }
    }
    let score = board.scores;
    console.log(score)
    if (score[0] > board.n ** 2 / 2) return { coups: [], value: Infinity };
    if (score[1] > board.n ** 2 / 2) return { coups: [], value: -Infinity };

    //if (depth == 1) console.log(depth, board.bords.flat(2).map((bord) => bord.appartenance));
    for (const bordLibre of board.bordsLibres()) {
        valeurs.set(bordLibre, miniMax(board.jouer(bordLibre.id), maxDepth, depth + 1));
    }

    return findExtrem(valeurs, board.playerNb);
}
function evaluer(board: Board): number {
    //if (i == 160000) { console.log(JSON.stringify(board.tiles.flat().map((ti) => ti.appartenance))); console.log(JSON.stringify(board.bords.map((l) => (l.map((ll) => (ll.map((lll) => lll.appartenance))))), null, 4)) }
    console.log(board.scores[0], board.scores[1])
    return board.scores[0] - board.scores[1];
}


// * has been tested, should work
export function findExtrem(map: Map<Bord, path>, playerNb: boolean): path {
    let signe = - (Number(playerNb) * 2 - 1); // si 0->1; 1->-1
    //console.log(signe);
    let meilleurPath: path = { coups: [], value: - signe * Infinity };
    //console.log(meilleurPath);
    let meilleurIdentifier: Identifier = { dir: 0, x: -1, y: -1 };
    for (let [bordChoisi, pathChoisi] of Array.from(map.entries())) {
        if ((pathChoisi.value - meilleurPath.value) * signe > 0) {
            meilleurPath = pathChoisi;
            meilleurIdentifier = bordChoisi.id;
        }
    }
    return { coups: [...meilleurPath.coups, meilleurIdentifier], value: meilleurPath.value }
}
