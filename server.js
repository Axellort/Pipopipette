const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

const n = 5;
let playerActu = 0;
let nJoueurs = 3;
let playerPerRoom = {"default":0};
io.on('connection', (socket) => {
    console.log("Connection");

    let playerForSocket = playerPerRoom[id] % nJoueurs;
    playerPerRoom[id]++;
    let idOfSocket = 'default';

    socket.on('game-id', (id) => {
        idOfSocket = id;
        socket.join(id);
        manageGame(id, socket, io);
    })
    // ! HOW TO : je récupère l'id de la partie au début et met mon socket dans la room. Quand je reçois un event de ce socket je l'émets avec io.of(id).emit (?) si id !==''
    // TODO : comment gérer les ids ? + voir vidéo de WebDevSimplified
    // TODO : when connection, if number of players for an id is full, give to each socket a playerID et mettre tous les événements dans les bonnes rooms

    manageGame(id, socket,io);
    
})



server.listen(3000, () => { console.log(`🕸️ Listening on 3000`) })


function manageGame(id, socket, io){
    playerForSocket = playerPerRoom[id] % nJoueurs ?? 0;
        playerPerRoom[id] = playerForSocket+1;
        socket.emit("player-id", playerForSocket);

        if (playerForSocket == nJoueurs) {
            io.of(id).emit('new-game', n, nJoueurs);
        }
        // new game
        socket.on('click', (player, i, j, str) => {
            console.log("CLICK")
            console.log(player)
            io.of(id).emit("click", player, i, j, str);
            playerActu++;
            playerActu %= nJoueurs;
        })
        socket.on("disconnect", () => { console.log("deconnection") })
}