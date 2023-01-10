const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("game") ?? null;
let socket = io();
let myPlayerId = -1;
let nb = 4;
let nJoueurs = 2;
createDom(nb);

//! SETTING CONSTANTS
const CLASS_TAKEN = "taken";
const gameElement = document.getElementById("game");
const CLASS_MY_TURN = "my-turn";

//! GETTING ELEMENTS AND SETTING ONCLICKS

const scoresElementsIds = ["first-score", "second-score"];
const scoresElements = scoresElementsIds.map((id) =>
  document.getElementById(id)
);
const myPlayerEl = document.getElementById("my-player");
let bordersV = [];
let bordersH = [];
let tiles = [];
let playerActu = 0;

socket.emit("game-id", gameId);
socket.on("connect", () => console.log("Weconnected"));
socket.on("player-id", (id) => {
  myPlayerId = id;
  setJoueurEl(myPlayerId);
});
socket.on("new-game", (n, nPlayers) => {
  playerActu = 0;
  nb = n;
  nJoueurs = nPlayers;
  clearGame();
  createDom(n);
  initElements(n);
});
socket.on("click", (player, i, j, str) => onClick(player, i, j, str));

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
  tiles = Array(n);
  for (let i = 0; i < n; i++) {
    tiles[i] = [];
    bordersH[i] = [];
    bordersV[i] = [];
    for (let j = 0; j < n; j++) {
      console.log(i + ", " + j);

      tiles[i].push({
        el: document.getElementById(`tile-${i}-${j}`),
        clicsH: [0, 0],
        clicsV: [0, 0],
        appartenance: -1,
      });
      bordersV[i].push({
        el: document.getElementById(`border-${i}-${j}-V`),
        appartenance: -1,
      });
      bordersH[i].push({
        el: document.getElementById(`border-${i}-${j}-H`),
        appartenance: -1,
      });
      setOnClick(i, j, "h");
      setOnClick(i, j, "v");
    }
  }
  let right = n;
  bordersV.push([]);
  for (let j = 0; j < n; j++) {
    bordersV[right].push({
      el: document.getElementById(`border-${right}-${j}-V`),
      appartenance: -1,
    });
    setOnClick(right, j, "v");
  }
  let bottom = n;
  for (let i = 0; i < n; i++) {
    bordersH[i].push({
      el: document.getElementById(`border-${i}-${bottom}-H`),
      appartenance: -1,
    });
    setOnClick(i, bottom, "h");
  }
}

function setOnClick(i, j, str) {
  const bordersBorder = str == "v" ? bordersV : bordersH;
  bordersBorder[i][j].el.onclick = () => {
    console.log(`emit click ${i}-${j}`);
    socket.emit("click", myPlayerId, i, j, str);
  };
}
function onClick(player, i, j, str) {
  console.info(
    ` Received Click from WS : player ${player}, playerActu ${playerActu}`
  );
  if (player != playerActu) return;
  let border = str == "v" ? bordersV[i][j] : bordersH[i][j];
  if (border.appartenance != -1) {
    return;
  }
  if (str == "v") {
    if (i != nb && j != nb) {
      tiles[i][j].clicsV[0] = 1;
    }
    if (i != 0) {
      tiles[i - 1][j].clicsV[1] = 1;
    }
    remplir(bordersV[i][j], player);
    let gotNewCases = checkRemplis(tiles, getJoueurActu());
    if (!gotNewCases) {
      getNextJoueur();
    }
    actualiserPoints();
  } else if (str == "h") {
    if (i != nb && j != nb) {
      tiles[i][j].clicsH[0] = 1;
    }
    if (j != 0) {
      tiles[i][j - 1].clicsH[1] = 1;
    }
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
  border.el.classList.add("selected");
  setTimeout(() => border.el.classList.add(getBorderClassName(player)), 0);
}

function checkFull(tile) {
  return (
    tile.clicsV[0] == 1 &&
    tile.clicsV[1] == 1 &&
    tile.clicsH[0] == 1 &&
    tile.clicsH[1] == 1
  );
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
    el.innerText = points[idx].toString();
  }
}
function getJoueurActu() {
  return playerActu;
}
function getNextJoueur() {
  playerActu++;
  playerActu = playerActu % nJoueurs;
  changerStyleGameEl(playerActu, myPlayerId);
  return playerActu;
}
function changerStyleGameEl(actu, our) {
  if (actu == our) {
    gameElement?.classList.add(CLASS_MY_TURN);
  } else {
    gameElement?.classList.remove(CLASS_MY_TURN);
  }
}
function setJoueurEl(player) {
  myPlayerEl?.classList.add(getIndicatorClass(player));
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
    gameElements = [
      ...gameElements,
      ...generateBorderLine(j, n),
      ...generateTileLine(j, n),
    ];
  }
  gameElements.push(...generateBorderLine(n, n));
  gameEl?.append(...gameElements);
}
function clearGame() {
  document.getElementById("game").innerHTML = "";
}
function setNVariableCSS(n) {
  document.documentElement.style.setProperty("--n", n);
}
function generateBorderLine(y, n) {
  let lineElements = [];
  for (let i = 0; i < n; i++) {
    let cross = generateCross();
    let borderH = generateBorderH(i, y);
    lineElements.push(cross, borderH);
  }
  lineElements.push(generateCross());
  return lineElements;
}
function generateTileLine(y, n) {
  let lineElements = [];
  for (let i = 0; i < n; i++) {
    let borderV = generateBorderV(i, y);
    let tile = generateTile(i, y);
    lineElements.push(borderV, tile);
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
