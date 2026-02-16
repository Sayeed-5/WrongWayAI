const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// When client connects
io.on("connection", (socket) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    socket.emit("traffic-update", {
      vehicles: Math.floor(Math.random() * 50),
      wrongWay: Math.random() > 0.6,
      plate: "OD02AB" + Math.floor(Math.random() * 9999),
    });
  }, 3000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
