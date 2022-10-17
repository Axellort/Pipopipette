const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

const n = 5;
let playerActu = 0;
let playerGiven = 0;
let nJoueurs = 3;
io.on('connection', (socket) => {
    const playerForSocket = playerGiven % nJoueurs;
    playerGiven++;
    console.log("Connection");

    socket.emit("player-id", playerForSocket);
    if (playerGiven == nJoueurs) {
        io.emit('new-game', n, nJoueurs);
    }
    // new game
    socket.on('click', (player, i, j, str) => {
        console.log("CLICK")
        console.log(player)
        io.emit("click", player, i, j, str);
        playerActu++;
        playerActu %= nJoueurs;
    })
    socket.on("disconnect", () => { console.log("deconnection") })
})



server.listen(3000, () => { console.log(`🕸️ Listening on 3000`) })


