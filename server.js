function log_stamp(str) {
    msg = new Date().toISOString() + ":" + str;
    console.log(msg);
}

const express = require("express");
const app = express();

let broadcaster;
const port = 8000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => log_stamp(e));
io.sockets.on("connection", socket => {
  log_stamp("on connection");

  socket.on("broadcaster", () => {
    log_stamp("on broadcaster");
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    log_stamp("on watcher");
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    log_stamp("on offer");
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    log_stamp("on answer");
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    log_stamp("on candidate");
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    log_stamp("on disconnect");
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
});
server.listen(port, () => log_stamp(`Server is running on port ${port}`));
