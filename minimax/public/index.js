let nb = 4;
let nJoueurs = 2;

createDom(nb);

//! SETTING CONSTANTS 
const CLASS_TAKEN = "taken";
const gameElement = document.getElementById("game");
const CLASS_MY_TURN = "";

//! GETTING ELEMENTS AND SETTING ONCLICKS

const scoresElementsIds = ["first-score", "second-score"];
const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))

let bordersV = []; 
let bordersH = [];
let tilesHTMLInfo = [];
let playerActu = 0;



function renderBoard(board){
    let n = board.n;
    nb = board.n;
    clearGame();
    createDom(n);
    initElements(n);

    for(let bord of board.bords.flat(2)){
        setBord(bord);
    }
    for(let tile of board.tiles.flat(1)){
        setTile(tile);
    }
    actualiserPoints();
}

function setBord(bord){
    if(bord.id.dir == 0){
        remplir(bordersH[bord.id.x][bord.id.y], bord.appartenance);
    }else {
        remplir(bordersV[bord.id.x][bord.id.y], bord.appartenance);
    }
}
function setTile(tile){
    console.log(tile.x, tile.y)
    remplirCase(tilesHTMLInfo[tile.x][tile.y].el, tile.appartenance);
}

/** 
 * @typedef TileInfo
 * @property {HTMLElement | null} el
 * @property {number[]} clicsH
 * @property {number[]} clicsV
 * @property {number} appartenance
 * 
 */
/**
 * @typedef BorderInfo
 * @property {HTMLElement| null} el
 * @property {number} appartenance
 */
function initElements(n) {
    /** @type BorderInfo[][] */
    bordersV = Array(n);
    /** @type BorderInfo[][] */
    bordersH = Array(n);
    /** @type TileInfo[][] */
    tilesHTMLInfo = Array(n);
    for (let i = 0; i < n; i++) {
        tilesHTMLInfo[i] = [];
        bordersH[i] = [];
        bordersV[i] = [];
        for (let j = 0; j < n; j++) {

            console.log(i + ", " + j);

            tilesHTMLInfo[i].push({ el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 });
            bordersV[i].push({ el: document.getElementById(`border-${i}-${j}-V`), appartenance: -1 });
            bordersH[i].push({ el: document.getElementById(`border-${i}-${j}-H`), appartenance: -1 });
        }
    }
    let right = n;
    bordersV.push([]);
    for (let j = 0; j < n; j++) {
        bordersV[right].push({ el: document.getElementById(`border-${right}-${j}-V`), appartenance: -1 });
    }
    let bottom = n;
    for (let i = 0; i < n; i++) {
        bordersH[i].push({ el: document.getElementById(`border-${i}-${bottom}-H`), appartenance: -1 });
    }
}



//! HELPER FUNCTIONS
function remplir(border, player) {
    border.appartenance = player;
    border.el.classList.add("selected")
    border.el.classList.add(getBorderClassName(player))

}


function remplirCase(tileEl, appartenance) {
    console.log(tileEl)
    tileEl.classList.add(getTileClassName(appartenance), CLASS_TAKEN);
}

function compterLesPoints(cases) {
    let points = [0, 0, 0, 0, 0];
    for (let tile of cases.flat()) {
        if (tile.appartenance >= 0) {
            points[tile.appartenance]++;
        }
    }
    return points;
}

function actualiserPoints() {
    const points = compterLesPoints(tilesHTMLInfo);
    for (let [idx, el] of scoresElements.entries()) {
        el.innerText = points[idx].toString();
    }
}

function getBorderClassName(player) {
    return "border-" + player;
}
function getTileClassName(player) {
    return "tile-" + player;
}
function getIndicatorClass(player) {
    return "indicator-" + player;
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
    gameEl?.append(...gameElements);
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
    return generateBorder(x, y, "h");

}
function generateBorderV(x, y) {
    return generateBorder(x, y, "v");
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {"v" | "h"} direction 
 */
function generateBorder(x, y, direction) {
    let border = document.createElement("div");
    border.classList.add(direction, "border");
    border.id = `border-${x}-${y}-${direction.toUpperCase()}`;
    return border;
}
function generateTile(x, y) {
    let tile = document.createElement("div");
    tile.setAttribute("class", "tile");
    tile.setAttribute("id", `tile-${x}-${y}`);
    return tile;
}