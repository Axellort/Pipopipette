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