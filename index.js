//grille à n cotes
const n = 5;

//création de la grille
createDom(n);


// constantes couleur joueur
const COLORS = ["red", "blue"]
const CLASS_NAMES_PER_PLAYER = ["first", "second"];
const CLASS_TAKEN = ["taken"];

// recupere les elements fixes et onclick

const scoresElementsIds = ["first-score", "second-score"];
// pour chaque element de la lister du dessus je recupere l'element qui a cette id
const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))
let bordersV = []; 
let bordersH = [];
let tiles = [];
let playerActu = 0;
for (let i = 0; i < n; i++) {
// je crée 3 tableaux de n listes pour les cases et les bords horizontaux et verticaux    
    tiles.push([]);
    bordersH.push([]);
    bordersV.push([]);
    for (let j = 0; j < n; j++) {

        console.log(i + ", " + j);
// dans chaque liste du tableau "tiles" j'ajoute l'element d'identifiant tile-coordonnéex-coordonéey 
        tiles[i].push({ el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance: -1 });
// de même pour les bords verticaux et horizontaux j'ajoute les elements border-coordonnéex-coordonnéey
        bordersV[i].push(document.getElementById(`border-${i}-${j}-V`));
        bordersH[i].push(document.getElementById(`border-${i}-${j}-H`));
// je donne une fonction à chaque bord horizontal et vertical qui colore les bords selon la couleur du joueur(voirsetonclick)
        setOnClick(bordersH[i][j], "h", i, j);
        setOnClick(bordersV[i][j], "v", i, j);

    }
}
//je pose une variable right
let right = n;
// j'ajoute une liste à mon tableau pour l'extrêmité droite
bordersV.push([]);
for (let j = 0; j < n; j++) {
//j'ajoute les éléments border-right-y pour passer de n à n+1 colonnes à ma grille
    bordersV[right].push(document.getElementById(`border-${right}-${j}-V`));
//je donne à mes bords la fonction setonclick
    setOnClick(bordersV[right][j], "v", right, j);
}
//je pose une variable bottom
let bottom = n;
for (let i = 0; i < n; i++) {
//dans chaque liste du tableau je rajoute l'élément border-x-bottom pour passer de n à n+1 lignes
    bordersH[i].push(document.getElementById(`border-${i}-${bottom}-H`));
//je donne à mes bords setonclick
    setOnClick(bordersH[i][bottom], "h", i, bottom);
}

//

//je crée ma fonction setonclick
function setOnClick(el, str, i, j) {
// si c'est un bord vertical
    if (str == "v") {
//si je clique sur un élément je lance ce qu'il y a après
        el.onclick = () => {
//si la case n'est pas une case sur les extrêmités
            if (i != n && j != n) { tiles[i][j].clicsV[0] = 1; }
            if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
            remplir(bordersV[i][j]);
            checkRemplis(tiles, getJoueurActu());
            getNextJoueur();
            actualiserPoints();
        }
    } else if (str == "h") {
        el.onclick = () => {
            if (i != n && j != n) { tiles[i][j].clicsH[0] = 1; }
            if (j != 0) { tiles[i][j - 1].clicsH[1] = 1; }
            remplir(bordersH[i][j]);
            checkRemplis(tiles, getJoueurActu());
            getNextJoueur();
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

