const COLORS = ["red", "blue"]
const n = 2;
console.log(document.getElementById(`border-0-0-V`))
// récupérer les cases
// --------------
let bordersV = [[0,0],[0,0]];
let bordersH = [[0,0],[0,0]];
let tiles = [0,0];
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        bordersV[i][j] = document.getElementById(`border-${i}-${j}-V`);
        bordersH[i][j] = document.getElementById(`border-${i}-${j}-H`);
        tiles[i][j] = { el: document.getElementById(`tile-${i}-${j}`), clicsH: [0, 0], clicsV: [0, 0], appartenance:-1 };
        console.log(bordersH[i][j], document.getElementById(`border-${i}-${j}-V`), tiles)
        bordersV[i][j].onclick = i == 0 ? () => { tiles[i][j].clicsV[1] = 1; checkRemplis(tiles, getNextJoueur()); } : () => {
            tiles[i - 1][j].clicsV[1] = 1;
            tiles[i][j].clicsV[1] = 1;
            checkRemplis(tiles, getNextJoueur());

        }
            
            bordersH[i][j].onclick = j==0 ? ()=>{tiles[i][j].clicsH[1] = 1; checkRemplis(tiles, getNextJoueur());} : () => {
            tiles[i][j - 1].clicsH[1] = 1;
            tiles[i][j].clicsH[1] = 1;
            checkRemplis(tiles, getNextJoueur());
        }
        
    }
}
document.onclick = (ev)=>{

}
//rajouter si côté déjà cliqué
function checkFull(tile){
    return tile.clicsV[0] == 1 && tile.clicsV[1] == 1 && tile.clicsH[0] == 1 && tile.clicsH[1] == 1; 
}
function checkRemplis(cases, joueurActuel) {
    for (let tile of cases) {
        if (checkFull(tile)) {
            tile.appartenance = joueurActuel;
            colorerCase(tile)
        }
    }
}

function colorerCase(tile) {
    tile.el.classList.add(tile.appartenance);
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
let joueur = 0;
function getNextJoueur(){
    joueur = 1-joueur
    return joueur;
}
// TODO valider le tour ?