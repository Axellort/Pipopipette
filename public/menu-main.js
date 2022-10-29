// @ts-nocheck
const joinGameInput = document.getElementById("join-input");
const joinGameBtn = document.getElementById("join-btn");
const createGameBtn = document.getElementById("create-btn");
const formGameJoin = document.getElementById("join-form");

formGameJoin.addEventListener("submit", (event) => {
    event.preventDefault();
    goToGame();
})
/*
joinGameBtn.onclick = () => {
    goToGame();
}*/


function goToGame() {
    let id = joinGameInput.value ?? "";
    window.location.href = `/game/?game=${id}`;
}