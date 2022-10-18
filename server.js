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
let nJoueurs = 2;
io.on('connection', (socket) => {
    console.log("Connection");
    let idOfSocket = '';
    socket.on('game-id', (id) => {
        idOfSocket = id;
        socket.join(id);
    })
    // ! HOW TO : je récupère l'id de la partie au début et met mon socket dans la room. Quand je reçois un event de ce socket je l'émets avec io.of(id).emit (?) si id !==''
    // TODO : comment gérer les ids ? + voir vidéo de WebDevSimplified
    // TODO : when connection, if number of players for an id is full, give to each socket a playerID et mettre tous les événements dans les bonnes rooms
    const playerForSocket = playerGiven % nJoueurs;
    playerGiven++;

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


