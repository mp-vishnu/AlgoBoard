const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const { userJoin, getUsers, userLeave } = require("./utils/user");

// Load environment variables
dotenv.config({ path: "config/config.env" });

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Integrate socket.io with the express server

// Middleware setup
app.use(express.json()); // req/res format
app.use(cors());

// Route imports
const basic = require("./router/basicRouter");
app.use("/", basic); // Use routes defined in basicRouter

// Socket.IO logic
// let roomIdGlobal, imgURLGlobal;
// io.on("connection", (socket) => {
// User joins the room
// socket.on("user-joined", (data) => {
//   const { roomId, userId, userName, host, presenter } = data;
//   userRoom = roomId;
//   const user = userJoin(socket.id, userName, roomId, host, presenter);
//   const roomUsers = getUsers(user.room);
//   socket.join(user.room);
//   socket.emit("message", {
//     message: "Welcome to ChatRoom",
//   });
//   socket.broadcast.to(user.room).emit("message", {
//     message: `${user.username} has joined`,
//   });

//   io.to(user.room).emit("users", roomUsers);
//   io.to(user.room).emit("canvasImage", imageUrl);

// Socket.IO logic
let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, useId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });

    if (imgURLGlobal) {
      socket.emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });
    }
  });

  socket.on("whiteboardData", ({ imgURL, roomId }) => {
    console.log("Broadcasting whiteboard data to room:", roomId);
    imgURLGlobal = imgURL;

    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imgURL,
    });
  });
});
// });

// Handle drawing
// socket.on("drawing", (data) => {
//   imageUrl = data;
//   socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
// });

// Handle disconnect
// socket.on("disconnect", () => {
//   const userLeaves = userLeave(socket.id);
//   const roomUsers = getUsers(userRoom);

//   if (userLeaves) {
//     io.to(userLeaves.room).emit("message", {
//       message: `${userLeaves.username} left the chat`,
//     });
//     io.to(userLeaves.room).emit("users", roomUsers);
//   }
// });

module.exports = { app, server };
