import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  getAllOnlineUsers,
  setOffline,
  setOnline,
} from "../service/user-status.service";
import { setUserSocket, clearUserSocket } from "../service/user-socket.service";
import { verifyToken } from "./jwt";
import { TokenType } from "../model/enum/token-type";
import { findUser } from "../service/user.service";
import { UserDto } from "../model/dto/user.dto";

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
  let token = socket.handshake.auth.token;
  console.log(token);

  verifyToken(token.substring("Bearer ".length), TokenType.ACCESS)
    .then(async (val) => {
      console.log(val);
      const user = (await findUser(val.id)) as UserDto;
      setOnline(user.id);
      await setUserSocket(user.id, socket.id);

      io.emit("getOnlineUsers", await getAllOnlineUsers());

      socket.on("disconnect", async () => {
        console.log("user disconnected", socket.id);
        setOffline(user.id);
        clearUserSocket(user.id);
        io.emit("getOnlineUsers", await getAllOnlineUsers());
      });
    })
    .catch((err) => {
      console.error(err);
      socket.disconnect();
    });
});

export { app, io, server };
