const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let readyPlayersCount = 0;

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("ready", () => {
    console.log(`player ready ${socket.id}`);
    readyPlayersCount++;

    if (readyPlayersCount === 2) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("disconnect", () => {
    console.log(`player disconnect ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
