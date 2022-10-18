const joinGameInput = document.getElementById("join-input");
const joinGameBtn = document.getElementById("join-btn");
const createGameBtn = document.getElementById("create-btn");

joinGameBtn.onclick = () => {
    let id = joinGameInput.value ?? "";
    goToGame(id);
}


function goToGame(id) {
    window.location = `${window.location.host}/?game=${id}`;
}