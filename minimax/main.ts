console.log("Hello from TypeScript")

interface Bord {
    appartenance: number,
    x: number,
    y: number,
    dir: Direction;
}
interface Tile {
    appartenance: number,
    x: number,
    y: number
}
enum Direction {
    HORIZONTAL,
    VERTICAL
};
interface path {
    coups: number[],
    value: number
}

class Board {
    n: number;
    bordsV: Bord[][];
    bordsH: Bord[][];
    bords: Bord[][][];
    tiles: Tile[][];
    isMin: boolean;

    constructor(n: number = 0, bords: Bord[] = [], tiles: Tile[][] = [], isMin: boolean = false, bordsV: Bord[][] = [], bordsH: Bord[][] = []) {
        this.n = n;
        this.tiles = this.generateTiles(tiles);
        this.bords = bords;
        this.bordsV = bordsV;
        this.bordsH = bordsH;
        this.isMin = isMin;
    }
    generateTiles(tiles: Tile[][]): Tile[][] {
        // TODO récupérer la fonction de Pipopipette pour colorier les cases qu'il faut 
        let newTiles: Tile[][] = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                let tile = tiles[i][j];
                if (tile.appartenance != -1) {
                    newTiles[i][j].appartenance = tile.appartenance;
                } if (this.checkFull(tile)) {
                    newTiles[i][j].appartenance = this.getJoueurActu();
                }
            }
        }
        return newTiles;
    }
    // * A tester
    checkFull(tile: Tile): boolean {
        let { x, y, appartenance } = tile;
        if (appartenance != -1) throw "should not have an appartenance";
        return (this.bordsV[x][y].appartenance != -1) && (x < this.n - 1 ? this.bordsV[x + 1][y].appartenance != -1 : true) && (this.bordsH[x][y].appartenance != -1) && (y < this.n - 1 ? this.bordsH[x][y + 1].appartenance != -1 : true);
    }
    getJoueurActu(): number {
        return Number(this.isMin);
    }
    scores(): [number, number] {
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
        let newBordsH = JSON.parse(JSON.stringify(this.bordsH));
        let newBordsV = JSON.parse(JSON.stringify(this.bordsV));
        if (bord.dir = Direction.HORIZONTAL) {
            newBordsH[bord.x][bord.y].appartenance = this.getJoueurActu();
        } else {
            newBordsV[bord.x][bord.y].appa
        }
        newBords[bord].appartenance = this.getJoueurActu();
        return new Board(this.n, newBords, this.tiles, !this.isMin);
    }

    coordonnes(idx: number): { x: number, y: number, dir: "v" | "h" } {
        let x = idx % this.n;
        let y = (idx - x) / this.n;
        return { x, y, dir: "v" };
    }
    bordsLibres(): Bord[] {
        return this.bords.filter((bord: Bord) => bord.appartenance = -1);
    }
}


function miniMax(board: Board, depth: number): path {
    let valeurs: Map<Bord, path> = new Map();
    for (const bordLibre of board.bordsLibres()) {
        valeurs.set(bordLibre, miniMax(board.jouer(bordLibre.index), depth + 1))
    }

    return findExtrem(valeurs, board.isMin);
}


// * has been tested, should work
export function findExtrem(map: Map<Bord, path>, isMin: boolean): path {
    let signe = 1 - Number(isMin) * 2;
    let meilleurPath: path = { coups: [], value: - signe * Infinity };
    let meilleurIdx: [number, number] = [-1, -1];
    for (let [idx, pathChoisi] of Array.from(map.entries())) {
        if ((pathChoisi.value - meilleurPath.value) * signe > 0) {
            meilleurPath = pathChoisi;
            meilleurIdx = idx;
        }
    }
    return { coups: [...meilleurPath.coups, meilleurIdx], value: meilleurPath.value }
}
