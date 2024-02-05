import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  getAllOnlineUsers,
  setOffline,
  setOnline,
} from "../service/user-status.service";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId: number) =>
  userSocketMap.get(receiverId);

const userSocketMap = new Map<number, any>(); // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const userId = +socket.handshake.query.userId!;
  if (userId !== undefined) {
    userSocketMap.set(userId, socket.id);
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", await getAllOnlineUsers());

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    setOffline(userId);
    io.emit("getOnlineUsers", await getAllOnlineUsers());
  });
});

export { app, io, server };
