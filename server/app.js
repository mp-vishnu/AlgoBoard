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

// 🧠 Instead of one image globally, we use a map
const roomWhiteboardData = {}; // { roomId: imgURL }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    socket.join(roomId);

    const users = addUser({ ...data, socketId: socket.id });
    io.to(roomId).emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);

    // 🧠 Send existing whiteboard image if any
    if (roomWhiteboardData[roomId]) {
      socket.emit("whiteBoardDataResponse", {
        imgURL: roomWhiteboardData[roomId],
      });
    }
  });

  socket.on("whiteboardData", ({ imgURL, roomId }) => {
    // 🧠 Store imgURL per room
    roomWhiteboardData[roomId] = imgURL;

    // Broadcast to others in the room
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    const { user } = removeUserFromRoom(socket.id, roomId);
    if (user) {
      socket.broadcast.to(roomId).emit("userLeftMessageBroadcasted", user.name);
    }

    const users = getUsersInRoom(roomId);
    if (users.length === 0) {
      console.log(`Room ${roomId} is now empty.`);
      // Optionally: delete roomWhiteboardData[roomId] to clean up memory
    } else {
      io.to(roomId).emit("userIsJoined", { success: true, users });
    }

    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomsToUpdate = removeUserFromRoom(socket.id);
    roomsToUpdate.forEach(({ roomId, user }) => {
      if (user) {
        socket.broadcast
          .to(roomId)
          .emit("userLeftMessageBroadcasted", user.name);
      }

      const users = getUsersInRoom(roomId);
      if (users.length > 0) {
        io.to(roomId).emit("userIsJoined", { success: true, users });
      }
    });
  });
});

module.exports = { app, server };
