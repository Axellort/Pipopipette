
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

function setOnClick(el, str, i, j) {
    if (str == "v") {
        el.onclick = () => {
            if (i != n && j != n) { tiles[i][j].clicsV[0] = 1; }
            if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
            remplir(bordersV[i][j]);
            let gotNewCases = checkRemplis(tiles, getJoueurActu());
            if(!gotNewCases){
                getNextJoueur();
            }
            actualiserPoints();
        }
    } else if (str == "h") {
        el.onclick = () => {
            if (i != n && j != n) { tiles[i][j].clicsH[0] = 1; }
            if (j != 0) { tiles[i][j - 1].clicsH[1] = 1; }
            remplir(bordersH[i][j]);
            let gotNewCases = checkRemplis(tiles, getJoueurActu());
            if(!gotNewCases){
                getNextJoueur();
            }
            actualiserPoints();
        }
    }
}


//! HELPER FUNCTIONS
function remplir(borderEl) {
    borderEl.classList.add("border-" + playerActu);
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
function getJoueurActu() {
    return playerActu;
}
function getNextJoueur() {
    playerActu = 1 - playerActu
    return playerActu;
}
function actualiserPoints() {
    const points = compterLesPoints(tiles);
    for (let [idx, el] of scoresElements.entries()) {
        el.innerText = points[idx]
    }
}
// TODO valider le tour ?
// TODO ne pas changer le tour si nouvelle case remplie

