const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const globalIo = io.of("/global");

io.on("connection", (socket) => {
  socket.on("send-message", (message, room) => {
    console.log(message, room);
    socket.broadcast.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    console.log(`Joined room: ${room}`);
    socket.join(room);
  });
});

globalIo.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });
});
