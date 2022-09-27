let socket = io();
const n = 5;
createDom(n);
//! SETTING CONSTANTS 
const COLORS = ["red", "blue"]
const CLASS_NAMES_PER_PLAYER = ["first", "second"];
const CLASS_TAKEN = ["taken"];

//! GETTING ELEMENTS AND SETTING ONCLICKS
const scoresElementsIds = ["first-score", "second-score"];
const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))

let bordersV = []; // TODO A MODIFIER, C'EST MOCHE COMME CA
let bordersH = [];
let tiles = [];
let playerActu = 0;
for (let i = 0; i < n; i++) {
    tiles.push([]);
    bordersH.push([]);
    bordersV.push([]);
    for (let j = 0; j < n; j++) {

        console.log(i + ", " + j);

        tiles[i].push({ el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 });
        bordersV[i].push(document.getElementById(`border-${i}-${j}-V`));
        bordersH[i].push(document.getElementById(`border-${i}-${j}-H`));
        setOnClick(i, j, "h");
        setOnClick(i, j, "v");

    }
}

let right = n;
bordersV.push([]);
for (let j = 0; j < n; j++) {
    bordersV[right].push(document.getElementById(`border-${right}-${j}-V`));
    setOnClick(right, j, "v");
}
let bottom = n;
for (let i = 0; i < n; i++) {
    bordersH[i].push(document.getElementById(`border-${i}-${bottom}-H`));
    setOnClick(i, bottom, "h");
}

socket.on("click", (player, i, j, str) => onClick(player, i, j, str));
function setOnClick(i, j, str) {
    const bordersBorder = str == "v" ? bordersV : bordersH;
    bordersBorder[i][j].onclick = () => { console.log(`emit click ${i}-${j}`); socket.emit("click", i, j, str); }

}
function onClick(player, i, j, str) {
    el = str == "v" ? bordersV[i][j] : bordersH[i][j];
    if (str == "v") {
        if (i != n && j != n) { tiles[i][j].clicsV[0] = 1; }
        if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
        remplir(bordersV[i][j], player);
        checkRemplis(tiles, player);
        actualiserPoints();
    } else if (str == "h") {
        if (i != n && j != n) { tiles[i][j].clicsH[0] = 1; }
        if (j != 0) { tiles[i][j - 1].clicsH[1] = 1; }
        remplir(bordersH[i][j], player);
        checkRemplis(tiles, player);
        actualiserPoints();
    }
}


//! HELPER FUNCTIONS
function remplir(borderEl, player) {
    borderEl.classList.add("border-" + player);
}
//rajouter si côté déjà cliqué
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
// get joueur actu à mettre avec le socket ?
function actualiserPoints() {
    const points = compterLesPoints(tiles);
    for (let [idx, el] of scoresElements.entries()) {
        el.innerText = points[idx]
    }
}
// TODO valider le tour ?
// TODO ne pas changer le tour si nouvelle case remplie




// ! Creating DOM

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
function clearGame() {
    document.getElementById("game").innerHTML = "";

}
function setNVariableCSS(n) {
    document.documentElement.style.setProperty("--n", n)
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