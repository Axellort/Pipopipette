// @ts-nocheck
const formGameJoin = document.getElementById("join-form");
const joinGameInput = document.getElementById("join-input");
const joinGameBtn = document.getElementById("join-btn");


const formGameCreate = document.getElementById("create-form");
const createGameBtn = document.getElementById("create-btn");
const playerCountInput = document.getElementById("player-count");
const connectionTypeCheckbox = document.getElementById("connection-mode");


formGameJoin.addEventListener("submit", (event) => {
    event.preventDefault();
    goToOnlineGame(joinGameInput.value.length > 0 ? joinGameInput.value : Date.now().toString());
})
formGameCreate.addEventListener("submit", (event) => {
    event.preventDefault();
    const gameType = connectionTypeCheckbox.checked;
    const playerNumberUnsafe = parseInt(playerCountInput.value);
    const playerNumber = playerNumberUnsafe >= 2 ? playerNumberUnsafe : 2 // will take two if Nan (not a number passed)
    if (gameType) {
        goToLocalGame(playerNumber)
    } else {
        goToOnlineGame(Date.now().toString());
    }
})
/*
joinGameBtn.onclick = () => {
    goToGame();
}*/


function goToOnlineGame(id = "") {
    window.location.href = `/game/?game=${id}`;
}
function goToLocalGame(playerNumber = 2, tailleGrille = 5) {
    window.location.href = `/game-local/?players=${playerNumber}&taille=${tailleGrille}`
}