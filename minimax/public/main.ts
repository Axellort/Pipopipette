// TODO prendre en compte qu'on rejoue...

const MAX_NUMBER = 100000;
console.log("Hello from TypeScripte");
const MAX_DEPTH = 3;
let i = 0;
const noLog = true;
interface Bord {
  appartenance: number;
  id: Identifier;
}
interface Identifier {
  dir: 0 | 1;
  x: number;
  y: number;
}
interface Tile {
  appartenance: number;
  x: number;
  y: number;
}

interface path {
  coups: Identifier[];
  value: number;
}

class Board {
  n: number;
  bords: Bord[][][];
  tiles: Tile[][];
  playerNb: boolean;
  scores: [number, number];
  index: number;
  depth: number;

  constructor(
    n: number = 0,
    bords: Bord[][][] = [],
    tiles: Tile[][] = [],
    playerNb: boolean = false,
    scores: [number, number] = [0, 0],
    depth: number = 0
  ) {
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
    this.log(
      `Constructor new Board ---------------------------------- ${this.index} depth ${this.depth}`
    );
    this.log(JSON.stringify(this, null, 2));
  }
  log(str: string) {
    if (noLog) return;
    if (this.index % 10 == 0) console.log(str);
  }
  generateTiles(tiles: Tile[][], player: boolean): Tile[][] {
    // TODO récupérer la fonction de Pipopipette pour colorier les cases qu'il faut
    let newTiles: Tile[][] = Array(this.n);
    for (let i = 0; i < this.n; i++) {
      newTiles[i] = Array(this.n);
      for (let j = 0; j < this.n; j++) {
        let tile = tiles[i][j];
        newTiles[i][j] = tile;
        if (tile.appartenance == -1 && this.checkFull(tile)) {
          //console.log("change appartenance depth + " + this.depth)
          newTiles[i][j].appartenance = Number(player);
        }
      }
    }
    //console.log("new tiles : " + JSON.stringify(newTiles));
    return newTiles;
  }
  // * A tester
  checkFull(tile: Tile): boolean {
    let { x, y, appartenance } = tile;
    //if (appartenance != -1) throw "should not have an appartenance";

    return (
      this.bords[1][x][y].appartenance != -1 &&
      (x < this.n ? this.bords[1][x + 1][y].appartenance != -1 : true) &&
      this.bords[0][x][y].appartenance != -1 &&
      (y < this.n ? this.bords[0][x][y + 1].appartenance != -1 : true)
    );
  }
  getJoueurActu(): number {
    return Number(this.playerNb);
  }
  getScores(): [number, number] {
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
    let newBords = _.cloneDeep(this.bords);
    newBords[bordId.dir][bordId.x][bordId.y].appartenance =
      this.getJoueurActu();
    return new Board(
      this.n,
      newBords,
      _.cloneDeep(this.tiles),
      this.playerNb,
      this.scores,
      this.depth + 1
    );
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

function miniMax(board: Board, maxDepth: number, depth: number = 0): path {
  let valeurs: Map<Bord, path> = new Map();
  if (depth == maxDepth || board.bordsLibres().length == 0) {
    //console.log(`evaluation : ${evaluer(board)}`)
    return { coups: [{ dir: 0, x: 100, y: 100 }], value: evaluer(board) };
  }
  let score = board.scores;
  //console.log(score)
  if (score[0] > board.n ** 2 / 2) {
    return { coups: [{ dir: 0, x: 69, y: 69 }], value: MAX_NUMBER };
  }
  if (score[1] > board.n ** 2 / 2) {
    /*console.log(score)*/ return {
      coups: [{ dir: 1, x: 69, y: 69 }],
      value: -MAX_NUMBER,
    };
  }

  //if (depth == 1) console.log(depth, board.bords.flat(2).map((bord) => bord.appartenance));
  for (const bordLibre of board.bordsLibres()) {
    valeurs.set(
      bordLibre,
      miniMax(board.jouer(bordLibre.id), maxDepth, depth + 1)
    );
  }
  let findExtreme = findExtrem(valeurs, board.playerNb);
  //console.log(`minimax of depth ${depth} return value ${findExtreme.value} -------------------------`)
  return findExtreme;
}
function evaluer(board: Board): number {
  //if (i == 160000) { console.log(JSON.stringify(board.tiles.flat().map((ti) => ti.appartenance))); console.log(JSON.stringify(board.bords.map((l) => (l.map((ll) => (ll.map((lll) => lll.appartenance))))), null, 4)) }
  //console.log(board.scores[0], board.scores[1])
  return board.scores[0] - board.scores[1];
}

// * has been tested, should work
function findExtrem(map: Map<Bord, path>, playerNb: boolean): path {
  let signe = -(Number(playerNb) * 2 - 1); // si 0->1; 1->-1
  //console.log(signe);
  let meilleurPath: path = {
    coups: [{ dir: 0, x: 42, y: 42 }],
    value: -signe * MAX_NUMBER,
  };
  let meilleurIdentifier: Identifier = { dir: 0, x: -1, y: -1 };
  for (let [bordChoisi, pathChoisi] of Array.from(map.entries())) {
    if ((pathChoisi.value - meilleurPath.value) * signe >= 0) {
      meilleurPath = pathChoisi;
      meilleurIdentifier = bordChoisi.id;
    }
  }
  //console.log(meilleurPath.value + " MEILLEUR PATH VALUE -----------")
  return {
    coups: [...meilleurPath.coups, meilleurIdentifier],
    value: meilleurPath.value,
  };
}
