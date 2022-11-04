// d'abord je crée des variables et des fonctionjs que j'utilise plus tard

//grille à n cotes
const n = 6;

// constantes couleur joueur
const COLORS = ["red", "blue"];
const CLASS_NAMES_PER_PLAYER = ["first", "second"];
const CLASS_TAKEN = ["taken"];

// recupere les elements fixes et onclick
 const scoresElementsIds = ["first-score", "second-score"];

// .map permet de créer un nouvelle liste à partir d'une autre 
// ici je crée deux élément ayant un id first-score et second-score
const scoresElements = scoresElementsIds.map((id) => document.getElementById(id))
let bordersV = []; 
let bordersH = [];
let tiles = [];
let playerActu = 0;

//fonction qui permet d'ajouter au nom de mon bord "border-0/1" pour le colorer dans le css
function remplir(borderEl) {
    borderEl.classList.add("border-" + playerActu);
}

// conditon que j'aurais pu mettre dans checkRemplis pour savoir si les 4 bords de la case sont colorés
function checkFull(tile) {
    return tile.clicsV[0] == 1 && tile.clicsV[1] == 1 && tile.clicsH[0] == 1 && tile.clicsH[1] == 1;
}
function checkRemplis(cases, joueurActuel) {
    // .flat permet de créer un nouveau tableau dans lequel j'extrais les sous  tableaux 
    for (let tile of cases.flat()) {
        if (checkFull(tile) && tile.appartenance == -1) {
            tile.appartenance = joueurActuel;
            colorerCase(tile)
        }
    }
}
//fonction qui permet d'ajouter à la class de ma case "first/second" et "taken" pour le colorer dans le css
function colorerCase(tile) {
    tile.el.classList.add(CLASS_NAMES_PER_PLAYER[tile.appartenance], CLASS_TAKEN);
}

//fonction qui permet de compter les points dans une liste si l'appartenance est 0 ou 1
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
function getNextJoueur() {
    playerActu = 1 - playerActu
    return playerActu;
}

//je crée ma fonction setonclick
function setOnClick(el, str, i, j) {
    // si c'est un bord vertical
        if (str == "v") {
    //si je clique sur un élément je lance ce qu'il y a après
            el.onclick = () => {
    //si le bord vertical n'est pas tout à droite alors j'ajoute 1 à la case de mm coordonée tiles(i,j).clicsV[0] =1
                if (i != n ) { tiles[i][j].clicsV[0] = 1; }
    //si le bord vertical n'est pas tout à gauche alors j'ajoute 1 à la case située à gauche de mon bord
                if (i != 0) { tiles[i - 1][j].clicsV[1] = 1; }
    //je remplis mon bord avec la couleur
                remplir(bordersV[i][j]);
                checkRemplis(tiles, getJoueurActu());
                getNextJoueur();
                actualiserPoints();
            }
        } else if (str == "h") {
    // même chose que pour les bords verticaux mais horizontaux
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
// autres fonctions que j'utilise ppour créer le cadrillage

function setNVariableCSS(n) {
    document.documentElement.style.setProperty("--n", n)
}

//je crée un élément div de class cross 
function generateCross() {
    let cross = document.createElement("div");
    cross.classList.add("cross");
    return cross;
}

// je génère un bord vertical que j'appelle div de class h border et de id border x,y,H
function generateBorderH(x, y) {
    let borderH = document.createElement("div");
    borderH.setAttribute("class", "h border");
    borderH.setAttribute("id", `border-${x}-${y}-H`);
    return borderH;
}

//de même que pour les bords horizontaux
function generateBorderV(x, y) {
    let borderV = document.createElement("div");
    borderV.setAttribute("class", "v border");
    borderV.setAttribute("id", `border-${x}-${y}-V`);
    return borderV;
}

//pareil
function generateTile(x, y) {
    let tile = document.createElement("div");
    tile.setAttribute("class", "tile");
    tile.setAttribute("id", `tile-${x}-${y}`);
    return tile;
}

// je crée un liste contenant un carré, un bord, un carré, un bord... (n fois) -> une ligne du cadrillage)
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

// je crée une ligne contenant un bord vertical, une case... (n fois)
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

//je crée ma grille
function createDom(n) {
    //je donne à gameEl le id game pour l'afficher dans le html
    let gameEl = document.getElementById("game");
    setNVariableCSS(n);
    let gameElements = [];
    //j'ajoute chaque ligne 
    for (let j = 0; j < n; j++) {
        gameElements = [...gameElements, ...generateBorderLine(j, n), ...generateTileLine(j, n)];
    }
    //je rajoute une dernière pour fermer le cadrillage
    gameElements.push(...generateBorderLine(n, n));
// je mets dans gameEl tous mes bords mes cases et mes petits carrés
    gameEl.append(...gameElements);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////   
//mon programme en tant que tel 

//création de la grille
createDom(n);

for (let i = 0; i < n; i++) {
// je crée 3 tableaux de n listes pour les cases et les bords horizontaux et verticaux    
    tiles.push([]);
    bordersH.push([]);
    bordersV.push([]);
    for (let j = 0; j < n; j++) {

        console.log(i + ", " + j);
// dans chaque liste du tableau "tiles" j'ajoute l'element d'identifiant tile-coordonnéex-coordonéey 
// j'ajoute aussi clicsV et H qui indiquent si les 4 cotés ont été cliqués
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

