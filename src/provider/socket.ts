import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  getAllOnlineUsers,
  setOffline,
  setOnline,
} from "../service/user-status.service";
import { setUserSocket, clearUserSocket } from "../service/user-socket.service";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const userId = +socket.handshake.query.userId!;
  if (userId !== undefined) {
    setOnline(userId);
    await setUserSocket(userId, socket.id);
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", await getAllOnlineUsers());

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    setOffline(userId);
    clearUserSocket(userId);
    io.emit("getOnlineUsers", await getAllOnlineUsers());
  });
});

export { app, io, server };
