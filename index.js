const COLORS = ["red", "blue"]
const CLASS_NAMES_PER_PLAYER = ["first", "second"];
const CLASS_TAKEN = ["taken"];
const n = 2;
console.log(document.getElementById(`border-0-0-V`))

let bordersV = [[0, 0], [0, 0]];
let bordersH = [[0, 0], [0, 0]];
let tiles = [[0, 0], [0, 0]];
let playerActu = 0;
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        bordersV[i][j] = document.getElementById(`border-${i}-${j}-V`);
        bordersH[i][j] = document.getElementById(`border-${i}-${j}-H`);
        tiles[i][j] = { el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 };
        console.log(i + ", " + j);

        if (i == 0) {
            bordersV[i][j].onclick = () => {
                tiles[i][j].clicsV[1] = 1;
                remplir(bordersV[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
            }
        } else {
            bordersV[i][j].onclick = () => {
                tiles[i - 1][j].clicsV[0] = 1;
                tiles[i][j].clicsV[1] = 1;
                remplir(bordersV[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();

            }
        }

        if (j == 0) {
            bordersH[i][j].onclick = () => {
                tiles[i][j].clicsH[1] = 1;
                remplir(bordersH[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
            }
        } else {
            bordersH[i][j].onclick = () => {
                tiles[i][j - 1].clicsH[0] = 1;
                tiles[i][j].clicsH[1] = 1;
                remplir(bordersH[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
            }
        }


    }
}
document.onclick = (ev) => {

}

function remplir(borderEl) {
    borderEl.classList.add("border-" + playerActu);
}
//rajouter si côté déjà cliqué
function checkFull(tile) {
    return tile.clicsV[0] == 1 && tile.clicsV[1] == 1 && tile.clicsH[0] == 1 && tile.clicsH[1] == 1;
}
function checkRemplis(cases, joueurActuel) {
    for (let tile of cases.flat()) {
        if (checkFull(tile)) {
            tile.appartenance = joueurActuel;
            colorerCase(tile)
        }
    }
}

function colorerCase(tile) {
    tile.el.classList.add(CLASS_NAMES_PER_PLAYER[tile.appartenance], CLASS_TAKEN);
}

function compterLesPoints(cases) {
    let points = [];
    for (let tile of cases) {
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
// TODO valider le tour ?