const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

const n = 7;
let playerActu = 0;
let playerGiven = 0;
let nJoueurs = 2;
io.on('connection', (socket) => {
    const playerForSocket = playerGiven % nJoueurs;
    playerGiven++;
    console.log("Connection");

    io.emit('new-game', n);
    // new game
    socket.on('click', (i, j, str) => {
        console.log("CLICK")
        console.log(playerForSocket)
        if (playerForSocket == playerActu) {
            io.emit("click", playerForSocket, i, j, str);
            playerActu++;
            playerActu %= nJoueurs;
        } else {
            console.error("Tried to play but not your turn, player : " + playerForSocket);
        }
    })
})




server.listen(3000, () => { console.log(`🕸️ Listening on 3000`) })


