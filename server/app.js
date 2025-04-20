// --- server.js ---
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const {
  userJoin,
  getUsers,
  userLeave,
  addUser,
  removeUserFromRoom,
  getUsersInRoom,
} = require("./utils/user");

// Load environment variables
dotenv.config({ path: "config/config.env" });

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors());

const basic = require("./router/basicRouter");
app.use("/", basic);

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);

    const users = addUser({ ...data, socketId: socket.id });
    io.to(roomId).emit("userIsJoined", { success: true, users });

    if (imgURLGlobal) {
      socket.emit("whiteBoardDataResponse", { imgURL: imgURLGlobal });
    }
  });

  socket.on("whiteboardData", ({ imgURL, roomId }) => {
    imgURLGlobal = imgURL;
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    removeUserFromRoom(socket.id, roomId);
    const users = getUsersInRoom(roomId);

    if (users.length === 0) {
      console.log(`Room ${roomId} is now empty.`);
    } else {
      io.to(roomId).emit("userIsJoined", { success: true, users });
    }

    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomsToUpdate = removeUserFromRoom(socket.id);
    roomsToUpdate.forEach((roomId) => {
      const users = getUsersInRoom(roomId);
      if (users.length > 0) {
        io.to(roomId).emit("userIsJoined", { success: true, users });
      }
    });
  });
});

module.exports = { app, server };
