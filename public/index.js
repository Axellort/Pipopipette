let socket = io();
let ourId = -1;
let nb = 4;
let nJoueurs = 2;

createDom(nb);
//! SETTING CONSTANTS 
const CLASS_TAKEN = "taken";

//! GETTING ELEMENTS AND SETTING ONCLICKS

const scoresElementsIds = ["first-score", "second-score"];
const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))
const myPlayerEl = document.getElementById("my-player");
const playerPlaying= document.getElementById("player-playing")
let bordersV = []; // TODO A MODIFIER, C'EST MOCHE COMME CA
let bordersH = [];
let tiles = [];
let playerActu = 0;

socket.on("new-game", (n, nPlayers) => {
    playerActu = 0;
    nb = n;
    nJoueurs = nPlayers;
    clearGame();
    createDom(n);
    initElements(n);
});
socket.on("player-id", id => { ourId = id; setJoueurEl(ourId) });
socket.on("click", (player, i, j, str) => onClick(player, i, j, str));

socket.on("connect", () => console.log("Weconnected"))
function initElements(n) {
    bordersV = []; // TODO A MODIFIER, C'EST MOCHE COMME CA
    bordersH = [];
    tiles = [];
    for (let i = 0; i < n; i++) {
        tiles.push([]);
        bordersH.push([]);
        bordersV.push([]);
        for (let j = 0; j < n; j++) {

            console.log(i + ", " + j);

            tiles[i].push({ el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 });
            bordersV[i].push({ el: document.getElementById(`border-${i}-${j}-V`), appartenance: -1 });
            bordersH[i].push({ el: document.getElementById(`border-${i}-${j}-H`), appartenance: -1 });
            setOnClick(i, j, "h");
            setOnClick(i, j, "v");

        }
    }
    let right = n;
    bordersV.push([]);
    for (let j = 0; j < n; j++) {
        bordersV[right].push({ el: document.getElementById(`border-${right}-${j}-V`), appartenance: -1 });
        setOnClick(right, j, "v");
    }
    let bottom = n;
    for (let i = 0; i < n; i++) {
        bordersH[i].push({ el: document.getElementById(`border-${i}-${bottom}-H`), appartenance: -1 });
        setOnClick(i, bottom, "h");
    }
}


function setOnClick(i, j, str) {
    const bordersBorder = str == "v" ? bordersV : bordersH;
    bordersBorder[i][j].el.onclick = () => {
        console.log(`emit click ${i}-${j}`);
        socket.emit("click", ourId, i, j, str);
    }

}
function onClick(player, i, j, str) {
    console.info(` Received Click from WS : player ${player}, playerActu ${playerActu}`);
    if (player != playerActu) return;
    border = str == "v" ? bordersV[i][j] : bordersH[i][j];
    if (border.appartenance != -1) { return };
    if (str == "v") {
        if (i != nb && j != nb) { tiles[i][j].clicsV[0] = 1; }
        if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
        remplir(bordersV[i][j], player);
        let gotNewCases = checkRemplis(tiles, getJoueurActu());
        if (!gotNewCases) {
            getNextJoueur();
        }
        actualiserPoints();
    } else if (str == "h") {
        if (i != nb && j != nb) { tiles[i][j].clicsH[0] = 1; }
        if (j != 0) { tiles[i][j - 1].clicsH[1] = 1; }
        remplir(bordersH[i][j], player);
        let gotNewCases = checkRemplis(tiles, getJoueurActu());
        if (!gotNewCases) {
            getNextJoueur();
        }
        actualiserPoints();
    }

}


//! HELPER FUNCTIONS
function remplir(border, player) {
    border.appartenance = player;
    border.el.classList.add(getBorderClassName(player));
}
//rajouter si côté déjà cliqué
function checkFull(tile) {
    return tile.clicsV[0] == 1 && tile.clicsV[1] == 1 && tile.clicsH[0] == 1 && tile.clicsH[1] == 1;
}
function checkRemplis(cases, joueurActuel) {
    let nouvellesCasesRemplies = false;
    for (let tile of cases.flat()) {
        if (checkFull(tile) && tile.appartenance == -1) {
            tile.appartenance = joueurActuel;
            colorerCase(tile);
            nouvellesCasesRemplies = true;
        }
    }
    return nouvellesCasesRemplies;
}

function colorerCase(tile) {
    tile.el.classList.add(getTileClassName(tile.appartenance), CLASS_TAKEN);
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
// get joueur actu à mettre avec le socket ?
function actualiserPoints() {
    const points = compterLesPoints(tiles);
    for (let [idx, el] of scoresElements.entries()) {
        el.innerText = points[idx]
    }
}
function getJoueurActu() {
   
    return playerActu;
}
function getNextJoueur() {
    playerPlaying.classList.add(getIndicatorClass(playerActu)) 
    playerPlaying.removeAttribute(getIndicatorClass((playerActu-1)%n))
    playerActu++;
    playerActu = playerActu % nJoueurs;
    return playerActu;
}
function setJoueurEl(player) {
    myPlayerEl.classList.add(getIndicatorClass(player));
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