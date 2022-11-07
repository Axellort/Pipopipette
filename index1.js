const n = 6;

const COLORS = ["red", "blue"];
const CLASS_NAMES_PER_PLAYER = ["first", "second"];
const CLASS_TAKEN = ["taken"];

 const scoresElementsIds = ["first-score", "second-score"];

const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))
let bordersV = []; 
let bordersH = [];
let tiles = [];
let playerActu = 0;
playerActu.setAttribute("class","playeractu")
playerActu.setAttribute("id", "first")

function remplir(borderEl) {
    borderEl.classList.add("border-" + playerActu);
}

function checkFull(tile) {
    return tile.clicsV[0] == 1 && tile.clicsV[1] == 1 && tile.clicsH[0] == 1 && tile.clicsH[1] == 1;
}
function checkRemplis(cases, joueurActuel) {
    for (let tile of cases.flat()) {
        if (checkFull(tile) && tile.appartenance == -1) {
            tile.appartenance = joueurActuel;
            colorerCase(tile)
        }
    }
}
function colorerCase(tile) {
    tile.el.classList.add(CLASS_NAMES_PER_PLAYER[tile.appartenance], CLASS_TAKEN);
}

function compterLesPoints(cases) {
    let points = [0, 0];
    for (let tile of cases.flat()) {
        if (tile.appartenance >= 0) {
            points[tile.appartenance]++;
        }
    }
    return points;
}

//
function actualiserPoints() {
    const points = compterLesPoints(tiles);
    for (let [idx, el] of scoresElements.entries()) {
        el.innerText = points[idx]
    }
}

function getJoueurActu() {
    return playerActu;
}

function getIndicatorClass(player) {
    return "indicator-" + player;
}

function getNextJoueur() {
    playerActu = 1 - playerActu
    playerActu.setAttribute("id",CLASS_NAMES_PER_PLAYER[playerActu%2])
    return playerActu;
}

function setOnClick(el, str, i, j) {
        if (str == "v") {
            el.onclick = () => {
                if (i != n ) { tiles[i][j].clicsV[0] = 1; }
                if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
                remplir(bordersV[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
                actualiserPoints();
            }
        } else if (str == "h") {
            el.onclick = () => {
                if ( j != n) { tiles[i][j].clicsH[0] = 1; }
                if (j != 0) { tiles[i][j - 1].clicsH[1] = 1; }
                remplir(bordersH[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
                actualiserPoints();
            }
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////

function setNVariableCSS(n) {
    document.documentElement.style.setProperty("--n", n)
}
 
function generateCross() {
    let cross = document.createElement("div");
    cross.classList.add("cross");
    return cross;
}

function generateBorderH(x, y) {
    let borderH = document.createElement("div");
    borderH.setAttribute("class", "h border");
    borderH.setAttribute("id", `border-${x}-${y}-H`);
    return borderH;
}

function generateBorderV(x, y) {
    let borderV = document.createElement("div");
    borderV.setAttribute("class", "v border");
    borderV.setAttribute("id", `border-${x}-${y}-V`);
    return borderV;
}

function generateTile(x, y) {
    let tile = document.createElement("div");
    tile.setAttribute("class", "tile");
    tile.setAttribute("id", `tile-${x}-${y}`);
    return tile;
}

function generateBorderLine(y, n) {
    let lineElements = [];
    for (let i = 0; i < n; i++) {
        let cross = generateCross();
        let borderH = generateBorderH(i, y)
        lineElements.push(cross, borderH)
    }
    lineElements.push(generateCross());
    return lineElements
}

function generateTileLine(y, n) {
    let lineElements = [];
    for (let i = 0; i < n; i++) {
        let borderV = generateBorderV(i, y);
        let tile = generateTile(i, y);
        lineElements.push(borderV, tile)
    }
    lineElements.push(generateBorderV(n, y));
    return lineElements;
}

function createDom(n) {
    let gameEl = document.getElementById("game");
    setNVariableCSS(n);
    let gameElements = []; 
    for (let j = 0; j < n; j++) {
        gameElements = [...gameElements, ...generateBorderLine(j, n), ...generateTileLine(j, n)];
    }
    gameElements.push(...generateBorderLine(n, n));
    gameEl.append(...gameElements);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////   

createDom(n);

for (let i = 0; i < n; i++) {  
    tiles.push([]);
    bordersH.push([]);
    bordersV.push([]);
    for (let j = 0; j < n; j++) {
        console.log(i + ", " + j);
        tiles[i].push({ el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 });
        bordersV[i].push(document.getElementById(`border-${i}-${j}-V`));
        bordersH[i].push(document.getElementById(`border-${i}-${j}-H`));
        setOnClick(bordersH[i][j], "h", i, j);
        setOnClick(bordersV[i][j], "v", i, j);

    }
}

let right = n;
bordersV.push([]);
for (let j = 0; j < n; j++) {
    bordersV[right].push(document.getElementById(`border-${right}-${j}-V`));
    setOnClick(bordersV[right][j], "v", right, j);
}

let bottom = n;
for (let i = 0; i < n; i++) {
    bordersH[i].push(document.getElementById(`border-${i}-${bottom}-H`));
    setOnClick(bordersH[i][bottom], "h", i, bottom);
}

